import type { Metadata } from "next";

import { DivisionBuilder } from "@/features/division-builder/division-builder";
import { loadDivisionBuilderData } from "@/features/division-builder/data";
import { PageIntro } from "@/components/ui/page-intro";

export const metadata: Metadata = {
  title: "Division Builder",
  description:
    "Build a sample Hearts of Iron IV division and receive transparent, role-specific coaching.",
};

export default function DivisionsPage() {
  const dataSet = loadDivisionBuilderData();

  return (
    <>
      <PageIntro
        eyebrow="Phase 4 / Division Builder MVP"
        title="Build for a mission, then inspect the trade-offs."
        description="Place compatible battalions, add support companies, calculate from canonical sample data, and receive transparent coaching for a selected role."
        aside={
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <span className="rounded-full border border-brass-400/35 bg-brass-400/8 px-3 py-2 text-xs font-bold tracking-[0.1em] text-brass-300 uppercase">
              Simplified evaluation
            </span>
            <span className="rounded-full border border-ink-600 bg-ink-900 px-3 py-2 text-xs font-bold tracking-[0.1em] text-slate-300 uppercase">
              {dataSet.version.gameVersion}
            </span>
          </div>
        }
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <aside
          className="mb-8 border-l-2 border-brass-400 bg-brass-400/5 p-5"
          aria-label="Builder limitations"
        >
          <p className="text-sm leading-6 text-slate-300">
            <strong className="text-brass-300">
              Representative coaching only:
            </strong>{" "}
            sample statistics are incomplete and unverified. The model excludes
            doctrines, technologies, terrain, country bonuses, commanders,
            designers, and equipment variants.
          </p>
        </aside>

        <DivisionBuilder dataSet={dataSet} />
      </div>
    </>
  );
}
