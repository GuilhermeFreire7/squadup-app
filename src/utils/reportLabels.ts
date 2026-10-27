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

/** Fundo vai na View e texto no Text — em React Native a cor do texto não herda. */
export const STATUS_COLORS: Record<ReportStatus, { bg: string; text: string }> = {
  pending: { bg: "bg-warning-50", text: "text-warning-700" },
  archived: { bg: "bg-secondary-100", text: "text-secondary-600" },
  warned: { bg: "bg-accent-50", text: "text-accent-700" },
  banned: { bg: "bg-error-50", text: "text-error-700" },
};
