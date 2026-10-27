import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Avatar from "../components/Avatar";
import Badge from "../components/Badge";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import Header from "../components/Header";
import LoadingState from "../components/LoadingState";
import ParticipantList from "../components/ParticipantList";
import RatingStars from "../components/RatingStars";
import SectionCard from "../components/SectionCard";
import SlotsBar from "../components/SlotsBar";
import SportTile from "../components/SportTile";
import { useAuth } from "../contexts/AuthContext";
import { useMatchParticipation } from "../hooks/useMatchParticipation";
import type { AppRootStackParamList } from "../navigation/types";
import { colors, LEVEL_META, shadows, SPORT_META, type IconName } from "../theme";
import { formatMatchDate } from "../utils/date";

type Nav = NativeStackNavigationProp<AppRootStackParamList>;
type Route = RouteProp<AppRootStackParamList, "MatchDetail">;

const statusLabel: Record<string, string> = {
  full: "Lotada",
  pending_approval: "Pendente",
  closed: "Encerrada",
  cancelled: "Cancelada",
};

function InfoRow({
  icon,
  label,
  value,
}: Readonly<{ icon: IconName; label: string; value: string }>) {
  return (
    <View className="flex-row items-center gap-3">
      <View className="w-10 h-10 rounded-control bg-primary-50 items-center justify-center">
        <MaterialCommunityIcons name={icon} size={20} color={colors.primary[500]} />
      </View>
      <View className="flex-1">
        <Text className="text-overline uppercase text-secondary-500 mb-0.5">{label}</Text>
        <Text className="text-body text-secondary-900">{value}</Text>
      </View>
    </View>
  );
}

export default function MatchDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const insets = useSafeAreaInsets();
  const { matchId } = route.params;
  const { user } = useAuth();
  const { match, userStatus, isLoading, join, cancel, close, approve } = useMatchParticipation(
    matchId,
    user
  );

  const confirmedCount = useMemo(
    () => (match ? match.participants.filter((p) => p.status === "confirmed").length : 0),
    [match]
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-secondary-50">
        <Header title="Detalhes da partida" onBack={() => navigation.goBack()} />
        <LoadingState label="Carregando partida..." />
      </View>
    );
  }

  if (!match) {
    return (
      <View className="flex-1 bg-secondary-50">
        <Header title="Detalhes da partida" onBack={() => navigation.goBack()} />
        <EmptyState icon="calendar-remove-outline" title="Partida não encontrada." />
      </View>
    );
  }

  const isMatchOver = match.status === "closed" || match.status === "cancelled";
  const isMatchFull = match.status === "full" && userStatus !== "confirmed";
  const nonOpenStatus = match.status !== "open" ? statusLabel[match.status] : null;
  const sportMeta = SPORT_META[match.sport];
  const bottomPadding = Math.max(insets.bottom, 16);
  const isOrganizer = match.organizer.id === user?.id;
  const canClose = isOrganizer && !isMatchOver;

  let bottomAction: React.ReactNode;
  if (isMatchOver) {
    bottomAction = (
      <View className="gap-3">
        <Button label="Partida encerrada" onPress={() => {}} disabled fullWidth />
        {match.status === "closed" && userStatus === "confirmed" && (
          <Button
            label="Avaliar participantes"
            icon="star-outline"
            onPress={() => navigation.navigate("PostMatchRating", { matchId: match.id })}
            variant="ghost"
            fullWidth
          />
        )}
      </View>
    );
  } else if (userStatus === "confirmed") {
    bottomAction = (
      <View className="gap-3">
        <View className="flex-row items-center justify-center gap-2 bg-success-50 rounded-control py-2.5">
          <MaterialCommunityIcons
            name="check-circle-outline"
            size={18}
            color={colors.successText}
          />
          <Text className="text-label text-success-700">Você está confirmado</Text>
        </View>
        <Button
          label="Chat da partida"
          icon="chat-outline"
          onPress={() => navigation.navigate("MatchChat", { matchId: match.id })}
          fullWidth
        />
        <Button label="Cancelar participação" onPress={cancel} variant="ghost" fullWidth />
        {canClose && <Button label="Encerrar partida" onPress={close} variant="danger" fullWidth />}
      </View>
    );
  } else if (userStatus === "pending") {
    bottomAction = (
      <View className="gap-3">
        <View className="flex-row items-center justify-center gap-2 bg-warning-50 rounded-control py-2.5">
          <MaterialCommunityIcons name="clock-outline" size={18} color={colors.warningText} />
          <Text className="text-label text-warning-700">Aguardando aprovação</Text>
        </View>
        <Button label="Cancelar solicitação" onPress={cancel} variant="ghost" fullWidth />
      </View>
    );
  } else if (isMatchFull) {
    bottomAction = <Button label="Partida lotada" onPress={() => {}} disabled fullWidth />;
  } else {
    bottomAction = (
      <Button label="Participar" icon="account-plus-outline" onPress={join} size="lg" fullWidth />
    );
  }

  return (
    <View className="flex-1 bg-secondary-50">
      <Header title="Detalhes da partida" onBack={() => navigation.goBack()} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        <View className="p-5 gap-4">
          {/* Hero */}
          <View className="flex-row items-start gap-4">
            <SportTile sport={match.sport} size={56} />
            <View className="flex-1">
              <Text className={`text-overline uppercase mb-1 ${sportMeta.textClass}`}>
                {sportMeta.label} · {LEVEL_META[match.level].label}
              </Text>
              <Text className="text-title text-secondary-900">{match.title}</Text>
            </View>
          </View>

          {/* Status pills */}
          {(nonOpenStatus || match.requiresApproval || match.allowBeginners) && (
            <View className="flex-row flex-wrap gap-2">
              {nonOpenStatus && (
                <Badge variant="status" status={match.status} label={nonOpenStatus} />
              )}
              {match.requiresApproval && <Badge label="Aprovação necessária" />}
              {match.allowBeginners && <Badge label="Iniciantes OK" />}
            </View>
          )}

          {/* Info block */}
          <SectionCard>
            <View className="gap-4">
              <InfoRow icon="map-marker-outline" label="Local" value={match.location} />
              <InfoRow
                icon="calendar-blank-outline"
                label="Data"
                value={formatMatchDate(match.date)}
              />
              <InfoRow icon="clock-outline" label="Horário" value={match.time} />
            </View>
          </SectionCard>

          {/* Slots */}
          {match.status !== "cancelled" && (
            <SectionCard title="Vagas">
              <SlotsBar confirmed={confirmedCount} max={match.maxParticipants} size="md" />
            </SectionCard>
          )}

          {/* Description */}
          {match.description ? (
            <SectionCard title="Sobre a partida">
              <Text className="text-body-sm text-secondary-700">{match.description}</Text>
            </SectionCard>
          ) : null}

          {/* Organizer */}
          <SectionCard title="Organizador">
            <Pressable
              onPress={() => navigation.navigate("PublicProfile", { userId: match.organizer.id })}
              accessibilityRole="button"
              accessibilityLabel={`Ver perfil de ${match.organizer.name}`}
              className="flex-row items-center gap-3 min-h-11 active:opacity-70"
            >
              <Avatar name={match.organizer.name} photoUrl={match.organizer.photoUrl} size="md" />
              <View className="flex-1">
                <View className="flex-row items-center gap-1">
                  <Text className="text-label text-secondary-900" numberOfLines={1}>
                    {match.organizer.name}
                  </Text>
                  {match.organizer.isVerified && (
                    <MaterialCommunityIcons
                      name="check-decagram"
                      size={15}
                      color={colors.primary[500]}
                      accessibilityLabel="Verificado"
                    />
                  )}
                </View>
                <RatingStars rating={match.organizer.averageRating} size="sm" showValue />
                <Text className="text-caption text-secondary-500 mt-0.5">
                  {match.organizer.matchesPlayed} partidas
                </Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color={colors.secondary[400]}
              />
            </Pressable>
          </SectionCard>

          {/* Participants */}
          <SectionCard
            title="Participantes confirmados"
            subtitle={`${confirmedCount} de ${match.maxParticipants}`}
          >
            <ParticipantList
              participants={match.participants}
              onPress={(userId) => navigation.navigate("PublicProfile", { userId })}
              onApprove={isOrganizer ? approve : undefined}
            />
          </SectionCard>
        </View>
      </ScrollView>

      {/* Bottom action area */}
      <View
        className="bg-white px-5 pt-4 border-t border-secondary-200"
        style={[shadows.overlay, { paddingBottom: bottomPadding }]}
      >
        {bottomAction}
      </View>
    </View>
  );
}
