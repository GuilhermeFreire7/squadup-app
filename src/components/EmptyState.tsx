import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Text, View } from "react-native";

import { colors, type IconName } from "../theme";

interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

function EmptyState({ icon = "magnify", title, description, action }: Readonly<EmptyStateProps>) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <View className="w-20 h-20 rounded-full bg-secondary-100 items-center justify-center mb-5">
        <MaterialCommunityIcons name={icon} size={36} color={colors.secondary[400]} />
      </View>
      <Text className="text-lg font-bold text-secondary-900 text-center mb-2">{title}</Text>
      {description ? (
        <Text className="text-sm text-secondary-500 text-center leading-5 mb-6">{description}</Text>
      ) : null}
      {action ?? null}
    </View>
  );
}

export default memo(EmptyState);
