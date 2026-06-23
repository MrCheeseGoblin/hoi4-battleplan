import { loadAllGameData } from "@/lib/game-data";

export const DIVISION_BUILDER_VERSION_ID = "1.16-sample";

export function loadDivisionBuilderData() {
  const dataSet = loadAllGameData().find(
    (candidate) => candidate.version.id === DIVISION_BUILDER_VERSION_ID,
  );

  if (!dataSet) {
    throw new Error(
      `Division Builder game version "${DIVISION_BUILDER_VERSION_ID}" was not found.`,
    );
  }

  return dataSet;
}
