import { useQuery } from "@tanstack/react-query";

import { toMatchDetail } from "../services/adapters/match";
import { ApiError } from "../services/api/client";
import { fetchMatchDetail } from "../services/api/matches";
import { queryKeys } from "../services/queryKeys";
import type { MatchDetail } from "../types";

/** Intervalo do polling com o detalhe aberto: pega pedidos de entrada e mudanças de vaga. */
export const MATCH_DETAIL_POLL_INTERVAL_MS = 10_000;

export interface UseMatchDetailOptions {
  /** Refaz a busca a cada `pollIntervalMs`. Ligar só com a tela de detalhe em foco. */
  poll?: boolean;
  pollIntervalMs?: number;
}

export interface UseMatchDetailResult {
  match: MatchDetail | null;
  isLoading: boolean;
  /** A partida não existe (404). Diferente de `isError`, não adianta tentar de novo. */
  isNotFound: boolean;
  /** Falha que pode ser temporária (rede, servidor): vale oferecer "tentar de novo". */
  isError: boolean;
  refetch: () => Promise<unknown>;
}

export function useMatchDetail(
  matchId: string,
  { poll = false, pollIntervalMs = MATCH_DETAIL_POLL_INTERVAL_MS }: UseMatchDetailOptions = {}
): UseMatchDetailResult {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.match(matchId),
    queryFn: async () => toMatchDetail(await fetchMatchDetail(matchId)),
    // Outros usuários mudam a partida (entram, pedem para entrar, saem): reabrir sempre busca.
    staleTime: 0,
    refetchInterval: poll ? pollIntervalMs : false,
  });

  const isNotFound = error instanceof ApiError && error.status === 404;

  return {
    match: data ?? null,
    isLoading,
    isNotFound,
    isError: error != null && !isNotFound,
    refetch: () => refetch(),
  };
}
