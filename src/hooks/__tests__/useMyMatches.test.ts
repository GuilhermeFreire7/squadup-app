import { renderHook, waitFor } from "@testing-library/react-native";

import { createQueryWrapper } from "../../test-utils/queryClientWrapper";
import { useMyMatches } from "../useMyMatches";

function apiMyMatch(id: string, overrides: Record<string, unknown> = {}) {
  return {
    id,
    sport: "football",
    title: `Partida ${id}`,
    location: "Arena Botafogo",
    date: "2026-12-20",
    time: "10:00:00",
    max_participants: 10,
    level: "intermediate",
    description: null,
    organizer_id: "u1",
    status: "open",
    allow_beginners: true,
    requires_approval: true,
    confirmed_count: 1,
    available_slots: 9,
    is_organizer: true,
    my_status: "confirmed",
    pending_requests: 0,
    is_past: false,
    ...overrides,
  };
}

function mockFetch(body: unknown, status = 200) {
  globalThis.fetch = jest.fn(async () => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  })) as jest.Mock;
}

describe("useMyMatches", () => {
  it("separa próximas e anteriores mantendo a ordem da API", async () => {
    mockFetch([
      apiMyMatch("a"),
      apiMyMatch("b", { is_organizer: false, my_status: "pending" }),
      apiMyMatch("c", { is_past: true, status: "closed" }),
    ]);

    const { result } = renderHook(() => useMyMatches(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.upcoming.map((m) => m.id)).toEqual(["a", "b"]);
    expect(result.current.past.map((m) => m.id)).toEqual(["c"]);
    expect(result.current.upcoming[1].myStatus).toBe("pending");
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/users/me/matches"),
      expect.anything()
    );
  });

  it("soma os pedidos pendentes só das próximas partidas", async () => {
    mockFetch([
      apiMyMatch("a", { pending_requests: 2 }),
      apiMyMatch("b", { pending_requests: 1 }),
      apiMyMatch("c", { pending_requests: 5, is_past: true }),
    ]);

    const { result } = renderHook(() => useMyMatches(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.pendingRequestsTotal).toBe(3);
  });

  it("expõe a falha da consulta", async () => {
    mockFetch({ detail: { code: "INTERNAL", message: "erro" } }, 500);

    const { result } = renderHook(() => useMyMatches(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.upcoming).toEqual([]);
    expect(result.current.pendingRequestsTotal).toBe(0);
  });
});
