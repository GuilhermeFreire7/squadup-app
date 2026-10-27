import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import LoginScreen from "../screens/LoginScreen";
import ProfileSetupScreen from "../screens/ProfileSetupScreen";
import RegisterScreen from "../screens/RegisterScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import { colors } from "../theme";
import type { AuthStackParamList } from "./types";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: true,
          title: "",
          headerTransparent: true,
          headerTintColor: colors.primary[500],
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerShown: true,
          title: "",
          headerTransparent: true,
          headerTintColor: colors.primary[500],
        }}
      />
      <Stack.Screen
        name="ProfileSetup"
        component={ProfileSetupScreen}
        options={{
          headerShown: true,
          title: "Configurar perfil",
          headerTintColor: colors.primary[500],
          headerTitleStyle: { color: colors.secondary[900] },
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}
