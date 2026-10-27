import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useMemo } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

import Avatar from "../components/Avatar";
import EmptyState from "../components/EmptyState";
import Header from "../components/Header";
import RatingStars from "../components/RatingStars";
import { useAuth } from "../contexts/AuthContext";
import { useMatchDetail } from "../hooks/useMatchDetail";
import { useHasRatedMap } from "../hooks/useRatings";
import type { AppRootStackParamList } from "../navigation/types";
import { colors, LEVEL_META, shadows } from "../theme";
import type { Participant } from "../types";

type Nav = NativeStackNavigationProp<AppRootStackParamList>;
type Route = RouteProp<AppRootStackParamList, "PostMatchRating">;

function ParticipantRow({
  participant,
  alreadyRated,
  onRate,
}: Readonly<{
  participant: Participant;
  alreadyRated: boolean;
  onRate: () => void;
}>) {
  const { user } = participant;
  return (
    <View
      className="flex-row items-center gap-3 bg-white rounded-2xl border border-secondary-100 p-4 mb-3"
      style={shadows.card}
    >
      <Avatar name={user.name} photoUrl={user.photoUrl} size="md" />
      <View className="flex-1">
        <View className="flex-row items-center gap-1">
          <Text className="text-sm font-semibold text-secondary-900" numberOfLines={1}>
            {user.name}
          </Text>
          {user.isVerified && (
            <MaterialCommunityIcons
              name="check-decagram"
              size={14}
              color={colors.primary[500]}
              accessibilityLabel="Verificado"
            />
          )}
        </View>
        <Text className="text-xs text-secondary-500">{LEVEL_META[user.level].label}</Text>
        <RatingStars rating={user.averageRating} size="sm" showValue />
      </View>
      {alreadyRated ? (
        <View className="flex-row items-center gap-1 bg-success/10 rounded-full px-3 py-2">
          <MaterialCommunityIcons name="check-circle" size={16} color={colors.success} />
          <Text className="text-xs font-semibold text-success">Avaliado</Text>
        </View>
      ) : (
        <Pressable
          onPress={onRate}
          className="flex-row items-center gap-1 bg-primary-500 active:bg-primary-600 rounded-full px-4 py-2"
          accessibilityLabel={`Avaliar ${user.name}`}
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="star-outline" size={14} color={colors.white} />
          <Text className="text-xs font-semibold text-white">Avaliar</Text>
        </Pressable>
      )}
    </View>
  );
}

export default function PostMatchRatingScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { matchId } = route.params;
  const { match } = useMatchDetail(matchId);
  const { user: currentUser } = useAuth();

  const otherParticipants = useMemo(
    () =>
      match
        ? match.participants.filter(
            (p) => p.status === "confirmed" && p.user.id !== currentUser?.id
          )
        : [],
    [match, currentUser?.id]
  );

  const ratedUserIds = useMemo(() => otherParticipants.map((p) => p.user.id), [otherParticipants]);
  const hasRatedMap = useHasRatedMap(matchId, ratedUserIds);

  const allRated =
    otherParticipants.length > 0 && otherParticipants.every((p) => hasRatedMap[p.user.id]);

  if (!match) {
    return (
      <View className="flex-1 items-center justify-center bg-secondary-50">
        <Text className="text-secondary-500">Partida não encontrada.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-secondary-50">
      <Header
        title="Avaliar participantes"
        subtitle={match.title}
        onBack={() => navigation.goBack()}
      />

      {otherParticipants.length === 0 ? (
        <EmptyState
          icon="account-group-outline"
          title="Sem outros participantes"
          description="Não há outros confirmados nesta partida para avaliar."
        />
      ) : (
        <>
          {allRated && (
            <View className="flex-row items-center justify-center gap-2 bg-success/10 mx-5 mt-4 rounded-2xl px-4 py-3">
              <MaterialCommunityIcons name="check-circle" size={18} color={colors.success} />
              <Text className="text-sm font-semibold text-success">
                Todos os participantes foram avaliados!
              </Text>
            </View>
          )}
          <FlatList
            data={otherParticipants}
            keyExtractor={(item) => item.user.id}
            renderItem={({ item }) => (
              <ParticipantRow
                participant={item}
                alreadyRated={Boolean(hasRatedMap[item.user.id])}
                onRate={() => navigation.navigate("RateUser", { matchId, userId: item.user.id })}
              />
            )}
            ListHeaderComponent={
              <Text className="text-sm text-secondary-500 mb-4">
                Avalie os participantes desta partida — sua avaliação constrói a reputação da
                comunidade.
              </Text>
            }
            contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </View>
  );
}
