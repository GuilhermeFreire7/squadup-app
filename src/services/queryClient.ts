import { focusManager, QueryClient } from "@tanstack/react-query";
import { AppState, type AppStateStatus, Platform } from "react-native";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60_000,
    },
  },
});

/**
 * No React Native, o React Query não sabe quando o app volta do segundo plano (no web ele usa o
 * foco da janela). Ligando o `focusManager` ao `AppState`: ao voltar para o app, as consultas
 * velhas são refeitas (ex.: partidas novas na Home), e o polling do chat pausa em segundo plano.
 */
export function subscribeAppStateFocus(handleFocus: (focused: boolean) => void): () => void {
  const subscription = AppState.addEventListener("change", (status: AppStateStatus) => {
    handleFocus(status === "active");
  });
  return () => subscription.remove();
}

if (Platform.OS !== "web") {
  focusManager.setEventListener(subscribeAppStateFocus);
}
