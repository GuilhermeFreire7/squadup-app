import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { Alert } from "react-native";

import { approveParticipant, closeMatch, joinMatch, leaveMatch } from "../services/api/matches";
import { queryKeys } from "../services/queryKeys";
import type { MatchDetail, ParticipationStatus, PublicUser } from "../types";
import { useMatchDetail } from "./useMatchDetail";

export interface UseMatchParticipationResult {
  match: MatchDetail | null;
  userStatus: ParticipationStatus | null;
  isLoading: boolean;
  /** Falha ao carregar a partida que não é 404 (rede, servidor): vale tentar de novo. */
  isError: boolean;
  refetch: () => void;
  join: () => Promise<void>;
  cancel: () => void;
  close: () => void;
  approve: (userId: string) => Promise<void>;
}

export function useMatchParticipation(
  matchId: string,
  currentUser: PublicUser | null
): UseMatchParticipationResult {
  const queryClient = useQueryClient();
  const { match, isLoading, isError, refetch } = useMatchDetail(matchId);

  const userStatus = useMemo((): ParticipationStatus | null => {
    if (!match || !currentUser) return null;
    const found = match.participants.find((p) => p.user.id === currentUser.id);
    if (!found || found.status === "cancelled") return null;
    return found.status;
  }, [match, currentUser]);

  const invalidate = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.match(matchId) });
    void queryClient.invalidateQueries({ queryKey: ["matches"] });
  }, [queryClient, matchId]);

  const join = useCallback(async () => {
    if (!match) return;
    try {
      await joinMatch(matchId);
      invalidate();
    } catch {
      Alert.alert("Não foi possível participar", "Tente novamente em instantes.");
    }
  }, [match, matchId, invalidate]);

  const cancel = useCallback(() => {
    Alert.alert("Cancelar participação", "Tem certeza que deseja cancelar?", [
      { text: "Não", style: "cancel" },
      {
        text: "Sim, cancelar",
        style: "destructive",
        onPress: async () => {
          try {
            await leaveMatch(matchId);
            invalidate();
          } catch {
            Alert.alert("Não foi possível cancelar", "Tente novamente em instantes.");
          }
        },
      },
    ]);
  }, [matchId, invalidate]);

  const close = useCallback(() => {
    Alert.alert("Encerrar partida", "Tem certeza que deseja encerrar esta partida?", [
      { text: "Não", style: "cancel" },
      {
        text: "Sim, encerrar",
        style: "destructive",
        onPress: async () => {
          try {
            await closeMatch(matchId);
            invalidate();
          } catch {
            Alert.alert("Não foi possível encerrar", "Tente novamente em instantes.");
          }
        },
      },
    ]);
  }, [matchId, invalidate]);

  const approve = useCallback(
    async (userId: string) => {
      try {
        await approveParticipant(matchId, userId);
        invalidate();
      } catch {
        Alert.alert("Não foi possível aprovar", "Tente novamente em instantes.");
      }
    },
    [matchId, invalidate]
  );

  return { match, userStatus, isLoading, isError, refetch, join, cancel, close, approve };
}
