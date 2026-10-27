import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";

import CreateMatchScreen from "../CreateMatchScreen";

const mockNavigate = jest.fn();
const mockInvalidateMatches = jest.fn();
const mockCreateMatch = jest.fn();
const mockRequestLocation = jest.fn();
let mockDeviceLocation: { latitude: number; longitude: number } | null = null;

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
}));

jest.mock("../../contexts/MatchesContext", () => ({
  useInvalidateMatches: () => mockInvalidateMatches,
}));

jest.mock("../../services/api/matches", () => ({
  createMatch: (...args: unknown[]) => mockCreateMatch(...args),
}));

jest.mock("../../hooks/useDeviceLocation", () => ({
  useDeviceLocation: () => ({
    location: mockDeviceLocation,
    permissionDenied: false,
    isLoading: false,
    requestLocation: mockRequestLocation,
  }),
}));

jest.spyOn(Alert, "alert");

beforeEach(() => {
  jest.clearAllMocks();
  mockCreateMatch.mockResolvedValue({ id: "match-new" });
  mockRequestLocation.mockResolvedValue(undefined);
  mockDeviceLocation = null;
});

// ─── Helpers ────────────────────────────────────────────────────────────────

function fillValidForm() {
  fireEvent.press(screen.getByLabelText("Futebol"));
  fireEvent.changeText(
    screen.getByPlaceholderText("Ex: Pelada de domingo na arena"),
    "Pelada de teste no parque"
  );
  fireEvent.changeText(
    screen.getByPlaceholderText("Ex: Arena Botafogo — Rua Gen. Polidoro"),
    "Parque Ibirapuera"
  );
  fireEvent.changeText(screen.getByPlaceholderText("DD/MM/AAAA"), "01/06/2026");
  fireEvent.changeText(screen.getByPlaceholderText("HH:MM"), "18:00");
  fireEvent.changeText(screen.getByPlaceholderText("Ex: 10"), "10");
}

// ─── Renderização ────────────────────────────────────────────────────────────

describe("CreateMatchScreen — renderização", () => {
  it("exibe o título da tela", () => {
    render(<CreateMatchScreen />);
    // Título do header e rótulo do botão de envio
    expect(screen.getAllByText("Criar partida")).toHaveLength(2);
  });

  it("exibe o campo de título", () => {
    render(<CreateMatchScreen />);
    expect(screen.getByPlaceholderText("Ex: Pelada de domingo na arena")).toBeTruthy();
  });

  it("exibe o campo de local", () => {
    render(<CreateMatchScreen />);
    expect(screen.getByPlaceholderText("Ex: Arena Botafogo — Rua Gen. Polidoro")).toBeTruthy();
  });

  it("exibe os chips de esporte", () => {
    render(<CreateMatchScreen />);
    expect(screen.getByLabelText("Futebol")).toBeTruthy();
    expect(screen.getByLabelText("Basquete")).toBeTruthy();
    expect(screen.getByLabelText("Vôlei")).toBeTruthy();
  });

  it("exibe os chips de nível", () => {
    render(<CreateMatchScreen />);
    expect(screen.getByLabelText("Iniciante")).toBeTruthy();
    expect(screen.getByLabelText("Intermediário")).toBeTruthy();
    expect(screen.getByLabelText("Avançado")).toBeTruthy();
  });

  it("exibe os toggles de opções", () => {
    render(<CreateMatchScreen />);
    expect(screen.getByLabelText("Permitir iniciantes")).toBeTruthy();
    expect(screen.getByLabelText("Exigir aprovação do organizador")).toBeTruthy();
  });

  it("exibe o botão de submissão", () => {
    render(<CreateMatchScreen />);
    expect(screen.getByRole("button", { name: "Criar partida" })).toBeTruthy();
  });
});

// ─── Validação ───────────────────────────────────────────────────────────────

describe("CreateMatchScreen — validação", () => {
  it("exibe erro de esporte ao submeter sem selecionar modalidade", () => {
    render(<CreateMatchScreen />);
    fireEvent.press(screen.getByRole("button", { name: "Criar partida" }));
    expect(screen.getByText("Selecione uma modalidade esportiva")).toBeTruthy();
  });

  it("exibe erro de título muito curto", () => {
    render(<CreateMatchScreen />);
    fireEvent.changeText(screen.getByPlaceholderText("Ex: Pelada de domingo na arena"), "AB");
    fireEvent.press(screen.getByRole("button", { name: "Criar partida" }));
    expect(screen.getByText("Título deve ter ao menos 3 caracteres")).toBeTruthy();
  });

  it("exibe erro de local vazio", () => {
    render(<CreateMatchScreen />);
    fireEvent.press(screen.getByRole("button", { name: "Criar partida" }));
    expect(screen.getByText("Informe o local da partida")).toBeTruthy();
  });

  it("exibe erro de data inválida", () => {
    render(<CreateMatchScreen />);
    fireEvent.changeText(screen.getByPlaceholderText("DD/MM/AAAA"), "abc");
    fireEvent.press(screen.getByRole("button", { name: "Criar partida" }));
    expect(screen.getByText("Use o formato DD/MM/AAAA")).toBeTruthy();
  });

  it("exibe erro de horário inválido", () => {
    render(<CreateMatchScreen />);
    fireEvent.changeText(screen.getByPlaceholderText("HH:MM"), "25:00");
    fireEvent.press(screen.getByRole("button", { name: "Criar partida" }));
    expect(screen.getByText("Use o formato HH:MM")).toBeTruthy();
  });

  it("exibe erro de participantes abaixo do mínimo", () => {
    render(<CreateMatchScreen />);
    fireEvent.changeText(screen.getByPlaceholderText("Ex: 10"), "1");
    fireEvent.press(screen.getByRole("button", { name: "Criar partida" }));
    expect(screen.getByText("Mínimo de 2 participantes")).toBeTruthy();
  });

  it("exibe erro de participantes quando campo está vazio", () => {
    render(<CreateMatchScreen />);
    fireEvent.press(screen.getByRole("button", { name: "Criar partida" }));
    expect(screen.getByText("Mínimo de 2 participantes")).toBeTruthy();
  });

  it("não chama createMatch quando o formulário é inválido", () => {
    render(<CreateMatchScreen />);
    fireEvent.press(screen.getByRole("button", { name: "Criar partida" }));
    expect(mockCreateMatch).not.toHaveBeenCalled();
  });
});

// ─── Submissão válida ─────────────────────────────────────────────────────────

describe("CreateMatchScreen — submissão válida", () => {
  it("chama createMatch com os dados corretos", async () => {
    render(<CreateMatchScreen />);
    fillValidForm();
    fireEvent.press(screen.getByRole("button", { name: "Criar partida" }));

    await waitFor(() => expect(mockCreateMatch).toHaveBeenCalledTimes(1));
    const payload = mockCreateMatch.mock.calls[0][0];
    expect(payload.sport).toBe("football");
    expect(payload.title).toBe("Pelada de teste no parque");
    expect(payload.location).toBe("Parque Ibirapuera");
    expect(payload.date).toBe("2026-06-01");
    expect(payload.time).toBe("18:00:00");
    expect(payload.max_participants).toBe(10);
    expect(payload.level).toBe("intermediate");
  });

  it("converte data DD/MM/AAAA para YYYY-MM-DD corretamente", async () => {
    render(<CreateMatchScreen />);
    fillValidForm();
    fireEvent.press(screen.getByRole("button", { name: "Criar partida" }));

    await waitFor(() => expect(mockCreateMatch).toHaveBeenCalledTimes(1));
    const payload = mockCreateMatch.mock.calls[0][0];
    expect(payload.date).toBe("2026-06-01");
  });

  it("invalida o cache de partidas após sucesso", async () => {
    render(<CreateMatchScreen />);
    fillValidForm();
    fireEvent.press(screen.getByRole("button", { name: "Criar partida" }));

    await waitFor(() => expect(mockInvalidateMatches).toHaveBeenCalledTimes(1));
  });

  it("exibe Alert de sucesso após submissão válida", async () => {
    render(<CreateMatchScreen />);
    fillValidForm();
    fireEvent.press(screen.getByRole("button", { name: "Criar partida" }));

    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith(
        "Partida criada!",
        expect.stringContaining("Pelada de teste no parque"),
        expect.any(Array)
      )
    );
  });

  it("inclui o esporte e a data no Alert de sucesso", async () => {
    render(<CreateMatchScreen />);
    fillValidForm();
    fireEvent.press(screen.getByRole("button", { name: "Criar partida" }));

    await waitFor(() => expect(Alert.alert).toHaveBeenCalled());
    const message = (Alert.alert as jest.Mock).mock.calls[0][1] as string;
    expect(message).toContain("Futebol");
    expect(message).toContain("01/06/2026");
    expect(message).toContain("18:00");
  });

  it("exibe Alert de erro quando createMatch falha", async () => {
    mockCreateMatch.mockRejectedValueOnce(new Error("network error"));
    render(<CreateMatchScreen />);
    fillValidForm();
    fireEvent.press(screen.getByRole("button", { name: "Criar partida" }));

    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith(
        "Não foi possível criar a partida",
        expect.any(String)
      )
    );
  });
});

// ─── Interações ───────────────────────────────────────────────────────────────

describe("CreateMatchScreen — interações", () => {
  it("toggle 'Permitir iniciantes' altera o estado visualmente", () => {
    render(<CreateMatchScreen />);
    const toggle = screen.getByLabelText("Permitir iniciantes");
    expect(toggle.props.accessibilityState.checked).toBe(false);
    fireEvent.press(toggle);
    expect(toggle.props.accessibilityState.checked).toBe(true);
  });

  it("toggle 'Exigir aprovação' altera o estado visualmente", () => {
    render(<CreateMatchScreen />);
    const toggle = screen.getByLabelText("Exigir aprovação do organizador");
    expect(toggle.props.accessibilityState.checked).toBe(false);
    fireEvent.press(toggle);
    expect(toggle.props.accessibilityState.checked).toBe(true);
  });

  it("selecionar um esporte remove o erro de modalidade", () => {
    render(<CreateMatchScreen />);
    fireEvent.press(screen.getByRole("button", { name: "Criar partida" }));
    expect(screen.getByText("Selecione uma modalidade esportiva")).toBeTruthy();
    fireEvent.press(screen.getByLabelText("Vôlei"));
    expect(screen.queryByText("Selecione uma modalidade esportiva")).toBeNull();
  });

  it("createMatch recebe allow_beginners=true quando toggle ativado", async () => {
    render(<CreateMatchScreen />);
    fillValidForm();
    fireEvent.press(screen.getByLabelText("Permitir iniciantes"));
    fireEvent.press(screen.getByRole("button", { name: "Criar partida" }));

    await waitFor(() => expect(mockCreateMatch).toHaveBeenCalledTimes(1));
    const payload = mockCreateMatch.mock.calls[0][0];
    expect(payload.allow_beginners).toBe(true);
  });

  it("createMatch recebe requires_approval=true quando toggle ativado", async () => {
    render(<CreateMatchScreen />);
    fillValidForm();
    fireEvent.press(screen.getByLabelText("Exigir aprovação do organizador"));
    fireEvent.press(screen.getByRole("button", { name: "Criar partida" }));

    await waitFor(() => expect(mockCreateMatch).toHaveBeenCalledTimes(1));
    const payload = mockCreateMatch.mock.calls[0][0];
    expect(payload.requires_approval).toBe(true);
  });
});

// ─── Geolocalização ─────────────────────────────────────────────────────────

describe("CreateMatchScreen — geolocalização", () => {
  it("solicita a localização do dispositivo ao montar", () => {
    render(<CreateMatchScreen />);
    expect(mockRequestLocation).toHaveBeenCalledTimes(1);
  });

  it("inclui latitude/longitude no payload quando a localização está disponível", async () => {
    mockDeviceLocation = { latitude: -22.9, longitude: -43.2 };
    render(<CreateMatchScreen />);
    fillValidForm();
    fireEvent.press(screen.getByRole("button", { name: "Criar partida" }));

    await waitFor(() => expect(mockCreateMatch).toHaveBeenCalledTimes(1));
    const payload = mockCreateMatch.mock.calls[0][0];
    expect(payload.latitude).toBe(-22.9);
    expect(payload.longitude).toBe(-43.2);
  });

  it("não inclui latitude/longitude no payload quando a localização não está disponível", async () => {
    render(<CreateMatchScreen />);
    fillValidForm();
    fireEvent.press(screen.getByRole("button", { name: "Criar partida" }));

    await waitFor(() => expect(mockCreateMatch).toHaveBeenCalledTimes(1));
    const payload = mockCreateMatch.mock.calls[0][0];
    expect(payload.latitude).toBeUndefined();
    expect(payload.longitude).toBeUndefined();
  });

  it("mostra aviso discreto quando a localização não pôde ser capturada (D26)", async () => {
    render(<CreateMatchScreen />);
    expect(
      await screen.findByText("Localização não disponível — partida será criada sem coordenadas")
    ).toBeTruthy();
  });

  it("não mostra aviso de localização quando as coordenadas estão disponíveis", async () => {
    mockDeviceLocation = { latitude: -22.9, longitude: -43.2 };
    render(<CreateMatchScreen />);
    await waitFor(() => expect(mockRequestLocation).toHaveBeenCalledTimes(1));
    expect(
      screen.queryByText("Localização não disponível — partida será criada sem coordenadas")
    ).toBeNull();
  });
});
