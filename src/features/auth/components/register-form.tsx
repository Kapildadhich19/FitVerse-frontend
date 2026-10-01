"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthError } from "@/features/auth/components/auth-error";
import { PasswordStrength } from "@/features/auth/components/password-strength";
import { useRegisterMutation } from "@/features/auth/hooks/use-auth-mutations";
import { type RegisterFormValues, registerSchema } from "@/features/auth/schemas/auth.schema";
import { getApiErrorMessage } from "@/lib/http/axios-client";

export function RegisterForm() {
  const registerMutation = useRegisterMutation();
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false
    }
  });

  function onSubmit(values: RegisterFormValues) {
    registerMutation.mutate(values);
  }

  const password = watch("password");
  const isLoading = isSubmitting || registerMutation.isPending;

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <AuthError message={registerMutation.isError ? getApiErrorMessage(registerMutation.error) : undefined} />
      <FormField id="name" label="Name" error={errors.name?.message}>
        <Input id="name" autoComplete="name" {...register("name")} />
      </FormField>
      <FormField id="email" label="Email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" {...register("email")} />
      </FormField>
      <FormField id="password" label="Password" error={errors.password?.message}>
        <Input id="password" type="password" autoComplete="new-password" {...register("password")} />
      </FormField>
      <PasswordStrength password={password} />
      <FormField id="confirmPassword" label="Confirm password" error={errors.confirmPassword?.message}>
        <Input id="confirmPassword" type="password" autoComplete="new-password" {...register("confirmPassword")} />
      </FormField>
      <Controller
        control={control}
        name="acceptTerms"
        render={({ field }) => (
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Checkbox id="acceptTerms" checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
              <Label htmlFor="acceptTerms" className="leading-5 text-muted-foreground">
                I accept the FitVerse terms and privacy policy.
              </Label>
            </div>
            {errors.acceptTerms?.message ? <p className="text-sm text-destructive">{errors.acceptTerms.message}</p> : null}
          </div>
        )}
      />
      <Button className="w-full" type="submit" disabled={isLoading}>
        <UserPlus className="h-4 w-4" />
        {isLoading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
