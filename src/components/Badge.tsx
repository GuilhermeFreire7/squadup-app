import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Text, View } from "react-native";

import { SPORT_META } from "../theme";
import type { ExperienceLevel, MatchStatus, Sport } from "../types";

type BadgeVariant = "sport" | "level" | "status" | "custom";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  sport?: Sport;
  level?: ExperienceLevel;
  status?: MatchStatus;
}

// [fundo, texto] — a cor do texto precisa ir no <Text>: em React Native ela não
// herda da View.
type Tone = readonly [bg: string, text: string];

const levelStyle: Record<ExperienceLevel, Tone> = {
  beginner: ["bg-primary-100", "text-primary-700"],
  intermediate: ["bg-accent-50", "text-accent-700"],
  advanced: ["bg-primary-900", "text-white"],
};

const statusStyle: Record<MatchStatus, Tone> = {
  open: ["bg-primary-100", "text-primary-700"],
  full: ["bg-error-50", "text-error-700"],
  pending_approval: ["bg-warning-50", "text-warning-700"],
  closed: ["bg-secondary-100", "text-secondary-600"],
  cancelled: ["bg-secondary-100", "text-secondary-600"],
};

const defaultTone: Tone = ["bg-secondary-100", "text-secondary-700"];

function Badge({ label, variant = "custom", sport, level, status }: Readonly<BadgeProps>) {
  // Esporte: cor de categoria + ícone vetorial
  if (variant === "sport" && sport) {
    const meta = SPORT_META[sport];
    return (
      <View
        className={`self-start flex-row items-center gap-1 rounded-full px-2.5 py-1 ${meta.bgClass}`}
      >
        <MaterialCommunityIcons name={meta.icon} size={12} color={meta.color} />
        <Text className={`text-caption font-semibold ${meta.textClass}`}>{label}</Text>
      </View>
    );
  }

  let tone = defaultTone;
  if (variant === "level" && level) {
    tone = levelStyle[level];
  } else if (variant === "status" && status) {
    tone = statusStyle[status];
  }

  return (
    <View className={`self-start rounded-full px-2.5 py-1 ${tone[0]}`}>
      <Text className={`text-caption font-semibold ${tone[1]}`}>{label}</Text>
    </View>
  );
}

export default memo(Badge);
