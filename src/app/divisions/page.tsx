import type { Metadata } from "next";

import { PlaceholderSection } from "@/components/ui/placeholder-section";

export const metadata: Metadata = {
  title: "Division workspace",
  description:
    "The future role-based Hearts of Iron IV division builder and evaluation workspace.",
};

const outcomes = [
  "Structured line-battalion grid",
  "Five support-company slots",
  "Regiment compatibility rules",
  "Role and context selection",
  "Canonical stat calculations",
  "Transparent strengths and warnings",
] as const;

export default function DivisionsPage() {
  return (
    <PlaceholderSection
      phase="Phase 4 / Division builder"
      title="Build the formation around its mission."
      description="The flagship workspace will calculate from canonical data and explain whether a template fits its selected role—without pretending there is one universal best division."
      outcomes={outcomes}
    />
  );
}
