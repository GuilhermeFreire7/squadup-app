import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Text, View } from "react-native";

import { colors } from "../theme";

interface RatingStarsProps {
  rating: number | null;
  max?: number;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
}

const starSize: Record<"sm" | "md" | "lg", number> = {
  sm: 13,
  md: 16,
  lg: 22,
};

const labelSize: Record<"sm" | "md" | "lg", string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

function RatingStars({
  rating,
  max = 5,
  showValue = true,
  size = "md",
}: Readonly<RatingStarsProps>) {
  const px = starSize[size];

  if (rating === null) {
    return (
      <View className="flex-row items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
          <MaterialCommunityIcons
            key={`empty-${i}`}
            name="star-outline"
            size={px}
            color={colors.secondary[300]}
          />
        ))}
        {showValue ? (
          <Text className={`ml-1 ${labelSize[size]} font-medium text-secondary-500`}>
            Sem avaliações
          </Text>
        ) : null}
      </View>
    );
  }

  const clamped = Math.min(Math.max(rating, 0), max);
  const fullStars = Math.floor(clamped);
  const hasHalf = clamped - fullStars >= 0.5;
  const emptyStars = max - fullStars - (hasHalf ? 1 : 0);

  return (
    <View className="flex-row items-center gap-0.5">
      {Array.from({ length: fullStars }).map((_, i) => (
        <MaterialCommunityIcons key={`full-${i}`} name="star" size={px} color={colors.warning} />
      ))}
      {hasHalf ? (
        <MaterialCommunityIcons name="star-half-full" size={px} color={colors.warning} />
      ) : null}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <MaterialCommunityIcons
          key={`empty-${i}`}
          name="star-outline"
          size={px}
          color={colors.secondary[300]}
        />
      ))}
      {showValue ? (
        <Text className={`ml-1 ${labelSize[size]} font-semibold text-secondary-600`}>
          {clamped.toFixed(1)}
        </Text>
      ) : null}
    </View>
  );
}

export default memo(RatingStars);
