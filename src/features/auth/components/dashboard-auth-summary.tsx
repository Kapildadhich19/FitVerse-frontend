"use client";

import { LogOut, Mail, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/context/auth-provider";

export function DashboardAuthSummary() {
  const { user, isLoading, logout, isLoggingOut } = useAuth();

  if (isLoading) {
    return (
      <section className="rounded-lg border bg-card p-6 text-card-foreground">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="mt-3 h-5 w-72" />
      </section>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <section className="flex flex-col gap-5 rounded-lg border bg-card p-6 text-card-foreground md:flex-row md:items-center md:justify-between">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
            <UserRound className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Welcome {user.name}</h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              {user.email}
            </div>
          </div>
        </div>
      </div>
      <Button variant="outline" onClick={logout} disabled={isLoggingOut}>
        <LogOut className="h-4 w-4" />
        {isLoggingOut ? "Signing out..." : "Logout"}
      </Button>
    </section>
  );
}
