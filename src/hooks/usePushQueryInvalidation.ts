import { useQueryClient } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

import { isPushNotificationData } from "../navigation/navigationRef";
import { invalidateQueriesForPush } from "../services/pushQueryInvalidation";

/**
 * Atualiza os dados quando chega um push com o app aberto (ou quando o usuário toca nele).
 * É o que faz a tela do organizador mostrar um pedido de entrada sem precisar recarregar.
 */
export function usePushQueryInvalidation(): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handle = (notification: Notifications.Notification) => {
      const data = notification.request.content.data;
      if (isPushNotificationData(data)) {
        invalidateQueriesForPush(queryClient, data);
      }
    };
    const received = Notifications.addNotificationReceivedListener(handle);
    const tapped = Notifications.addNotificationResponseReceivedListener((response) =>
      handle(response.notification)
    );
    return () => {
      received.remove();
      tapped.remove();
    };
  }, [queryClient]);
}
