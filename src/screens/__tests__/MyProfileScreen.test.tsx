import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { Alert, type AlertButton } from "react-native";

import { CURRENT_USER } from "../../mocks/users";
import type { MyProfile } from "../../types";
import MyProfileScreen from "../MyProfileScreen";

const mockNavigate = jest.fn();
const mockLogout = jest.fn();
let mockUser: MyProfile | null = CURRENT_USER;

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
}));

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: mockUser, logout: mockLogout }),
}));

jest.mock("../../hooks/useRatings", () => ({
  useUserRatings: () => ({ ratings: [], isLoading: false }),
}));

beforeEach(() => {
  mockNavigate.mockClear();
});

describe("MyProfileScreen — painel administrativo", () => {
  it("não mostra a entrada do painel para usuário comum", () => {
    mockUser = { ...CURRENT_USER, role: "user" };
    render(<MyProfileScreen />);
    expect(screen.getByText(CURRENT_USER.name)).toBeTruthy();
    expect(screen.queryByText("Painel administrativo")).toBeNull();
  });

  it("mostra a entrada do painel para admin e navega até ele", () => {
    mockUser = { ...CURRENT_USER, role: "admin" };
    render(<MyProfileScreen />);
    fireEvent.press(screen.getByRole("button", { name: "Painel administrativo" }));
    expect(mockNavigate).toHaveBeenCalledWith("AdminDashboard");
  });
});

describe("MyProfileScreen — sair da conta", () => {
  function pressLogoutAndGetButtons(): AlertButton[] {
    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => undefined);
    mockUser = { ...CURRENT_USER, role: "user" };
    render(<MyProfileScreen />);

    fireEvent.press(screen.getByText("Sair da conta"));

    expect(alertSpy).toHaveBeenCalledWith("Sair da conta", expect.any(String), expect.any(Array));
    const buttons = alertSpy.mock.calls[0][2] as AlertButton[];
    alertSpy.mockRestore();
    return buttons;
  }

  beforeEach(() => mockLogout.mockClear());

  it("pede confirmação e sai ao confirmar", () => {
    const buttons = pressLogoutAndGetButtons();

    buttons.find((b) => b.text === "Sair")?.onPress?.();

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("não sai ao cancelar", () => {
    const buttons = pressLogoutAndGetButtons();

    buttons.find((b) => b.text === "Cancelar")?.onPress?.();

    expect(mockLogout).not.toHaveBeenCalled();
  });
});
