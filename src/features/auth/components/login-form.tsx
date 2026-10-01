"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthError } from "@/features/auth/components/auth-error";
import { useLoginMutation } from "@/features/auth/hooks/use-auth-mutations";
import { type LoginFormValues, loginSchema } from "@/features/auth/schemas/auth.schema";
import { getApiErrorMessage } from "@/lib/http/axios-client";

export function LoginForm() {
  const loginMutation = useLoginMutation();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    }
  });

  function onSubmit(values: LoginFormValues) {
    loginMutation.mutate(values);
  }

  const isLoading = isSubmitting || loginMutation.isPending;

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <AuthError message={loginMutation.isError ? getApiErrorMessage(loginMutation.error) : undefined} />
      <FormField id="email" label="Email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" {...register("email")} />
      </FormField>
      <FormField id="password" label="Password" error={errors.password?.message}>
        <Input id="password" type="password" autoComplete="current-password" {...register("password")} />
      </FormField>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Controller
          control={control}
          name="rememberMe"
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox id="rememberMe" checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
              <Label htmlFor="rememberMe" className="text-sm text-muted-foreground">
                Remember me
              </Label>
            </div>
          )}
        />
        <Button type="button" variant="ghost" size="sm" disabled>
          Forgot password
        </Button>
      </div>
      <Button className="w-full" type="submit" disabled={isLoading}>
        <LogIn className="h-4 w-4" />
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
