import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";

import SquadUpLogo from "../../assets/squadup_logo.svg";
import Button from "../components/Button";
import Input from "../components/Input";
import { useAuth } from "../contexts/AuthContext";
import type { AuthStackParamList } from "../navigation/types";
import { ApiError } from "../services/api/client";
import { validateEmail } from "../utils/validation";

type LoginNavProp = NativeStackNavigationProp<AuthStackParamList, "Login">;

export default function LoginScreen() {
  const navigation = useNavigation<LoginNavProp>();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError("Informe um e-mail válido");
      valid = false;
    } else {
      setEmailError("");
    }

    if (password.length < 6) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!valid) return;

    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setPasswordError(
        err instanceof ApiError ? err.message : "Não foi possível entrar. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-secondary-50"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: 96,
          paddingBottom: 32,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <StatusBar style="dark" />
        {/* Brand header */}
        <View className="items-center mb-8">
          <SquadUpLogo width={180} height={54} />
          <Text className="mt-6 text-display text-secondary-900 text-center">
            Bem-vindo de volta
          </Text>
          <Text className="mt-2 text-body text-secondary-600 text-center">
            Entre com sua conta para continuar
          </Text>
        </View>

        <View className="gap-4">
          <Input
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            error={emailError}
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon="email-outline"
          />

          <Input
            label="Senha"
            value={password}
            onChangeText={setPassword}
            error={passwordError}
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            leftIcon="lock-outline"
          />
        </View>

        <View className="mt-8">
          <Button
            label="Entrar"
            onPress={handleLogin}
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
          />
        </View>

        <View className="mt-6 flex-row justify-center items-center">
          <Text className="text-body text-secondary-600">Não tem uma conta? </Text>
          <Pressable
            hitSlop={12}
            accessibilityRole="link"
            onPress={() => navigation.navigate("Register")}
          >
            <Text className="text-body font-semibold text-primary-500">Criar conta</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
