import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useRef, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";

import EmptyState from "../components/EmptyState";
import Header from "../components/Header";
import MatchCard from "../components/MatchCard";
import { useMatchFiltersContext } from "../contexts/MatchFiltersContext";
import { useMatchesContext } from "../contexts/MatchesContext";
import { useMatchFilters } from "../hooks/useMatchFilters";
import type { AppRootStackParamList } from "../navigation/types";
import { colors } from "../theme";

type Nav = NativeStackNavigationProp<AppRootStackParamList>;

export default function SearchScreen() {
  const navigation = useNavigation<Nav>();
  const [searchText, setSearchText] = useState("");
  const { activeFilterCount } = useMatchFiltersContext();
  const { matches } = useMatchesContext();
  const filteredMatches = useMatchFilters(matches, searchText);
  const inputRef = useRef<TextInput>(null);

  return (
    <View className="flex-1 bg-secondary-50">
      <Header variant="large" title="Busca">
        <View className="flex-row gap-2.5">
          <View className="flex-1 flex-row items-center bg-secondary-800 rounded-control px-4 h-12 gap-2.5">
            <MaterialCommunityIcons name="magnify" size={20} color={colors.secondary[400]} />
            <TextInput
              ref={inputRef}
              className="flex-1 text-white text-sm"
              placeholder="Esporte, local, organizador..."
              placeholderTextColor={colors.secondary[400]}
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="search"
              autoFocus
              accessibilityLabel="Campo de busca"
            />
            {searchText.length > 0 && (
              <Pressable onPress={() => setSearchText("")} accessibilityLabel="Limpar busca">
                <MaterialCommunityIcons
                  name="close-circle"
                  size={16}
                  color={colors.secondary[400]}
                />
              </Pressable>
            )}
          </View>

          <Pressable
            className="h-12 w-12 items-center justify-center bg-secondary-800 rounded-control"
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
              <View className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 rounded-full items-center justify-center">
                <Text className="text-white text-xs font-bold">{activeFilterCount}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </Header>

      {/* Results count */}
      {searchText.length > 0 && (
        <View className="px-5 pt-4">
          <Text className="text-xs font-semibold text-secondary-500 uppercase tracking-wide">
            {filteredMatches.length} resultado{filteredMatches.length === 1 ? "" : "s"}
          </Text>
        </View>
      )}

      <FlatList
        data={filteredMatches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MatchCard
            match={item}
            onPress={() => navigation.navigate("MatchDetail", { matchId: item.id })}
          />
        )}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListEmptyComponent={
          searchText.length === 0 ? (
            <EmptyState
              icon="magnify"
              title="Digite para buscar"
              description="Encontre partidas por esporte, local ou nome do organizador."
            />
          ) : (
            <EmptyState
              icon="magnify-close"
              title="Nenhum resultado"
              description={`Não encontramos partidas para "${searchText}".`}
            />
          )
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}
