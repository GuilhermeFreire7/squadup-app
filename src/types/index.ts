export type Sport = "football" | "volleyball" | "basketball" | "tennis" | "futsal" | "other";

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export type MatchStatus = "open" | "full" | "pending_approval" | "closed" | "cancelled";

export type ParticipationStatus = "confirmed" | "pending" | "cancelled";

export type ReportReason =
  | "bad_behavior"
  | "violence"
  | "no_show"
  | "hate_speech"
  | "spam"
  | "fake_info"
  | "other";

export type ReportStatus = "pending" | "archived" | "warned" | "banned";

export type UserRole = "user" | "admin";

/** Dados públicos de qualquer usuário — equivalente a `PublicProfileRead` no backend. */
export interface PublicUser {
  id: string;
  name: string;
  photoUrl?: string;
  age: number;
  location: string;
  bio?: string;
  favoriteSports: Sport[];
  level: ExperienceLevel;
  averageRating: number | null;
  matchesPlayed: number;
  isVerified: boolean;
}

/** Perfil do próprio usuário logado — equivalente a `MyProfileRead` no backend. */
export interface MyProfile extends PublicUser {
  email: string;
  role: UserRole;
}

export interface Participant {
  user: PublicUser;
  status: ParticipationStatus;
}

/** Equivalente a `MatchRead` — shape devolvido por listagem e ações, sem expandir organizador/participantes. */
export interface MatchSummary {
  id: string;
  sport: Sport;
  title: string;
  location: string;
  date: string;
  time: string;
  maxParticipants: number;
  level: ExperienceLevel;
  description?: string;
  organizerId: string;
  confirmedCount: number;
  availableSlots: number;
  status: MatchStatus;
  allowBeginners: boolean;
  requiresApproval: boolean;
  latitude: number | null;
  longitude: number | null;
  /** Presente só quando a busca (`GET /matches`) informou `lat`/`lng` — nunca recalcular no cliente. */
  distanceKm: number | null;
}

/** Equivalente a `MatchDetailRead` — shape devolvido só por `GET /matches/{id}`. */
export interface MatchDetail extends MatchSummary {
  organizer: PublicUser;
  participants: Participant[];
}

/** Equivalente a `MyMatchRead` — partida vista por quem organiza ou participa (`GET /users/me/matches`). */
export interface MyMatch extends MatchSummary {
  isOrganizer: boolean;
  /** `null` quando o organizador não consta como participante (partidas antigas). */
  myStatus: Exclude<ParticipationStatus, "cancelled"> | null;
  /** Pedidos de entrada esperando aprovação. Sempre 0 para quem não organiza. */
  pendingRequests: number;
  /** Encerrada, cancelada ou com data já passada. */
  isPast: boolean;
}

/** Referência leve a uma partida, embutida em Rating/Report — equivalente a `MatchRef` no backend. */
export interface MatchRef {
  id: string;
  title: string;
  sport: Sport;
  date: string;
}

export interface RatingCriteria {
  punctuality: number;
  respect: number;
  behavior: number;
  presence: number;
  overall: number;
}

export interface Rating {
  id: string;
  ratedUser: PublicUser;
  raterUser: PublicUser;
  match: MatchRef;
  criteria: RatingCriteria;
  comment?: string;
  createdAt: string;
}

export interface Report {
  id: string;
  reportedUser: PublicUser;
  reporterUser: PublicUser;
  match?: MatchRef;
  reason: ReportReason;
  description: string;
  createdAt: string;
  status: ReportStatus;
}

export type MessageType = "message" | "system";

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  senderName: string;
  senderPhotoUrl?: string;
  text: string;
  createdAt: string;
  type: MessageType;
}
