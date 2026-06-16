"use client";

import { PageHeader } from "@/components/PageHeader";
import { HeroSection } from "@/static-pages/home/components/HeroSection";
import { AboutUs } from "@/static-pages/home/components/AboutUs";
import { ServicesSection } from "@/static-pages/home/components/ServicesSection";
import { ProcessSection } from "@/static-pages/home/components/ProcessSection";
import { ProjectShowcaseSection } from "@/static-pages/home/components/ProjectShowcaseSection";
import { GlobalFootprintSection } from "@/static-pages/home/components/GlobalFootprintSection";
import { WhyEncotecSection } from "@/static-pages/home/components/WhyEncotecSection";
import { TestimonialsSection } from "@/static-pages/home/components/TestimonialsSection";
import { LogoStripSection } from "@/static-pages/home/components/LogoStripSection";
import { CTASection } from "@/static-pages/home/components/CTASection";
import FooterCMS from "@/components/cms/sections/FooterCMS";

export default function HomeCMSPage() {
  return (
    <section className="flex flex-col gap-8 pb-12">
      <PageHeader
        title="Home Page Content"
        description="Manage the layout sections of your homepage. Expand any section to edit its details."
      />

      <HeroSection />
      <AboutUs />
      <ServicesSection />
      <ProcessSection />
      <ProjectShowcaseSection />
      <GlobalFootprintSection />
      <WhyEncotecSection />
      <TestimonialsSection />
      <LogoStripSection />
      <CTASection />
    </section>
  );
}
