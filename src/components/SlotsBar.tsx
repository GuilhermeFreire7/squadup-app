import React, { memo } from "react";
import { Text, View } from "react-native";

interface SlotsBarProps {
  confirmed: number;
  max: number;
  /** `sm` no card da lista, `md` na tela de detalhes */
  size?: "sm" | "md";
}

/**
 * Barra de ocupação da partida. A cor reforça o estado (livre / quase cheia / lotada),
 * mas o texto abaixo sempre diz o mesmo — nada é transmitido só por cor.
 */
function SlotsBar({ confirmed, max, size = "sm" }: Readonly<SlotsBarProps>) {
  const available = max - confirmed;
  const ratio = max > 0 ? confirmed / max : 0;
  const pct = Math.min(ratio * 100, 100);

  let fillColor = "bg-success";
  if (available === 0) fillColor = "bg-error";
  else if (ratio >= 0.8) fillColor = "bg-accent-500";

  let availabilityText = "Sem vagas";
  if (available === 1) availabilityText = "1 vaga disponível";
  else if (available > 1) availabilityText = `${available} vagas disponíveis`;

  return (
    <View>
      <View
        className={`${size === "md" ? "h-2" : "h-1.5"} bg-secondary-100 rounded-full overflow-hidden`}
      >
        <View className={`h-full rounded-full ${fillColor}`} style={{ width: `${pct}%` }} />
      </View>
      <Text
        className={`${size === "md" ? "text-body-sm" : "text-caption"} text-secondary-600 mt-2`}
      >
        {availabilityText}
        {" · "}
        {confirmed}/{max} confirmados
      </Text>
    </View>
  );
}

export default memo(SlotsBar);
