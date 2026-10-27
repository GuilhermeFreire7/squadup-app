import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useMemo } from "react";
import { Alert, ScrollView, Text, View } from "react-native";

import Avatar from "../components/Avatar";
import Button from "../components/Button";
import Header from "../components/Header";
import SectionCard from "../components/SectionCard";
import { useReports, useUpdateReportAction } from "../hooks/useReports";
import type { AppRootStackParamList } from "../navigation/types";
import type { ReportAction } from "../services/api/reports";
import { REASON_LABELS, STATUS_COLORS, STATUS_LABELS } from "../utils/reportLabels";

type Nav = NativeStackNavigationProp<AppRootStackParamList>;
type Route = RouteProp<AppRootStackParamList, "ReportDetail">;

const ACTIONS: ReadonlyArray<{ action: ReportAction; label: string; message: string }> = [
  {
    action: "archive",
    label: "Arquivar denúncia",
    message: "A denúncia será arquivada sem punição ao usuário.",
  },
  {
    action: "warn",
    label: "Advertir usuário",
    message: "O usuário receberá uma advertência formal.",
  },
  {
    action: "ban",
    label: "Banir usuário",
    message: "O usuário será banido da plataforma.",
  },
];

function formatReportDateTime(isoString: string): string {
  const date = new Date(isoString);
  return `${date.toLocaleDateString("pt-BR")} às ${date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export default function ReportDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { reportId } = route.params;
  const { reports } = useReports();
  const { updateReportAction } = useUpdateReportAction();

  const report = useMemo(() => reports.find((r) => r.id === reportId) ?? null, [reports, reportId]);

  if (!report) {
    return (
      <View className="flex-1 items-center justify-center bg-secondary-50">
        <Text className="text-secondary-500">Denúncia não encontrada.</Text>
      </View>
    );
  }

  function handleAction(action: ReportAction, label: string, message: string) {
    Alert.alert(label, message, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Confirmar",
        style: action === "ban" ? "destructive" : "default",
        onPress: () => {
          updateReportAction(reportId, action, { onSuccess: () => navigation.goBack() });
        },
      },
    ]);
  }

  return (
    <View className="flex-1 bg-secondary-50">
      <Header title="Detalhes da denúncia" onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
      >
        <View className="gap-4">
          <SectionCard title="Usuário denunciado">
            <View className="flex-row items-center gap-3">
              <Avatar
                name={report.reportedUser.name}
                photoUrl={report.reportedUser.photoUrl}
                size="md"
              />
              <Text className="text-base font-bold text-secondary-900">
                {report.reportedUser.name}
              </Text>
            </View>
          </SectionCard>

          <SectionCard title="Denunciado por">
            <View className="flex-row items-center gap-3">
              <Avatar
                name={report.reporterUser.name}
                photoUrl={report.reporterUser.photoUrl}
                size="sm"
              />
              <Text className="text-sm font-medium text-secondary-900">
                {report.reporterUser.name}
              </Text>
            </View>
          </SectionCard>

          <SectionCard title="Motivo">
            <Text className="text-sm font-medium text-secondary-900">
              {REASON_LABELS[report.reason]}
            </Text>
          </SectionCard>

          {report.description ? (
            <SectionCard title="Descrição">
              <Text className="text-sm text-secondary-600 leading-5">{report.description}</Text>
            </SectionCard>
          ) : null}

          {report.match ? (
            <SectionCard title="Partida relacionada">
              <Text className="text-sm font-medium text-secondary-900">{report.match.title}</Text>
            </SectionCard>
          ) : null}

          <SectionCard title="Enviada em">
            <Text className="text-sm font-medium text-secondary-900">
              {formatReportDateTime(report.createdAt)}
            </Text>
          </SectionCard>

          <View className="flex-row items-center gap-2">
            <Text className="text-sm font-bold text-secondary-900">Status atual</Text>
            <View className={`self-start rounded-full px-3 py-1 ${STATUS_COLORS[report.status]}`}>
              <Text className="text-xs font-semibold">{STATUS_LABELS[report.status]}</Text>
            </View>
          </View>

          <View className="gap-3 mt-1">
            <Text className="text-sm font-bold text-secondary-900">Ações administrativas</Text>
            {ACTIONS.map(({ action, label, message }) => (
              <Button
                key={action}
                label={label}
                onPress={() => handleAction(action, label, message)}
                variant={action === "ban" ? "danger" : "secondary"}
                fullWidth
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
