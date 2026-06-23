import type { DivisionEvaluation } from "@/features/division-builder/types";

type EvaluationPanelProps = {
  evaluation: DivisionEvaluation;
};

export function EvaluationPanel({ evaluation }: EvaluationPanelProps) {
  return (
    <section className="panel p-5 sm:p-6" aria-labelledby="evaluation-heading">
      <div className="flex flex-col justify-between gap-4 border-b border-ink-700 pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Role-specific coaching</p>
          <h2
            id="evaluation-heading"
            className="mt-2 text-xl font-bold text-paper-50"
          >
            {evaluation.roleName}
          </h2>
        </div>
        <div className="sm:text-right">
          <p className="text-xs font-bold tracking-[0.12em] text-slate-500 uppercase">
            Overall suitability
          </p>
          <p
            className="mt-1 text-lg font-black text-olive-200"
            data-testid="role-suitability"
          >
            {evaluation.suitabilityLabel}
            {evaluation.roleScore === null
              ? ""
              : ` · ${evaluation.roleScore}/100`}
          </p>
        </div>
      </div>

      {evaluation.dimensions.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {evaluation.dimensions.map((dimension) => (
            <article
              key={dimension.id}
              className="rounded-sm border border-ink-700 bg-ink-950/40 p-4"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-sm font-bold text-paper-100">
                  {dimension.label}
                </h3>
                <span className="text-xs font-black text-brass-300">
                  {dimension.score}/100
                </span>
              </div>
              <div
                className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-700"
                role="progressbar"
                aria-label={`${dimension.label} score`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={dimension.score}
              >
                <span
                  className="block h-full rounded-full bg-olive-400"
                  style={{ width: `${dimension.score}%` }}
                />
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-400">
                <strong className="text-paper-100">
                  {dimension.displayValue}.
                </strong>{" "}
                {dimension.explanation}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-5 text-sm leading-6 text-slate-400">
          Add line battalions to produce role-specific dimension scores.
        </p>
      )}

      <div className="mt-7 grid gap-6 lg:grid-cols-2">
        <ResultList
          title="Strengths"
          items={evaluation.strengths}
          empty="No role strengths identified yet."
        />
        <ResultList
          title="Weaknesses"
          items={evaluation.weaknesses}
          empty="No major role weaknesses identified yet."
        />
        <ResultList
          title="Critical warnings"
          items={evaluation.criticalWarnings}
          empty="No critical warnings."
          tone="warning"
        />
        <ResultList
          title="Improvement suggestions"
          items={evaluation.suggestions}
          empty="No immediate changes suggested by this simplified model."
        />
      </div>

      <details className="mt-7 rounded-sm border border-ink-700 bg-ink-950/40 p-4">
        <summary className="focus-ring cursor-pointer rounded-sm text-sm font-black text-paper-100">
          Assumptions and limitations
        </summary>
        <ul className="mt-4 space-y-2">
          {evaluation.assumptions.map((assumption) => (
            <li
              key={assumption}
              className="flex gap-3 text-xs leading-5 text-slate-400"
            >
              <span
                aria-hidden="true"
                className="mt-2 size-1.5 shrink-0 rounded-full bg-brass-400"
              />
              {assumption}
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}

function ResultList({
  title,
  items,
  empty,
  tone = "default",
}: {
  title: string;
  items: string[];
  empty: string;
  tone?: "default" | "warning";
}) {
  return (
    <section>
      <h3
        className={`text-xs font-black tracking-[0.12em] uppercase ${
          tone === "warning" ? "text-red-300" : "text-paper-100"
        }`}
      >
        {title}
      </h3>
      {items.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-sm leading-6 text-slate-400"
            >
              <span
                aria-hidden="true"
                className={`mt-2 size-1.5 shrink-0 rounded-full ${
                  tone === "warning" ? "bg-red-400" : "bg-olive-400"
                }`}
              />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm leading-6 text-slate-500">{empty}</p>
      )}
    </section>
  );
}
