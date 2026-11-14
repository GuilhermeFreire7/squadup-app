import { act, fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

import type { MyMatch } from "../../types";
import MyMatchesScreen from "../MyMatchesScreen";

const mockNavigate = jest.fn();
const mockRefetch = jest.fn(async () => undefined);
let mockFocusEffect: (() => void) | null = null;
const mockState: {
  upcoming: MyMatch[];
  past: MyMatch[];
  isLoading: boolean;
  isError: boolean;
} = { upcoming: [], past: [], isLoading: false, isError: false };

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useFocusEffect: (effect: () => void) => {
    mockFocusEffect = effect;
  },
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
}));

jest.mock("../../hooks/useMyMatches", () => ({
  useMyMatches: () => ({ ...mockState, pendingRequestsTotal: 0, refetch: mockRefetch }),
}));

function myMatch(overrides: Partial<MyMatch> = {}): MyMatch {
  return {
    id: "match-1",
    sport: "football",
    title: "Pelada de domingo",
    location: "Arena Botafogo",
    date: "2026-12-20",
    time: "09:00",
    maxParticipants: 10,
    level: "intermediate",
    organizerId: "user-1",
    confirmedCount: 3,
    availableSlots: 7,
    status: "open",
    allowBeginners: false,
    requiresApproval: true,
    latitude: null,
    longitude: null,
    distanceKm: null,
    isOrganizer: true,
    myStatus: "confirmed",
    pendingRequests: 0,
    isPast: false,
    ...overrides,
  };
}

function setState(state: Partial<typeof mockState>) {
  Object.assign(mockState, { upcoming: [], past: [], isLoading: false, isError: false }, state);
}

beforeEach(() => {
  jest.clearAllMocks();
  mockFocusEffect = null;
  setState({});
});

describe("MyMatchesScreen", () => {
  it("separa próximas e anteriores e abre o detalhe ao tocar", () => {
    setState({
      upcoming: [myMatch({ id: "next", title: "Futsal de quinta" })],
      past: [myMatch({ id: "old", title: "Vôlei de maio", isPast: true, status: "closed" })],
    });
    render(<MyMatchesScreen />);

    expect(screen.getByText("Próximas")).toBeTruthy();
    expect(screen.getByText("Anteriores")).toBeTruthy();

    fireEvent.press(screen.getByText("Futsal de quinta"));
    expect(mockNavigate).toHaveBeenCalledWith("MatchDetail", { matchId: "next" });
  });

  it("mostra o papel do usuário e os pedidos para aprovar", () => {
    setState({
      upcoming: [
        myMatch({ id: "mine", pendingRequests: 2 }),
        myMatch({ id: "joined", isOrganizer: false, title: "Basquete" }),
        myMatch({ id: "asked", isOrganizer: false, myStatus: "pending", title: "Tênis" }),
      ],
    });
    render(<MyMatchesScreen />);

    expect(screen.getByText("Você organiza")).toBeTruthy();
    expect(screen.getByText("2 pedidos para aprovar")).toBeTruthy();
    expect(screen.getByText("Confirmado")).toBeTruthy();
    expect(screen.getByText("Aguardando aprovação")).toBeTruthy();
  });

  it("não mostra pedidos pendentes em partida que já passou", () => {
    setState({ past: [myMatch({ pendingRequests: 1, isPast: true, status: "closed" })] });
    render(<MyMatchesScreen />);

    expect(screen.queryByText("1 pedido para aprovar")).toBeNull();
  });

  it("sem partidas, convida a explorar a Home", () => {
    render(<MyMatchesScreen />);

    expect(screen.getByText("Nenhuma partida por aqui")).toBeTruthy();
    fireEvent.press(screen.getByText("Explorar partidas"));
    expect(mockNavigate).toHaveBeenCalledWith("Home");
  });

  it("mostra erro com 'Tentar de novo' quando a busca falha sem dados", () => {
    setState({ isError: true });
    render(<MyMatchesScreen />);

    fireEvent.press(screen.getByText("Tentar de novo"));
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it("puxar para atualizar e voltar para a aba refazem a busca", async () => {
    setState({ upcoming: [myMatch()] });
    render(<MyMatchesScreen />);

    const list = screen.getByTestId("my-matches-list");
    await act(async () => {
      await list.props.refreshControl.props.onRefresh();
    });
    act(() => mockFocusEffect?.());
    act(() => mockFocusEffect?.());

    expect(mockRefetch).toHaveBeenCalledTimes(2);
  });
});
