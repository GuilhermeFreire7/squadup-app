import React, { createContext, useContext, useEffect, useState } from "react";

import { useNotificationRegistration } from "../hooks/useNotificationRegistration";
import { toMyProfile } from "../services/adapters/user";
import { loginRequest, logoutRequest, refreshRequest, registerRequest } from "../services/api/auth";
import { ApiError, setUnauthorizedHandler } from "../services/api/client";
import { fetchMyProfile, updateMyProfile } from "../services/api/users";
import { queryClient } from "../services/queryClient";
import {
  clearTokens,
  getRefreshToken,
  restoreAuthToken,
  saveTokens,
} from "../services/storage/tokenStorage";
import type { ExperienceLevel, MyProfile, Sport } from "../types";

interface ProfileData {
  favoriteSports: Sport[];
  level: ExperienceLevel;
  location: string;
  photoUrl?: string;
}

export interface UpdateProfileData {
  name?: string;
  bio?: string;
  location?: string;
  favoriteSports?: Sport[];
  level?: ExperienceLevel;
  photoUrl?: string;
}

interface AuthContextValue {
  user: MyProfile | null;
  isAuthenticated: boolean;
  isBooting: boolean;
  pendingName: string;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, age: number) => void;
  completeProfile: (data: ProfileData) => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MyProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [pendingName, setPendingName] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [pendingPassword, setPendingPassword] = useState("");
  const [pendingAge, setPendingAge] = useState(0);

  const { registerForPushNotifications } = useNotificationRegistration();

  // Roda uma única vez a cada transição para autenticado (login, cadastro ou boot restaurado).
  useEffect(() => {
    if (isAuthenticated) {
      void registerForPushNotifications();
    }
  }, [isAuthenticated, registerForPushNotifications]);

  const clearPendingState = () => {
    setPendingName("");
    setPendingEmail("");
    setPendingPassword("");
    setPendingAge(0);
  };

  useEffect(() => {
    setUnauthorizedHandler(async () => {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) return null;

      try {
        const tokens = await refreshRequest(refreshToken);
        await saveTokens(tokens);
        return tokens.accessToken;
      } catch {
        await clearTokens();
        setUser(null);
        setIsAuthenticated(false);
        return null;
      }
    });

    (async () => {
      const token = await restoreAuthToken();
      if (!token) {
        setIsBooting(false);
        return;
      }

      try {
        const profile = await fetchMyProfile();
        setUser(toMyProfile(profile));
        setIsAuthenticated(true);
      } catch {
        await clearTokens();
      } finally {
        setIsBooting(false);
      }
    })();

    return () => setUnauthorizedHandler(null);
  }, []);

  const login = async (email: string, password: string) => {
    const tokens = await loginRequest(email, password);
    await saveTokens(tokens);
    const profile = await fetchMyProfile();
    setUser(toMyProfile(profile));
    setIsAuthenticated(true);
  };

  const register = (name: string, email: string, password: string, age: number) => {
    setPendingName(name);
    setPendingEmail(email);
    setPendingPassword(password);
    setPendingAge(age);
  };

  const completeProfile = async (data: ProfileData) => {
    try {
      await registerRequest({
        name: pendingName,
        email: pendingEmail,
        password: pendingPassword,
        age: pendingAge,
        location: data.location,
        favorite_sports: data.favoriteSports,
      });
    } catch (err) {
      // Se uma tentativa anterior já criou a conta (ex.: falha de rede no passo seguinte,
      // login/PATCH), o e-mail já existe — segue para o login em vez de travar o usuário
      // com "e-mail já cadastrado" sem conseguir prosseguir. Se o e-mail já existia por
      // outro motivo, o login abaixo falha normalmente com uma mensagem própria.
      const alreadyRegisteredByUs =
        err instanceof ApiError && err.code === "EMAIL_ALREADY_REGISTERED";
      if (!alreadyRegisteredByUs) throw err;
    }

    const tokens = await loginRequest(pendingEmail, pendingPassword);
    await saveTokens(tokens);

    // RegisterRequest não aceita `level` (backend sempre cria com o default BEGINNER) — o
    // PATCH seguinte grava o nível escolhido e já devolve o MyProfileRead completo.
    const profile = await updateMyProfile({ level: data.level, photo_url: data.photoUrl });
    setUser(toMyProfile(profile));
    clearPendingState();
    setIsAuthenticated(true);
  };

  const updateProfile = async (data: UpdateProfileData) => {
    const profile = await updateMyProfile({
      name: data.name,
      bio: data.bio,
      location: data.location,
      favorite_sports: data.favoriteSports,
      level: data.level,
      photo_url: data.photoUrl,
    });
    setUser(toMyProfile(profile));
  };

  const logout = async () => {
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      try {
        await logoutRequest(refreshToken);
      } catch {
        // Refresh token já pode estar expirado/revogado — segue com o logout local mesmo assim.
      }
    }
    await clearTokens();
    // Sem isso, quem logar em seguida no mesmo aparelho veria por alguns instantes dados em cache
    // da conta anterior (mensagens, avaliações, denúncias do painel admin).
    queryClient.clear();
    setUser(null);
    clearPendingState();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isBooting,
        pendingName,
        login,
        register,
        completeProfile,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
