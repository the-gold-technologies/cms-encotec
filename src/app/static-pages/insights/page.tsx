"use client";

import { PageHeader } from "@/components/PageHeader";
import { InsightsHeroCMS } from "./components/InsightsHeroCMS";
import { FeaturedInsightCMS } from "./components/FeaturedInsightCMS";
import { StatsBannerCMS } from "./components/StatsBannerCMS";
import { InsightsCTACMS } from "./components/InsightsCTACMS";
import { RelatedInsightsCMS } from "./components/RelatedInsightsCMS";

export default function InsightsCMSPage() {
  return (
    <section className="flex flex-col gap-6 pb-12">
      <PageHeader
        title="Insights Page Content"
        description="Manage details, featured articles, stats, and CTAs of the dedicated Insights page. Save each section independently."
      />

      <div className="flex flex-col gap-6">
        <InsightsHeroCMS />
        <FeaturedInsightCMS />
        <StatsBannerCMS />
        <InsightsCTACMS />
        <RelatedInsightsCMS />
      </div>
    </section>
  );
}
