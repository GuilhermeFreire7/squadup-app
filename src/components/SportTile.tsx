import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { memo } from "react";
import { View } from "react-native";

import { SPORT_META } from "../theme";
import type { Sport } from "../types";

interface SportTileProps {
  sport: Sport;
  size?: number;
}

/**
 * Tile quadrado com o ícone e a cor de categoria do esporte —
 * âncora visual de cards e heros de partida.
 */
function SportTile({ sport, size = 48 }: Readonly<SportTileProps>) {
  const meta = SPORT_META[sport];

  return (
    <View
      className={`items-center justify-center rounded-2xl ${meta.bgClass}`}
      style={{ width: size, height: size }}
    >
      <MaterialCommunityIcons name={meta.icon} size={size * 0.52} color={meta.color} />
    </View>
  );
}

export default memo(SportTile);
