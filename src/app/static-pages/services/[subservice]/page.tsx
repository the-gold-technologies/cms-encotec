import { PageHeader } from "@/components/PageHeader";
import { notFound } from "next/navigation";

// Engineering Editors
import {
  EngineeringHeroCMS,
  OverviewSectionCMS,
  CapabilitiesSectionCMS,
  ProcessSectionCMS,
  StatsSectionCMS,
  FeaturedProjectSectionCMS,
  ValueSectionCMS,
  RelatedServicesSectionCMS,
  CTASectionCMS,
} from "./components/EngineeringComponents";

// Project Management Editors
import {
  ProjectHeroCMS,
  PhilosophySectionCMS,
  CoreOfferingsCMS,
  ProjectStatsSectionCMS,
} from "./components/ProjectManagementComponents";

// Power Generation Editors
import {
  StewardshipHeroCMS,
  StewardshipFeaturesCMS,
  StewardshipPhilosophyCMS,
} from "./components/PowerGenerationComponents";

// Transmission & Distribution Editors
import {
  ConstructionHeroCMS,
  ConstructionCapabilitiesCMS,
  ProcessFlowCMS,
} from "./components/TransmissionDistributionComponents";

// Renewable Energy Editors
import {
  AdvisoryHeroCMS,
  AdvisoryFeaturesCMS,
  DiagnosticProcessCMS,
} from "./components/RenewableEnergyComponents";

// Airport Services Editors
import {
  DueDiligenceHeroCMS,
  HealthFeaturesCMS,
  ValueProtectionCMS,
} from "./components/AirportServicesComponents";

// Value-Added Services Editors
import {
  SourcingHeroCMS,
  SourcingFeaturesCMS,
  SourcingAdvantageCMS,
} from "./components/ValueAddedComponents";

interface PageProps {
  params: Promise<{ subservice: string }>;
}

const validSubservices = [
  "engineering",
  "project-management",
  "power-generation",
  "transmission-distribution",
  "renewable-energy",
  "airport-services",
  "value-added",
];

export default async function SubServicePage({ params }: PageProps) {
  const { subservice } = await params;

  if (!validSubservices.includes(subservice)) {
    notFound();
  }

  const saveUrl = `/api/services/${subservice}`;

  if (subservice === "engineering") {
    return (
      <section className="flex flex-col gap-6">
        <PageHeader
          title="Engineering Services Content"
          description="Manage headlines, stats badges, capabilities cards, methodology steps, impacts, and features of the Engineering Services page."
        />
        <EngineeringHeroCMS saveUrl={saveUrl} />
        <OverviewSectionCMS saveUrl={saveUrl} />
        <CapabilitiesSectionCMS saveUrl={saveUrl} />
        <ProcessSectionCMS saveUrl={saveUrl} />
        <StatsSectionCMS saveUrl={saveUrl} />
        <FeaturedProjectSectionCMS saveUrl={saveUrl} />
        <ValueSectionCMS saveUrl={saveUrl} />
        <RelatedServicesSectionCMS saveUrl={saveUrl} />
        <CTASectionCMS saveUrl={saveUrl} />
      </section>
    );
  }

  if (subservice === "project-management") {
    return (
      <section className="flex flex-col gap-6">
        <PageHeader
          title="Project Management Content"
          description="Manage headlines, pre-feasibility cards, strategic philosophies, and core development services."
        />
        <ProjectHeroCMS saveUrl={saveUrl} />
        <PhilosophySectionCMS saveUrl={saveUrl} />
        <CoreOfferingsCMS saveUrl={saveUrl} />
        <ProjectStatsSectionCMS saveUrl={saveUrl} />
        <CTASectionCMS saveUrl={saveUrl} />
      </section>
    );
  }

  if (subservice === "power-generation") {
    return (
      <section className="flex flex-col gap-6">
        <PageHeader
          title="Power Generation Content"
          description="Manage asset stewardship O&M headlines, thermal/airport capability sections, and philosophy items."
        />
        <StewardshipHeroCMS saveUrl={saveUrl} />
        <StewardshipFeaturesCMS saveUrl={saveUrl} />
        <StewardshipPhilosophyCMS saveUrl={saveUrl} />
        <CTASectionCMS saveUrl={saveUrl} />
      </section>
    );
  }

  if (subservice === "transmission-distribution") {
    return (
      <section className="flex flex-col gap-6">
        <PageHeader
          title="Construction, Commissioning & Relocation Content"
          description="Manage construction/relocation headlines, physical capabilities, investment protection, and relocation workflow processes."
        />
        <ConstructionHeroCMS saveUrl={saveUrl} />
        <ConstructionCapabilitiesCMS saveUrl={saveUrl} />
        <ValueProtectionCMS saveUrl={saveUrl} />
        <ProcessFlowCMS saveUrl={saveUrl} />
        <CTASectionCMS saveUrl={saveUrl} />
      </section>
    );
  }

  if (subservice === "renewable-energy") {
    return (
      <section className="flex flex-col gap-6">
        <PageHeader
          title="Renewable Energy Content"
          description="Manage advisory headlines, NDT testing parameters, and advisory/diagnostic workflow details."
        />
        <AdvisoryHeroCMS saveUrl={saveUrl} />
        <AdvisoryFeaturesCMS saveUrl={saveUrl} />
        <DiagnosticProcessCMS saveUrl={saveUrl} />
        <CTASectionCMS saveUrl={saveUrl} />
      </section>
    );
  }

  if (subservice === "airport-services") {
    return (
      <section className="flex flex-col gap-6">
        <PageHeader
          title="Airport Services Content"
          description="Manage due diligence headlines, residual life assessments, and value protection checklists."
        />
        <DueDiligenceHeroCMS saveUrl={saveUrl} />
        <HealthFeaturesCMS saveUrl={saveUrl} />
        <ValueProtectionCMS saveUrl={saveUrl} />
        <CTASectionCMS saveUrl={saveUrl} />
      </section>
    );
  }

  if (subservice === "value-added") {
    return (
      <section className="flex flex-col gap-6">
        <PageHeader
          title="Value-Added Services Content"
          description="Manage global sourcing and critical spares procurements, logistics, and partner OEMs."
        />
        <SourcingHeroCMS saveUrl={saveUrl} />
        <SourcingFeaturesCMS saveUrl={saveUrl} />
        <SourcingAdvantageCMS saveUrl={saveUrl} />
        <CTASectionCMS saveUrl={saveUrl} />
      </section>
    );
  }

  return null;
}
