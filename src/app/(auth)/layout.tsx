import type { ReactNode } from "react";

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main className="grid min-h-screen bg-muted/40 lg:grid-cols-[1fr_480px]">
      <section className="hidden bg-foreground px-12 py-10 text-background lg:flex lg:flex-col lg:justify-between">
        <div className="text-lg font-semibold">FitVerse</div>
        <div className="max-w-xl space-y-5">
          <p className="text-4xl font-semibold leading-tight">
            Build a digital twin wardrobe that makes online fashion feel personal.
          </p>
          <p className="text-base text-background/70">
            Start with secure accounts and a durable workspace for avatars, products, and try-on sessions.
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center px-6 py-10">{children}</section>
    </main>
  );
}
