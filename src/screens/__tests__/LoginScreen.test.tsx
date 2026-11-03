import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import React from "react";

import { SLOW_SERVER_MESSAGE } from "../../components/SlowServerNotice";
import { SLOW_REQUEST_HINT_MS } from "../../hooks/useSlowRequestHint";
import LoginScreen from "../LoginScreen";

const mockLogin = jest.fn();
const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ navigate: mockNavigate, goBack: jest.fn() }),
}));

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: false,
    user: null,
    pendingName: "",
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("LoginScreen", () => {
  it("renderiza o campo de e-mail", () => {
    render(<LoginScreen />);
    expect(screen.getByLabelText("E-mail")).toBeTruthy();
  });

  it("renderiza o campo de senha", () => {
    render(<LoginScreen />);
    expect(screen.getByLabelText("Senha")).toBeTruthy();
  });

  it("renderiza o botão Entrar", () => {
    render(<LoginScreen />);
    expect(screen.getByText("Entrar")).toBeTruthy();
  });

  it("renderiza o link para criação de conta", () => {
    render(<LoginScreen />);
    expect(screen.getByText("Criar conta")).toBeTruthy();
  });

  it("exibe erro quando e-mail está vazio", () => {
    render(<LoginScreen />);
    fireEvent.press(screen.getByText("Entrar"));
    expect(screen.getByText("Informe um e-mail válido")).toBeTruthy();
  });

  it("exibe erro quando senha é muito curta", () => {
    render(<LoginScreen />);
    fireEvent.changeText(screen.getByLabelText("E-mail"), "teste@email.com");
    fireEvent.changeText(screen.getByLabelText("Senha"), "123");
    fireEvent.press(screen.getByText("Entrar"));
    expect(screen.getByText("A senha deve ter pelo menos 6 caracteres")).toBeTruthy();
  });

  it("exibe erro de e-mail inválido sem @", () => {
    render(<LoginScreen />);
    fireEvent.changeText(screen.getByLabelText("E-mail"), "emailinvalido");
    fireEvent.changeText(screen.getByLabelText("Senha"), "senha123");
    fireEvent.press(screen.getByText("Entrar"));
    expect(screen.getByText("Informe um e-mail válido")).toBeTruthy();
  });

  it("chama login com as credenciais corretas quando o formulário é válido", async () => {
    render(<LoginScreen />);
    fireEvent.changeText(screen.getByLabelText("E-mail"), "teste@email.com");
    fireEvent.changeText(screen.getByLabelText("Senha"), "senha123");
    fireEvent.press(screen.getByText("Entrar"));
    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith("teste@email.com", "senha123"), {
      timeout: 1500,
    });
  });

  it("não chama login quando o formulário tem erros", () => {
    render(<LoginScreen />);
    fireEvent.press(screen.getByText("Entrar"));
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("navega para Register ao pressionar Criar conta", () => {
    render(<LoginScreen />);
    fireEvent.press(screen.getByText("Criar conta"));
    expect(mockNavigate).toHaveBeenCalledWith("Register");
  });
});

describe("LoginScreen — servidor lento (cold start)", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("avisa que o servidor está iniciando quando o login demora", () => {
    mockLogin.mockReturnValue(new Promise(() => undefined));
    render(<LoginScreen />);
    fireEvent.changeText(screen.getByLabelText("E-mail"), "ana@example.com");
    fireEvent.changeText(screen.getByLabelText("Senha"), "senha123");
    fireEvent.press(screen.getByText("Entrar"));

    expect(screen.queryByText(SLOW_SERVER_MESSAGE)).toBeNull();
    act(() => jest.advanceTimersByTime(SLOW_REQUEST_HINT_MS));

    expect(screen.getByText(SLOW_SERVER_MESSAGE)).toBeTruthy();
  });
});
