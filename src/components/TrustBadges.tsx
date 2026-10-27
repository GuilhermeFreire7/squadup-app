import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Text, View } from "react-native";

import { colors } from "../theme";

interface TrustBadgesProps {
  isVerified: boolean;
  matchesPlayed: number;
  averageRating: number | null;
}

function TrustBadges({ isVerified, matchesPlayed, averageRating }: TrustBadgesProps) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {isVerified && (
        <View className="flex-row items-center gap-1 bg-primary-50 border border-primary-100 rounded-full px-3 py-1.5">
          <MaterialCommunityIcons name="check-decagram" size={14} color={colors.primary[500]} />
          <Text className="text-caption font-semibold text-primary-700">Verificado</Text>
        </View>
      )}
      <View className="flex-row items-center gap-1 bg-white border border-secondary-200 rounded-full px-3 py-1.5">
        <MaterialCommunityIcons
          name="shield-check-outline"
          size={14}
          color={colors.secondary[600]}
        />
        <Text className="text-caption font-semibold text-secondary-700">
          {matchesPlayed} {matchesPlayed === 1 ? "partida" : "partidas"}
        </Text>
      </View>
      {averageRating !== null && (
        <View className="flex-row items-center gap-1 bg-warning-50 border border-warning/30 rounded-full px-3 py-1.5">
          <MaterialCommunityIcons name="star" size={14} color={colors.warning} />
          <Text className="text-caption font-semibold text-warning-700">
            {averageRating.toFixed(1)}
          </Text>
        </View>
      )}
    </View>
  );
}

export default memo(TrustBadges);
