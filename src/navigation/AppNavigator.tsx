import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AdminDashboardScreen from "../screens/AdminDashboardScreen";
import CreateMatchScreen from "../screens/CreateMatchScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import FiltersScreen from "../screens/FiltersScreen";
import HomeScreen from "../screens/HomeScreen";
import MatchChatScreen from "../screens/MatchChatScreen";
import MatchDetailScreen from "../screens/MatchDetailScreen";
import MyProfileScreen from "../screens/MyProfileScreen";
import PostMatchRatingScreen from "../screens/PostMatchRatingScreen";
import PublicProfileScreen from "../screens/PublicProfileScreen";
import RateUserScreen from "../screens/RateUserScreen";
import ReportDetailScreen from "../screens/ReportDetailScreen";
import ReportUserScreen from "../screens/ReportUserScreen";
import SearchScreen from "../screens/SearchScreen";
import { colors } from "../theme";
import type { AppRootStackParamList, AppTabParamList } from "./types";

const Tab = createBottomTabNavigator<AppTabParamList>();
const RootStack = createNativeStackNavigator<AppRootStackParamList>();

type IconProps = { color: string; focused: boolean };
const HomeIcon = ({ color, focused }: IconProps) => (
  <MaterialCommunityIcons
    name={focused ? "home-variant" : "home-variant-outline"}
    size={24}
    color={color}
  />
);
const SearchIcon = ({ color }: Pick<IconProps, "color">) => (
  <MaterialCommunityIcons name="magnify" size={24} color={color} />
);
const CreateIcon = ({ color, focused }: IconProps) => (
  <MaterialCommunityIcons
    name={focused ? "plus-circle" : "plus-circle-outline"}
    size={24}
    color={color}
  />
);
const ProfileIcon = ({ color, focused }: IconProps) => (
  <MaterialCommunityIcons name={focused ? "account" : "account-outline"} size={24} color={color} />
);

function AppTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary[400],
        tabBarInactiveTintColor: colors.secondary[400],
        tabBarStyle: {
          backgroundColor: colors.secondary[900],
          borderTopWidth: 0,
          elevation: 0,
          height: 52 + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom + 8,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Início",
          tabBarIcon: HomeIcon,
          tabBarAccessibilityLabel: "Início",
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: "Busca",
          tabBarIcon: SearchIcon,
          tabBarAccessibilityLabel: "Busca",
        }}
      />
      <Tab.Screen
        name="CreateMatch"
        component={CreateMatchScreen}
        options={{
          tabBarLabel: "Criar",
          tabBarIcon: CreateIcon,
          tabBarAccessibilityLabel: "Criar partida",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={MyProfileScreen}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ProfileIcon,
          tabBarAccessibilityLabel: "Perfil",
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <RootStack.Navigator>
      <RootStack.Screen name="AppTabs" component={AppTabs} options={{ headerShown: false }} />
      <RootStack.Screen
        name="Filters"
        component={FiltersScreen}
        options={{
          presentation: "modal",
          headerShown: false,
          contentStyle: { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
        }}
      />
      <RootStack.Screen
        name="MatchDetail"
        component={MatchDetailScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="MatchChat"
        component={MatchChatScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="PublicProfile"
        component={PublicProfileScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="ReportUser"
        component={ReportUserScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="PostMatchRating"
        component={PostMatchRatingScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="RateUser"
        component={RateUserScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="ReportDetail"
        component={ReportDetailScreen}
        options={{ headerShown: false }}
      />
    </RootStack.Navigator>
  );
}
