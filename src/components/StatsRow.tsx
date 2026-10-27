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
          className="flex-1 bg-white rounded-2xl border border-secondary-100 py-4 items-center"
          style={shadows.card}
        >
          <Text className="text-2xl font-bold text-secondary-900 tracking-tight">{stat.value}</Text>
          <Text className="text-xs font-medium text-secondary-500 mt-1">{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

export default memo(StatsRow);
