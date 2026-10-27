import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useMemo } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

import Avatar from "../components/Avatar";
import EmptyState from "../components/EmptyState";
import Header from "../components/Header";
import { useReports } from "../hooks/useReports";
import type { AppRootStackParamList } from "../navigation/types";
import { colors, shadows } from "../theme";
import type { Report } from "../types";
import { REASON_LABELS, STATUS_COLORS, STATUS_LABELS } from "../utils/reportLabels";

type Nav = NativeStackNavigationProp<AppRootStackParamList>;

function formatReportDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("pt-BR");
}

export default function AdminDashboardScreen() {
  const navigation = useNavigation<Nav>();
  const { reports } = useReports();

  const sortedReports = useMemo(
    () =>
      [...reports].sort((a, b) => {
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (a.status !== "pending" && b.status === "pending") return 1;
        return b.createdAt.localeCompare(a.createdAt);
      }),
    [reports]
  );
  const pendingCount = reports.filter((r) => r.status === "pending").length;

  let pendingText = "Nenhuma denúncia pendente";
  if (pendingCount === 1) pendingText = "1 denúncia pendente";
  else if (pendingCount > 1) pendingText = `${pendingCount} denúncias pendentes`;

  function renderItem({ item }: { item: Report }) {
    return (
      <Pressable
        onPress={() => navigation.navigate("ReportDetail", { reportId: item.id })}
        accessibilityRole="button"
        accessibilityLabel={`Denúncia contra ${item.reportedUser.name}`}
        className="bg-white rounded-2xl border border-secondary-100 p-4 mb-3 flex-row items-center gap-3 active:opacity-90"
        style={shadows.card}
      >
        <Avatar name={item.reportedUser.name} photoUrl={item.reportedUser.photoUrl} size="md" />
        <View className="flex-1">
          <Text className="text-sm font-bold text-secondary-900" numberOfLines={1}>
            {item.reportedUser.name}
          </Text>
          <Text className="text-xs text-secondary-500 mt-0.5" numberOfLines={1}>
            {REASON_LABELS[item.reason]} · {formatReportDate(item.createdAt)}
          </Text>
        </View>
        <View className={`self-start rounded-full px-3 py-1 ${STATUS_COLORS[item.status]}`}>
          <Text className="text-xs font-semibold">{STATUS_LABELS[item.status]}</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <View className="flex-1 bg-secondary-50">
      <Header title="Painel administrativo" onBack={() => navigation.goBack()} />

      <View className="flex-row items-center gap-2 px-5 pt-5 pb-3">
        <MaterialCommunityIcons
          name="shield-alert-outline"
          size={16}
          color={pendingCount > 0 ? colors.warning : colors.secondary[500]}
        />
        <Text className="text-sm font-medium text-secondary-500">{pendingText}</Text>
      </View>

      <FlatList
        data={sortedReports}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20, paddingTop: 4, flexGrow: 1 }}
        ListEmptyComponent={
          <EmptyState
            icon="shield-check-outline"
            title="Sem denúncias"
            description="Nada para moderar por aqui."
          />
        }
      />
    </View>
  );
}
