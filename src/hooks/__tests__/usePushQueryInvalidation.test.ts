import { QueryClient } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react-native";
import * as Notifications from "expo-notifications";

import { createQueryWrapper } from "../../test-utils/queryClientWrapper";
import { usePushQueryInvalidation } from "../usePushQueryInvalidation";

type Listener = (payload: unknown) => void;

const mockRemoveReceived = jest.fn();
const mockRemoveTapped = jest.fn();
let receivedListener: Listener | null = null;
let tappedListener: Listener | null = null;

jest.mock("expo-notifications", () => ({
  addNotificationReceivedListener: jest.fn((listener: Listener) => {
    receivedListener = listener;
    return { remove: mockRemoveReceived };
  }),
  addNotificationResponseReceivedListener: jest.fn((listener: Listener) => {
    tappedListener = listener;
    return { remove: mockRemoveTapped };
  }),
}));

function notification(data: unknown) {
  return { request: { content: { data } } };
}

function setup() {
  const client = new QueryClient();
  const invalidate = jest.spyOn(client, "invalidateQueries");
  const hook = renderHook(() => usePushQueryInvalidation(), {
    wrapper: createQueryWrapper(client),
  });
  return { invalidate, ...hook };
}

describe("usePushQueryInvalidation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    receivedListener = null;
    tappedListener = null;
  });

  it("push recebido com o app aberto atualiza a partida e a listagem", () => {
    const { invalidate } = setup();

    receivedListener?.(notification({ type: "join_request", matchId: "match-1" }));

    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["match", "match-1"] });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["matches"] });
  });

  it("tocar no push também atualiza", () => {
    const { invalidate } = setup();

    tappedListener?.({
      notification: notification({ type: "new_message", matchId: "match-2" }),
    });

    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["messages", "match-2"] });
  });

  it("ignora push sem o formato { type, matchId }", () => {
    const { invalidate } = setup();

    receivedListener?.(notification({ foo: "bar" }));

    expect(invalidate).not.toHaveBeenCalled();
  });

  it("remove os listeners ao desmontar", () => {
    const { unmount } = setup();

    unmount();

    expect(mockRemoveReceived).toHaveBeenCalled();
    expect(mockRemoveTapped).toHaveBeenCalled();
    expect(Notifications.addNotificationReceivedListener).toHaveBeenCalledTimes(1);
  });
});
