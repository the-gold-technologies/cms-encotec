"use client";

import { PageHeader } from "@/components/PageHeader";
import { CertificationsHeroCMS } from "./components/CertificationsHeroCMS";
import { TrustStatsCMS } from "./components/TrustStatsCMS";
import { CertificationsGridCMS } from "./components/CertificationsGridCMS";
import { StrategicPartnersCMS } from "./components/StrategicPartnersCMS";
import { IndustryMembershipsCMS } from "./components/IndustryMembershipsCMS";
import { CertificationsCTACMS } from "./components/CertificationsCTACMS";

export default function CertificationsCMSPage() {
  return (
    <section className="flex flex-col gap-6 pb-12">
      <PageHeader
        title="Certifications Page Content"
        description="Manage the ISO compliance credentials, statistics, strategic partners, memberships, and call-to-actions. Save each section independently."
      />

      <div className="flex flex-col gap-6">
        <CertificationsHeroCMS />
        <TrustStatsCMS />
        <CertificationsGridCMS />
        <StrategicPartnersCMS />
        <IndustryMembershipsCMS />
        <CertificationsCTACMS />
      </div>
    </section>
  );
}
