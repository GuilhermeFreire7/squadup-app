import { navigateFromPushNotification, navigationRef } from "../navigationRef";

describe("navigateFromPushNotification", () => {
  let isReadySpy: jest.SpyInstance;
  let navigateSpy: jest.SpyInstance;

  beforeEach(() => {
    isReadySpy = jest.spyOn(navigationRef, "isReady").mockReturnValue(true);
    navigateSpy = jest.spyOn(navigationRef, "navigate").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("não navega quando a navegação ainda não está pronta", () => {
    isReadySpy.mockReturnValue(false);

    navigateFromPushNotification({ type: "new_message", matchId: "match-1" });

    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it("navega para MatchChat em new_message", () => {
    navigateFromPushNotification({ type: "new_message", matchId: "match-1" });

    expect(navigateSpy).toHaveBeenCalledWith("MatchChat", { matchId: "match-1" });
  });

  it("navega para MatchDetail em match_closed", () => {
    navigateFromPushNotification({ type: "match_closed", matchId: "match-2" });

    expect(navigateSpy).toHaveBeenCalledWith("MatchDetail", { matchId: "match-2" });
  });

  it("navega para MatchDetail em participation_approved", () => {
    navigateFromPushNotification({ type: "participation_approved", matchId: "match-3" });

    expect(navigateSpy).toHaveBeenCalledWith("MatchDetail", { matchId: "match-3" });
  });

  it.each(["join_request", "participant_joined"] as const)(
    "navega para MatchDetail em %s (aviso ao organizador)",
    (type) => {
      navigateFromPushNotification({ type, matchId: "match-4" });

      expect(navigateSpy).toHaveBeenCalledWith("MatchDetail", { matchId: "match-4" });
    }
  );
});
