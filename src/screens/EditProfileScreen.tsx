import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import Avatar from "../components/Avatar";
import Button from "../components/Button";
import Chip from "../components/Chip";
import Header from "../components/Header";
import Input from "../components/Input";
import { useAuth } from "../contexts/AuthContext";
import type { AppRootStackParamList } from "../navigation/types";
import { colors, LEVEL_META, SPORT_META } from "../theme";
import type { ExperienceLevel, Sport } from "../types";

type Nav = NativeStackNavigationProp<AppRootStackParamList>;

const SPORTS: Sport[] = ["football", "volleyball", "basketball", "tennis", "futsal", "other"];
const LEVELS: ExperienceLevel[] = ["beginner", "intermediate", "advanced"];

function EditProfileForm({
  user,
}: Readonly<{ user: NonNullable<ReturnType<typeof useAuth>["user"]> }>) {
  const navigation = useNavigation<Nav>();
  const { updateProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio ?? "");
  const [location, setLocation] = useState(user.location);
  const [selectedSports, setSelectedSports] = useState<Sport[]>(user.favoriteSports);
  const [level, setLevel] = useState<ExperienceLevel>(user.level);
  const [nameError, setNameError] = useState("");
  const [locationError, setLocationError] = useState("");

  const toggleSport = (sport: Sport) => {
    setSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };

  const handleSave = async () => {
    let valid = true;

    if (name.trim().length < 2) {
      setNameError("Nome deve ter ao menos 2 caracteres");
      valid = false;
    } else {
      setNameError("");
    }

    if (location.trim().length < 3) {
      setLocationError("Informe seu bairro ou cidade");
      valid = false;
    } else {
      setLocationError("");
    }

    if (!valid) return;

    setIsSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        bio: bio.trim(),
        location: location.trim(),
        favoriteSports: selectedSports,
        level,
      });
      Alert.alert("Perfil atualizado!", "Suas informações foram salvas com sucesso.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert("Não foi possível salvar", "Tente novamente em instantes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoPress = () => {
    Alert.alert("Foto de perfil", "Upload de fotos disponível em breve!");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-secondary-50"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Header title="Editar perfil" onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Photo */}
        <View className="items-center mb-8">
          <Pressable onPress={handlePhotoPress} accessibilityLabel="Alterar foto de perfil">
            <View>
              <Avatar name={name || user.name} photoUrl={user.photoUrl} size="xl" />
              <View className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary-500 border-2 border-white items-center justify-center">
                <MaterialCommunityIcons name="camera" size={15} color={colors.white} />
              </View>
            </View>
            <Text className="mt-3 text-sm text-primary-500 text-center font-semibold">
              Alterar foto
            </Text>
          </Pressable>
        </View>

        <View className="gap-5">
          {/* Name */}
          <Input
            label="Nome"
            value={name}
            onChangeText={setName}
            error={nameError}
            placeholder="Seu nome"
            autoCapitalize="words"
            leftIcon="account-outline"
          />

          {/* Bio */}
          <Input
            label="Bio (opcional)"
            value={bio}
            onChangeText={setBio}
            placeholder="Conte um pouco sobre você e seu estilo de jogo"
            autoCapitalize="sentences"
            multiline
          />

          {/* Location */}
          <Input
            label="Localização aproximada"
            value={location}
            onChangeText={setLocation}
            error={locationError}
            placeholder="Ex: Botafogo, Rio de Janeiro"
            autoCapitalize="words"
            leftIcon="map-marker-outline"
          />

          {/* Sports */}
          <View>
            <Text className="text-sm font-bold text-secondary-900 mb-3">Esportes favoritos</Text>
            <View className="flex-row flex-wrap gap-2">
              {SPORTS.map((sport) => (
                <Chip
                  key={sport}
                  label={SPORT_META[sport].label}
                  icon={SPORT_META[sport].icon}
                  iconColor={SPORT_META[sport].color}
                  selected={selectedSports.includes(sport)}
                  onPress={() => toggleSport(sport)}
                  accessibilityRole="checkbox"
                />
              ))}
            </View>
          </View>

          {/* Level */}
          <View>
            <Text className="text-sm font-bold text-secondary-900 mb-3">Nível de experiência</Text>
            <View className="flex-row gap-2">
              {LEVELS.map((lvl) => {
                const selected = level === lvl;
                return (
                  <Pressable
                    key={lvl}
                    onPress={() => setLevel(lvl)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                    accessibilityLabel={LEVEL_META[lvl].label}
                    className={`flex-1 h-12 rounded-control border items-center justify-center ${
                      selected
                        ? "bg-primary-500 border-primary-500"
                        : "bg-white border-secondary-200"
                    }`}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        selected ? "text-white" : "text-secondary-700"
                      }`}
                    >
                      {LEVEL_META[lvl].label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Button
            label="Salvar alterações"
            icon="check"
            onPress={() => void handleSave()}
            variant="primary"
            size="lg"
            loading={isSaving}
            fullWidth
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function EditProfileScreen() {
  const { user } = useAuth();
  if (!user) return null;
  return <EditProfileForm user={user} />;
}
