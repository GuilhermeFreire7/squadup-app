import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import Avatar from "../components/Avatar";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Header from "../components/Header";
import ReviewCard from "../components/ReviewCard";
import RatingStars from "../components/RatingStars";
import SectionCard from "../components/SectionCard";
import StatsRow from "../components/StatsRow";
import TrustBadges from "../components/TrustBadges";
import { useAuth } from "../contexts/AuthContext";
import { useUserRatings } from "../hooks/useRatings";
import type { AppRootStackParamList } from "../navigation/types";
import { colors, LEVEL_META, SPORT_META } from "../theme";

type Nav = NativeStackNavigationProp<AppRootStackParamList>;

export default function MyProfileScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const { ratings: myReviews } = useUserRatings(user?.id ?? "");

  if (!user) return null;

  return (
    <View className="flex-1 bg-secondary-50">
      <Header
        title="Meu Perfil"
        rightElement={
          <Pressable
            onPress={() => navigation.navigate("EditProfile")}
            className="w-10 h-10 items-center justify-center rounded-full bg-white/10 active:bg-white/20"
            accessibilityLabel="Editar perfil"
            accessibilityRole="button"
          >
            <MaterialCommunityIcons name="pencil-outline" size={20} color={colors.white} />
          </Pressable>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Profile hero */}
        <View className="bg-secondary-900 pb-8 px-4 items-center gap-3 rounded-b-3xl">
          <Avatar name={user.name} photoUrl={user.photoUrl} size="xl" ring />
          <View className="items-center gap-1">
            <View className="flex-row items-center gap-1.5">
              <Text className="text-xl font-bold text-white tracking-tight">{user.name}</Text>
              {user.isVerified && (
                <MaterialCommunityIcons
                  name="check-decagram"
                  size={18}
                  color={colors.primary[400]}
                  accessibilityLabel="Verificado"
                />
              )}
            </View>
            {user.location ? (
              <View className="flex-row items-center gap-1">
                <MaterialCommunityIcons
                  name="map-marker-outline"
                  size={14}
                  color={colors.secondary[400]}
                />
                <Text className="text-sm text-secondary-400">{user.location}</Text>
              </View>
            ) : null}
          </View>
          <RatingStars rating={user.averageRating} size="md" showValue />
        </View>

        <View className="p-5 gap-4 -mt-4">
          {/* Stats row */}
          <StatsRow
            stats={[
              { value: user.matchesPlayed, label: "Partidas" },
              { value: user.averageRating?.toFixed(1) ?? "—", label: "Avaliação" },
              { value: myReviews.length, label: "Avaliações" },
            ]}
          />

          {/* Trust badges */}
          <TrustBadges
            isVerified={user.isVerified}
            matchesPlayed={user.matchesPlayed}
            averageRating={user.averageRating}
          />

          {/* Bio */}
          {user.bio ? (
            <SectionCard title="Sobre mim">
              <Text className="text-sm text-secondary-600 leading-5">{user.bio}</Text>
            </SectionCard>
          ) : null}

          {/* Sports */}
          <SectionCard title="Esportes favoritos">
            <View className="flex-row flex-wrap gap-2">
              {user.favoriteSports.map((s) => (
                <Badge key={s} variant="sport" sport={s} label={SPORT_META[s].label} />
              ))}
            </View>
          </SectionCard>

          {/* Level */}
          <SectionCard
            title="Nível de experiência"
            rightElement={
              <Badge variant="level" level={user.level} label={LEVEL_META[user.level].label} />
            }
          />

          {/* Reviews */}
          {myReviews.length > 0 && (
            <View className="gap-3">
              <Text className="text-base font-bold text-secondary-900 tracking-tight mt-1">
                Avaliações recebidas ({myReviews.length})
              </Text>
              {myReviews.map((r) => (
                <ReviewCard key={r.id} rating={r} />
              ))}
            </View>
          )}

          {/* Actions */}
          <Button
            label="Editar perfil"
            icon="pencil-outline"
            onPress={() => navigation.navigate("EditProfile")}
            variant="secondary"
            fullWidth
          />

          {/* Hidden admin entry point — protótipo acadêmico, sem RBAC real */}
          <Button
            label="Painel administrativo"
            icon="shield-crown-outline"
            onPress={() => navigation.navigate("AdminDashboard")}
            variant="ghost"
            fullWidth
          />
        </View>
      </ScrollView>
    </View>
  );
}
