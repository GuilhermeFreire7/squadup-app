import { renderHook, waitFor } from "@testing-library/react-native";

import { createQueryWrapper } from "../../test-utils/queryClientWrapper";
import { useMatchDetail } from "../useMatchDetail";

const ORGANIZER = {
  id: "u1",
  name: "Ana Souza",
  photo_url: null,
  age: 28,
  location: "Rio de Janeiro, RJ",
  bio: null,
  favorite_sports: ["football"],
  level: "intermediate",
  is_verified: false,
  average_rating: 4.5,
  matches_played: 12,
};

const MATCH = {
  id: "match-1",
  sport: "football",
  title: "Pelada de domingo",
  location: "Arena Botafogo",
  date: "2026-12-20",
  time: "10:00:00",
  max_participants: 10,
  level: "intermediate",
  description: null,
  organizer_id: "u1",
  status: "open",
  allow_beginners: true,
  requires_approval: false,
  confirmed_count: 1,
  available_slots: 9,
  organizer: ORGANIZER,
  participants: [{ user: ORGANIZER, status: "confirmed" }],
};

function mockFetchMatch() {
  globalThis.fetch = jest.fn(async () => ({
    ok: true,
    status: 200,
    json: async () => MATCH,
  })) as jest.Mock;
}

describe("useMatchDetail — polling", () => {
  beforeEach(() => mockFetchMatch());

  it("com poll ligado, busca a partida de novo a cada intervalo", async () => {
    const { result } = renderHook(
      () => useMatchDetail("match-1", { poll: true, pollIntervalMs: 30 }),
      {
        wrapper: createQueryWrapper(),
      }
    );

    await waitFor(() => expect(result.current.match?.title).toBe("Pelada de domingo"));
    await waitFor(() =>
      expect((globalThis.fetch as jest.Mock).mock.calls.length).toBeGreaterThanOrEqual(3)
    );
  });

  it("sem poll, busca uma vez só", async () => {
    const { result } = renderHook(() => useMatchDetail("match-1", { pollIntervalMs: 30 }), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.match).not.toBeNull());
    await new Promise((resolve) => setTimeout(resolve, 120));
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });
});
