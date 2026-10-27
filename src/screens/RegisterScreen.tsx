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
import { calculateAge, formatDateInput, parseBirthDate } from "../utils/date";
import { validateEmail } from "../utils/validation";

const MINIMUM_AGE = 18;

type RegisterNavProp = NativeStackNavigationProp<AuthStackParamList, "Register">;

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterNavProp>();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [birthDateError, setBirthDateError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    let valid = true;

    if (name.trim().length < 2) {
      setNameError("Informe seu nome completo");
      valid = false;
    } else {
      setNameError("");
    }

    if (!validateEmail(email)) {
      setEmailError("Informe um e-mail válido");
      valid = false;
    } else {
      setEmailError("");
    }

    if (password.length < 8) {
      setPasswordError("A senha deve ter pelo menos 8 caracteres");
      valid = false;
    } else {
      setPasswordError("");
    }

    const parsedBirthDate = parseBirthDate(birthDate);
    let age = 0;
    if (!parsedBirthDate) {
      setBirthDateError("Informe uma data de nascimento válida (DD/MM/AAAA)");
      valid = false;
    } else {
      age = calculateAge(parsedBirthDate);
      if (age < MINIMUM_AGE) {
        setBirthDateError(`Você precisa ter pelo menos ${MINIMUM_AGE} anos para se cadastrar`);
        valid = false;
      } else {
        setBirthDateError("");
      }
    }

    if (!valid) return;

    setLoading(true);
    setTimeout(() => {
      register(name.trim(), email, password, age);
      setLoading(false);
      navigation.navigate("ProfileSetup");
    }, 600);
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
          <Text className="mt-6 text-display text-secondary-900 text-center">Crie sua conta</Text>
          <Text className="mt-2 text-body text-secondary-600 text-center">
            Junte-se ao SquadUp e encontre sua próxima partida
          </Text>
        </View>

        <View className="gap-4">
          <Input
            label="Nome completo"
            value={name}
            onChangeText={setName}
            error={nameError}
            placeholder="Seu nome"
            autoCapitalize="words"
            leftIcon="account-outline"
          />

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
            placeholder="Mínimo 8 caracteres"
            secureTextEntry
            leftIcon="lock-outline"
          />

          <Input
            label="Data de nascimento"
            value={birthDate}
            onChangeText={(text) => setBirthDate(formatDateInput(text))}
            error={birthDateError}
            placeholder="DD/MM/AAAA"
            keyboardType="number-pad"
            maxLength={10}
            leftIcon="cake-variant-outline"
          />
        </View>

        <View className="mt-8">
          <Button
            label="Criar conta"
            onPress={handleRegister}
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
          />
        </View>

        <View className="mt-6 flex-row justify-center items-center">
          <Text className="text-body text-secondary-600">Já tem uma conta? </Text>
          <Pressable
            hitSlop={12}
            accessibilityRole="link"
            onPress={() => navigation.navigate("Login")}
          >
            <Text className="text-body font-semibold text-primary-500">Entrar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
