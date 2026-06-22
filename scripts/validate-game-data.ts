import path from "node:path";

import { GameDataValidationError } from "../src/lib/game-data/errors";
import { loadAllGameData } from "../src/lib/game-data/loader";

const gameDataRoot = path.resolve(process.cwd(), "data", "game");

try {
  const dataSets = loadAllGameData(gameDataRoot);
  const totals = dataSets.reduce(
    (result, dataSet) => ({
      versions: result.versions + 1,
      dlcs: result.dlcs + dataSet.dlcs.length,
      equipment: result.equipment + dataSet.equipment.length,
      units: result.units + dataSet.units.length,
    }),
    { versions: 0, dlcs: 0, equipment: 0, units: 0 },
  );

  console.log(
    `Game data valid: ${totals.versions} version, ${totals.dlcs} DLC, ${totals.equipment} equipment records, ${totals.units} units.`,
  );
} catch (error) {
  if (error instanceof GameDataValidationError) {
    console.error(error.message);
    process.exitCode = 1;
  } else {
    throw error;
  }
}
