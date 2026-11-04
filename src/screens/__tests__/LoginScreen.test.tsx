import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import React from "react";

import { SLOW_SERVER_MESSAGE } from "../../components/SlowServerNotice";
import LoginScreen from "../LoginScreen";

const mockLogin = jest.fn();
const mockNavigate = jest.fn();

// O atraso de 8 s é testado no próprio hook (useSlowRequestHint.test.ts). Aqui só importa a
// ligação com a tela: "lento" assim que houver carregamento. Sem fake timers nesta suíte, porque
// eles também falsificam microtasks usadas pelo act do React e, com um login pendente, a limpeza
// do teste travava no CI.
jest.mock("../../hooks/useSlowRequestHint", () => ({
  useSlowRequestHint: (active: boolean) => active,
}));

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
  it("mostra o aviso de servidor iniciando enquanto o login está em andamento", async () => {
    let finishLogin: () => void = () => undefined;
    mockLogin.mockReturnValue(new Promise<void>((resolve) => (finishLogin = resolve)));
    render(<LoginScreen />);
    expect(screen.queryByText(SLOW_SERVER_MESSAGE)).toBeNull();

    fireEvent.changeText(screen.getByLabelText("E-mail"), "ana@example.com");
    fireEvent.changeText(screen.getByLabelText("Senha"), "senha123");
    fireEvent.press(screen.getByText("Entrar"));

    expect(await screen.findByText(SLOW_SERVER_MESSAGE)).toBeTruthy();

    // Termina o login para não deixar promise pendente entre os testes.
    await act(async () => finishLogin());
    await waitFor(() => expect(screen.queryByText(SLOW_SERVER_MESSAGE)).toBeNull());
  });
});
