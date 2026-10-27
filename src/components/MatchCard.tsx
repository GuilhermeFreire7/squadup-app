import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Text, View } from "react-native";

import { colors, LEVEL_META, SPORT_META } from "../theme";
import type { MatchSummary } from "../types";
import { formatMatchDate } from "../utils/date";
import Badge from "./Badge";
import Card from "./Card";
import SlotsBar from "./SlotsBar";

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

function MatchCard({ match, onPress }: Readonly<MatchCardProps>) {
  const confirmed = match.confirmedCount;
  const statusBadge = statusLabel[match.status];
  const isCancelled = match.status === "cancelled";
  const sportMeta = SPORT_META[match.sport];

  const accessibilityLabel = `${match.title}, ${sportMeta.label}, ${formatMatchDate(match.date)} às ${match.time}, ${match.location}`;

  const hasTags = match.requiresApproval || match.allowBeginners;

  return (
    <Card onPress={onPress} padded={false} accessibilityLabel={accessibilityLabel}>
      <View className={`p-4 ${isCancelled ? "opacity-60" : ""}`}>
        {/* Header: sport tile + eyebrow + title + status */}
        <View className="flex-row gap-3">
          <View
            className={`w-12 h-12 items-center justify-center rounded-control ${sportMeta.bgClass}`}
          >
            <MaterialCommunityIcons name={sportMeta.icon} size={26} color={sportMeta.color} />
          </View>

          <View className="flex-1">
            <View className="flex-row items-center justify-between gap-2">
              <Text
                className={`text-overline uppercase flex-1 ${sportMeta.textClass}`}
                numberOfLines={1}
              >
                {sportMeta.label} · {LEVEL_META[match.level].label}
              </Text>
              {statusBadge && <Badge variant="status" status={match.status} label={statusBadge} />}
            </View>
            <Text className="text-subheading font-bold text-secondary-900 mt-1" numberOfLines={2}>
              {match.title}
            </Text>
          </View>
        </View>

        {/* Meta */}
        <View className="mt-3 gap-1.5">
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={16}
              color={colors.secondary[400]}
            />
            <Text className="text-body-sm text-secondary-600 flex-1" numberOfLines={1}>
              {match.location}
              {match.distanceKm != null ? ` · ${formatDistance(match.distanceKm)}` : ""}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons
              name="calendar-blank-outline"
              size={16}
              color={colors.secondary[400]}
            />
            <Text className="text-body-sm text-secondary-600">
              {formatMatchDate(match.date)} · {match.time}
            </Text>
          </View>
        </View>

        {/* Slots bar */}
        {match.status !== "cancelled" && (
          <View className="mt-4">
            <SlotsBar confirmed={confirmed} max={match.maxParticipants} />
          </View>
        )}

        {/* Footer: tags — só quando há alguma, para não sobrar um divisor vazio */}
        {hasTags && (
          <View className="flex-row items-center gap-2 mt-4 pt-3 border-t border-secondary-100">
            {match.requiresApproval && (
              <View className="flex-row items-center gap-1 bg-secondary-100 rounded-full px-2.5 py-1">
                <MaterialCommunityIcons
                  name="shield-account-outline"
                  size={12}
                  color={colors.secondary[600]}
                />
                <Text className="text-caption font-semibold text-secondary-700">Aprovação</Text>
              </View>
            )}
            {match.allowBeginners && (
              <View className="flex-row items-center gap-1 bg-success-50 rounded-full px-2.5 py-1">
                <MaterialCommunityIcons
                  name="account-heart-outline"
                  size={12}
                  color={colors.successText}
                />
                <Text className="text-caption font-semibold text-success-700">Iniciantes OK</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </Card>
  );
}

export default memo(MatchCard);
