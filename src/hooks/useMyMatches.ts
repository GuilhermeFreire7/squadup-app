import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { toMyMatch } from "../services/adapters/match";
import { fetchMyMatches } from "../services/api/users";
import { queryKeys } from "../services/queryKeys";
import type { MyMatch } from "../types";

/**
 * Consulta periódica com o app aberto (pausa em segundo plano). Mantém o contador de pedidos da
 * aba atualizado mesmo sem push, por exemplo quando o usuário negou a permissão de notificações.
 */
export const MY_MATCHES_POLL_INTERVAL_MS = 30_000;

export interface UseMyMatchesResult {
  /** Próximas partidas, da mais perto para a mais distante (ordem da API). */
  upcoming: MyMatch[];
  /** Encerradas, canceladas ou com data passada, da mais recente para a mais antiga. */
  past: MyMatch[];
  /** Pedidos de entrada esperando aprovação, somados nas próximas partidas que o usuário organiza. */
  pendingRequestsTotal: number;
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<unknown>;
}

export function useMyMatches(): UseMyMatchesResult {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.myMatches(),
    queryFn: async () => (await fetchMyMatches()).map(toMyMatch),
    refetchInterval: MY_MATCHES_POLL_INTERVAL_MS,
  });

  return useMemo(() => {
    const matches = data ?? [];
    const upcoming = matches.filter((match) => !match.isPast);
    return {
      upcoming,
      past: matches.filter((match) => match.isPast),
      pendingRequestsTotal: upcoming.reduce((sum, match) => sum + match.pendingRequests, 0),
      isLoading,
      isError,
      refetch: () => refetch(),
    };
  }, [data, isLoading, isError, refetch]);
}
