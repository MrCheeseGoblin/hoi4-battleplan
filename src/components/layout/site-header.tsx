import Link from "next/link";

import { BrandMark } from "@/components/ui/brand-mark";
import { primaryNavigation } from "@/lib/navigation";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink-700/80 bg-ink-950/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="focus-ring -m-1 flex items-center gap-3 rounded-sm p-1"
            aria-label="HOI4 Battleplan home"
          >
            <BrandMark />
            <span className="leading-none">
              <span className="block text-[0.68rem] font-semibold tracking-[0.22em] text-brass-300 uppercase">
                HOI4
              </span>
              <span className="mt-1 block text-sm font-bold tracking-[0.12em] text-paper-50 uppercase">
                Battleplan
              </span>
            </span>
          </Link>
          <span className="rounded-full border border-olive-400/30 bg-olive-400/10 px-2.5 py-1 text-[0.64rem] font-bold tracking-[0.14em] text-olive-200 uppercase lg:hidden">
            Foundation
          </span>
        </div>

        <div className="flex items-center gap-4">
          <nav aria-label="Primary navigation" className="min-w-0 flex-1">
            <ul className="flex flex-wrap gap-x-1 gap-y-1">
              {primaryNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="focus-ring inline-flex min-h-10 items-center rounded-sm px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-ink-800 hover:text-paper-50"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <span className="hidden rounded-full border border-olive-400/30 bg-olive-400/10 px-3 py-1.5 text-[0.66rem] font-bold tracking-[0.14em] text-olive-200 uppercase lg:inline-flex">
            Foundation
          </span>
        </div>
      </div>
    </header>
  );
}
