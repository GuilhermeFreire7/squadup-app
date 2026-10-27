import { render, screen } from "@testing-library/react-native";
import React from "react";

import LoadingState from "../LoadingState";

describe("LoadingState", () => {
  it("exibe o texto de carregamento", () => {
    render(<LoadingState label="Carregando partida..." />);
    expect(screen.getByText("Carregando partida...")).toBeTruthy();
  });
});
