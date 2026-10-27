import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Pressable, Text, View } from "react-native";

import { colors, type IconName } from "../theme";

type ChipTone = "primary" | "danger";

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: IconName;
  /** Cor do ícone quando não selecionado (ex.: cor da categoria do esporte) */
  iconColor?: string;
  sublabel?: string;
  tone?: ChipTone;
  accessibilityRole?: "radio" | "checkbox";
  /** Override do rótulo de acessibilidade (padrão: `label`) */
  accessibilityLabel?: string;
}

const selectedContainer: Record<ChipTone, string> = {
  primary: "bg-primary-500 border-primary-500",
  danger: "bg-error/10 border-error",
};

const selectedText: Record<ChipTone, string> = {
  primary: "text-white",
  danger: "text-error",
};

/**
 * Pill selecionável — única implementação de chip do app
 * (esportes, níveis, motivos de denúncia, filtros).
 */
function Chip({
  label,
  selected,
  onPress,
  icon,
  iconColor,
  sublabel,
  tone = "primary",
  accessibilityRole = "radio",
  accessibilityLabel,
}: Readonly<ChipProps>) {
  const containerClass = selected ? selectedContainer[tone] : "bg-white border-secondary-200";
  const textClass = selected ? selectedText[tone] : "text-secondary-600";

  let resolvedIconColor = iconColor ?? colors.secondary[500];
  if (selected) resolvedIconColor = tone === "primary" ? colors.white : colors.error;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityRole === "checkbox" ? { checked: selected } : { selected }}
      accessibilityLabel={accessibilityLabel ?? label}
      className={`flex-row items-center gap-1.5 px-4 py-2.5 rounded-full border ${containerClass}`}
      style={({ pressed }) => (pressed ? { transform: [{ scale: 0.96 }] } : undefined)}
    >
      {icon ? <MaterialCommunityIcons name={icon} size={15} color={resolvedIconColor} /> : null}
      <View>
        <Text className={`text-sm font-semibold ${textClass}`}>{label}</Text>
        {sublabel ? (
          <Text className={`text-xs ${selected ? textClass : "text-secondary-500"}`}>
            {sublabel}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

export default memo(Chip);
