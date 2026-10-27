import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { memo } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { colors, type IconName } from "../theme";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: IconName;
}

const containerBase = "flex-row items-center justify-center rounded-control";

const containerVariant: Record<Variant, string> = {
  primary: "bg-primary-500 active:bg-primary-600",
  secondary: "bg-secondary-900 active:bg-secondary-700",
  ghost: "bg-secondary-100 active:bg-secondary-200",
  outline: "bg-transparent border-2 border-white/80 active:bg-white/10",
  danger: "bg-error-50 border border-error/30 active:bg-error/10",
};

// Desabilitado é neutro em todas as variantes (sobre fundo claro), para não parecer
// uma versão "apagada" da ação; `outline` só aparece sobre fundo escuro.
const containerDisabled: Record<Variant, string> = {
  primary: "bg-secondary-200",
  secondary: "bg-secondary-200",
  ghost: "bg-secondary-100",
  outline: "border-2 border-secondary-600",
  danger: "bg-secondary-100",
};

const containerSize: Record<Size, string> = {
  sm: "h-11 px-4",
  md: "h-12 px-5",
  lg: "h-14 px-6",
};

const textVariant: Record<Variant, string> = {
  primary: "text-white",
  secondary: "text-white",
  ghost: "text-secondary-700",
  outline: "text-white",
  danger: "text-error-700",
};

const textDisabled: Record<Variant, string> = {
  primary: "text-secondary-500",
  secondary: "text-secondary-500",
  ghost: "text-secondary-500",
  outline: "text-secondary-400",
  danger: "text-secondary-500",
};

const textSize: Record<Size, string> = {
  sm: "text-label",
  md: "text-subheading",
  lg: "text-heading font-semibold",
};

const iconSize: Record<Size, number> = {
  sm: 16,
  md: 18,
  lg: 20,
};

const contentColor: Record<Variant, string> = {
  primary: colors.white,
  secondary: colors.white,
  ghost: colors.secondary[700],
  outline: colors.white,
  danger: colors.errorText,
};

function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
}: Readonly<ButtonProps>) {
  const isDisabled = disabled || loading;
  // Carregando bloqueia o toque, mas mantém a cor da variante (é envio, não indisponível)
  const looksDisabled = disabled && !loading;

  const containerClass = [
    containerBase,
    looksDisabled ? containerDisabled[variant] : containerVariant[variant],
    containerSize[size],
    fullWidth ? "w-full" : "self-start",
  ].join(" ");

  const textClass = [
    looksDisabled ? textDisabled[variant] : textVariant[variant],
    textSize[size],
  ].join(" ");

  return (
    <Pressable
      className={containerClass}
      style={({ pressed }) => (pressed ? { transform: [{ scale: 0.98 }] } : undefined)}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={contentColor[variant]}
          accessibilityLabel="Carregando"
        />
      ) : (
        <View className="flex-row items-center gap-2">
          {icon ? (
            <MaterialCommunityIcons
              name={icon}
              size={iconSize[size]}
              color={looksDisabled ? colors.secondary[500] : contentColor[variant]}
            />
          ) : null}
          <Text className={textClass}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

export default memo(Button);
