import React, { memo } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { colors } from "../theme";

interface LoadingStateProps {
  label: string;
}

/** Carregamento de tela inteira — mesmo enquadramento do `EmptyState`. */
function LoadingState({ label }: Readonly<LoadingStateProps>) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16 bg-secondary-50">
      <ActivityIndicator size="large" color={colors.primary[500]} />
      <Text className="text-body-sm text-secondary-600 text-center mt-4">{label}</Text>
    </View>
  );
}

export default memo(LoadingState);
