import { act, renderHook } from "@testing-library/react-native";
import { Keyboard } from "react-native";

import { useKeyboardVisible } from "../useKeyboardVisible";

describe("useKeyboardVisible", () => {
  it("acompanha o teclado abrindo e fechando e remove os listeners ao desmontar", () => {
    const listeners: Record<string, () => void> = {};
    const remove = jest.fn();
    const spy = jest.spyOn(Keyboard, "addListener").mockImplementation((event, handler) => {
      listeners[event] = handler as () => void;
      return { remove } as unknown as ReturnType<typeof Keyboard.addListener>;
    });

    const { result, unmount } = renderHook(() => useKeyboardVisible());
    expect(result.current).toBe(false);

    act(() => listeners.keyboardDidShow());
    expect(result.current).toBe(true);

    act(() => listeners.keyboardDidHide());
    expect(result.current).toBe(false);

    unmount();
    expect(remove).toHaveBeenCalledTimes(2);
    spy.mockRestore();
  });
});
