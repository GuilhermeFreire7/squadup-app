import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Pressable, Text, View } from "react-native";

import type { Participant } from "../types";
import Avatar from "./Avatar";
import Button from "./Button";
import RatingStars from "./RatingStars";

interface ParticipantListProps {
  readonly participants: Participant[];
  readonly onPress?: (userId: string) => void;
  /** Só o organizador pode aprovar — omitir esconde a ação (D17). */
  readonly onApprove?: (userId: string) => void;
}

function ParticipantList({ participants, onPress, onApprove }: ParticipantListProps) {
  const confirmed = participants.filter((p) => p.status === "confirmed");
  const pending = participants.filter((p) => p.status === "pending");

  return (
    <View>
      {confirmed.map(({ user }) => (
        <Pressable
          key={user.id}
          onPress={() => onPress?.(user.id)}
          accessibilityRole="button"
          accessibilityLabel={`Ver perfil de ${user.name}`}
          className="flex-row items-center gap-3 py-3 border-b border-secondary-100 active:opacity-70"
        >
          <Avatar name={user.name} photoUrl={user.photoUrl} size="sm" />
          <View className="flex-1">
            <View className="flex-row items-center gap-1">
              <Text className="text-sm font-semibold text-secondary-900" numberOfLines={1}>
                {user.name}
              </Text>
              {user.isVerified && (
                <MaterialCommunityIcons
                  name="check-decagram"
                  size={14}
                  color="#2563EB"
                  accessibilityLabel="Verificado"
                />
              )}
            </View>
            <RatingStars rating={user.averageRating} size="sm" showValue={false} />
          </View>
          <View className="flex-row items-center gap-1">
            <Text className="text-xs text-secondary-500">{user.matchesPlayed} partidas</Text>
            <MaterialCommunityIcons name="chevron-right" size={16} color="#CBD5E1" />
          </View>
        </Pressable>
      ))}
      {pending.map(({ user }) => (
        <View
          key={user.id}
          className={`flex-row items-center gap-3 py-3 border-b border-secondary-100 ${
            onApprove ? "" : "opacity-60"
          }`}
        >
          <Avatar name={user.name} photoUrl={user.photoUrl} size="sm" />
          <View className="flex-1">
            <Text className="text-sm font-semibold text-secondary-900" numberOfLines={1}>
              {user.name}
            </Text>
            <Text className="text-xs text-accent-600">Aguardando aprovação</Text>
          </View>
          {onApprove && (
            <Button label="Aprovar" size="sm" variant="ghost" onPress={() => onApprove(user.id)} />
          )}
        </View>
      ))}
    </View>
  );
}

export default memo(ParticipantList);
