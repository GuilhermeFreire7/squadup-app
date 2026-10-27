import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "../theme";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  variant?: "compact" | "large";
  children?: React.ReactNode;
}

function Header({
  title,
  subtitle,
  onBack,
  rightElement,
  variant = "compact",
  children,
}: Readonly<HeaderProps>) {
  const insets = useSafeAreaInsets();
  const containerStyle = { paddingTop: insets.top + 12 };

  if (variant === "large") {
    return (
      <View className="bg-secondary-900 px-5 pb-5" style={containerStyle}>
        <View className={`flex-row items-center gap-3 ${children ? "mb-4" : ""}`}>
          <View className="flex-1">
            <Text className="text-white text-title" numberOfLines={1}>
              {title}
            </Text>
            {subtitle ? (
              <Text className="text-secondary-400 text-body-sm mt-0.5">{subtitle}</Text>
            ) : null}
          </View>
          {rightElement ?? null}
        </View>
        {children}
      </View>
    );
  }

  return (
    <View className="flex-row items-center bg-secondary-900 px-4 pb-3" style={containerStyle}>
      {onBack ? (
        <Pressable
          onPress={onBack}
          className="w-11 h-11 items-center justify-center rounded-full bg-white/10 active:bg-white/20"
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color={colors.white} />
        </Pressable>
      ) : (
        <View className="w-11 h-11" />
      )}

      {subtitle ? (
        <View className="flex-1 mx-3">
          <Text className="text-white text-heading" numberOfLines={1}>
            {title}
          </Text>
          <Text className="text-secondary-400 text-caption" numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
      ) : (
        <Text className="flex-1 text-white text-heading text-center mx-3" numberOfLines={1}>
          {title}
        </Text>
      )}

      {rightElement ?? <View className="w-11 h-11" />}
    </View>
  );
}

export default memo(Header);
