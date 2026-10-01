import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { AvatarWorkspace } from "@/features/avatar/components/avatar-workspace";

export default function AvatarPage() {
  return (
    <main className="min-h-screen bg-muted/30">
      <div className="container py-8">
        <ProtectedRoute>
          <AvatarWorkspace />
        </ProtectedRoute>
      </div>
    </main>
  );
}
