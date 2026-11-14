import { toMatchDetail, toMatchRef, toMatchSummary, toMyMatch, toParticipant } from "../match";
import type {
  ApiMatchDetail,
  ApiMatchRef,
  ApiMatchSummary,
  ApiMyMatch,
  ApiParticipant,
  ApiPublicUser,
} from "../types";

const API_USER: ApiPublicUser = {
  id: "user-1",
  name: "Carlos Lima",
  photo_url: null,
  age: 30,
  location: "Rio de Janeiro, RJ",
  bio: null,
  favorite_sports: ["football"],
  level: "advanced",
  is_verified: false,
  average_rating: 4.0,
  matches_played: 20,
};

const API_MATCH_SUMMARY: ApiMatchSummary = {
  id: "match-1",
  sport: "football",
  title: "Pelada de domingo na arena",
  location: "Arena Botafogo",
  date: "2026-05-25",
  time: "09:00:00",
  max_participants: 14,
  level: "intermediate",
  description: "Jogo de campo gramado.",
  organizer_id: "user-1",
  status: "open",
  allow_beginners: true,
  requires_approval: false,
  confirmed_count: 4,
  available_slots: 10,
};

describe("toMatchRef", () => {
  it("converte a referência leve de partida", () => {
    const api: ApiMatchRef = {
      id: "match-1",
      title: "Pelada",
      sport: "football",
      date: "2026-05-25",
    };

    expect(toMatchRef(api)).toEqual(api);
  });
});

describe("toParticipant", () => {
  it("expande o usuário e mantém o status", () => {
    const api: ApiParticipant = { user: API_USER, status: "confirmed" };

    const result = toParticipant(api);

    expect(result.status).toBe("confirmed");
    expect(result.user.id).toBe("user-1");
  });
});

describe("toMatchSummary", () => {
  it("converte snake_case, calcula vagas a partir dos campos do servidor e encurta o horário", () => {
    const result = toMatchSummary(API_MATCH_SUMMARY);

    expect(result).toEqual({
      id: "match-1",
      sport: "football",
      title: "Pelada de domingo na arena",
      location: "Arena Botafogo",
      date: "2026-05-25",
      time: "09:00",
      maxParticipants: 14,
      level: "intermediate",
      description: "Jogo de campo gramado.",
      organizerId: "user-1",
      confirmedCount: 4,
      availableSlots: 10,
      status: "open",
      allowBeginners: true,
      requiresApproval: false,
      latitude: null,
      longitude: null,
      distanceKm: null,
    });
  });

  it("mantém latitude/longitude quando o servidor informa coordenadas", () => {
    const result = toMatchSummary({ ...API_MATCH_SUMMARY, latitude: -22.9, longitude: -43.2 });

    expect(result.latitude).toBe(-22.9);
    expect(result.longitude).toBe(-43.2);
  });

  it("mantém distance_km quando o servidor informa a distância", () => {
    const result = toMatchSummary({ ...API_MATCH_SUMMARY, distance_km: 3.2 });

    expect(result.distanceKm).toBe(3.2);
  });

  it("converte description nula em undefined", () => {
    const result = toMatchSummary({ ...API_MATCH_SUMMARY, description: null });

    expect(result.description).toBeUndefined();
  });
});

describe("toMatchDetail", () => {
  it("expande organizer e participants a partir do MatchSummary", () => {
    const api: ApiMatchDetail = {
      ...API_MATCH_SUMMARY,
      organizer: API_USER,
      participants: [{ user: API_USER, status: "confirmed" }],
    };

    const result = toMatchDetail(api);

    expect(result.organizer.id).toBe("user-1");
    expect(result.participants).toHaveLength(1);
    expect(result.participants[0].status).toBe("confirmed");
    expect(result.availableSlots).toBe(10);
  });
});

describe("toMyMatch", () => {
  it("acrescenta papel, status, pedidos pendentes e se a partida já passou", () => {
    const api: ApiMyMatch = {
      ...API_MATCH_SUMMARY,
      is_organizer: true,
      my_status: "confirmed",
      pending_requests: 2,
      is_past: false,
    };

    expect(toMyMatch(api)).toEqual({
      ...toMatchSummary(API_MATCH_SUMMARY),
      isOrganizer: true,
      myStatus: "confirmed",
      pendingRequests: 2,
      isPast: false,
    });
  });
});
