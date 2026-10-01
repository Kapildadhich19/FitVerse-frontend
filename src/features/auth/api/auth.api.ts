import { api } from "@/lib/http/axios-client";

import type { LoginRequest, RegisterRequest } from "@/features/auth/schemas/auth.schema";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

export function login(payload: LoginRequest) {
  return api.post<AuthResponse>("/auth/login", payload).then((response) => response.data);
}

export function register(payload: RegisterRequest) {
  return api.post<AuthResponse>("/auth/register", payload).then((response) => response.data);
}

export function logout() {
  return api.post<void>("/auth/logout").then((response) => response.data);
}

export function refreshSession() {
  return api.post<AuthResponse>("/auth/refresh").then((response) => response.data);
}

export function getCurrentUser() {
  return api.get<{ user: AuthUser }>("/auth/me").then((response) => response.data.user);
}
