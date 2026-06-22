// @vitest-environment node

import { describe, expect, it } from "vitest";

import { loadAllGameData } from "@/lib/game-data/loader";

describe("repository game data", () => {
  it("loads every checked-in game version", () => {
    const dataSets = loadAllGameData();

    expect(dataSets).toHaveLength(1);
    expect(dataSets[0]).toEqual(
      expect.objectContaining({
        version: expect.objectContaining({
          id: "1.16-sample",
          status: "sample",
        }),
      }),
    );
    expect(dataSets[0]?.units.length).toBeGreaterThan(0);
  });
});
