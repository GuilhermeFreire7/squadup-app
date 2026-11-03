import type { ApiMessage } from "../adapters/types";
import { apiClient } from "./client";

export interface MessagesQueryOptions {
  skip?: number;
  limit?: number;
  /** `desc` traz as mais recentes primeiro (backend padrão: `asc`). */
  order?: "asc" | "desc";
}

function buildQueryString({ skip, limit, order }: MessagesQueryOptions): string {
  const params = new URLSearchParams();
  if (skip) params.set("skip", String(skip));
  if (limit) params.set("limit", String(limit));
  if (order) params.set("order", order);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function fetchMessages(
  matchId: string,
  options: MessagesQueryOptions = {}
): Promise<ApiMessage[]> {
  return apiClient.get<ApiMessage[]>(`/matches/${matchId}/messages${buildQueryString(options)}`);
}

export async function postMessage(matchId: string, text: string): Promise<ApiMessage> {
  return apiClient.post<ApiMessage>(`/matches/${matchId}/messages`, { text });
}
