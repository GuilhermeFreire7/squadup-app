import { QueryClient } from "@tanstack/react-query";

import { invalidateQueriesForPush } from "../pushQueryInvalidation";

function invalidatedKeys(type: Parameters<typeof invalidateQueriesForPush>[1]["type"]) {
  const client = new QueryClient();
  const spy = jest.spyOn(client, "invalidateQueries");
  invalidateQueriesForPush(client, { type, matchId: "match-1" });
  return spy.mock.calls.map(([filters]) => filters?.queryKey);
}

describe("invalidateQueriesForPush", () => {
  it.each(["participation_approved", "match_closed"] as const)(
    "%s atualiza a partida e a listagem",
    (type) => {
      expect(invalidatedKeys(type)).toEqual([["match", "match-1"], ["matches"]]);
    }
  );

  it("new_message também atualiza as mensagens da partida", () => {
    expect(invalidatedKeys("new_message")).toEqual([
      ["match", "match-1"],
      ["matches"],
      ["messages", "match-1"],
    ]);
  });
});
