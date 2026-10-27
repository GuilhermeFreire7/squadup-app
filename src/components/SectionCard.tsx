import React, { memo } from "react";
import { Text, View } from "react-native";

import Card from "./Card";

interface SectionCardProps {
  title?: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Card de seção padrão — agrupa conteúdo sob um título consistente.
 * Substitui os blocos `bg-white rounded-2xl p-4` duplicados entre telas.
 */
function SectionCard({ title, subtitle, rightElement, children }: Readonly<SectionCardProps>) {
  const hasHeader = Boolean(title || rightElement);
  const hasBody = children !== null && children !== undefined && children !== false;
  let headerMargin = "";
  if (hasBody && !subtitle) headerMargin = "mb-3";

  return (
    <Card>
      {hasHeader ? (
        <View className={`flex-row items-center justify-between ${headerMargin}`}>
          {title ? <Text className="text-subheading text-secondary-900">{title}</Text> : <View />}
          {rightElement ?? null}
        </View>
      ) : null}
      {subtitle ? (
        <Text className={`text-caption text-secondary-500 mt-0.5 ${hasBody ? "mb-3" : ""}`}>
          {subtitle}
        </Text>
      ) : null}
      {children}
    </Card>
  );
}

export default memo(SectionCard);
