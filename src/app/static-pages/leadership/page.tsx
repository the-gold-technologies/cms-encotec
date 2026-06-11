"use client";

import { PageHeader } from "@/components/PageHeader";
import { LeadershipHeroCMS } from "./components/LeadershipHeroCMS";
import { LeadershipPhilosophyCMS } from "./components/LeadershipPhilosophyCMS";
import { ExecutiveTeamCMS } from "./components/ExecutiveTeamCMS";
import { SeniorLeadershipCMS } from "./components/SeniorLeadershipCMS";
import { TeamByNumbersCMS } from "./components/TeamByNumbersCMS";
import { CultureValuesCMS } from "./components/CultureValuesCMS";
import { JoinCTACMS } from "./components/JoinCTACMS";

export default function LeadershipCMSPage() {
  return (
    <section className="flex flex-col gap-6 pb-12">
      <PageHeader
        title="Leadership Page Content"
        description="Manage details, profiles, statistics, values, and CTAs of the dedicated Leadership page. Save each section independently."
      />

      <div className="flex flex-col gap-6">
        <LeadershipHeroCMS />
        <LeadershipPhilosophyCMS />
        <ExecutiveTeamCMS />
        <SeniorLeadershipCMS />
        <TeamByNumbersCMS />
        <CultureValuesCMS />
        <JoinCTACMS />
      </div>
    </section>
  );
}
