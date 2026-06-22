import Link from "next/link";

import { BrandMark } from "@/components/ui/brand-mark";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink-700 bg-ink-950">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
        <div className="flex max-w-2xl items-start gap-4">
          <BrandMark className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold tracking-wide text-paper-50">
              HOI4 Battleplan
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              An unofficial fan project for clearer division choices, practical
              unit knowledge, and version-aware nation planning.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 text-sm md:items-end">
          <Link
            className="focus-ring rounded-sm text-slate-300 underline decoration-ink-600 underline-offset-4 hover:text-paper-50"
            href="/about"
          >
            Project principles and disclaimer
          </Link>
          <p className="text-slate-500">
            Not affiliated with or endorsed by Paradox Interactive.
          </p>
        </div>
      </div>
    </footer>
  );
}
