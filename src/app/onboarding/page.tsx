import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { DigitalTwinWizard } from "@/features/onboarding/components/digital-twin-wizard";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-muted/30">
      <div className="container py-8">
        <ProtectedRoute>
          <DigitalTwinWizard />
        </ProtectedRoute>
      </div>
    </main>
  );
}
