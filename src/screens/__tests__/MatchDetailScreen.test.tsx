import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import React from "react";

import { createQueryWrapper } from "../../test-utils/queryClientWrapper";
import MatchDetailScreen from "../MatchDetailScreen";

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({
    user: {
      id: "user-1",
      name: "Guilherme Freire",
      email: "guilherme@example.com",
      role: "user",
      photoUrl: undefined,
      age: 28,
      location: "Botafogo, Rio de Janeiro",
      bio: undefined,
      favoriteSports: ["football"],
      level: "intermediate",
      averageRating: 4.7,
      matchesPlayed: 42,
      isVerified: true,
    },
  }),
}));

const GUILHERME = {
  id: "user-1",
  name: "Guilherme Freire",
  photo_url: null,
  age: 28,
  location: "Botafogo, Rio de Janeiro",
  bio: null,
  favorite_sports: ["football"],
  level: "intermediate",
  is_verified: true,
  average_rating: 4.7,
  matches_played: 42,
};

const ANA = {
  ...GUILHERME,
  id: "user-2",
  name: "Ana Lima",
};

function apiMatchDetail(overrides: Record<string, unknown> = {}) {
  return {
    id: "match-1",
    sport: "football",
    title: "Pelada de domingo na arena",
    location: "Arena Botafogo — Rua General Polidoro, 400",
    date: "2026-05-25",
    time: "09:00:00",
    max_participants: 14,
    level: "intermediate",
    description: "Jogo de campo gramado.",
    organizer_id: "user-1",
    status: "open",
    allow_beginners: false,
    requires_approval: false,
    confirmed_count: 1,
    available_slots: 13,
    organizer: GUILHERME,
    participants: [{ user: GUILHERME, status: "confirmed" }],
    ...overrides,
  };
}

function mockFetchOnce(body: unknown, status = 200) {
  globalThis.fetch = jest.fn(async () => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  })) as jest.Mock;
}

function renderWithQueryClient() {
  return render(<MatchDetailScreen />, { wrapper: createQueryWrapper() });
}

const mockGoBack = jest.fn();
const mockUseRoute = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ goBack: mockGoBack, navigate: jest.fn() }),
  useRoute: () => mockUseRoute(),
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("MatchDetailScreen — estado: aberta / não participa", () => {
  beforeEach(() => {
    mockUseRoute.mockReturnValue({ params: { matchId: "match-6" } });
    mockFetchOnce(
      apiMatchDetail({
        id: "match-6",
        organizer_id: "user-2",
        organizer: ANA,
        participants: [{ user: ANA, status: "confirmed" }],
        confirmed_count: 1,
        available_slots: 13,
      })
    );
  });

  it('exibe o botão "Participar"', async () => {
    renderWithQueryClient();
    await waitFor(() => expect(screen.getByText("Participar")).toBeTruthy());
  });
});

describe("MatchDetailScreen — estado: participante confirmado", () => {
  beforeEach(() => {
    mockUseRoute.mockReturnValue({ params: { matchId: "match-4" } });
    mockFetchOnce(apiMatchDetail({ id: "match-4" }));
  });

  it('exibe "Encerrar partida" e o chat para o organizador, sem "Cancelar participação"', async () => {
    renderWithQueryClient();
    await waitFor(() => expect(screen.getByText("Encerrar partida")).toBeTruthy());
    expect(screen.getByText("Você está confirmado")).toBeTruthy();
    expect(screen.getByText("Chat da partida")).toBeTruthy();
    expect(screen.queryByText("Cancelar participação")).toBeNull();
  });
});

describe("MatchDetailScreen — estado: participante confirmado (não organizador)", () => {
  beforeEach(() => {
    mockUseRoute.mockReturnValue({ params: { matchId: "match-7" } });
    mockFetchOnce(
      apiMatchDetail({
        id: "match-7",
        organizer_id: "user-2",
        organizer: ANA,
        participants: [
          { user: ANA, status: "confirmed" },
          { user: GUILHERME, status: "confirmed" },
        ],
        confirmed_count: 2,
        available_slots: 12,
      })
    );
  });

  it('exibe "Você está confirmado" e a opção de cancelar, sem "Encerrar partida"', async () => {
    renderWithQueryClient();
    await waitFor(() => expect(screen.getByText("Você está confirmado")).toBeTruthy());
    expect(screen.getByText("Cancelar participação")).toBeTruthy();
    expect(screen.queryByText("Encerrar partida")).toBeNull();
  });
});

describe("MatchDetailScreen — estado: aguardando aprovação (pending)", () => {
  beforeEach(() => {
    mockUseRoute.mockReturnValue({ params: { matchId: "match-2" } });
    mockFetchOnce(
      apiMatchDetail({
        id: "match-2",
        organizer_id: "user-2",
        organizer: ANA,
        requires_approval: true,
        participants: [
          { user: ANA, status: "confirmed" },
          { user: GUILHERME, status: "pending" },
        ],
      })
    );
  });

  it('exibe "Aguardando aprovação" e opção de cancelar solicitação', async () => {
    renderWithQueryClient();
    await waitFor(() =>
      expect(screen.getAllByText("Aguardando aprovação").length).toBeGreaterThan(0)
    );
    expect(screen.getByText("Cancelar solicitação")).toBeTruthy();
  });
});

describe("MatchDetailScreen — estado: partida lotada (usuário fora)", () => {
  beforeEach(() => {
    mockUseRoute.mockReturnValue({ params: { matchId: "match-12" } });
    mockFetchOnce(
      apiMatchDetail({
        id: "match-12",
        organizer_id: "user-2",
        organizer: ANA,
        status: "full",
        participants: [{ user: ANA, status: "confirmed" }],
      })
    );
  });

  it('exibe o botão desabilitado "Partida lotada"', async () => {
    renderWithQueryClient();
    await waitFor(() => expect(screen.getByText("Partida lotada")).toBeTruthy());
  });
});

describe("MatchDetailScreen — estado: encerrada / cancelada", () => {
  beforeEach(() => {
    mockUseRoute.mockReturnValue({ params: { matchId: "match-10" } });
    mockFetchOnce(
      apiMatchDetail({
        id: "match-10",
        status: "cancelled",
        organizer_id: "user-2",
        organizer: ANA,
        participants: [{ user: ANA, status: "confirmed" }],
      })
    );
  });

  it('exibe o botão desabilitado "Partida encerrada"', async () => {
    renderWithQueryClient();
    await waitFor(() => expect(screen.getByText("Partida encerrada")).toBeTruthy());
  });
});

describe("MatchDetailScreen — renderização geral", () => {
  beforeEach(() => {
    mockUseRoute.mockReturnValue({ params: { matchId: "match-1" } });
    mockFetchOnce(apiMatchDetail());
  });

  it("exibe o título da partida", async () => {
    renderWithQueryClient();
    await waitFor(() => expect(screen.getByText("Pelada de domingo na arena")).toBeTruthy());
  });

  it("exibe o nome do organizador", async () => {
    renderWithQueryClient();
    await waitFor(() => expect(screen.getAllByText("Guilherme Freire").length).toBeGreaterThan(0));
  });

  it("exibe o local da partida", async () => {
    renderWithQueryClient();
    await waitFor(() =>
      expect(screen.getByText("Arena Botafogo — Rua General Polidoro, 400")).toBeTruthy()
    );
  });

  it("exibe o botão Voltar acessível", async () => {
    renderWithQueryClient();
    await waitFor(() => expect(screen.getByLabelText("Voltar")).toBeTruthy());
  });

  it("pressionar Voltar chama goBack", async () => {
    renderWithQueryClient();
    await waitFor(() => expect(screen.getByLabelText("Voltar")).toBeTruthy());
    fireEvent.press(screen.getByLabelText("Voltar"));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it("exibe mensagem de erro para matchId inexistente", async () => {
    mockUseRoute.mockReturnValue({ params: { matchId: "match-nao-existe" } });
    globalThis.fetch = jest.fn(async () => ({
      ok: false,
      status: 404,
      json: async () => ({ detail: { code: "MATCH_NOT_FOUND", message: "Não encontrada." } }),
    })) as jest.Mock;

    renderWithQueryClient();
    await waitFor(() => expect(screen.getByText("Partida não encontrada.")).toBeTruthy());
  });
});
