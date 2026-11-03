import { render, screen } from "@testing-library/react-native";
import React from "react";

import SlowServerNotice, { SLOW_SERVER_MESSAGE } from "../SlowServerNotice";

describe("SlowServerNotice", () => {
  it("não renderiza nada quando invisível", () => {
    render(<SlowServerNotice visible={false} />);

    expect(screen.queryByText(SLOW_SERVER_MESSAGE)).toBeNull();
  });

  it("mostra o aviso quando visível", () => {
    render(<SlowServerNotice visible tone="dark" />);

    expect(screen.getByText(SLOW_SERVER_MESSAGE)).toBeTruthy();
  });
});
