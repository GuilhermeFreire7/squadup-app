import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Avatar from "../components/Avatar";
import Button from "../components/Button";
import Chip from "../components/Chip";
import Header from "../components/Header";
import Input from "../components/Input";
import SectionCard from "../components/SectionCard";
import { useCreateReport } from "../hooks/useReports";
import { usePublicProfile } from "../hooks/usePublicProfile";
import type { AppRootStackParamList } from "../navigation/types";
import { colors, shadows } from "../theme";
import type { MatchRef, ReportReason } from "../types";
import { formatMatchDate } from "../utils/date";

type Nav = NativeStackNavigationProp<AppRootStackParamList>;
type Route = RouteProp<AppRootStackParamList, "ReportUser">;

const REPORT_REASONS: ReadonlyArray<{ value: ReportReason; label: string }> = [
  { value: "bad_behavior", label: "Comportamento inadequado" },
  { value: "violence", label: "Violência ou agressão" },
  { value: "no_show", label: "Não compareceu" },
  { value: "hate_speech", label: "Discurso de ódio" },
  { value: "spam", label: "Spam ou publicidade" },
  { value: "fake_info", label: "Informações falsas" },
  { value: "other", label: "Outro" },
];

export default function ReportUserScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const insets = useSafeAreaInsets();
  const { userId } = route.params;
  const { submitReport, isSubmitting } = useCreateReport();

  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { profile: user, isLoading } = usePublicProfile(userId);
  // Sem endpoint para "partidas em comum com userId" (D23, .status/queue.md) — picker de
  // partida relacionada fica vazio até o backend expor esse dado.
  const userMatches: MatchRef[] = [];

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-secondary-50">
        <Text className="text-secondary-500">Carregando...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-secondary-50">
        <Text className="text-secondary-500">Usuário não encontrado.</Text>
      </View>
    );
  }

  function selectReason(value: string) {
    setSelectedReason(value);
    if (error) setError(null);
  }

  function handleSubmit() {
    if (!selectedReason) {
      setError("Selecione o motivo da denúncia.");
      return;
    }
    const relatedMatch = userMatches.find((m) => m.id === selectedMatchId);
    submitReport(
      {
        reported_user_id: user!.id,
        match_id: relatedMatch?.id,
        reason: selectedReason as ReportReason,
        description,
      },
      {
        onSuccess: () => {
          Alert.alert(
            "Denúncia enviada!",
            `Sua denúncia sobre ${user!.name} foi registrada. Vamos analisar o caso em até 48 horas.`,
            [{ text: "OK", onPress: () => navigation.goBack() }]
          );
        },
        onError: () => setError("Não foi possível enviar a denúncia. Tente novamente."),
      }
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-secondary-50"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Header title="Denunciar usuário" onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 140 }}
      >
        <View className="gap-4">
          {/* User card */}
          <SectionCard>
            <View className="flex-row items-center gap-3">
              <Avatar name={user.name} photoUrl={user.photoUrl} size="md" />
              <View className="flex-1">
                <Text className="text-base font-bold text-secondary-900" numberOfLines={1}>
                  {user.name}
                </Text>
                <Text className="text-xs text-secondary-500 mt-0.5">Usuário sendo denunciado</Text>
              </View>
              <View className="w-10 h-10 rounded-full bg-error/10 items-center justify-center">
                <MaterialCommunityIcons name="flag" size={18} color={colors.error} />
              </View>
            </View>
          </SectionCard>

          {/* Reason */}
          <SectionCard title="Motivo da denúncia *" subtitle="Selecione o motivo principal">
            <View className="flex-row flex-wrap gap-2">
              {REPORT_REASONS.map(({ value, label }) => (
                <Chip
                  key={value}
                  label={label}
                  tone="danger"
                  selected={selectedReason === value}
                  onPress={() => selectReason(value)}
                />
              ))}
            </View>
          </SectionCard>

          {/* Related match (optional) */}
          {userMatches.length > 0 && (
            <SectionCard title="Partida relacionada" subtitle="Opcional">
              <View className="flex-row flex-wrap gap-2">
                <Chip
                  label="Nenhuma"
                  accessibilityLabel="Nenhuma partida"
                  selected={selectedMatchId === null}
                  onPress={() => setSelectedMatchId(null)}
                />
                {userMatches.map((m) => (
                  <Chip
                    key={m.id}
                    label={m.title}
                    sublabel={formatMatchDate(m.date)}
                    selected={selectedMatchId === m.id}
                    onPress={() => setSelectedMatchId(m.id)}
                  />
                ))}
              </View>
            </SectionCard>
          )}

          {/* Description */}
          <SectionCard title="Descrição" subtitle="Opcional — ajuda na análise do caso">
            <Input
              value={description}
              onChangeText={setDescription}
              placeholder="Descreva o ocorrido com mais detalhes..."
              multiline
              numberOfLines={4}
              maxLength={500}
              accessibilityLabel="Descrição da denúncia"
            />
            <Text className="text-xs text-secondary-500 mt-1.5 text-right">
              {description.length}/500
            </Text>
          </SectionCard>

          {/* Notice */}
          <View className="flex-row items-start gap-2.5 bg-warning/10 rounded-2xl px-4 py-3.5">
            <MaterialCommunityIcons name="shield-check-outline" size={18} color={colors.warning} />
            <Text className="text-xs text-warning flex-1 leading-4 font-medium">
              Todas as denúncias são revisadas pela equipe do SquadUp. Denúncias falsas ou
              maliciosas podem resultar em suspensão da conta.
            </Text>
          </View>

          {/* Error */}
          {error ? (
            <View className="flex-row items-center gap-2 bg-error/10 rounded-2xl px-4 py-3">
              <MaterialCommunityIcons name="alert-circle-outline" size={18} color={colors.error} />
              <Text className="text-sm font-medium text-error flex-1">{error}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* Bottom action */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white px-5 pt-4 border-t border-secondary-200"
        style={[shadows.overlay, { paddingBottom: Math.max(insets.bottom, 16) }]}
      >
        <Button
          label="Enviar denúncia"
          icon="flag-outline"
          onPress={handleSubmit}
          variant="danger"
          size="lg"
          fullWidth
          loading={isSubmitting}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
