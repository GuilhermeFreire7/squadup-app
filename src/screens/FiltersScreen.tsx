import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";

import Button from "../components/Button";
import Chip from "../components/Chip";
import Input from "../components/Input";
import type { MatchFilters } from "../contexts/MatchFiltersContext";
import { DEFAULT_RADIUS_KM, useMatchFiltersContext } from "../contexts/MatchFiltersContext";
import { useDeviceLocation } from "../hooks/useDeviceLocation";
import { colors, LEVEL_META, shadows, SPORT_META } from "../theme";
import type { ExperienceLevel, Sport } from "../types";
import { formatDateInput } from "../utils/date";

const SPORTS: Sport[] = ["football", "futsal", "volleyball", "basketball", "tennis"];
const LEVELS: ExperienceLevel[] = ["beginner", "intermediate", "advanced"];
const RADII_KM = [5, 10, 20, 50];
const DATE_RE = /^(\d{2})\/(\d{2})\/(\d{4})$/;

function isoToDisplayDate(iso: string | null): string {
  if (!iso) return "";
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

function displayToIsoDate(display: string): string | null {
  const match = DATE_RE.exec(display);
  if (!match) return null;
  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}

function SectionLabel({ children }: Readonly<{ children: string }>) {
  return <Text className="text-sm font-bold text-secondary-900 mb-3">{children}</Text>;
}

export default function FiltersScreen() {
  const navigation = useNavigation();
  const { filters, setFilters, clearFilters } = useMatchFiltersContext();

  const [local, setLocal] = useState<MatchFilters>({ ...filters });
  const [dateText, setDateText] = useState(isoToDisplayDate(filters.date));
  const [dateError, setDateError] = useState("");

  const { location, permissionDenied, requestLocation } = useDeviceLocation();

  function toggleNearMe() {
    setLocal((prev) => {
      if (prev.nearMe) return { ...prev, nearMe: false, latitude: null, longitude: null };
      void requestLocation();
      return { ...prev, nearMe: true };
    });
  }

  function toggleSport(sport: Sport) {
    setLocal((prev) => ({ ...prev, sport: prev.sport === sport ? null : sport }));
  }

  function toggleLevel(level: ExperienceLevel) {
    setLocal((prev) => ({ ...prev, level: prev.level === level ? null : level }));
  }

  function handleDateChange(rawText: string) {
    const text = formatDateInput(rawText);
    setDateText(text);
    if (!text) {
      setDateError("");
      setLocal((prev) => ({ ...prev, date: null }));
      return;
    }
    const iso = displayToIsoDate(text);
    if (iso) {
      setDateError("");
      setLocal((prev) => ({ ...prev, date: iso }));
    } else {
      setDateError("Use o formato DD/MM/AAAA");
    }
  }

  function handleApply() {
    if (dateText && !displayToIsoDate(dateText)) {
      setDateError("Use o formato DD/MM/AAAA");
      return;
    }
    setFilters({
      ...local,
      latitude: local.nearMe ? (location?.latitude ?? local.latitude) : null,
      longitude: local.nearMe ? (location?.longitude ?? local.longitude) : null,
    });
    navigation.goBack();
  }

  function handleClear() {
    clearFilters();
    setLocal({
      sport: null,
      level: null,
      onlyAvailable: false,
      date: null,
      location: null,
      nearMe: false,
      latitude: null,
      longitude: null,
      radiusKm: DEFAULT_RADIUS_KM,
    });
    setDateText("");
    setDateError("");
  }

  const localActiveCount = [
    local.sport,
    local.level,
    local.onlyAvailable || null,
    local.date,
    local.location,
    local.nearMe || null,
  ].filter(Boolean).length;

  let applyLabel = "Aplicar filtros";
  if (localActiveCount === 1) applyLabel = "Aplicar 1 filtro";
  else if (localActiveCount > 1) applyLabel = `Aplicar ${localActiveCount} filtros`;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Handle bar */}
      <View className="items-center pt-3 pb-1">
        <View className="w-10 h-1 bg-secondary-200 rounded-full" />
      </View>

      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Fechar filtros"
          className="w-9 h-9 items-center justify-center rounded-full bg-secondary-100 active:bg-secondary-200"
        >
          <MaterialCommunityIcons name="close" size={20} color={colors.secondary[700]} />
        </Pressable>
        <Text className="text-base font-bold text-secondary-900">Filtros</Text>
        <Pressable
          onPress={handleClear}
          accessibilityRole="button"
          accessibilityLabel="Limpar filtros"
          className="h-9 justify-center"
        >
          <Text className="text-sm text-primary-500 font-semibold">Limpar</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Sport */}
        <SectionLabel>Esporte</SectionLabel>
        <View className="flex-row flex-wrap gap-2 mb-6">
          {SPORTS.map((sport) => (
            <Chip
              key={sport}
              label={SPORT_META[sport].label}
              icon={SPORT_META[sport].icon}
              iconColor={SPORT_META[sport].color}
              selected={local.sport === sport}
              onPress={() => toggleSport(sport)}
            />
          ))}
        </View>

        {/* Level */}
        <SectionLabel>Nível</SectionLabel>
        <View className="flex-row flex-wrap gap-2 mb-6">
          {LEVELS.map((level) => (
            <Chip
              key={level}
              label={LEVEL_META[level].label}
              selected={local.level === level}
              onPress={() => toggleLevel(level)}
            />
          ))}
        </View>

        {/* Date */}
        <SectionLabel>Data</SectionLabel>
        <View className="mb-6">
          <Input
            value={dateText}
            onChangeText={handleDateChange}
            error={dateError}
            placeholder="DD/MM/AAAA"
            keyboardType="number-pad"
            maxLength={10}
            leftIcon="calendar-blank-outline"
          />
        </View>

        {/* Location */}
        <SectionLabel>Localização</SectionLabel>
        <View className="mb-6">
          <Input
            value={local.location ?? ""}
            onChangeText={(text) =>
              setLocal((prev) => ({ ...prev, location: text.trim() ? text : null }))
            }
            placeholder="Ex: Botafogo"
            autoCapitalize="words"
            leftIcon="map-marker-outline"
          />
        </View>

        {/* Only available */}
        <SectionLabel>Disponibilidade</SectionLabel>
        <Pressable
          className={`flex-row items-center justify-between p-4 rounded-control border mb-6 ${
            local.onlyAvailable
              ? "bg-primary-50 border-primary-300"
              : "bg-white border-secondary-200"
          }`}
          onPress={() => setLocal((prev) => ({ ...prev, onlyAvailable: !prev.onlyAvailable }))}
          accessibilityRole="switch"
          accessibilityState={{ checked: local.onlyAvailable }}
        >
          <View className="flex-row items-center gap-3 flex-1">
            <MaterialCommunityIcons
              name="account-check-outline"
              size={20}
              color={local.onlyAvailable ? colors.primary[500] : colors.secondary[500]}
            />
            <Text
              className={`text-sm font-semibold ${
                local.onlyAvailable ? "text-primary-700" : "text-secondary-600"
              }`}
            >
              Somente com vagas disponíveis
            </Text>
          </View>
          <View
            className={`w-6 h-6 rounded-md border-2 items-center justify-center ${
              local.onlyAvailable ? "bg-primary-500 border-primary-500" : "border-secondary-300"
            }`}
          >
            {local.onlyAvailable && (
              <MaterialCommunityIcons name="check-bold" size={14} color={colors.white} />
            )}
          </View>
        </Pressable>

        {/* Near me */}
        <SectionLabel>Proximidade</SectionLabel>
        <Pressable
          className={`flex-row items-center justify-between p-4 rounded-control border ${
            local.nearMe ? "bg-primary-50 border-primary-300" : "bg-white border-secondary-200"
          }`}
          onPress={toggleNearMe}
          accessibilityRole="switch"
          accessibilityState={{ checked: local.nearMe }}
        >
          <View className="flex-row items-center gap-3 flex-1">
            <MaterialCommunityIcons
              name="crosshairs-gps"
              size={20}
              color={local.nearMe ? colors.primary[500] : colors.secondary[500]}
            />
            <Text
              className={`text-sm font-semibold ${
                local.nearMe ? "text-primary-700" : "text-secondary-600"
              }`}
            >
              Usar minha localização
            </Text>
          </View>
          <View
            className={`w-6 h-6 rounded-md border-2 items-center justify-center ${
              local.nearMe ? "bg-primary-500 border-primary-500" : "border-secondary-300"
            }`}
          >
            {local.nearMe && (
              <MaterialCommunityIcons name="check-bold" size={14} color={colors.white} />
            )}
          </View>
        </Pressable>

        {local.nearMe && permissionDenied && (
          <Text className="text-xs text-error-700 mt-2">
            Permissão de localização negada — ative nas configurações do dispositivo para buscar por
            proximidade.
          </Text>
        )}

        {local.nearMe && (
          <View className="flex-row flex-wrap gap-2 mt-3">
            {RADII_KM.map((radiusKm) => (
              <Chip
                key={radiusKm}
                label={`${radiusKm} km`}
                selected={local.radiusKm === radiusKm}
                onPress={() => setLocal((prev) => ({ ...prev, radiusKm }))}
              />
            ))}
          </View>
        )}

        <View className="mb-6" />
      </ScrollView>

      {/* Apply button */}
      <View
        className="px-5 pb-8 pt-4 bg-white border-t border-secondary-200"
        style={shadows.overlay}
      >
        <Button label={applyLabel} onPress={handleApply} size="lg" fullWidth />
      </View>
    </KeyboardAvoidingView>
  );
}
