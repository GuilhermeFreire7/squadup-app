import React, { memo } from "react";
import { Text, View } from "react-native";

import { shadows } from "../theme";

interface Stat {
  value: string | number;
  label: string;
}

interface StatsRowProps {
  stats: readonly Stat[];
}

/** Linha de métricas em cards — usada nos perfis. */
function StatsRow({ stats }: Readonly<StatsRowProps>) {
  return (
    <View className="flex-row gap-3">
      {stats.map((stat) => (
        <View
          key={stat.label}
          className="flex-1 bg-white rounded-card border border-secondary-200/70 py-4 items-center"
          style={shadows.card}
        >
          <Text className="text-title text-secondary-900">{stat.value}</Text>
          <Text className="text-caption text-secondary-600 mt-1">{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

export default memo(StatsRow);
