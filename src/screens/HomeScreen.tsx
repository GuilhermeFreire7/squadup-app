import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { FlatList, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Avatar from "../components/Avatar";
import EmptyState from "../components/EmptyState";
import MatchCard from "../components/MatchCard";
import { MatchCardSkeleton } from "../components/Skeleton";
import { useAuth } from "../contexts/AuthContext";
import { useMatchFiltersContext } from "../contexts/MatchFiltersContext";
import { useMatchesContext } from "../contexts/MatchesContext";
import type { AppRootStackParamList } from "../navigation/types";
import { useMatchFilters } from "../hooks/useMatchFilters";
import { colors, SPORT_META } from "../theme";
import type { Sport } from "../types";

type Nav = NativeStackNavigationProp<AppRootStackParamList>;

const QUICK_SPORTS: Sport[] = ["football", "futsal", "volleyball", "basketball", "tennis"];

function SportQuickFilter({
  sport,
  selected,
  onPress,
}: Readonly<{ sport: Sport | null; selected: boolean; onPress: () => void }>) {
  const meta = sport ? SPORT_META[sport] : null;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={meta ? meta.label : "Todos os esportes"}
      hitSlop={4}
      className={`flex-row items-center gap-1.5 px-4 h-10 rounded-full ${
        selected
          ? "bg-primary-500 active:bg-primary-600"
          : "bg-secondary-800 active:bg-secondary-700"
      }`}
    >
      {meta ? (
        <MaterialCommunityIcons
          name={meta.icon}
          size={15}
          color={selected ? colors.white : colors.secondary[400]}
        />
      ) : null}
      <Text className={`text-label ${selected ? "text-white" : "text-secondary-300"}`}>
        {meta ? meta.label : "Todos"}
      </Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState("");
  const { user } = useAuth();
  const { filters, setFilters, activeFilterCount } = useMatchFiltersContext();
  const { matches, isLoading } = useMatchesContext();
  const filteredMatches = useMatchFilters(matches, searchText);

  const firstName = user?.name.split(" ")[0] ?? "";

  function selectSport(sport: Sport | null) {
    setFilters({ ...filters, sport });
  }

  return (
    <View className="flex-1 bg-secondary-50">
      {/* Hero header */}
      <View className="bg-secondary-900 px-5 pb-5" style={{ paddingTop: insets.top + 12 }}>
        <View className="flex-row items-center justify-between mb-5">
          <View>
            <Text className="text-secondary-400 text-body-sm">Bem-vindo de volta,</Text>
            <Text className="text-white text-title">{firstName}</Text>
          </View>
          <Avatar name={user?.name ?? ""} photoUrl={user?.photoUrl} size="md" ring />
        </View>

        {/* Search + filters */}
        <View className="flex-row gap-2">
          <View className="flex-1 flex-row items-center bg-secondary-800 rounded-control px-4 h-12 gap-2">
            <MaterialCommunityIcons name="magnify" size={20} color={colors.secondary[400]} />
            <TextInput
              className="flex-1 text-white text-body"
              placeholder="Buscar partidas..."
              placeholderTextColor={colors.secondary[400]}
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="search"
              accessibilityLabel="Buscar partidas"
            />
            {searchText.length > 0 && (
              <Pressable
                onPress={() => setSearchText("")}
                hitSlop={14}
                accessibilityLabel="Limpar busca"
                accessibilityRole="button"
              >
                <MaterialCommunityIcons
                  name="close-circle"
                  size={16}
                  color={colors.secondary[400]}
                />
              </Pressable>
            )}
          </View>

          <Pressable
            className="h-12 w-12 items-center justify-center bg-secondary-800 rounded-control active:bg-secondary-700"
            onPress={() => navigation.navigate("Filters")}
            accessibilityLabel="Abrir filtros"
            accessibilityRole="button"
          >
            <MaterialCommunityIcons
              name="tune-variant"
              size={20}
              color={activeFilterCount > 0 ? colors.primary[400] : colors.secondary[400]}
            />
            {activeFilterCount > 0 && (
              <View className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-primary-500 rounded-full items-center justify-center border-2 border-secondary-900">
                <Text className="text-white text-caption font-bold">{activeFilterCount}</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Sport quick filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-3 -mx-5"
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
        >
          <SportQuickFilter
            sport={null}
            selected={filters.sport === null}
            onPress={() => selectSport(null)}
          />
          {QUICK_SPORTS.map((sport) => (
            <SportQuickFilter
              key={sport}
              sport={sport}
              selected={filters.sport === sport}
              onPress={() => selectSport(filters.sport === sport ? null : sport)}
            />
          ))}
        </ScrollView>
      </View>

      {/* List */}
      {isLoading ? (
        <View className="p-5 gap-3">
          <MatchCardSkeleton />
          <MatchCardSkeleton />
          <MatchCardSkeleton />
        </View>
      ) : (
        <FlatList
          data={filteredMatches}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MatchCard
              match={item}
              onPress={() => navigation.navigate("MatchDetail", { matchId: item.id })}
            />
          )}
          ListHeaderComponent={
            <View className="flex-row items-baseline justify-between">
              <Text className="text-heading text-secondary-900">Partidas próximas</Text>
              <Text className="text-caption text-secondary-500">
                {filteredMatches.length}{" "}
                {filteredMatches.length === 1 ? "encontrada" : "encontradas"}
              </Text>
            </View>
          }
          contentContainerStyle={{ padding: 20, gap: 12 }}
          ListEmptyComponent={
            <EmptyState
              icon="calendar-search"
              title="Nenhuma partida encontrada"
              description="Tente ajustar os filtros ou buscar por outro termo."
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
