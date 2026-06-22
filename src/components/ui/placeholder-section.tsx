import Link from "next/link";

type PlaceholderSectionProps = {
  phase: string;
  title: string;
  description: string;
  outcomes: readonly string[];
};

export function PlaceholderSection({
  phase,
  title,
  description,
  outcomes,
}: PlaceholderSectionProps) {
  return (
    <>
      <section className="border-b border-ink-700 bg-ink-900/70">
        <div className="planning-grid">
          <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
            <p className="eyebrow">{phase}</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-[-0.035em] text-paper-50 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              {description}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-8 lg:py-16">
        <div className="panel p-6 sm:p-8">
          <p className="eyebrow">Planned capability</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {outcomes.map((outcome) => (
              <li
                key={outcome}
                className="flex gap-3 border-t border-ink-700 pt-3 text-sm leading-6 text-slate-300"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-olive-400"
                />
                {outcome}
              </li>
            ))}
          </ul>
        </div>

        <aside className="border-l-2 border-brass-400/60 bg-brass-400/5 p-6">
          <p className="text-xs font-black tracking-[0.18em] text-brass-300 uppercase">
            Foundation status
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            This route is intentionally a shell. Core feature logic starts only
            after the canonical game-data layer is validated.
          </p>
          <Link
            href="/"
            className="focus-ring decoration-ink-500 mt-5 inline-flex rounded-sm text-sm font-bold text-paper-50 underline underline-offset-4"
          >
            Return to headquarters
          </Link>
        </aside>
      </section>
    </>
  );
}
