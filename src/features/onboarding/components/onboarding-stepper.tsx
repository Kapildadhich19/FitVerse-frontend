import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export type OnboardingStep = {
  id: string;
  label: string;
  description: string;
};

type OnboardingStepperProps = {
  steps: readonly OnboardingStep[];
  currentStep: number;
};

export function OnboardingStepper({ steps, currentStep }: OnboardingStepperProps) {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary">Digital Twin onboarding</p>
          <h1 className="text-3xl font-semibold tracking-tight">{steps[currentStep]?.label}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{steps[currentStep]?.description}</p>
        </div>
        <div className="hidden text-sm text-muted-foreground sm:block">
          Step {currentStep + 1} of {steps.length}
        </div>
      </div>
      <div className="h-2 rounded-full bg-muted">
        <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
      </div>
      <div className="grid gap-2 sm:grid-cols-5">
        {steps.map((step, index) => {
          const isComplete = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div
              key={step.id}
              className={cn(
                "flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm text-muted-foreground",
                isActive && "border-primary text-foreground",
                isComplete && "border-primary/40 bg-primary/5 text-foreground"
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs",
                  isActive && "border-primary bg-primary text-primary-foreground",
                  isComplete && "border-primary bg-primary text-primary-foreground"
                )}
              >
                {isComplete ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </span>
              <span className="truncate">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
