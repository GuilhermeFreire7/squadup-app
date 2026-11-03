/**
 * Cliente HTTP central para a API do SquadUp.
 * Backend responde erros como `{ detail: { code, message } }` (ver .status/backend-contract.md §3).
 */

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000";

export interface ApiErrorPayload {
  code: string;
  message: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, payload: ApiErrorPayload) {
    super(payload.message);
    this.name = "ApiError";
    this.status = status;
    this.code = payload.code;
  }
}

let authToken: string | null = null;

/** Chamado pelo AuthContext/storage seguro após login, refresh ou logout (Fase 13.4). */
export function setAuthToken(token: string | null): void {
  authToken = token;
}

export function getAuthToken(): string | null {
  return authToken;
}

/**
 * Chamado em um 401 para tentar renovar a sessão. Deve devolver o novo access token (já
 * aplicado via `setAuthToken`) em caso de sucesso, ou `null` se o refresh falhou (sessão
 * encerrada). Registrado pelo `AuthContext` no boot — o cliente HTTP não conhece storage
 * de token nem estado de autenticação, só delega a decisão de "tentar renovar" para quem
 * registrou o handler, evitando um import circular com `services/storage/tokenStorage.ts`.
 */
type UnauthorizedHandler = () => Promise<string | null>;
let onUnauthorized: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  onUnauthorized = handler;
}

const AUTH_PATHS_WITHOUT_RETRY = new Set([
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
]);

export type ApiRequestOptions = Omit<RequestInit, "body" | "method"> & {
  body?: unknown;
};

interface FastApiValidationError {
  loc?: unknown[];
  msg?: string;
}

/**
 * Erro de validação automático do FastAPI/Pydantic (422 antes de chegar no handler da rota —
 * ex.: senha curta demais, e-mail em formato inválido) tem um formato diferente do nosso
 * `{ detail: { code, message } }` (ver `.status/backend-contract.md` §3): `detail` vem como uma
 * lista de `{ loc, msg, type }`. Sem tratar isso à parte, esses erros caem no fallback genérico
 * e escondem a causa real (ex.: "senha deve ter pelo menos 8 caracteres") tanto do usuário
 * quanto de quem for depurar depois.
 */
function fromValidationErrors(detail: FastApiValidationError[]): ApiErrorPayload | null {
  const first = detail[0];
  if (!first?.msg) return null;
  const field = Array.isArray(first.loc) ? first.loc.at(-1) : undefined;
  return {
    code: "VALIDATION_ERROR",
    message: typeof field === "string" ? `${field}: ${first.msg}` : first.msg,
  };
}

async function parseErrorPayload(response: Response): Promise<ApiErrorPayload> {
  const json = await response.json().catch(() => null);
  if (json?.detail?.code && json?.detail?.message) {
    return json.detail as ApiErrorPayload;
  }
  if (Array.isArray(json?.detail) && json.detail.length > 0) {
    const validationError = fromValidationErrors(json.detail);
    if (validationError) return validationError;
  }
  return { code: "UNKNOWN_ERROR", message: "Erro inesperado ao comunicar com o servidor." };
}

/**
 * `true` quando `err` veio do próprio `fetch()` falhando (sem internet, DNS, conexão recusada,
 * blip momentâneo de rede móvel) — nunca de uma resposta HTTP de erro (essas viram `ApiError`).
 * Usado tanto para decidir se vale tentar de novo quanto para telas mostrarem uma mensagem
 * amigável em vez do texto cru do erro nativo (ex.: "Network request failed").
 */
export function isNetworkError(err: unknown): boolean {
  return err instanceof TypeError;
}

const NETWORK_RETRY_ATTEMPTS = 2;
const NETWORK_RETRY_DELAY_MS = 600;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Só reenvia quando o `fetch()` falha antes de qualquer resposta chegar (queda momentânea de
 * rede) — nunca em cima de uma resposta HTTP já recebida (4xx/5xx são erros de negócio reais,
 * repeti-los às cegas arrisca efeito colateral duplicado, ex. duas denúncias iguais).
 */
async function fetchWithNetworkRetry(url: string, init: RequestInit): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fetch(url, init);
    } catch (err) {
      if (attempt >= NETWORK_RETRY_ATTEMPTS || !isNetworkError(err)) throw err;
      await sleep(NETWORK_RETRY_DELAY_MS);
    }
  }
}

async function request<T>(
  method: string,
  path: string,
  options: ApiRequestOptions = {},
  isRetry = false
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  const hasBody = options.body !== undefined;
  if (hasBody) headers.set("Content-Type", "application/json");
  if (authToken) headers.set("Authorization", `Bearer ${authToken}`);

  const response = await fetchWithNetworkRetry(`${API_BASE_URL}${path}`, {
    ...options,
    method,
    headers,
    body: hasBody ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const canRetry = response.status === 401 && !isRetry && onUnauthorized;
    if (canRetry && !AUTH_PATHS_WITHOUT_RETRY.has(path)) {
      const newToken = await onUnauthorized!();
      if (newToken) {
        return request<T>(method, path, options, true);
      }
    }
    throw new ApiError(response.status, await parseErrorPayload(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const apiClient = {
  get: <T>(path: string, options?: ApiRequestOptions) => request<T>("GET", path, options),
  post: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>("POST", path, { ...options, body }),
  patch: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>("PATCH", path, { ...options, body }),
  delete: <T>(path: string, options?: ApiRequestOptions) => request<T>("DELETE", path, options),
};
