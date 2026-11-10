import { act, renderHook, waitFor } from "@testing-library/react-native";
import * as SecureStore from "expo-secure-store";
import React from "react";

import { apiClient, getAuthToken } from "../../services/api/client";
import { queryClient } from "../../services/queryClient";
import type { MyProfile } from "../../types";
import { AuthProvider, useAuth } from "../AuthContext";

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

function wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(AuthProvider, null, children);
}

const MY_PROFILE_BODY = {
  id: "user-1",
  name: "Ana Souza",
  email: "ana@email.com",
  photo_url: null,
  age: 28,
  location: "São Paulo, SP",
  bio: null,
  favorite_sports: ["football"],
  level: "beginner",
  is_verified: false,
  average_rating: null,
  matches_played: 0,
  role: "user",
};

interface FetchResponseSpec {
  status: number;
  body: unknown;
}

function mockFetchSequence(responses: FetchResponseSpec[]) {
  const queue = [...responses];
  globalThis.fetch = jest.fn(async () => {
    const next = queue.shift();
    if (!next) throw new Error("fetch chamado além do esperado nesta sequência de teste");
    return {
      ok: next.status >= 200 && next.status < 300,
      status: next.status,
      json: async () => next.body,
    } as Response;
  }) as jest.Mock;
}

async function waitForBootToFinish(result: { current: ReturnType<typeof useAuth> }) {
  await waitFor(() => expect(result.current.isBooting).toBe(false));
}

function mockNoSavedSession() {
  (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
}

describe("AuthContext", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("boot sem sessão salva termina isBooting sem autenticar (sem chamada de rede)", async () => {
    mockNoSavedSession();
    mockFetchSequence([]);

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitForBootToFinish(result);

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("boot com token salvo restaura a sessão via GET /users/me", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockImplementation(async (key: string) =>
      key === "squadup.accessToken" ? "acc-persisted" : null
    );
    mockFetchSequence([{ status: 200, body: MY_PROFILE_BODY }]);

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitForBootToFinish(result);

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe("ana@email.com");
    expect(getAuthToken()).toBe("acc-persisted");
  });

  it("register guarda nome/email/senha/idade como pendentes sem chamar a rede", async () => {
    mockNoSavedSession();
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitForBootToFinish(result);

    mockFetchSequence([]);
    act(() => {
      result.current.register("Ana Souza", "ana@email.com", "senha123", 28);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.pendingName).toBe("Ana Souza");
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("completeProfile chama POST /auth/register → POST /auth/login → PATCH /users/me em sequência", async () => {
    mockNoSavedSession();
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitForBootToFinish(result);

    act(() => {
      result.current.register("Ana Souza", "ana@email.com", "senha123", 28);
    });

    mockFetchSequence([
      { status: 201, body: MY_PROFILE_BODY },
      {
        status: 200,
        body: { access_token: "acc-1", refresh_token: "ref-1", token_type: "bearer" },
      },
      { status: 200, body: { ...MY_PROFILE_BODY, level: "intermediate" } },
    ]);

    await act(async () => {
      await result.current.completeProfile({
        favoriteSports: ["football"],
        level: "intermediate",
        location: "São Paulo, SP",
      });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.name).toBe("Ana Souza");
    expect(result.current.user?.email).toBe("ana@email.com");
    expect((result.current.user as MyProfile).level).toBe("intermediate");
    expect(result.current.pendingName).toBe("");

    const calls = (globalThis.fetch as jest.Mock).mock.calls;
    expect(calls).toHaveLength(3);
    expect(calls[0][0]).toContain("/auth/register");
    expect(calls[1][0]).toContain("/auth/login");
    expect(calls[2][0]).toContain("/users/me");
    expect(calls[2][1].method).toBe("PATCH");
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith("squadup.accessToken", "acc-1");
  });

  it("completeProfile segue para o login quando o registro falha por e-mail já cadastrado (retry após falha parcial)", async () => {
    // Cenário real: uma tentativa anterior já criou a conta (ex.: caiu a rede no login ou no
    // PATCH seguinte), então o registro falha com EMAIL_ALREADY_REGISTERED — mas como as
    // credenciais são as mesmas, o login abaixo deve funcionar normalmente em vez de travar
    // o usuário sem conseguir prosseguir com o mesmo e-mail.
    mockNoSavedSession();
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitForBootToFinish(result);

    act(() => {
      result.current.register("Ana Souza", "ana@email.com", "senha123", 28);
    });

    mockFetchSequence([
      {
        status: 409,
        body: {
          detail: { code: "EMAIL_ALREADY_REGISTERED", message: "Este e-mail já está cadastrado." },
        },
      },
      {
        status: 200,
        body: { access_token: "acc-1", refresh_token: "ref-1", token_type: "bearer" },
      },
      { status: 200, body: { ...MY_PROFILE_BODY, level: "beginner" } },
    ]);

    await act(async () => {
      await result.current.completeProfile({
        favoriteSports: [],
        level: "beginner",
        location: "São Paulo, SP",
      });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe("ana@email.com");
  });

  it("completeProfile propaga o erro do login quando o e-mail já cadastrado é de outra conta", async () => {
    // Mesmo ponto de partida (409 no registro), mas agora o login também falha (senha não
    // bate com a conta existente) — o erro real do login deve chegar ao chamador, não o
    // EMAIL_ALREADY_REGISTERED do registro (que seria enganoso nesse caso).
    mockNoSavedSession();
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitForBootToFinish(result);

    act(() => {
      result.current.register("Ana Souza", "ana@email.com", "senha123", 28);
    });

    mockFetchSequence([
      {
        status: 409,
        body: {
          detail: { code: "EMAIL_ALREADY_REGISTERED", message: "Este e-mail já está cadastrado." },
        },
      },
      {
        status: 401,
        body: { detail: { code: "INVALID_CREDENTIALS", message: "E-mail ou senha inválidos." } },
      },
    ]);

    await expect(
      result.current.completeProfile({
        favoriteSports: [],
        level: "beginner",
        location: "São Paulo, SP",
      })
    ).rejects.toMatchObject({ code: "INVALID_CREDENTIALS" });

    expect(result.current.isAuthenticated).toBe(false);
  });

  it("login autentica com token e busca o perfil real via GET /users/me", async () => {
    mockNoSavedSession();
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitForBootToFinish(result);

    mockFetchSequence([
      {
        status: 200,
        body: { access_token: "acc-2", refresh_token: "ref-2", token_type: "bearer" },
      },
      { status: 200, body: MY_PROFILE_BODY },
    ]);

    await act(async () => {
      await result.current.login("ana@email.com", "senha123");
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe("ana@email.com");
  });

  it("login propaga ApiError quando as credenciais são inválidas", async () => {
    mockNoSavedSession();
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitForBootToFinish(result);

    mockFetchSequence([
      {
        status: 401,
        body: { detail: { code: "INVALID_CREDENTIALS", message: "E-mail ou senha inválidos." } },
      },
    ]);

    await expect(result.current.login("ana@email.com", "errada")).rejects.toMatchObject({
      code: "INVALID_CREDENTIALS",
    });

    expect(result.current.isAuthenticated).toBe(false);
  });

  it("logout chama POST /auth/logout com o refresh token salvo e limpa o estado local", async () => {
    mockNoSavedSession();
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitForBootToFinish(result);

    mockFetchSequence([
      {
        status: 200,
        body: { access_token: "acc-3", refresh_token: "ref-3", token_type: "bearer" },
      },
      { status: 200, body: MY_PROFILE_BODY },
    ]);
    await act(async () => {
      await result.current.login("ana@email.com", "senha123");
    });

    (SecureStore.getItemAsync as jest.Mock).mockImplementation(async (key: string) =>
      key === "squadup.refreshToken" ? "ref-3" : null
    );
    mockFetchSequence([{ status: 204, body: undefined }]);

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.pendingName).toBe("");
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("squadup.accessToken");

    const [url, options] = (globalThis.fetch as jest.Mock).mock.calls[0];
    expect(url).toContain("/auth/logout");
    expect(options.body).toBe(JSON.stringify({ refresh_token: "ref-3" }));
  });

  it("logout limpa o cache do React Query (dados da conta anterior)", async () => {
    mockNoSavedSession();
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitForBootToFinish(result);
    queryClient.setQueryData(["messages", "match-1"], { pages: [["mensagem da conta anterior"]] });

    mockFetchSequence([{ status: 204, body: undefined }]);
    await act(async () => {
      await result.current.logout();
    });

    expect(queryClient.getQueryData(["messages", "match-1"])).toBeUndefined();
  });

  it("logout limpa o estado local mesmo se POST /auth/logout falhar (refresh token já expirado)", async () => {
    mockNoSavedSession();
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitForBootToFinish(result);

    mockFetchSequence([
      {
        status: 200,
        body: { access_token: "acc-4", refresh_token: "ref-4", token_type: "bearer" },
      },
      { status: 200, body: MY_PROFILE_BODY },
    ]);
    await act(async () => {
      await result.current.login("ana@email.com", "senha123");
    });

    (SecureStore.getItemAsync as jest.Mock).mockImplementation(async (key: string) =>
      key === "squadup.refreshToken" ? "ref-4" : null
    );
    mockFetchSequence([
      {
        status: 401,
        body: { detail: { code: "INVALID_REFRESH_TOKEN", message: "Refresh token inválido." } },
      },
    ]);

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    // /auth/logout está isento do interceptor de refresh — um 401 aqui não deve tentar
    // renovar a sessão com o mesmo refresh token que acabou de falhar (só 1 chamada de rede).
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it("uma chamada autenticada que recebe 401 renova a sessão via /auth/refresh e repete a chamada original", async () => {
    mockNoSavedSession();
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitForBootToFinish(result);

    mockFetchSequence([
      {
        status: 200,
        body: { access_token: "acc-old", refresh_token: "ref-old", token_type: "bearer" },
      },
      { status: 200, body: MY_PROFILE_BODY },
    ]);
    await act(async () => {
      await result.current.login("ana@email.com", "senha123");
    });

    (SecureStore.getItemAsync as jest.Mock).mockImplementation(async (key: string) =>
      key === "squadup.refreshToken" ? "ref-old" : null
    );
    mockFetchSequence([
      { status: 401, body: { detail: { code: "INVALID_TOKEN", message: "Expirado." } } },
      {
        status: 200,
        body: { access_token: "acc-new", refresh_token: "ref-new", token_type: "bearer" },
      },
      { status: 200, body: { id: "match-1" } },
    ]);

    const data = await apiClient.get<{ id: string }>("/matches/match-1");

    expect(data).toEqual({ id: "match-1" });
    expect(getAuthToken()).toBe("acc-new");
  });
});
