import { useQuery } from "@tanstack/react-query";

import { toMatchDetail } from "../services/adapters/match";
import { ApiError } from "../services/api/client";
import { fetchMatchDetail } from "../services/api/matches";
import { queryKeys } from "../services/queryKeys";
import type { MatchDetail } from "../types";

export interface UseMatchDetailResult {
  match: MatchDetail | null;
  isLoading: boolean;
  /** A partida não existe (404). Diferente de `isError`, não adianta tentar de novo. */
  isNotFound: boolean;
  /** Falha que pode ser temporária (rede, servidor): vale oferecer "tentar de novo". */
  isError: boolean;
  refetch: () => void;
}

export function useMatchDetail(matchId: string): UseMatchDetailResult {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.match(matchId),
    queryFn: async () => toMatchDetail(await fetchMatchDetail(matchId)),
  });

  const isNotFound = error instanceof ApiError && error.status === 404;

  return {
    match: data ?? null,
    isLoading,
    isNotFound,
    isError: error != null && !isNotFound,
    refetch: () => void refetch(),
  };
}
