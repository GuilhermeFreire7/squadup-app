import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { CompositeNavigationProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useMemo } from "react";
import { RefreshControl, SectionList, Text, View } from "react-native";

import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import Header from "../components/Header";
import MatchCard from "../components/MatchCard";
import MyMatchRole from "../components/MyMatchRole";
import { MatchCardSkeleton } from "../components/Skeleton";
import { useMyMatches } from "../hooks/useMyMatches";
import { usePullToRefresh } from "../hooks/usePullToRefresh";
import { useRefreshOnFocus } from "../hooks/useRefreshOnFocus";
import type { AppRootStackParamList, AppTabParamList } from "../navigation/types";
import { colors } from "../theme";
import type { MyMatch } from "../types";

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<AppTabParamList, "MyMatches">,
  NativeStackNavigationProp<AppRootStackParamList>
>;

export default function MyMatchesScreen() {
  const navigation = useNavigation<Nav>();
  const { upcoming, past, isLoading, isError, refetch } = useMyMatches();
  const { refreshing, onRefresh } = usePullToRefresh(refetch);
  useRefreshOnFocus(refetch);

  const sections = useMemo(
    () =>
      [
        { title: "Próximas", data: upcoming },
        { title: "Anteriores", data: past },
      ].filter((section) => section.data.length > 0),
    [upcoming, past]
  );

  let content: React.ReactNode;
  if (isLoading) {
    content = (
      <View className="p-5 gap-3">
        <MatchCardSkeleton />
        <MatchCardSkeleton />
      </View>
    );
  } else if (isError && sections.length === 0) {
    content = (
      <ErrorState title="Não foi possível carregar suas partidas" onRetry={() => void refetch()} />
    );
  } else {
    content = (
      <SectionList<MyMatch>
        testID="my-matches-list"
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{ padding: 20, gap: 12, flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary[500]]}
            tintColor={colors.primary[500]}
          />
        }
        renderSectionHeader={({ section }) => (
          <Text className="text-overline uppercase text-secondary-500 mt-2">{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <View>
            <MyMatchRole match={item} />
            <MatchCard
              match={item}
              onPress={() => navigation.navigate("MatchDetail", { matchId: item.id })}
            />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="calendar-blank-outline"
            title="Nenhuma partida por aqui"
            description="As partidas que você criar ou de que participar aparecem nesta aba."
            action={
              <Button
                label="Explorar partidas"
                icon="magnify"
                onPress={() => navigation.navigate("Home")}
              />
            }
          />
        }
      />
    );
  }

  return (
    <View className="flex-1 bg-secondary-50">
      <Header
        variant="large"
        title="Minhas partidas"
        subtitle="As que você organiza e as de que participa"
      />
      {content}
    </View>
  );
}
