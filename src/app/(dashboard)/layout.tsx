import { ScanFace, Shirt, Sparkles, UserRound } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { ProtectedRoute } from "@/features/auth/components/protected-route";

const navItems: Array<{ href: Route; label: string; icon: typeof UserRound }> = [
  { href: "/dashboard", label: "Overview", icon: UserRound },
  { href: "/avatar", label: "Avatar", icon: ScanFace },
  { href: "/try-on", label: "Try-On", icon: Sparkles },
  { href: "/dashboard/products", label: "Products", icon: Shirt }
];

export default function DashboardLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/dashboard" className="text-lg font-semibold">
            FitVerse
          </Link>
          <nav className="flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="container py-8">
        <ProtectedRoute>{children}</ProtectedRoute>
      </main>
    </div>
  );
}
