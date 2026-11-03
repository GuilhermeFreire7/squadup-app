import { act, renderHook } from "@testing-library/react-native";

import { SLOW_REQUEST_HINT_MS, useSlowRequestHint } from "../useSlowRequestHint";

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe("useSlowRequestHint", () => {
  it("fica false enquanto nada está carregando", () => {
    const { result } = renderHook(() => useSlowRequestHint(false));

    act(() => jest.advanceTimersByTime(SLOW_REQUEST_HINT_MS * 2));

    expect(result.current).toBe(false);
  });

  it("vira true só depois do atraso, se o carregamento continuar", () => {
    const { result } = renderHook(() => useSlowRequestHint(true));

    act(() => jest.advanceTimersByTime(SLOW_REQUEST_HINT_MS - 1));
    expect(result.current).toBe(false);

    act(() => jest.advanceTimersByTime(1));
    expect(result.current).toBe(true);
  });

  it("volta a false quando o carregamento termina e recomeça a contagem na próxima vez", () => {
    const { result, rerender } = renderHook(
      ({ active }: { active: boolean }) => useSlowRequestHint(active),
      {
        initialProps: { active: true },
      }
    );
    act(() => jest.advanceTimersByTime(SLOW_REQUEST_HINT_MS));
    expect(result.current).toBe(true);

    rerender({ active: false });
    expect(result.current).toBe(false);

    rerender({ active: true });
    act(() => jest.advanceTimersByTime(SLOW_REQUEST_HINT_MS - 1));
    expect(result.current).toBe(false);
  });
});
