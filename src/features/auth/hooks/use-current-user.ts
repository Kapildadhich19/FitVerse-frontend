import { useQuery } from "@tanstack/react-query";

import { getCurrentUser, refreshSession } from "@/features/auth/api/auth.api";
import { tokenStore } from "@/features/auth/lib/token-store";

export const authQueryKeys = {
  all: ["auth"] as const,
  me: ["auth", "me"] as const
};

export function useCurrentUser() {
  return useQuery({
    queryKey: authQueryKeys.me,
    queryFn: async () => {
      if (!tokenStore.getAccessToken()) {
        const session = await refreshSession();
        tokenStore.setAccessToken(session.accessToken, tokenStore.shouldRemember());
      }

      return getCurrentUser();
    },
    retry: false,
    staleTime: 60_000
  });
}
