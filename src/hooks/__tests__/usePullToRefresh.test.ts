import { act, renderHook } from "@testing-library/react-native";

import { usePullToRefresh } from "../usePullToRefresh";

describe("usePullToRefresh", () => {
  it("mostra o indicador enquanto busca e esconde ao terminar", async () => {
    let finish: () => void = () => {};
    const refetch = jest.fn(() => new Promise<void>((resolve) => (finish = resolve)));
    const { result } = renderHook(() => usePullToRefresh(refetch));

    let pending: Promise<void> = Promise.resolve();
    act(() => {
      pending = result.current.onRefresh();
    });
    expect(result.current.refreshing).toBe(true);

    await act(async () => {
      finish();
      await pending;
    });
    expect(result.current.refreshing).toBe(false);
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("esconde o indicador mesmo quando a busca falha", async () => {
    const refetch = jest.fn(async () => {
      throw new Error("rede");
    });
    const { result } = renderHook(() => usePullToRefresh(refetch));

    await act(async () => {
      await result.current.onRefresh().catch(() => {});
    });

    expect(result.current.refreshing).toBe(false);
  });
});
