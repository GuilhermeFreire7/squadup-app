import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import Button from "../components/Button";
import Chip from "../components/Chip";
import Header from "../components/Header";
import Input from "../components/Input";
import { useInvalidateMatches } from "../contexts/MatchesContext";
import { useDeviceLocation } from "../hooks/useDeviceLocation";
import type { AppTabParamList } from "../navigation/types";
import { createMatch } from "../services/api/matches";
import { colors, LEVEL_META, SPORT_META } from "../theme";
import type { ExperienceLevel, Sport } from "../types";
import { formatDateInput } from "../utils/date";

type Nav = BottomTabNavigationProp<AppTabParamList>;

const SPORTS: Sport[] = ["football", "futsal", "volleyball", "basketball", "tennis", "other"];
const LEVELS: ExperienceLevel[] = ["beginner", "intermediate", "advanced"];

const DATE_RE = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

function SectionLabel({ children }: { readonly children: string }) {
  return <Text className="text-sm font-bold text-secondary-900 mb-3">{children}</Text>;
}

function ToggleRow({
  label,
  description,
  value,
  onToggle,
  accessibilityLabel,
}: {
  readonly label: string;
  readonly description: string;
  readonly value: boolean;
  readonly onToggle: () => void;
  readonly accessibilityLabel: string;
}) {
  return (
    <Pressable
      className={`flex-row items-center justify-between p-4 rounded-2xl border ${
        value ? "bg-primary-50 border-primary-300" : "bg-white border-secondary-200"
      }`}
      onPress={onToggle}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={accessibilityLabel}
    >
      <View className="flex-1 mr-3">
        <Text
          className={`text-sm font-semibold ${value ? "text-primary-700" : "text-secondary-700"}`}
        >
          {label}
        </Text>
        <Text className="text-xs text-secondary-500 mt-0.5">{description}</Text>
      </View>
      <View
        className={`w-6 h-6 rounded-lg border-2 items-center justify-center ${
          value ? "bg-primary-500 border-primary-500" : "border-secondary-300"
        }`}
      >
        {value && <MaterialCommunityIcons name="check-bold" size={14} color={colors.white} />}
      </View>
    </Pressable>
  );
}

export default function CreateMatchScreen() {
  const navigation = useNavigation<Nav>();
  const invalidateMatches = useInvalidateMatches();
  const {
    location: deviceLocation,
    isLoading: isLocationLoading,
    requestLocation,
  } = useDeviceLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationChecked, setLocationChecked] = useState(false);

  useEffect(() => {
    void requestLocation().finally(() => setLocationChecked(true));
  }, [requestLocation]);

  const showLocationWarning = locationChecked && !isLocationLoading && !deviceLocation;

  const [sport, setSport] = useState<Sport | null>(null);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [level, setLevel] = useState<ExperienceLevel>("intermediate");
  const [description, setDescription] = useState("");
  const [allowBeginners, setAllowBeginners] = useState(false);
  const [requiresApproval, setRequiresApproval] = useState(false);

  const [sportError, setSportError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [dateError, setDateError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [maxParticipantsError, setMaxParticipantsError] = useState("");

  function validate(): boolean {
    let valid = true;

    if (sport) {
      setSportError("");
    } else {
      setSportError("Selecione uma modalidade esportiva");
      valid = false;
    }

    if (title.trim().length >= 3) {
      setTitleError("");
    } else {
      setTitleError("Título deve ter ao menos 3 caracteres");
      valid = false;
    }

    if (location.trim().length >= 3) {
      setLocationError("");
    } else {
      setLocationError("Informe o local da partida");
      valid = false;
    }

    if (DATE_RE.test(date)) {
      setDateError("");
    } else {
      setDateError("Use o formato DD/MM/AAAA");
      valid = false;
    }

    if (TIME_RE.test(time)) {
      setTimeError("");
    } else {
      setTimeError("Use o formato HH:MM");
      valid = false;
    }

    const participants = Number.parseInt(maxParticipants, 10);
    if (!Number.isNaN(participants) && participants >= 2) {
      setMaxParticipantsError("");
    } else {
      setMaxParticipantsError("Mínimo de 2 participantes");
      valid = false;
    }

    return valid;
  }

  async function handleSubmit() {
    if (!validate()) return;

    const [day, month, year] = date.split("/");
    const isoDate = `${year}-${month}-${day}`;
    const max = Number.parseInt(maxParticipants, 10);

    setIsSubmitting(true);
    try {
      await createMatch({
        sport: sport!,
        title: title.trim(),
        location: location.trim(),
        date: isoDate,
        time: `${time.trim()}:00`,
        max_participants: max,
        level,
        description: description.trim() || undefined,
        allow_beginners: allowBeginners,
        requires_approval: requiresApproval,
        ...(deviceLocation
          ? { latitude: deviceLocation.latitude, longitude: deviceLocation.longitude }
          : {}),
      });

      invalidateMatches();

      Alert.alert(
        "Partida criada!",
        `"${title.trim()}" foi criada com sucesso.\n${SPORT_META[sport!].label} · ${date} às ${time}`,
        [{ text: "Ver partidas", onPress: () => navigation.navigate("Home") }]
      );
    } catch {
      Alert.alert("Não foi possível criar a partida", "Tente novamente em instantes.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-secondary-50"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Header variant="large" title="Criar Partida" subtitle="Organize o jogo e chame a galera" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-6">
          {/* Sport */}
          <View>
            <SectionLabel>Modalidade *</SectionLabel>
            <View className="flex-row flex-wrap gap-2">
              {SPORTS.map((s) => (
                <Chip
                  key={s}
                  label={SPORT_META[s].label}
                  icon={SPORT_META[s].icon}
                  iconColor={SPORT_META[s].color}
                  selected={sport === s}
                  onPress={() => {
                    setSport(s);
                    setSportError("");
                  }}
                />
              ))}
            </View>
            {sportError ? (
              <View className="mt-2 flex-row items-center gap-1">
                <MaterialCommunityIcons name="alert-circle" size={14} color={colors.error} />
                <Text className="text-sm text-error">{sportError}</Text>
              </View>
            ) : null}
          </View>

          {/* Title */}
          <Input
            label="Título da partida *"
            value={title}
            onChangeText={setTitle}
            error={titleError}
            placeholder="Ex: Pelada de domingo na arena"
            autoCapitalize="sentences"
          />

          {/* Location */}
          <Input
            label="Local *"
            value={location}
            onChangeText={setLocation}
            error={locationError}
            placeholder="Ex: Arena Botafogo — Rua Gen. Polidoro"
            autoCapitalize="words"
            leftIcon="map-marker-outline"
          />
          {showLocationWarning ? (
            <View className="-mt-4 flex-row items-center gap-1">
              <MaterialCommunityIcons
                name="map-marker-off-outline"
                size={14}
                color={colors.secondary[400]}
              />
              <Text className="text-xs text-secondary-500">
                Localização não disponível — partida será criada sem coordenadas
              </Text>
            </View>
          ) : null}

          {/* Date + Time */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Input
                label="Data *"
                value={date}
                onChangeText={(text) => setDate(formatDateInput(text))}
                error={dateError}
                placeholder="DD/MM/AAAA"
                keyboardType="number-pad"
                maxLength={10}
                leftIcon="calendar-blank-outline"
              />
            </View>
            <View className="flex-1">
              <Input
                label="Horário *"
                value={time}
                onChangeText={setTime}
                error={timeError}
                placeholder="HH:MM"
                keyboardType="number-pad"
                maxLength={5}
                leftIcon="clock-outline"
              />
            </View>
          </View>

          {/* Max participants */}
          <Input
            label="Máximo de participantes *"
            value={maxParticipants}
            onChangeText={setMaxParticipants}
            error={maxParticipantsError}
            placeholder="Ex: 10"
            keyboardType="number-pad"
            maxLength={3}
            leftIcon="account-group-outline"
          />

          {/* Level */}
          <View>
            <SectionLabel>Nível da partida</SectionLabel>
            <View className="flex-row gap-2">
              {LEVELS.map((l) => {
                const selected = level === l;
                return (
                  <Pressable
                    key={l}
                    onPress={() => setLevel(l)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    accessibilityLabel={LEVEL_META[l].label}
                    className={`flex-1 py-3.5 rounded-xl border items-center ${
                      selected
                        ? "bg-primary-500 border-primary-500"
                        : "bg-white border-secondary-200"
                    }`}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        selected ? "text-white" : "text-secondary-600"
                      }`}
                    >
                      {LEVEL_META[l].label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Description */}
          <Input
            label="Descrição (opcional)"
            value={description}
            onChangeText={setDescription}
            placeholder="Informações extras: equipamento necessário, regras, etc."
            autoCapitalize="sentences"
            multiline
            numberOfLines={3}
            style={{ minHeight: 80, textAlignVertical: "top" }}
          />

          {/* Toggles */}
          <View className="gap-3">
            <SectionLabel>Opções</SectionLabel>
            <ToggleRow
              label="Permitir iniciantes"
              description="Jogadores de qualquer nível podem participar"
              value={allowBeginners}
              onToggle={() => setAllowBeginners((v) => !v)}
              accessibilityLabel="Permitir iniciantes"
            />
            <ToggleRow
              label="Exigir aprovação do organizador"
              description="Você aprova cada solicitação de entrada"
              value={requiresApproval}
              onToggle={() => setRequiresApproval((v) => !v)}
              accessibilityLabel="Exigir aprovação do organizador"
            />
          </View>

          <Button
            label="Criar partida"
            icon="plus-circle-outline"
            onPress={handleSubmit}
            variant="primary"
            size="lg"
            fullWidth
            loading={isSubmitting}
            disabled={isSubmitting}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
