import Link from "next/link";

type FeatureCardProps = {
  code: string;
  title: string;
  description: string;
  href: `/${string}`;
  linkLabel: string;
  status: string;
};

export function FeatureCard({
  code,
  title,
  description,
  href,
  linkLabel,
  status,
}: FeatureCardProps) {
  return (
    <article className="panel group flex h-full flex-col p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-black tracking-[0.2em] text-brass-300 uppercase">
          {code}
        </span>
        <span className="rounded-full border border-ink-600 px-2.5 py-1 text-[0.65rem] font-bold tracking-[0.12em] text-slate-400 uppercase">
          {status}
        </span>
      </div>
      <h2 className="mt-8 text-xl font-bold text-paper-50">{title}</h2>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">
        {description}
      </p>
      <Link
        href={href}
        className="focus-ring mt-6 inline-flex min-h-10 items-center self-start rounded-sm text-sm font-bold text-olive-200 underline decoration-olive-500/40 underline-offset-4 transition-colors hover:text-olive-100"
      >
        {linkLabel}
        <span
          aria-hidden="true"
          className="ml-2 transition-transform group-hover:translate-x-1"
        >
          →
        </span>
      </Link>
    </article>
  );
}
