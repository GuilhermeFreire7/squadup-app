import { act, renderHook, waitFor } from "@testing-library/react-native";

import { createQueryWrapper } from "../../test-utils/queryClientWrapper";
import { MESSAGES_PAGE_SIZE, useMessages } from "../useMessages";

const SENDER = {
  id: "u1",
  name: "Guilherme Freire",
  photo_url: null,
  age: 28,
  location: "Rio de Janeiro, RJ",
  bio: null,
  favorite_sports: ["football"],
  level: "intermediate",
  is_verified: false,
  average_rating: 4.5,
  matches_played: 12,
};

function apiMessage(overrides: Record<string, unknown> = {}) {
  return {
    id: "message-1",
    match_id: "match-1",
    sender: SENDER,
    text: "Confirmado!",
    created_at: "2026-07-08T09:00:00Z",
    type: "message",
    ...overrides,
  };
}

function mockFetchSequence(responses: { status: number; body: unknown }[]) {
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

describe("useMessages — leitura", () => {
  it("mantém a ordem da API (mais recente primeiro = index 0 da lista invertida)", async () => {
    mockFetchSequence([
      {
        status: 200,
        body: [
          apiMessage({ id: "message-2", text: "Segunda", created_at: "2026-07-08T09:05:00Z" }),
          apiMessage({ id: "message-1", text: "Primeira", created_at: "2026-07-08T09:00:00Z" }),
        ],
      },
    ]);

    const { result } = renderHook(() => useMessages("match-1"), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.messages.map((m) => m.text)).toEqual(["Segunda", "Primeira"]);
  });

  it("busca GET /matches/{id}/messages com order=desc e o tamanho da página", async () => {
    mockFetchSequence([{ status: 200, body: [] }]);

    const { result } = renderHook(() => useMessages("match-1"), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/matches/match-1/messages?limit=${MESSAGES_PAGE_SIZE}&order=desc`),
      expect.objectContaining({ method: "GET" })
    );
  });

  it("loadMore busca a página seguinte (mais antiga) via skip", async () => {
    const firstPage = Array.from({ length: MESSAGES_PAGE_SIZE }, (_, i) =>
      apiMessage({ id: `recente-${i}`, text: `Recente ${i}` })
    );
    mockFetchSequence([
      { status: 200, body: firstPage },
      { status: 200, body: [apiMessage({ id: "antiga-0", text: "Antiga" })] },
    ]);
    const { result } = renderHook(() => useMessages("match-1"), {
      wrapper: createQueryWrapper(),
    });
    await waitFor(() => expect(result.current.hasMore).toBe(true));

    act(() => result.current.loadMore());

    await waitFor(() => expect(result.current.messages).toHaveLength(MESSAGES_PAGE_SIZE + 1));
    expect(globalThis.fetch).toHaveBeenLastCalledWith(
      expect.stringContaining(`skip=${MESSAGES_PAGE_SIZE}&limit=${MESSAGES_PAGE_SIZE}&order=desc`),
      expect.anything()
    );
    expect(result.current.messages.at(-1)?.text).toBe("Antiga");
    expect(result.current.hasMore).toBe(false);
  });

  it("não repete mensagem que aparece em duas páginas (offset deslocado por mensagem nova)", async () => {
    const firstPage = Array.from({ length: MESSAGES_PAGE_SIZE }, (_, i) =>
      apiMessage({ id: `m-${i}` })
    );
    mockFetchSequence([
      { status: 200, body: firstPage },
      { status: 200, body: [apiMessage({ id: `m-${MESSAGES_PAGE_SIZE - 1}` })] },
    ]);
    const { result } = renderHook(() => useMessages("match-1"), {
      wrapper: createQueryWrapper(),
    });
    await waitFor(() => expect(result.current.hasMore).toBe(true));

    act(() => result.current.loadMore());

    await waitFor(() => expect(result.current.isFetchingMore).toBe(false));
    expect(result.current.messages).toHaveLength(MESSAGES_PAGE_SIZE);
  });
});

describe("useMessages — polling", () => {
  const POLL_MS = 50;

  /** A cada chamada devolve a lista de `responses`; depois da última, repete a última. */
  function mockFetchByCall(responses: unknown[]) {
    let call = 0;
    globalThis.fetch = jest.fn(async () => {
      const body = responses[Math.min(call, responses.length - 1)];
      call += 1;
      return { ok: true, status: 200, json: async () => body } as Response;
    }) as jest.Mock;
  }

  it("com poll ligado, busca de novo sozinho e mostra a mensagem nova", async () => {
    mockFetchByCall([
      [apiMessage({ id: "m-1", text: "Antes" })],
      [apiMessage({ id: "m-2", text: "Nova" }), apiMessage({ id: "m-1", text: "Antes" })],
    ]);

    const { result } = renderHook(
      () => useMessages("match-1", { poll: true, pollIntervalMs: POLL_MS }),
      { wrapper: createQueryWrapper() }
    );

    await waitFor(() =>
      expect(result.current.messages.map((m) => m.text)).toEqual(["Nova", "Antes"])
    );
  });

  it("com poll desligado, não busca de novo sozinho", async () => {
    mockFetchByCall([[apiMessage()]]);
    const { result } = renderHook(
      () => useMessages("match-1", { poll: false, pollIntervalMs: POLL_MS }),
      { wrapper: createQueryWrapper() }
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, POLL_MS * 4));
    });

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });
});

describe("useMessages — sendMessage()", () => {
  it("envia POST /matches/{id}/messages só com o texto", async () => {
    mockFetchSequence([{ status: 200, body: [] }]);
    const { result } = renderHook(() => useMessages("match-1"), {
      wrapper: createQueryWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    mockFetchSequence([
      { status: 201, body: apiMessage() },
      { status: 200, body: [apiMessage()] },
    ]);
    await act(async () => {
      result.current.sendMessage("Confirmado!");
    });

    await waitFor(() =>
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/matches/match-1/messages"),
        expect.objectContaining({ method: "POST", body: JSON.stringify({ text: "Confirmado!" }) })
      )
    );
  });

  it("ignora texto vazio ou só com espaços", async () => {
    mockFetchSequence([{ status: 200, body: [] }]);
    const { result } = renderHook(() => useMessages("match-1"), {
      wrapper: createQueryWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const callsBefore = (globalThis.fetch as jest.Mock).mock.calls.length;
    act(() => result.current.sendMessage("   "));

    expect((globalThis.fetch as jest.Mock).mock.calls.length).toBe(callsBefore);
  });
});
