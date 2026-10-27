import type { ReportReason, ReportStatus } from "../types";

export const REASON_LABELS: Record<ReportReason, string> = {
  bad_behavior: "Comportamento inadequado",
  violence: "Violência ou agressão",
  no_show: "Não compareceu",
  hate_speech: "Discurso de ódio",
  spam: "Spam ou publicidade",
  fake_info: "Informações falsas",
  other: "Outro",
};

export const STATUS_LABELS: Record<ReportStatus, string> = {
  pending: "Pendente",
  archived: "Arquivada",
  warned: "Usuário advertido",
  banned: "Usuário banido",
};

export const STATUS_COLORS: Record<ReportStatus, string> = {
  pending: "bg-warning/10 text-warning",
  archived: "bg-secondary-200 text-secondary-600",
  warned: "bg-accent-100 text-accent-700",
  banned: "bg-error/10 text-error",
};
