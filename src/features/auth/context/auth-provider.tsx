"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { AuthUser } from "@/features/auth/api/auth.api";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useLogoutMutation } from "@/features/auth/hooks/use-auth-mutations";

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  isLoggingOut: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const currentUser = useCurrentUser();
  const logoutMutation = useLogoutMutation();
  const user = currentUser.data ?? null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: currentUser.isLoading,
        isAuthenticated: Boolean(user),
        logout: () => logoutMutation.mutate(),
        isLoggingOut: logoutMutation.isPending
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
