"use client";

import { useMemo, useState } from "react";

import type { GameDataSet } from "@/lib/game-data";
import { calculateDivisionStats } from "@/features/division-builder/calculation";
import { DivisionGrid } from "@/features/division-builder/division-grid";
import { DivisionStatistics } from "@/features/division-builder/division-statistics";
import {
  divisionRoles,
  evaluateDivision,
} from "@/features/division-builder/evaluation";
import { EvaluationPanel } from "@/features/division-builder/evaluation-panel";
import {
  createEmptyDivisionTemplate,
  removeLineBattalion,
  removeSupportCompany,
  setLineBattalion,
  setSupportCompany,
} from "@/features/division-builder/template";
import type {
  DivisionRoleId,
  TemplateIssue,
} from "@/features/division-builder/types";
import { SupportSlots } from "@/features/division-builder/support-slots";

type DivisionBuilderProps = {
  dataSet: GameDataSet;
};

type BuilderFeedback = {
  slotKey: string;
  issue: TemplateIssue;
} | null;

export function DivisionBuilder({ dataSet }: DivisionBuilderProps) {
  const [template, setTemplate] = useState(() =>
    createEmptyDivisionTemplate(dataSet.version.id),
  );
  const [feedback, setFeedback] = useState<BuilderFeedback>(null);
  const calculation = useMemo(
    () => calculateDivisionStats(template, dataSet),
    [template, dataSet],
  );
  const evaluation = useMemo(
    () => evaluateDivision(template, calculation, dataSet),
    [template, calculation, dataSet],
  );
  const selectedRole = divisionRoles.find(
    (role) => role.id === template.roleId,
  )!;
  const feedbackId = "builder-placement-feedback";

  function changeLineSlot(row: number, column: number, unitId: string) {
    if (!unitId) {
      setTemplate((current) => removeLineBattalion(current, row, column));
      setFeedback(null);
      return;
    }

    const result = setLineBattalion(template, row, column, unitId, dataSet);

    if (result.ok) {
      setTemplate(result.template);
      setFeedback(null);
    } else {
      setFeedback({ slotKey: `line-${row}-${column}`, issue: result.issue });
    }
  }

  function changeSupportSlot(index: number, unitId: string) {
    if (!unitId) {
      setTemplate((current) => removeSupportCompany(current, index));
      setFeedback(null);
      return;
    }

    const result = setSupportCompany(template, index, unitId, dataSet);

    if (result.ok) {
      setTemplate(result.template);
      setFeedback(null);
    } else {
      setFeedback({ slotKey: `support-${index}`, issue: result.issue });
    }
  }

  function resetTemplate() {
    setTemplate(
      createEmptyDivisionTemplate(dataSet.version.id, template.roleId),
    );
    setFeedback(null);
  }

  return (
    <div className="space-y-8">
      <section className="panel p-5 sm:p-6" aria-labelledby="role-heading">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
          <div>
            <p className="eyebrow">Mission selection</p>
            <h2
              id="role-heading"
              className="mt-2 text-xl font-bold text-paper-50"
            >
              Intended division role
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              {selectedRole.description}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <label className="flex-1">
              <span className="mb-1.5 block text-[0.65rem] font-bold tracking-[0.1em] text-slate-500 uppercase">
                Evaluate for
              </span>
              <select
                className="focus-ring min-h-11 w-full rounded-sm border border-ink-600 bg-ink-950 px-3 py-2 text-sm font-semibold text-paper-100"
                value={template.roleId}
                onChange={(event) =>
                  setTemplate((current) => ({
                    ...current,
                    roleId: event.target.value as DivisionRoleId,
                  }))
                }
              >
                {divisionRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="focus-ring min-h-11 rounded-sm border border-ink-600 px-4 py-2 text-sm font-bold text-slate-300 hover:bg-ink-800 hover:text-paper-50"
              onClick={resetTemplate}
            >
              Reset template
            </button>
          </div>
        </div>
      </section>

      {feedback ? (
        <div
          id={feedbackId}
          role="alert"
          className="border-l-2 border-red-400 bg-red-400/8 p-4 text-sm leading-6 text-red-100"
        >
          <strong>Placement blocked:</strong> {feedback.issue.message}
        </div>
      ) : (
        <p id={feedbackId} className="sr-only" aria-live="polite">
          Placement accepted.
        </p>
      )}

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <DivisionGrid
          dataSet={dataSet}
          template={template}
          invalidSlotKey={feedback?.slotKey ?? null}
          feedbackId={feedbackId}
          onChange={changeLineSlot}
        />
        <SupportSlots
          dataSet={dataSet}
          template={template}
          invalidSlotKey={feedback?.slotKey ?? null}
          feedbackId={feedbackId}
          onChange={changeSupportSlot}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <DivisionStatistics calculation={calculation} />
        <EvaluationPanel evaluation={evaluation} />
      </div>
    </div>
  );
}
