import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  findUnitCatalogueEntry,
  loadUnitCatalogue,
} from "@/features/unit-catalogue/catalogue";
import { UnitDetail } from "@/features/unit-catalogue/unit-detail";

type UnitDetailPageProps = {
  params: Promise<{ unitId: string }>;
};

export function generateStaticParams() {
  return loadUnitCatalogue().entries.map(({ unit }) => ({
    unitId: unit.id,
  }));
}

export async function generateMetadata({
  params,
}: UnitDetailPageProps): Promise<Metadata> {
  const { unitId } = await params;
  const entry = findUnitCatalogueEntry(loadUnitCatalogue(), unitId);

  if (!entry) {
    return {
      title: "Unit not found",
    };
  }

  return {
    title: entry.unit.name,
    description:
      entry.guidance?.description ??
      `Canonical sample statistics for ${entry.unit.name}.`,
  };
}

export default async function UnitDetailPage({ params }: UnitDetailPageProps) {
  const { unitId } = await params;
  const catalogue = loadUnitCatalogue();
  const entry = findUnitCatalogueEntry(catalogue, unitId);

  if (!entry) {
    notFound();
  }

  return <UnitDetail catalogue={catalogue} entry={entry} />;
}
