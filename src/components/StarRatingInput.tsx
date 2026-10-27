import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Pressable, Text, View } from "react-native";

import { colors } from "../theme";

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  size?: "sm" | "md" | "lg";
}

const starPixelSize: Record<"sm" | "md" | "lg", number> = {
  sm: 22,
  md: 30,
  lg: 38,
};

function StarRatingInput({ value, onChange, label, size = "md" }: Readonly<StarRatingInputProps>) {
  return (
    <View className="gap-1.5">
      {label ? <Text className="text-sm text-secondary-800 font-semibold">{label}</Text> : null}
      <View className="flex-row gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= value;
          return (
            <Pressable
              key={star}
              onPress={() => onChange(star)}
              accessibilityLabel={`${star} estrela${star !== 1 ? "s" : ""}`}
              accessibilityRole="button"
              hitSlop={6}
              style={({ pressed }) => (pressed ? { transform: [{ scale: 1.15 }] } : undefined)}
            >
              <MaterialCommunityIcons
                name={filled ? "star" : "star-outline"}
                size={starPixelSize[size]}
                color={filled ? colors.warning : colors.secondary[300]}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default memo(StarRatingInput);
