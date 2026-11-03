import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

import { toMessage } from "../services/adapters/message";
import { fetchMessages, postMessage } from "../services/api/messages";
import { queryKeys } from "../services/queryKeys";
import type { Message } from "../types";

export const MESSAGES_PAGE_SIZE = 30;
/** Intervalo do polling enquanto o chat está aberto (o app ainda não usa o WebSocket da API). */
export const CHAT_POLL_INTERVAL_MS = 5_000;

export interface UseMessagesOptions {
  /** Refaz a busca a cada `pollIntervalMs`. Ligar só com a tela de chat em foco. */
  poll?: boolean;
  pollIntervalMs?: number;
}

export interface UseMessagesResult {
  messages: Message[];
  isLoading: boolean;
  isFetchingMore: boolean;
  hasMore: boolean;
  loadMore: () => void;
  sendMessage: (text: string) => void;
}

export function useMessages(
  matchId: string,
  { poll = false, pollIntervalMs = CHAT_POLL_INTERVAL_MS }: UseMessagesOptions = {}
): UseMessagesResult {
  const queryClient = useQueryClient();

  // `order=desc`: a página 0 traz as mensagens mais recentes e cada página seguinte (via `skip`)
  // traz as mais antigas, que é como a FlatList invertida do chat carrega ao rolar para cima.
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: queryKeys.messages(matchId),
    queryFn: async ({ pageParam }) => {
      const apiMessages = await fetchMessages(matchId, {
        skip: pageParam,
        limit: MESSAGES_PAGE_SIZE,
        order: "desc",
      });
      return apiMessages.map(toMessage);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < MESSAGES_PAGE_SIZE ? undefined : allPages.length * MESSAGES_PAGE_SIZE,
    // Mensagens mudam o tempo todo: sem cache "fresco", reabrir o chat sempre busca de novo.
    staleTime: 0,
    refetchInterval: poll ? pollIntervalMs : false,
  });

  // As páginas já vêm da mais recente para a mais antiga, que é a ordem da FlatList invertida
  // (item 0 = embaixo, mensagem mais nova). Se chegam mensagens novas entre o refetch de uma
  // página e o da seguinte, os offsets deslocam e uma mensagem pode aparecer em duas páginas:
  // o filtro por `id` evita a duplicata.
  const messages = useMemo(() => {
    const seen = new Set<string>();
    const result: Message[] = [];
    for (const message of data?.pages.flat() ?? []) {
      if (seen.has(message.id)) continue;
      seen.add(message.id);
      result.push(message);
    }
    return result;
  }, [data]);

  const { mutate: sendMessage } = useMutation({
    mutationFn: (text: string) => postMessage(matchId, text),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.messages(matchId) });
    },
  });

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    messages,
    isLoading,
    isFetchingMore: isFetchingNextPage,
    hasMore: hasNextPage ?? false,
    loadMore,
    sendMessage: (text: string) => {
      const trimmed = text.trim();
      if (trimmed) sendMessage(trimmed);
    },
  };
}
