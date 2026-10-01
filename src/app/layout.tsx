import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AppProviders } from "@/app/providers";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "FitVerse",
  description: "AI-powered virtual fashion try-on for modern shoppers."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
