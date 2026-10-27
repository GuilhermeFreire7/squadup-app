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

const levelStyle: Record<ExperienceLevel, string> = {
  beginner: "bg-primary-100 text-primary-700",
  intermediate: "bg-accent-100 text-accent-700",
  advanced: "bg-primary-900 text-white",
};

const statusStyle: Record<MatchStatus, string> = {
  open: "bg-primary-100 text-primary-700",
  full: "bg-error/10 text-error",
  pending_approval: "bg-warning/10 text-warning",
  closed: "bg-secondary-200 text-secondary-600",
  cancelled: "bg-secondary-200 text-secondary-500",
};

function Badge({ label, variant = "custom", sport, level, status }: Readonly<BadgeProps>) {
  // Esporte: cor de categoria + ícone vetorial (aplicados via style — cores dinâmicas)
  if (variant === "sport" && sport) {
    const meta = SPORT_META[sport];
    return (
      <View
        className={`self-start flex-row items-center gap-1 rounded-full px-3 py-1 ${meta.bgClass}`}
      >
        <MaterialCommunityIcons name={meta.icon} size={12} color={meta.color} />
        <Text className={`text-xs font-semibold ${meta.textClass}`}>{label}</Text>
      </View>
    );
  }

  let colorClass = "bg-secondary-100 text-secondary-700";
  if (variant === "level" && level) {
    colorClass = levelStyle[level];
  } else if (variant === "status" && status) {
    colorClass = statusStyle[status];
  }

  return (
    <View className={`self-start rounded-full px-3 py-1 ${colorClass}`}>
      <Text className="text-xs font-semibold">{label}</Text>
    </View>
  );
}

export default memo(Badge);
