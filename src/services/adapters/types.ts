import type {
  ExperienceLevel,
  MatchStatus,
  MessageType,
  ParticipationStatus,
  ReportReason,
  ReportStatus,
  Sport,
  UserRole,
} from "../../types";

/** Shapes espelham os schemas Pydantic reais em `snake_case` (ver .status/backend-contract.md). */

export interface ApiPublicUser {
  id: string;
  name: string;
  photo_url?: string | null;
  age: number;
  location: string;
  bio?: string | null;
  favorite_sports: Sport[];
  level: ExperienceLevel;
  is_verified: boolean;
  average_rating: number | null;
  matches_played: number;
}

export interface ApiMyProfile extends ApiPublicUser {
  email: string;
  role: UserRole;
}

export interface ApiParticipant {
  user: ApiPublicUser;
  status: ParticipationStatus;
}

export interface ApiMatchSummary {
  id: string;
  sport: Sport;
  title: string;
  location: string;
  date: string;
  time: string;
  max_participants: number;
  level: ExperienceLevel;
  description?: string | null;
  organizer_id: string;
  status: MatchStatus;
  allow_beginners: boolean;
  requires_approval: boolean;
  confirmed_count: number;
  available_slots: number;
  latitude?: number | null;
  longitude?: number | null;
  distance_km?: number | null;
}

export interface ApiMatchDetail extends ApiMatchSummary {
  organizer: ApiPublicUser;
  participants: ApiParticipant[];
}

export interface ApiMyMatch extends ApiMatchSummary {
  is_organizer: boolean;
  my_status: "confirmed" | "pending" | null;
  pending_requests: number;
  is_past: boolean;
}

export interface ApiMatchRef {
  id: string;
  title: string;
  sport: Sport;
  date: string;
}

export interface ApiRating {
  id: string;
  match: ApiMatchRef;
  rated_user: ApiPublicUser;
  rater: ApiPublicUser;
  punctuality: number;
  respect: number;
  behavior: number;
  presence: number;
  overall: number;
  comment?: string | null;
  created_at: string;
}

export interface ApiReport {
  id: string;
  reported_user: ApiPublicUser;
  reporter: ApiPublicUser;
  match?: ApiMatchRef | null;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  created_at: string;
}

export interface ApiMessage {
  id: string;
  match_id: string;
  sender: ApiPublicUser;
  text: string;
  created_at: string;
  type: MessageType;
}
