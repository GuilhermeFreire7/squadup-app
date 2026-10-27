import React, { memo, useEffect, useState } from "react";
import { Animated, Easing, View, type DimensionValue } from "react-native";

import { colors, shadows } from "../theme";

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  radius?: number;
}

/** Bloco de loading com pulso suave — base dos skeleton screens. */
function SkeletonBase({ width = "100%", height = 16, radius = 8 }: Readonly<SkeletonProps>) {
  const [opacity] = useState(() => new Animated.Value(0.5));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={{
        width,
        height,
        borderRadius: radius,
        backgroundColor: colors.secondary[200],
        opacity,
      }}
    />
  );
}

export const Skeleton = memo(SkeletonBase);

/** Placeholder de MatchCard durante carregamento da lista. */
function MatchCardSkeletonBase() {
  return (
    <View
      className="bg-white rounded-card border border-secondary-200/70 p-4"
      style={shadows.card}
      accessibilityLabel="Carregando partida"
    >
      <View className="flex-row gap-3">
        <Skeleton width={48} height={48} radius={12} />
        <View className="flex-1 gap-2">
          <Skeleton width="55%" height={12} radius={6} />
          <Skeleton width="85%" height={16} radius={6} />
        </View>
      </View>
      <View className="mt-4 gap-2">
        <Skeleton width="70%" height={12} radius={6} />
        <Skeleton width="45%" height={12} radius={6} />
      </View>
      <View className="mt-4">
        <Skeleton width="100%" height={6} radius={3} />
      </View>
    </View>
  );
}

export const MatchCardSkeleton = memo(MatchCardSkeletonBase);
