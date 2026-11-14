import { createNavigationContainerRef } from "@react-navigation/native";

import type { AppRootStackParamList } from "./types";

export const navigationRef = createNavigationContainerRef<AppRootStackParamList>();

/** Contrato de `data` definido pelo backend (`notification_service.py`): `{ type, matchId }`. */
export interface PushNotificationData {
  type:
    | "new_message"
    | "match_closed"
    | "participation_approved"
    | "join_request"
    | "participant_joined";
  matchId: string;
}

export function navigateFromPushNotification(data: PushNotificationData): void {
  if (!navigationRef.isReady()) return;

  switch (data.type) {
    case "new_message":
      navigationRef.navigate("MatchChat", { matchId: data.matchId });
      return;
    case "match_closed":
    case "participation_approved":
    case "join_request":
    case "participant_joined":
      navigationRef.navigate("MatchDetail", { matchId: data.matchId });
  }
}
