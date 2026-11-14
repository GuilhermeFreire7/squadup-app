import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Text, View } from "react-native";

import { colors, type IconName } from "../theme";
import type { MyMatch } from "../types";

interface PillProps {
  icon: IconName;
  label: string;
  tone: "neutral" | "success" | "warning";
}

const toneClasses: Record<PillProps["tone"], [bg: string, text: string, icon: string]> = {
  neutral: ["bg-secondary-100", "text-secondary-700", colors.secondary[600]],
  success: ["bg-success-50", "text-success-700", colors.successText],
  warning: ["bg-warning-50", "text-warning-700", colors.warningText],
};

function Pill({ icon, label, tone }: Readonly<PillProps>) {
  const [bg, text, iconColor] = toneClasses[tone];
  return (
    <View className={`flex-row items-center gap-1 rounded-full px-2.5 py-1 ${bg}`}>
      <MaterialCommunityIcons name={icon} size={12} color={iconColor} />
      <Text className={`text-caption font-semibold ${text}`}>{label}</Text>
    </View>
  );
}

function pendingLabel(count: number): string {
  return count === 1 ? "1 pedido para aprovar" : `${count} pedidos para aprovar`;
}

/** Papel do usuário na partida, mostrado acima do card em "Minhas partidas". */
function MyMatchRole({ match }: Readonly<{ match: MyMatch }>) {
  const showPending = match.isOrganizer && !match.isPast && match.pendingRequests > 0;
  return (
    <View className="flex-row flex-wrap gap-2 mb-2">
      {match.isOrganizer && <Pill icon="crown-outline" label="Você organiza" tone="neutral" />}
      {!match.isOrganizer && match.myStatus === "confirmed" && (
        <Pill icon="check-circle-outline" label="Confirmado" tone="success" />
      )}
      {match.myStatus === "pending" && (
        <Pill icon="clock-outline" label="Aguardando aprovação" tone="warning" />
      )}
      {showPending && (
        <Pill
          icon="account-clock-outline"
          label={pendingLabel(match.pendingRequests)}
          tone="warning"
        />
      )}
    </View>
  );
}

export default memo(MyMatchRole);
