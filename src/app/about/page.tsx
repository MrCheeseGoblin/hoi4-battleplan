import type { Metadata } from "next";

import { PageIntro } from "@/components/ui/page-intro";

export const metadata: Metadata = {
  title: "About",
  description:
    "The goals, principles, scope, and unofficial fan-project disclaimer for HOI4 Battleplan.",
};

const principles = [
  {
    title: "One source of mechanical truth",
    body: "The catalogue, builder, and guides should reference the same validated and versioned game data.",
  },
  {
    title: "Explain every recommendation",
    body: "Role suitability needs assumptions, evidence, warnings, and practical improvements—not a mysterious score.",
  },
  {
    title: "Separate fact from advice",
    body: "Stable mechanics, Battleplan recommendations, and future community opinions must be clearly labelled.",
  },
  {
    title: "Earn complexity",
    body: "Accounts, ratings, comments, databases, and automated ingestion wait until the core tools are trustworthy.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="About the project"
        title="A practical planning layer for HOI4."
        description="Battleplan exists to make game data and strategy advice easier to act on, especially when the correct answer depends on role, patch, doctrine, industry, or context."
        aside={
          <span className="inline-flex rounded-full border border-brass-400/35 bg-brass-400/8 px-3 py-2 text-xs font-bold tracking-[0.12em] text-brass-300 uppercase">
            Unofficial fan project
          </span>
        }
      />

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8 lg:py-18">
        <div>
          <p className="eyebrow">Working principles</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {principles.map((principle, index) => (
              <article key={principle.title} className="panel p-6">
                <p className="text-xs font-black tracking-[0.16em] text-olive-300 uppercase">
                  Principle {index + 1}
                </p>
                <h2 className="mt-4 text-lg font-bold text-paper-50">
                  {principle.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {principle.body}
                </p>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-5">
          <section className="border-l-2 border-brass-400 bg-brass-400/5 p-6">
            <h2 className="text-sm font-black tracking-[0.14em] text-brass-300 uppercase">
              Disclaimer
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              HOI4 Battleplan is not affiliated with or endorsed by Paradox
              Interactive. Hearts of Iron IV and related marks belong to their
              respective owners.
            </p>
          </section>
          <section className="border border-ink-700 bg-ink-900 p-6">
            <h2 className="text-sm font-black tracking-[0.14em] text-paper-100 uppercase">
              Asset policy
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              The project uses an original interface and placeholder identity.
              Official logos, UI, artwork, icons, and fonts are not copied.
            </p>
          </section>
        </aside>
      </section>
    </>
  );
}
