import { createNavigationContainerRef } from "@react-navigation/native";

import type { AppRootStackParamList } from "./types";

export const navigationRef = createNavigationContainerRef<AppRootStackParamList>();

/** Contrato de `data` definido pelo backend (`notification_service.py`): `{ type, matchId }`. */
export interface PushNotificationData {
  type: "new_message" | "match_closed" | "participation_approved";
  matchId: string;
}

export function isPushNotificationData(data: unknown): data is PushNotificationData {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof (data as Record<string, unknown>).type === "string" &&
    typeof (data as Record<string, unknown>).matchId === "string"
  );
}

export function navigateFromPushNotification(data: PushNotificationData): void {
  if (!navigationRef.isReady()) return;

  switch (data.type) {
    case "new_message":
      navigationRef.navigate("MatchChat", { matchId: data.matchId });
      return;
    case "match_closed":
    case "participation_approved":
      navigationRef.navigate("MatchDetail", { matchId: data.matchId });
  }
}
