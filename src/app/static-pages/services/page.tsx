import { PageHeader } from "@/components/PageHeader";
import { ServicesHeroCMS } from "./components/ServicesHeroCMS";
import { IntroSectionCMS } from "./components/IntroSectionCMS";
import { CoreServicesCMS } from "./components/CoreServicesCMS";
import { IndustriesSectionCMS } from "./components/IndustriesSectionCMS";
import { ProcessSectionCMS } from "./components/ProcessSectionCMS";
import { ClosingSectionCMS } from "./components/ClosingSectionCMS";

export default function ServicesCMSPage() {
  return (
    <section className="flex flex-col gap-6">
      <PageHeader
        title="Services Page Content"
        description="Manage the content displayed on the Services page, including core engineering services, target capabilities, value statements, industries served, and workflows."
      />

      <ServicesHeroCMS />
      <IntroSectionCMS />
      <CoreServicesCMS />
      <IndustriesSectionCMS />
      <ProcessSectionCMS />
      <ClosingSectionCMS />
    </section>
  );
}
