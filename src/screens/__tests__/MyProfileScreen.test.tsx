import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

import { CURRENT_USER } from "../../mocks/users";
import type { MyProfile } from "../../types";
import MyProfileScreen from "../MyProfileScreen";

const mockNavigate = jest.fn();
let mockUser: MyProfile | null = CURRENT_USER;

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
}));

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: mockUser }),
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
