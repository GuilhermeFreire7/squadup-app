import React, { memo } from "react";
import { Pressable, View, ViewProps } from "react-native";

import { shadows } from "../theme";

interface CardProps extends Omit<ViewProps, "className"> {
  children: React.ReactNode;
  onPress?: () => void;
  padded?: boolean;
  /** Eleva o card acima do plano da lista (ex.: destaque, modal) */
  raised?: boolean;
  /** Rótulo para leitores de tela quando o card inteiro é clicável */
  accessibilityLabel?: string;
}

function Card({
  children,
  onPress,
  padded = true,
  raised = false,
  accessibilityLabel,
  ...rest
}: Readonly<CardProps>) {
  const base = `bg-white rounded-card border border-secondary-200/70 ${padded ? "p-4" : ""}`;
  const shadow = raised ? shadows.overlay : shadows.card;

  if (onPress) {
    return (
      <Pressable
        className={base}
        style={({ pressed }) => [
          shadow,
          pressed ? { transform: [{ scale: 0.985 }], opacity: 0.95 } : undefined,
        ]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        {...rest}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View className={base} style={shadow} {...rest}>
      {children}
    </View>
  );
}

export default memo(Card);
