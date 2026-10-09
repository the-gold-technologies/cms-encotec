"use client";

import { PageHeader } from "@/components/PageHeader";
import { GalleryHeroCMS } from "./components/GalleryHeroCMS";
import { GalleryGridCMS } from "./components/GalleryGridCMS";
import { GalleryCTACMS } from "./components/GalleryCTACMS";

export default function GalleryCMSPage() {
  return (
    <section className="flex flex-col gap-6 pb-12">
      <PageHeader
        title="Gallery Page Content"
        description="Manage visual portfolio, project showcases, field photos, and CTAs of the dedicated Gallery page. Save each section independently."
      />

      <div className="flex flex-col gap-6">
        <GalleryHeroCMS />
        <GalleryGridCMS />
        <GalleryCTACMS />
      </div>
    </section>
  );
}
