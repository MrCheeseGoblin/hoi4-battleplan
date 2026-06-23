import { DIVISION_GRID_COLUMNS } from "@/features/division-builder/types";

export function lineSlotIndex(row: number, column: number) {
  return row * DIVISION_GRID_COLUMNS + column;
}
