import { useCallback, useState } from "react";

export interface UsePullToRefreshResult {
  refreshing: boolean;
  onRefresh: () => Promise<void>;
}

/**
 * Estado do "puxar para atualizar". Só o gesto mostra o indicador: as buscas em segundo plano
 * (polling, volta do app, push recebido) atualizam a tela sem piscar o spinner.
 */
export function usePullToRefresh(refetch: () => Promise<unknown>): UsePullToRefreshResult {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);
  return { refreshing, onRefresh };
}
