import type { Metadata } from "next";

import { PlaceholderSection } from "@/components/ui/placeholder-section";

export const metadata: Metadata = {
  title: "Unit catalogue",
  description:
    "The future compact, practical, version-aware Hearts of Iron IV unit catalogue.",
};

const outcomes = [
  "Search and practical filters",
  "Compact unit comparison cards",
  "Version and DLC requirements",
  "Strengths and weaknesses",
  "Typical battlefield uses",
  "Related unit links",
] as const;

export default function UnitsPage() {
  return (
    <PlaceholderSection
      phase="Phase 3 / Unit catalogue"
      title="Know the tool before choosing the formation."
      description="The catalogue will pair key statistics with plain-language uses, trade-offs, requirements, and version context—all from the same data used by the division builder."
      outcomes={outcomes}
    />
  );
}
