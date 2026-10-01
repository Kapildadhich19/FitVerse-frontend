import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { authQueryKeys } from "@/features/auth/hooks/use-current-user";
import { login, logout, register } from "@/features/auth/api/auth.api";
import type { LoginFormValues, RegisterFormValues } from "@/features/auth/schemas/auth.schema";
import { tokenStore } from "@/features/auth/lib/token-store";
import { useToast } from "@/components/ui/toast";

type LoginMutationInput = LoginFormValues & {
  rememberMe: boolean;
};

function toLoginRequest(values: LoginMutationInput) {
  return {
    email: values.email,
    password: values.password
  };
}

function toRegisterRequest(values: RegisterFormValues) {
  return {
    name: values.name,
    email: values.email,
    password: values.password
  };
}

export function useLoginMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (values: LoginMutationInput) => login(toLoginRequest(values)),
    onSuccess: (data, variables) => {
      tokenStore.setAccessToken(data.accessToken, variables.rememberMe);
      queryClient.setQueryData(authQueryKeys.me, data.user);
      toast({ title: "Signed in", description: "Welcome back to FitVerse." });
      router.replace("/dashboard");
    }
  });
}

export function useRegisterMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (values: RegisterFormValues) => register(toRegisterRequest(values)),
    onSuccess: (data) => {
      tokenStore.setAccessToken(data.accessToken, true);
      queryClient.setQueryData(authQueryKeys.me, data.user);
      toast({ title: "Account created", description: "Your FitVerse workspace is ready." });
      router.replace("/dashboard");
    }
  });
}

export function useLogoutMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      tokenStore.clearAccessToken();
      queryClient.removeQueries({ queryKey: authQueryKeys.all });
      toast({ title: "Signed out", description: "Your session has ended." });
      router.replace("/login");
    }
  });
}
