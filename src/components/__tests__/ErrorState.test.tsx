import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

import ErrorState from "../ErrorState";

describe("ErrorState", () => {
  it("mostra título e descrição padrão", () => {
    render(<ErrorState onRetry={jest.fn()} />);

    expect(screen.getByText("Não foi possível carregar")).toBeTruthy();
    expect(screen.getByText("Verifique sua conexão e tente de novo.")).toBeTruthy();
  });

  it("aceita título próprio e chama onRetry ao tocar em 'Tentar de novo'", () => {
    const onRetry = jest.fn();
    render(<ErrorState title="Falhou a lista" onRetry={onRetry} />);

    fireEvent.press(screen.getByText("Tentar de novo"));

    expect(screen.getByText("Falhou a lista")).toBeTruthy();
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
