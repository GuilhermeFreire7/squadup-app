import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import SquadUpLogo from "../../assets/squadup_logo_dark.svg";
import Button from "../components/Button";
import type { AuthStackParamList } from "../navigation/types";
import { SPORT_META } from "../theme";
import type { Sport } from "../types";

type WelcomeNavProp = NativeStackNavigationProp<AuthStackParamList, "Welcome">;

const SPORTS: Sport[] = ["football", "basketball", "volleyball", "tennis"];

const STATS = [
  { value: "10k+", label: "Jogadores" },
  { value: "500+", label: "Partidas/mês" },
  { value: "6", label: "Esportes" },
] as const;

export default function WelcomeScreen() {
  const navigation = useNavigation<WelcomeNavProp>();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-secondary-900">
      {/* Glow decorativo atrás do hero */}
      <View
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary-500/10"
        pointerEvents="none"
      />
      <View
        className="absolute top-40 -left-32 w-64 h-64 rounded-full bg-primary-500/5"
        pointerEvents="none"
      />

      {/* Hero section */}
      <View
        className="flex-1 items-center justify-center px-8"
        style={{ paddingTop: insets.top + 24 }}
      >
        <View className="mb-7">
          <SquadUpLogo width={200} height={64} />
        </View>

        <Text className="text-heading text-white mb-3">Conecte-se. Jogue. Repita.</Text>

        <Text className="text-body text-secondary-400 text-center">
          Encontre partidas, forme grupos e pratique{"\n"}o esporte que você ama.
        </Text>

        {/* Sport tiles — cores de categoria */}
        <View className="flex-row mt-10 gap-3">
          {SPORTS.map((sport) => {
            const meta = SPORT_META[sport];
            return (
              <View key={sport} className="items-center gap-2">
                <View className="w-14 h-14 rounded-control bg-secondary-800 items-center justify-center border border-secondary-700">
                  <MaterialCommunityIcons name={meta.icon} size={26} color={meta.color} />
                </View>
                <Text className="text-caption text-secondary-400">{meta.label}</Text>
              </View>
            );
          })}
        </View>

        {/* Stats row */}
        <View className="flex-row mt-10 gap-6">
          {STATS.map((stat, index) => (
            <React.Fragment key={stat.label}>
              {index > 0 && <View className="w-px bg-secondary-700" />}
              <View className="items-center">
                <Text className="text-title text-white">{stat.value}</Text>
                <Text className="text-caption text-secondary-400 mt-0.5">{stat.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* CTA section */}
      <View
        className="px-5 pt-6 border-t border-secondary-800"
        style={{ paddingBottom: Math.max(insets.bottom, 32) }}
      >
        <Button
          label="Criar conta"
          onPress={() => navigation.navigate("Register")}
          variant="primary"
          size="lg"
          fullWidth
        />
        <View className="h-3" />
        <Button
          label="Já tenho conta"
          onPress={() => navigation.navigate("Login")}
          variant="outline"
          size="lg"
          fullWidth
        />
      </View>
    </View>
  );
}
