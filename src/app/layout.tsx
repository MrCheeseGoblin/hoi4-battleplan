import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "HOI4 Battleplan",
    template: "%s | HOI4 Battleplan",
  },
  description:
    "Build divisions, explore units, and master nations with practical, version-aware Hearts of Iron IV guidance.",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <a
          href="#main-content"
          className="focus-ring fixed top-3 left-3 z-[100] -translate-y-24 rounded-sm bg-paper-50 px-4 py-2 text-sm font-bold text-ink-950 transition-transform focus:translate-y-0"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
