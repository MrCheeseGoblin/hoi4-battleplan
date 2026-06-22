import type { ReactNode } from "react";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
};

export function PageIntro({
  eyebrow,
  title,
  description,
  aside,
}: PageIntroProps) {
  return (
    <section className="border-b border-ink-700 bg-ink-900/70">
      <div className="planning-grid">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 sm:px-6 sm:py-18 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:px-8">
          <div className="max-w-3xl">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.035em] text-paper-50 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              {description}
            </p>
          </div>
          {aside ? <div className="lg:pb-1">{aside}</div> : null}
        </div>
      </div>
    </section>
  );
}
