"use client";

import { PageHeader } from "@/components/PageHeader";
import { CareersHeroCMS } from "./components/CareersHeroCMS";
import { CareersCultureCMS } from "./components/CareersCultureCMS";
import { CareersBenefitsCMS } from "./components/CareersBenefitsCMS";
import { CareersOpenPositionsCMS } from "./components/CareersOpenPositionsCMS";
import { CareersGalleryCMS } from "./components/CareersGalleryCMS";
import { CareersProcessCMS } from "./components/CareersProcessCMS";
import { CareersCTACMS } from "./components/CareersCTACMS";

export default function CareersCMSPage() {
  return (
    <section className="flex flex-col gap-6 pb-12">
      <PageHeader
        title="Careers Page Content"
        description="Manage job application settings, HR contact channels, benefits, positions, process, and culture values. Save each section independently."
      />

      <div className="flex flex-col gap-6">
        <CareersHeroCMS />
        <CareersCultureCMS />
        <CareersBenefitsCMS />
        <CareersOpenPositionsCMS />
        <CareersGalleryCMS />
        <CareersProcessCMS />
        <CareersCTACMS />
      </div>
    </section>
  );
}
