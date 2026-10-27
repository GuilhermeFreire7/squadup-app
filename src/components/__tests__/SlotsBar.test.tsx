import { render, screen } from "@testing-library/react-native";
import React from "react";

import SlotsBar from "../SlotsBar";

describe("SlotsBar", () => {
  it("mostra vagas disponíveis e confirmados", () => {
    render(<SlotsBar confirmed={4} max={14} />);
    expect(screen.getByText(/10 vagas disponíveis/)).toBeTruthy();
    expect(screen.getByText(/4\/14 confirmados/)).toBeTruthy();
  });

  it("usa o singular quando resta uma vaga", () => {
    render(<SlotsBar confirmed={9} max={10} />);
    expect(screen.getByText(/1 vaga disponível/)).toBeTruthy();
  });

  it("exibe 'Sem vagas' quando lotada", () => {
    render(<SlotsBar confirmed={10} max={10} size="md" />);
    expect(screen.getByText(/Sem vagas/)).toBeTruthy();
  });

  it("não quebra com máximo zero", () => {
    render(<SlotsBar confirmed={0} max={0} />);
    expect(screen.getByText(/0\/0 confirmados/)).toBeTruthy();
  });
});
