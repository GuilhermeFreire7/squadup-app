import { AppState } from "react-native";

import { subscribeAppStateFocus } from "../queryClient";

describe("subscribeAppStateFocus", () => {
  it("avisa foco quando o app volta a ficar ativo e perde foco em segundo plano", () => {
    const remove = jest.fn();
    let listener: ((status: string) => void) | undefined;
    const spy = jest.spyOn(AppState, "addEventListener").mockImplementation((_event, handler) => {
      listener = handler as (status: string) => void;
      return { remove } as unknown as ReturnType<typeof AppState.addEventListener>;
    });
    const handleFocus = jest.fn();

    const unsubscribe = subscribeAppStateFocus(handleFocus);
    listener?.("background");
    listener?.("active");
    unsubscribe();

    expect(spy).toHaveBeenCalledWith("change", expect.any(Function));
    expect(handleFocus.mock.calls).toEqual([[false], [true]]);
    expect(remove).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });
});
