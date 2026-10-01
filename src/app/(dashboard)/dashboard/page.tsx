import { Box, ScanFace, Sparkles } from "lucide-react";

import { DashboardAuthSummary } from "@/features/auth/components/dashboard-auth-summary";
import { OnboardingGate } from "@/features/onboarding/components/onboarding-gate";

const metrics = [
  { label: "Avatar status", value: "Not created", icon: ScanFace },
  { label: "Saved products", value: "0", icon: Box },
  { label: "Try-on sessions", value: "Coming soon", icon: Sparkles }
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <OnboardingGate />
      <DashboardAuthSummary />
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="max-w-2xl text-muted-foreground">
          Your FitVerse workspace is ready for account, avatar, product, and future try-on workflows.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-lg border bg-card p-5 text-card-foreground">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <metric.icon className="h-5 w-5" />
            </div>
            <p className="text-sm text-muted-foreground">{metric.label}</p>
            <p className="mt-1 text-xl font-semibold">{metric.value}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
