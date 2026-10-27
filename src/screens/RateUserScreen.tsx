import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Avatar from "../components/Avatar";
import Button from "../components/Button";
import Header from "../components/Header";
import Input from "../components/Input";
import RatingStars from "../components/RatingStars";
import SectionCard from "../components/SectionCard";
import StarRatingInput from "../components/StarRatingInput";
import { useMatchDetail } from "../hooks/useMatchDetail";
import { useSubmitRating } from "../hooks/useRatings";
import type { AppRootStackParamList } from "../navigation/types";
import { ApiError } from "../services/api/client";
import { colors, LEVEL_META, shadows } from "../theme";
import type { RatingCriteria } from "../types";

const NOT_MATCH_PARTICIPANT_MESSAGE =
  "Você e este participante precisam ter entrado na partida (não só organizado) para avaliar ou ser avaliado.";

type Nav = NativeStackNavigationProp<AppRootStackParamList>;
type Route = RouteProp<AppRootStackParamList, "RateUser">;

const CRITERIA_LABELS: { key: keyof RatingCriteria; label: string }[] = [
  { key: "punctuality", label: "Pontualidade" },
  { key: "respect", label: "Respeito" },
  { key: "behavior", label: "Comportamento" },
  { key: "presence", label: "Presença" },
  { key: "overall", label: "Experiência geral" },
];

const EMPTY_CRITERIA: RatingCriteria = {
  punctuality: 0,
  respect: 0,
  behavior: 0,
  presence: 0,
  overall: 0,
};

export default function RateUserScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const insets = useSafeAreaInsets();
  const { matchId, userId } = route.params;
  const { match } = useMatchDetail(matchId);
  const { submitRating, isSubmitting } = useSubmitRating();

  const [criteria, setCriteria] = useState<RatingCriteria>(EMPTY_CRITERIA);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  const user = match?.participants.find((p) => p.user.id === userId)?.user;

  if (!match || !user) {
    return (
      <View className="flex-1 items-center justify-center bg-secondary-50">
        <Text className="text-secondary-500">Usuário não encontrado.</Text>
      </View>
    );
  }

  function setCriterion(key: keyof RatingCriteria, value: number) {
    setCriteria((prev) => ({ ...prev, [key]: value }));
    if (error) setError(null);
  }

  function handleSubmit() {
    if (!user) return;
    const allFilled = CRITERIA_LABELS.every(({ key }) => criteria[key] >= 1);
    if (!allFilled) {
      setError("Avalie todos os critérios antes de enviar.");
      return;
    }
    submitRating(matchId, userId, criteria, comment.trim() || undefined, {
      onSuccess: () => {
        Alert.alert(
          "Avaliação enviada!",
          `Sua avaliação de ${user.name} foi registrada com sucesso. Obrigado pelo feedback!`,
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      },
      onError: (submitError) => {
        if (submitError instanceof ApiError && submitError.code === "NOT_MATCH_PARTICIPANT") {
          setError(NOT_MATCH_PARTICIPANT_MESSAGE);
        } else {
          setError("Não foi possível enviar a avaliação. Tente novamente.");
        }
      },
    });
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-secondary-50"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Header title="Avaliar participante" onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 140 }}
      >
        <View className="gap-4">
          {/* User card */}
          <SectionCard>
            <View className="flex-row items-center gap-3">
              <Avatar name={user.name} photoUrl={user.photoUrl} size="lg" />
              <View className="flex-1">
                <View className="flex-row items-center gap-1">
                  <Text className="text-base font-bold text-secondary-900" numberOfLines={1}>
                    {user.name}
                  </Text>
                  {user.isVerified && (
                    <MaterialCommunityIcons
                      name="check-decagram"
                      size={16}
                      color={colors.primary[500]}
                      accessibilityLabel="Verificado"
                    />
                  )}
                </View>
                <Text className="text-xs text-secondary-500 mt-0.5">
                  {LEVEL_META[user.level].label}
                </Text>
                <RatingStars rating={user.averageRating} size="sm" showValue />
                <Text className="text-xs text-secondary-500 mt-0.5">
                  {user.matchesPlayed} partidas concluídas
                </Text>
              </View>
            </View>
          </SectionCard>

          {/* Criteria */}
          <SectionCard title="Critérios de avaliação">
            <View className="gap-5 mt-1">
              {CRITERIA_LABELS.map(({ key, label }) => (
                <StarRatingInput
                  key={key}
                  label={label}
                  value={criteria[key]}
                  onChange={(v) => setCriterion(key, v)}
                  size="lg"
                />
              ))}
            </View>
          </SectionCard>

          {/* Comment */}
          <SectionCard
            title="Comentário"
            rightElement={<Text className="text-xs text-secondary-500">opcional</Text>}
          >
            <Input
              value={comment}
              onChangeText={setComment}
              placeholder="Descreva sua experiência com este participante..."
              multiline
              numberOfLines={4}
              maxLength={280}
              accessibilityLabel="Comentário"
            />
            <Text className="text-xs text-secondary-500 mt-1.5 text-right">
              {comment.length}/280
            </Text>
          </SectionCard>

          {/* Error */}
          {error ? (
            <View className="flex-row items-center gap-2 bg-error-50 rounded-control px-4 py-3">
              <MaterialCommunityIcons name="alert-circle-outline" size={18} color={colors.error} />
              <Text className="text-sm font-medium text-error-700 flex-1">{error}</Text>
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
          label="Enviar avaliação"
          icon="send"
          onPress={handleSubmit}
          size="lg"
          fullWidth
          loading={isSubmitting}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
