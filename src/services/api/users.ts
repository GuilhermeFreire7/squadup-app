import type { ExperienceLevel, Sport } from "../../types";
import type { ApiMyMatch, ApiMyProfile, ApiPublicUser } from "../adapters/types";
import { apiClient } from "./client";

interface UpdateMyProfilePayload {
  name?: string;
  location?: string;
  bio?: string;
  favorite_sports?: Sport[];
  level?: ExperienceLevel;
  photo_url?: string;
}

export async function fetchMyProfile(): Promise<ApiMyProfile> {
  return apiClient.get<ApiMyProfile>("/users/me");
}

export async function updateMyProfile(payload: UpdateMyProfilePayload): Promise<ApiMyProfile> {
  return apiClient.patch<ApiMyProfile>("/users/me", payload);
}

export async function fetchMyMatches(): Promise<ApiMyMatch[]> {
  return apiClient.get<ApiMyMatch[]>("/users/me/matches");
}

export async function registerPushToken(token: string): Promise<void> {
  await apiClient.post("/users/me/push-token", { token });
}

export async function fetchPublicProfile(userId: string): Promise<ApiPublicUser> {
  return apiClient.get<ApiPublicUser>(`/users/${userId}`);
}
