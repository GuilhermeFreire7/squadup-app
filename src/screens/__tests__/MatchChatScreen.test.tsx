import { render, screen, waitFor } from "@testing-library/react-native";
import React from "react";

import { createQueryWrapper } from "../../test-utils/queryClientWrapper";
import MatchChatScreen from "../MatchChatScreen";

const mockUseIsFocused = jest.fn(() => true);
const mockKeyboardVisible = jest.fn(() => false);

jest.mock("../../hooks/useKeyboardVisible", () => ({
  useKeyboardVisible: () => mockKeyboardVisible(),
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ goBack: jest.fn(), navigate: jest.fn() }),
  useRoute: () => ({ params: { matchId: "match-1" } }),
  useIsFocused: () => mockUseIsFocused(),
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
}));

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: { id: "user-1", name: "Guilherme Freire" } }),
}));

const GUILHERME = {
  id: "user-1",
  name: "Guilherme Freire",
  photo_url: null,
  age: 28,
  location: "Botafogo",
  bio: null,
  favorite_sports: ["football"],
  level: "intermediate",
  is_verified: false,
  average_rating: null,
  matches_played: 3,
};

const ANA = { ...GUILHERME, id: "user-2", name: "Ana Lima" };

const MATCH_DETAIL = {
  id: "match-1",
  sport: "football",
  title: "Pelada de domingo",
  location: "Arena Botafogo",
  date: "2026-12-06",
  time: "09:00:00",
  max_participants: 10,
  level: "intermediate",
  description: null,
  organizer_id: "user-1",
  status: "open",
  allow_beginners: true,
  requires_approval: false,
  latitude: null,
  longitude: null,
  confirmed_count: 2,
  available_slots: 8,
  distance_km: null,
  organizer: GUILHERME,
  participants: [
    { user: GUILHERME, status: "confirmed" },
    { user: ANA, status: "confirmed" },
  ],
};

function apiMessage(id: string, text: string, sender = ANA) {
  return {
    id,
    match_id: "match-1",
    sender,
    text,
    created_at: "2026-11-03T12:00:00Z",
    type: "message",
  };
}

function mockApi(messages: unknown[]) {
  globalThis.fetch = jest.fn(async (url: string) => {
    const body = url.includes("/messages") ? messages : MATCH_DETAIL;
    return { ok: true, status: 200, json: async () => body } as Response;
  }) as jest.Mock;
}

beforeEach(() => {
  jest.clearAllMocks();
  mockUseIsFocused.mockReturnValue(true);
  mockKeyboardVisible.mockReturnValue(false);
});

describe("MatchChatScreen", () => {
  it("mostra o título da partida e as mensagens mais recentes", async () => {
    mockApi([apiMessage("m-2", "Chego às 9h"), apiMessage("m-1", "Bom dia", GUILHERME)]);

    render(<MatchChatScreen />, { wrapper: createQueryWrapper() });

    expect(await screen.findByText("Chego às 9h")).toBeTruthy();
    expect(screen.getByText("Bom dia")).toBeTruthy();
    expect(screen.getByText("Pelada de domingo")).toBeTruthy();
  });

  it("busca as mensagens da mais recente para a mais antiga", async () => {
    mockApi([]);

    render(<MatchChatScreen />, { wrapper: createQueryWrapper() });

    await waitFor(() =>
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/matches/match-1/messages?limit=30&order=desc"),
        expect.anything()
      )
    );
  });

  it("mostra o estado vazio quando não há mensagens", async () => {
    mockApi([]);

    render(<MatchChatScreen />, { wrapper: createQueryWrapper() });

    expect(await screen.findByText("Nenhuma mensagem ainda.")).toBeTruthy();
  });

  it("reserva o espaço da barra de navegação abaixo do campo, exceto com o teclado aberto", async () => {
    mockApi([]);
    const { rerender } = render(<MatchChatScreen />, { wrapper: createQueryWrapper() });
    await screen.findByText("Nenhuma mensagem ainda.");

    expect(screen.getByTestId("chat-input-container").props.style).toEqual({ paddingBottom: 34 });

    mockKeyboardVisible.mockReturnValue(true);
    rerender(<MatchChatScreen />);

    expect(screen.getByTestId("chat-input-container").props.style).toEqual({ paddingBottom: 0 });
  });
});
