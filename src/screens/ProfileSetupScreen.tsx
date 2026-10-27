import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import Avatar from "../components/Avatar";
import Button from "../components/Button";
import Chip from "../components/Chip";
import Input from "../components/Input";
import { useAuth } from "../contexts/AuthContext";
import { ApiError, isNetworkError } from "../services/api/client";
import { colors, LEVEL_META, SPORT_META } from "../theme";
import type { ExperienceLevel, Sport } from "../types";

const SPORTS: Sport[] = ["football", "volleyball", "basketball", "tennis", "futsal", "other"];
const LEVELS: ExperienceLevel[] = ["beginner", "intermediate", "advanced"];

export default function ProfileSetupScreen() {
  const { completeProfile, pendingName } = useAuth();

  const [selectedSports, setSelectedSports] = useState<Sport[]>([]);
  const [level, setLevel] = useState<ExperienceLevel | null>(null);
  const [location, setLocation] = useState("");
  const [locationError, setLocationError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleSport = (sport: Sport) => {
    setSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };

  const submitProfile = async (data: Parameters<typeof completeProfile>[0]) => {
    setSubmitError("");
    setLoading(true);
    try {
      await completeProfile(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setSubmitError(err.message);
      } else if (isNetworkError(err)) {
        // apiClient já tenta de novo sozinho antes de desistir (falha de conectividade
        // passageira) — chegar aqui significa que continuou falhando mesmo assim.
        setSubmitError("Sem conexão com o servidor. Verifique sua internet e tente novamente.");
      } else {
        // Erro inesperado fora do formato { detail: { code, message } } da API — mostra a
        // mensagem crua em vez de um texto genérico, para não esconder a causa real.
        const detail = err instanceof Error ? err.message : String(err);
        setSubmitError(`Não foi possível concluir o cadastro (${detail}). Tente novamente.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    if (location.trim().length < 3) {
      setLocationError("Informe seu bairro ou cidade");
      return;
    }
    setLocationError("");

    submitProfile({
      favoriteSports: selectedSports,
      level: level ?? "beginner",
      location: location.trim(),
    });
  };

  const handlePhotoPress = () => {
    Alert.alert("Foto de perfil", "Upload de fotos disponível em breve!");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <StatusBar style="dark" />
        <View className="mb-6">
          <Text className="text-3xl font-bold text-secondary-900 tracking-tight">
            Configure seu perfil
          </Text>
          <Text className="mt-2 text-base text-secondary-500 leading-6">
            Conte-nos um pouco sobre você para encontrar partidas ideais
          </Text>
        </View>

        <View className="items-center mb-8">
          <Pressable onPress={handlePhotoPress} accessibilityLabel="Alterar foto de perfil">
            <View>
              <Avatar name={pendingName || "Eu"} size="xl" />
              <View className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary-500 border-2 border-white items-center justify-center">
                <MaterialCommunityIcons name="camera" size={15} color={colors.white} />
              </View>
            </View>
            <Text className="mt-3 text-sm text-primary-500 text-center font-semibold">
              Adicionar foto
            </Text>
          </Pressable>
        </View>

        <View className="mb-6">
          <Text className="text-sm font-bold text-secondary-900 mb-3">Esportes favoritos</Text>
          <View className="flex-row flex-wrap gap-2">
            {SPORTS.map((sport) => (
              <Chip
                key={sport}
                label={SPORT_META[sport].label}
                icon={SPORT_META[sport].icon}
                iconColor={SPORT_META[sport].color}
                selected={selectedSports.includes(sport)}
                onPress={() => toggleSport(sport)}
                accessibilityRole="checkbox"
              />
            ))}
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-sm font-bold text-secondary-900 mb-3">Nível de experiência</Text>
          <View className="flex-row gap-2">
            {LEVELS.map((lvl) => {
              const selected = level === lvl;
              return (
                <Pressable
                  key={lvl}
                  onPress={() => setLevel(lvl)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  accessibilityLabel={LEVEL_META[lvl].label}
                  className={`flex-1 py-3.5 rounded-xl border items-center ${
                    selected ? "bg-primary-500 border-primary-500" : "bg-white border-secondary-200"
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${selected ? "text-white" : "text-secondary-600"}`}
                  >
                    {LEVEL_META[lvl].label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="mb-8">
          <Input
            label="Localização aproximada"
            value={location}
            onChangeText={setLocation}
            error={locationError}
            placeholder="Ex: Botafogo, Rio de Janeiro"
            autoCapitalize="words"
            leftIcon="map-marker-outline"
          />
        </View>

        {submitError ? (
          <Text className="mb-4 text-sm text-error text-center">{submitError}</Text>
        ) : null}

        <Button
          label="Concluir configuração"
          onPress={handleComplete}
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
        />

        <View className="mt-4">
          <Button
            label="Pular por agora"
            onPress={() =>
              submitProfile({ favoriteSports: [], level: "beginner", location: "Rio de Janeiro" })
            }
            variant="ghost"
            size="md"
            fullWidth
            loading={loading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
