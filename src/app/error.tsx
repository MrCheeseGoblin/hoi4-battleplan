"use client";

import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="planning-grid flex min-h-[65vh] items-center border-b border-ink-700">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="eyebrow">Application error</p>
        <h1 className="mt-4 max-w-2xl text-4xl font-black tracking-[-0.035em] text-paper-50 sm:text-5xl">
          The plan encountered an unexpected obstacle.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
          No changes were made to your work. Try loading this section again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="focus-ring mt-8 inline-flex min-h-12 cursor-pointer items-center rounded-sm bg-olive-400 px-5 py-3 text-sm font-black text-ink-950 uppercase hover:bg-olive-300"
        >
          Try again
        </button>
      </div>
    </section>
  );
}
