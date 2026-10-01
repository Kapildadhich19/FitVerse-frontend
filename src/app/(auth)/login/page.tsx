import Link from "next/link";

import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">FitVerse</p>
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to manage your avatar and try-on workspace.</p>
      </div>
      <LoginForm />
      <p className="text-center text-sm text-muted-foreground">
        New to FitVerse?{" "}
        <Link className="font-medium text-primary hover:underline" href="/register">
          Create an account
        </Link>
      </p>
    </div>
  );
}
