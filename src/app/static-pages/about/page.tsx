import { PageHeader } from "@/components/PageHeader";
import { AboutHeroCMS } from "./components/AboutHeroCMS";
import { WhoWeAreCMS } from "./components/WhoWeAreCMS";
import { MissionVisionValuesCMS } from "./components/MissionVisionValuesCMS";
import { ScaleImpactCMS } from "./components/ScaleImpactCMS";
import { TimelineCMS } from "./components/TimelineCMS";
import { SustainabilityCMS } from "./components/SustainabilityCMS";
import { GlobalPresenceCMS } from "./components/GlobalPresenceCMS";
import { LeadershipCMS } from "./components/LeadershipCMS";
import { ClosingStatementCMS } from "./components/ClosingStatementCMS";

export default function AboutCMSPage() {
  return (
    <section className="flex flex-col gap-6">
      <PageHeader
        title="About Page Content"
        description="Manage the content displayed on the About Us page, including Encotec's brand values, numbers, history timeline, green initiatives, and geographic reach."
      />

      <AboutHeroCMS />
      <WhoWeAreCMS />
      <MissionVisionValuesCMS />
      <ScaleImpactCMS />
      <TimelineCMS />
      <SustainabilityCMS />
      <GlobalPresenceCMS />
      <LeadershipCMS />
      <ClosingStatementCMS />
    </section>
  );
}
