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
      <View className="w-16 h-16 rounded-full bg-secondary-100 items-center justify-center mb-4">
        <MaterialCommunityIcons name={icon} size={32} color={colors.secondary[500]} />
      </View>
      <Text className="text-heading text-secondary-900 text-center mb-1">{title}</Text>
      {description ? (
        <Text className="text-body-sm text-secondary-600 text-center mb-6">{description}</Text>
      ) : null}
      {action ?? null}
    </View>
  );
}

export default memo(EmptyState);
