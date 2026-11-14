import { NavigationContainer } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import SlowServerNotice from "../components/SlowServerNotice";
import { useAuth } from "../contexts/AuthContext";
import { usePushQueryInvalidation } from "../hooks/usePushQueryInvalidation";
import { useSlowRequestHint } from "../hooks/useSlowRequestHint";
import { warmUpServer } from "../services/api/health";
import { colors } from "../theme";
import AppNavigator from "./AppNavigator";
import AuthNavigator from "./AuthNavigator";
import {
  isPushNotificationData,
  navigateFromPushNotification,
  navigationRef,
} from "./navigationRef";

function BootScreen() {
  // A tela de abertura fica visível enquanto a sessão salva é restaurada (GET /users/me), que é
  // a primeira requisição do app e a que mais sofre com o servidor hibernado.
  const isSlow = useSlowRequestHint(true);
  return (
    <View className="flex-1 items-center justify-center bg-secondary-900 px-8">
      <ActivityIndicator size="large" color={colors.primary[500]} />
      <SlowServerNotice visible={isSlow} tone="dark" />
    </View>
  );
}

/** Registrado uma única vez no root do app — funciona independente do usuário estar autenticado. */
function usePushNotificationNavigation() {
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (isPushNotificationData(data)) {
        navigateFromPushNotification(data);
      }
    });
    return () => subscription.remove();
  }, []);
}

export default function RootNavigator() {
  const { isAuthenticated, isBooting } = useAuth();
  usePushNotificationNavigation();
  usePushQueryInvalidation();
  useEffect(() => warmUpServer(), []);

  if (isBooting) {
    return <BootScreen />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
