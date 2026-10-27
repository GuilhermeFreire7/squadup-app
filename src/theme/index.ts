import type { MaterialCommunityIcons } from "@expo/vector-icons";
import type React from "react";
import type { StyleProp, ViewStyle } from "react-native";

import type { ExperienceLevel, Sport } from "../types";

export type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

/**
 * Fonte única de verdade para cores consumidas fora do NativeWind
 * (props `color` de ícones, estilos inline, navegação).
 * Deve espelhar `tailwind.config.js`.
 */
export const colors = {
  primary: {
    50: "#EFF6FF",
    100: "#DBEAFE",
    200: "#BFDBFE",
    300: "#93C5FD",
    400: "#60A5FA",
    500: "#2563EB",
    600: "#1D4ED8",
    700: "#1E40AF",
    800: "#1E3A8A",
    900: "#1E2D5A",
  },
  /** Slate — única escala de cinza do app. */
  secondary: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
  },
  accent: {
    500: "#F97316",
    600: "#EA580C",
    700: "#C2410C",
  },
  /** Ícones e preenchimentos de estado. Para texto, usar os tons 700 abaixo. */
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#DC2626",
  successText: "#15803D",
  warningText: "#B45309",
  errorText: "#B91C1C",
  white: "#FFFFFF",
} as const;

/**
 * Elevação em dois níveis — sombra (iOS/web) + elevation (Android).
 * Aplicar via prop `style`, já que NativeWind não cobre sombras custom.
 */
export const shadows: Record<"card" | "overlay", StyleProp<ViewStyle>> = {
  /** Nível 1 — cards de conteúdo em repouso */
  card: {
    shadowColor: colors.secondary[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  /**
   * Nível 2 — o que flutua sobre o conteúdo (barras fixas, cards em destaque).
   * Barras no rodapé combinam com `border-t border-secondary-200`, porque no iOS a sombra
   * cai para baixo e não separaria a barra do conteúdo acima.
   */
  overlay: {
    shadowColor: colors.secondary[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
};

/**
 * Identidade visual por esporte — ícone vetorial + cor de categoria.
 * `color` é o tom vivo para ícones (prop `color`); texto e fundo usam as classes
 * `sport-*` do Tailwind, que passam AA. As strings ficam completas aqui para o
 * NativeWind encontrá-las ao compilar.
 */
export const SPORT_META: Record<
  Sport,
  { label: string; icon: IconName; color: string; textClass: string; bgClass: string }
> = {
  football: {
    label: "Futebol",
    icon: "soccer",
    color: "#059669",
    textClass: "text-sport-football",
    bgClass: "bg-sport-football-bg",
  },
  futsal: {
    label: "Futsal",
    icon: "soccer-field",
    color: "#0D9488",
    textClass: "text-sport-futsal",
    bgClass: "bg-sport-futsal-bg",
  },
  volleyball: {
    label: "Vôlei",
    icon: "volleyball",
    color: "#7C3AED",
    textClass: "text-sport-volleyball",
    bgClass: "bg-sport-volleyball-bg",
  },
  basketball: {
    label: "Basquete",
    icon: "basketball",
    color: "#EA580C",
    textClass: "text-sport-basketball",
    bgClass: "bg-sport-basketball-bg",
  },
  tennis: {
    label: "Tênis",
    icon: "tennis",
    color: "#65A30D",
    textClass: "text-sport-tennis",
    bgClass: "bg-sport-tennis-bg",
  },
  other: {
    label: "Outro",
    icon: "trophy-outline",
    color: "#475569",
    textClass: "text-sport-other",
    bgClass: "bg-sport-other-bg",
  },
};

export const LEVEL_META: Record<ExperienceLevel, { label: string }> = {
  beginner: { label: "Iniciante" },
  intermediate: { label: "Intermediário" },
  advanced: { label: "Avançado" },
};
