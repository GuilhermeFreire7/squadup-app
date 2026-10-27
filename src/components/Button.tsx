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

const containerBase = "flex-row items-center justify-center rounded-2xl";

const containerVariant: Record<Variant, string> = {
  primary: "bg-primary-500 active:bg-primary-600",
  secondary: "bg-secondary-900 active:bg-secondary-800",
  ghost: "bg-secondary-100 active:bg-secondary-200",
  outline: "bg-transparent border-2 border-white/80 active:bg-white/10",
  danger: "bg-error active:opacity-90",
};

const containerDisabled: Record<Variant, string> = {
  primary: "bg-primary-300",
  secondary: "bg-secondary-400",
  ghost: "bg-secondary-50",
  outline: "border-2 border-secondary-600",
  danger: "bg-error/40",
};

const containerSize: Record<Size, string> = {
  sm: "h-10 px-4",
  md: "h-12 px-5",
  lg: "h-14 px-6",
};

const textVariant: Record<Variant, string> = {
  primary: "text-white font-semibold",
  secondary: "text-white font-semibold",
  ghost: "text-secondary-700 font-semibold",
  outline: "text-white font-semibold",
  danger: "text-white font-semibold",
};

const textDisabled: Record<Variant, string> = {
  primary: "text-white",
  secondary: "text-white",
  ghost: "text-secondary-500",
  outline: "text-secondary-500",
  danger: "text-white",
};

const textSize: Record<Size, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
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
  danger: colors.white,
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

  const containerClass = [
    containerBase,
    isDisabled ? containerDisabled[variant] : containerVariant[variant],
    containerSize[size],
    fullWidth ? "w-full" : "self-start",
  ].join(" ");

  const textClass = [
    isDisabled ? textDisabled[variant] : textVariant[variant],
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
      accessibilityState={{ disabled: isDisabled }}
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
              color={contentColor[variant]}
            />
          ) : null}
          <Text className={textClass}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

export default memo(Button);
