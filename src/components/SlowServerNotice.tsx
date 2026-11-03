import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Text, View } from "react-native";

import { colors } from "../theme";

interface SlowServerNoticeProps {
  visible: boolean;
  /** `dark` para fundos escuros (tela de abertura). */
  tone?: "light" | "dark";
}

export const SLOW_SERVER_MESSAGE =
  "O servidor está iniciando. Na primeira vez, isso pode levar até 1 minuto.";

/** Aviso para esperas longas na primeira requisição (servidor hibernado no plano gratuito). */
function SlowServerNotice({ visible, tone = "light" }: Readonly<SlowServerNoticeProps>) {
  if (!visible) return null;
  const isDark = tone === "dark";
  return (
    <View
      className="flex-row items-center gap-2 mt-4 px-2"
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <MaterialCommunityIcons
        name="timer-sand"
        size={16}
        color={isDark ? colors.secondary[400] : colors.secondary[500]}
      />
      <Text
        className={`flex-1 text-body-sm ${isDark ? "text-secondary-300" : "text-secondary-600"}`}
      >
        {SLOW_SERVER_MESSAGE}
      </Text>
    </View>
  );
}

export default memo(SlowServerNotice);
