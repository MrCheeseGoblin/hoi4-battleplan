import { describe, expect, it } from "vitest";

import { primaryNavigation } from "@/lib/navigation";

describe("primaryNavigation", () => {
  it("contains one unique route for every shell destination", () => {
    const hrefs = primaryNavigation.map((item) => item.href);

    expect(new Set(hrefs).size).toBe(hrefs.length);
    expect(hrefs).toEqual(["/", "/divisions", "/units", "/guides", "/about"]);
  });
});
