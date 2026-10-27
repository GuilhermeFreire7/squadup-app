import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Text, View } from "react-native";

import { colors, LEVEL_META, SPORT_META } from "../theme";
import type { MatchSummary } from "../types";
import { formatMatchDate } from "../utils/date";
import Badge from "./Badge";
import Card from "./Card";

interface MatchCardProps {
  match: MatchSummary;
  onPress?: () => void;
}

const statusLabel: Record<MatchSummary["status"], string | null> = {
  open: null,
  full: "Lotada",
  pending_approval: "Pendente",
  closed: "Encerrada",
  cancelled: "Cancelada",
};

function formatDistance(km: number): string {
  return `${km.toFixed(1).replace(".", ",")} km`;
}

function SlotsBar({ confirmed, max }: Readonly<{ confirmed: number; max: number }>) {
  const ratio = max > 0 ? confirmed / max : 0;
  const available = max - confirmed;
  const pct = Math.min(ratio * 100, 100);

  let fillColor = "bg-success";
  if (available === 0) fillColor = "bg-error";
  else if (ratio >= 0.8) fillColor = "bg-accent-500";

  let availabilityText = "Sem vagas";
  if (available === 1) availabilityText = "1 vaga disponível";
  else if (available > 1) availabilityText = `${available} vagas disponíveis`;

  return (
    <View className="mt-3.5">
      <View className="h-1.5 bg-secondary-100 rounded-full overflow-hidden">
        <View className={`h-full rounded-full ${fillColor}`} style={{ width: `${pct}%` }} />
      </View>
      <Text className="text-xs font-medium text-secondary-500 mt-1.5">
        {availabilityText}
        {" · "}
        {confirmed}/{max} confirmados
      </Text>
    </View>
  );
}

function MatchCard({ match, onPress }: Readonly<MatchCardProps>) {
  const confirmed = match.confirmedCount;
  const statusBadge = statusLabel[match.status];
  const isCancelled = match.status === "cancelled";
  const sportMeta = SPORT_META[match.sport];

  const accessibilityLabel = `${match.title}, ${sportMeta.label}, ${formatMatchDate(match.date)} às ${match.time}, ${match.location}`;

  return (
    <Card onPress={onPress} padded={false} accessibilityLabel={accessibilityLabel}>
      <View className={`p-4 ${isCancelled ? "opacity-60" : ""}`}>
        {/* Header: sport tile + eyebrow + title + status */}
        <View className="flex-row gap-3">
          <View
            className={`w-12 h-12 items-center justify-center rounded-2xl ${sportMeta.bgClass}`}
          >
            <MaterialCommunityIcons name={sportMeta.icon} size={26} color={sportMeta.color} />
          </View>

          <View className="flex-1">
            <View className="flex-row items-center justify-between gap-2">
              <Text
                className={`text-xs font-bold tracking-wide uppercase flex-1 ${sportMeta.textClass}`}
                numberOfLines={1}
              >
                {sportMeta.label} · {LEVEL_META[match.level].label}
              </Text>
              {statusBadge && <Badge variant="status" status={match.status} label={statusBadge} />}
            </View>
            <Text className="text-base font-bold text-secondary-900 mt-0.5" numberOfLines={2}>
              {match.title}
            </Text>
          </View>
        </View>

        {/* Meta */}
        <View className="mt-3 gap-1.5">
          <View className="flex-row items-center gap-1.5">
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={15}
              color={colors.secondary[400]}
            />
            <Text className="text-sm text-secondary-500 flex-1" numberOfLines={1}>
              {match.location}
              {match.distanceKm != null ? ` · ${formatDistance(match.distanceKm)}` : ""}
            </Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <MaterialCommunityIcons
              name="calendar-blank-outline"
              size={15}
              color={colors.secondary[400]}
            />
            <Text className="text-sm text-secondary-500">
              {formatMatchDate(match.date)} · {match.time}
            </Text>
          </View>
        </View>

        {/* Slots bar */}
        {match.status !== "cancelled" && (
          <SlotsBar confirmed={confirmed} max={match.maxParticipants} />
        )}

        {/* Footer: tags */}
        <View className="flex-row items-center gap-2 mt-3.5 pt-3.5 border-t border-secondary-100">
          {match.requiresApproval && (
            <View className="flex-row items-center gap-1 bg-secondary-100 rounded-full px-2.5 py-1">
              <MaterialCommunityIcons
                name="shield-account-outline"
                size={12}
                color={colors.secondary[500]}
              />
              <Text className="text-xs font-semibold text-secondary-600">Aprovação</Text>
            </View>
          )}
          {match.allowBeginners && (
            <View className="flex-row items-center gap-1 bg-success/10 rounded-full px-2.5 py-1">
              <MaterialCommunityIcons
                name="account-heart-outline"
                size={12}
                color={colors.success}
              />
              <Text className="text-xs font-semibold text-success">Iniciantes OK</Text>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
}

export default memo(MatchCard);
