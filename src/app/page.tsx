import Link from "next/link";

import { FeatureCard } from "@/components/ui/feature-card";

const featureCards = [
  {
    code: "01 / Divisions",
    title: "Build for a role, not a generic score",
    description:
      "Shape a division, choose its job, and see transparent strengths, risks, assumptions, and improvements.",
    href: "/divisions",
    linkLabel: "Open division workspace",
    status: "Phase 4",
  },
  {
    code: "02 / Units",
    title: "Understand what each unit is for",
    description:
      "Compare key statistics with requirements, practical uses, limitations, and patch-aware context.",
    href: "/units",
    linkLabel: "Explore unit catalogue",
    status: "Phase 3",
  },
  {
    code: "03 / Guides",
    title: "Turn a national path into a plan",
    description:
      "Follow structured priorities for focuses, research, production, divisions, timing, and common mistakes.",
    href: "/guides",
    linkLabel: "Browse nation guides",
    status: "Phase 5",
  },
] as const;

const principles = [
  {
    title: "Version-aware",
    description:
      "Game data and recommendations stay tied to the patch assumptions that produced them.",
  },
  {
    title: "Explanation-first",
    description:
      "Scores never stand alone. Every verdict should show its reasoning and uncertainty.",
  },
  {
    title: "Useful anonymously",
    description:
      "Core tools stay open. Accounts will only gate persistent and community actions later.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <section className="overflow-hidden border-b border-ink-700 bg-ink-900/80">
        <div className="planning-grid">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-22 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)] lg:items-center lg:px-8 lg:py-28">
            <div>
              <p className="eyebrow">Unofficial strategy workspace</p>
              <h1 className="mt-5 max-w-4xl text-5xl leading-[0.98] font-black tracking-[-0.055em] text-paper-50 sm:text-6xl lg:text-7xl">
                Plan with context.
                <span className="mt-2 block text-olive-200">
                  Fight with purpose.
                </span>
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Build divisions. Explore units. Master nations. Battleplan turns
                scattered numbers and advice into practical, version-aware
                decisions.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/divisions"
                  className="focus-ring inline-flex min-h-12 items-center rounded-sm bg-olive-400 px-5 py-3 text-sm font-black tracking-wide text-ink-950 uppercase transition-colors hover:bg-olive-300"
                >
                  Enter division workspace
                </Link>
                <Link
                  href="/about"
                  className="focus-ring hover:border-ink-500 inline-flex min-h-12 items-center rounded-sm border border-ink-600 bg-ink-900 px-5 py-3 text-sm font-bold text-paper-100 transition-colors hover:bg-ink-800"
                >
                  How Battleplan works
                </Link>
              </div>
            </div>

            <aside className="panel relative p-6 sm:p-7">
              <div
                aria-hidden="true"
                className="absolute top-0 right-0 h-px w-1/3 bg-brass-400"
              />
              <div className="flex items-center justify-between gap-4 border-b border-ink-700 pb-4">
                <p className="text-xs font-black tracking-[0.18em] text-brass-300 uppercase">
                  Operational brief
                </p>
                <span className="rounded-full bg-olive-400/12 px-2.5 py-1 text-[0.65rem] font-bold tracking-[0.12em] text-olive-200 uppercase">
                  Foundation
                </span>
              </div>
              <dl className="mt-5 grid gap-5">
                <div className="grid grid-cols-[5.5rem_1fr] gap-4">
                  <dt className="text-xs font-bold tracking-wide text-slate-500 uppercase">
                    Mission
                  </dt>
                  <dd className="text-sm leading-6 text-paper-100">
                    Make complex choices understandable.
                  </dd>
                </div>
                <div className="grid grid-cols-[5.5rem_1fr] gap-4">
                  <dt className="text-xs font-bold tracking-wide text-slate-500 uppercase">
                    Method
                  </dt>
                  <dd className="text-sm leading-6 text-paper-100">
                    Shared data, transparent rules, clear assumptions.
                  </dd>
                </div>
                <div className="grid grid-cols-[5.5rem_1fr] gap-4">
                  <dt className="text-xs font-bold tracking-wide text-slate-500 uppercase">
                    Current
                  </dt>
                  <dd className="text-sm leading-6 text-paper-100">
                    Builder and unit catalogue ready for sample-data testing.
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="toolkit-heading"
        className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
      >
        <div className="flex flex-col justify-between gap-4 border-b border-ink-700 pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">The toolkit</p>
            <h2
              id="toolkit-heading"
              className="mt-3 text-3xl font-black tracking-[-0.03em] text-paper-50"
            >
              Three tools, one source of truth
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-400">
            Units, divisions, and guides will share canonical game data instead
            of drifting into separate answers.
          </p>
        </div>
        <div className="mt-7 grid gap-4 lg:grid-cols-3">
          {featureCards.map((feature) => (
            <FeatureCard key={feature.href} {...feature} />
          ))}
        </div>
      </section>

      <section className="border-y border-ink-700 bg-ink-900/65">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8 lg:py-16">
          {principles.map((principle, index) => (
            <article key={principle.title} className="relative pl-6">
              <span
                aria-hidden="true"
                className="absolute top-1 left-0 text-xs font-black text-brass-400"
              >
                0{index + 1}
              </span>
              <h2 className="text-base font-bold text-paper-50">
                {principle.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {principle.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="border-l-2 border-brass-400/60 pl-5">
          <p className="text-sm leading-6 text-slate-400">
            HOI4 Battleplan is an unofficial fan project and is not affiliated
            with or endorsed by Paradox Interactive. The interface and
            placeholder branding are original.
          </p>
        </div>
      </section>
    </>
  );
}
