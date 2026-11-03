import { act, fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

import type { MatchSummary } from "../../types";
import HomeScreen from "../HomeScreen";

const mockNavigate = jest.fn();
const mockRefetch = jest.fn(async () => undefined);
const mockMatchesState: {
  matches: MatchSummary[];
  isLoading: boolean;
  isError: boolean;
} = { matches: [], isLoading: false, isError: false };

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
}));

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: { id: "user-1", name: "Guilherme Freire" } }),
}));

jest.mock("../../contexts/MatchesContext", () => ({
  useMatchesContext: () => ({ ...mockMatchesState, refetch: mockRefetch }),
}));

jest.mock("../../contexts/MatchFiltersContext", () => ({
  useMatchFiltersContext: () => ({
    filters: {
      sport: null,
      level: null,
      onlyAvailable: false,
      date: null,
      location: null,
      nearMe: false,
      latitude: null,
      longitude: null,
      radiusKm: 20,
    },
    setFilters: jest.fn(),
    clearFilters: jest.fn(),
    activeFilterCount: 0,
  }),
}));

const MATCH: MatchSummary = {
  id: "match-1",
  sport: "football",
  title: "Pelada de domingo",
  location: "Arena Botafogo",
  date: "2026-12-06",
  time: "09:00",
  maxParticipants: 10,
  level: "intermediate",
  organizerId: "user-2",
  confirmedCount: 3,
  availableSlots: 7,
  status: "open",
  allowBeginners: true,
  requiresApproval: false,
  latitude: null,
  longitude: null,
  distanceKm: null,
};

function setMatchesState(state: Partial<typeof mockMatchesState>) {
  Object.assign(mockMatchesState, { matches: [], isLoading: false, isError: false }, state);
}

beforeEach(() => {
  jest.clearAllMocks();
  setMatchesState({});
});

describe("HomeScreen", () => {
  it("lista as partidas e abre o detalhe ao tocar", () => {
    setMatchesState({ matches: [MATCH] });

    render(<HomeScreen />);
    fireEvent.press(screen.getByText("Pelada de domingo"));

    expect(screen.getByText("1 encontrada")).toBeTruthy();
    expect(mockNavigate).toHaveBeenCalledWith("MatchDetail", { matchId: "match-1" });
  });

  it("mostra o estado vazio quando a busca não acha partidas", () => {
    render(<HomeScreen />);

    expect(screen.getByText("Nenhuma partida encontrada")).toBeTruthy();
  });

  it("mostra erro com 'Tentar de novo' quando a busca falha sem dados", () => {
    setMatchesState({ isError: true });

    render(<HomeScreen />);
    fireEvent.press(screen.getByText("Tentar de novo"));

    expect(screen.getByText("Não foi possível carregar as partidas")).toBeTruthy();
    expect(screen.queryByText("Nenhuma partida encontrada")).toBeNull();
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it("com dados antigos e falha na atualização, continua mostrando a lista", () => {
    setMatchesState({ matches: [MATCH], isError: true });

    render(<HomeScreen />);

    expect(screen.getByText("Pelada de domingo")).toBeTruthy();
    expect(screen.queryByText("Tentar de novo")).toBeNull();
  });

  it("puxar para atualizar refaz a busca", async () => {
    setMatchesState({ matches: [MATCH] });
    render(<HomeScreen />);

    const list = screen.getByTestId("matches-list");
    await act(async () => {
      await list.props.refreshControl.props.onRefresh();
    });

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it("mostra o esqueleto enquanto carrega", () => {
    setMatchesState({ isLoading: true });

    render(<HomeScreen />);

    expect(screen.queryByText("Nenhuma partida encontrada")).toBeNull();
    expect(screen.queryByTestId("matches-list")).toBeNull();
  });
});
