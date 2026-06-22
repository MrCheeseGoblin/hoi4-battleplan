import type { Metadata } from "next";

import { PlaceholderSection } from "@/components/ui/placeholder-section";

export const metadata: Metadata = {
  title: "Nation guides",
  description:
    "The future structured, practical, and version-aware Hearts of Iron IV nation guide library.",
};

const outcomes = [
  "One complete path before broad coverage",
  "Focus and political order",
  "Research and production priorities",
  "Division and timing milestones",
  "Common mistakes and alternatives",
  "Patch, DLC, and verification metadata",
] as const;

export default function GuidesPage() {
  return (
    <PlaceholderSection
      phase="Phase 5 / Nation guides"
      title="Turn national potential into an executable plan."
      description="Guides will be structured around decisions and timing rather than long undifferentiated prose, with clear patch assumptions and links back to the units and divisions they recommend."
      outcomes={outcomes}
    />
  );
}
