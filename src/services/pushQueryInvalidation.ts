import type { QueryClient } from "@tanstack/react-query";

import type { PushNotificationData } from "../navigation/navigationRef";
import { queryKeys } from "./queryKeys";

/**
 * Um push avisa que algo mudou no servidor (pedido de entrada, aprovação, encerramento, mensagem).
 * Em vez de esperar o cache vencer, as consultas afetadas são invalidadas: as telas abertas buscam
 * de novo na hora, e as fechadas buscam ao abrir.
 */
export function invalidateQueriesForPush(
  queryClient: QueryClient,
  data: PushNotificationData
): void {
  void queryClient.invalidateQueries({ queryKey: queryKeys.match(data.matchId) });
  void queryClient.invalidateQueries({ queryKey: ["matches"] });
  if (data.type === "new_message") {
    void queryClient.invalidateQueries({ queryKey: queryKeys.messages(data.matchId) });
  }
}
