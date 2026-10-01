"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useDigitalTwin } from "@/features/onboarding/hooks/use-digital-twin";

export function OnboardingGate() {
  const router = useRouter();
  const digitalTwin = useDigitalTwin();

  useEffect(() => {
    if (!digitalTwin.isLoading && !digitalTwin.data?.completedAt) {
      router.replace("/onboarding");
    }
  }, [digitalTwin.data?.completedAt, digitalTwin.isLoading, router]);

  return null;
}
