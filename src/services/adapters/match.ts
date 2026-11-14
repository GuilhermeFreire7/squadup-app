import type { MatchDetail, MatchRef, MatchSummary, MyMatch, Participant } from "../../types";
import type {
  ApiMatchDetail,
  ApiMatchRef,
  ApiMatchSummary,
  ApiMyMatch,
  ApiParticipant,
} from "./types";
import { toPublicUser } from "./user";

function toShortTime(time: string): string {
  return time.slice(0, 5);
}

export function toMatchRef(api: ApiMatchRef): MatchRef {
  return { id: api.id, title: api.title, sport: api.sport, date: api.date };
}

export function toParticipant(api: ApiParticipant): Participant {
  return { user: toPublicUser(api.user), status: api.status };
}

export function toMatchSummary(api: ApiMatchSummary): MatchSummary {
  return {
    id: api.id,
    sport: api.sport,
    title: api.title,
    location: api.location,
    date: api.date,
    time: toShortTime(api.time),
    maxParticipants: api.max_participants,
    level: api.level,
    description: api.description ?? undefined,
    organizerId: api.organizer_id,
    confirmedCount: api.confirmed_count,
    availableSlots: api.available_slots,
    status: api.status,
    allowBeginners: api.allow_beginners,
    requiresApproval: api.requires_approval,
    latitude: api.latitude ?? null,
    longitude: api.longitude ?? null,
    distanceKm: api.distance_km ?? null,
  };
}

export function toMyMatch(api: ApiMyMatch): MyMatch {
  return {
    ...toMatchSummary(api),
    isOrganizer: api.is_organizer,
    myStatus: api.my_status,
    pendingRequests: api.pending_requests,
    isPast: api.is_past,
  };
}

export function toMatchDetail(api: ApiMatchDetail): MatchDetail {
  return {
    ...toMatchSummary(api),
    organizer: toPublicUser(api.organizer),
    participants: api.participants.map(toParticipant),
  };
}
