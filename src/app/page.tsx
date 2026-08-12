import { Hero } from "@/components/sections/Hero";
import { CustomerJourney } from "@/components/sections/CustomerJourney";
import { CostOfWaiting } from "@/components/sections/CostOfWaiting";
import { DigitalPresenceProblem } from "@/components/sections/DigitalPresenceProblem";
import { MeetGraphikosX } from "@/components/sections/MeetGraphikosX";
import { Vision } from "@/components/sections/Vision";
import { Mission } from "@/components/sections/Mission";
import { Philosophy } from "@/components/sections/Philosophy";
import { IndustriesTeaser } from "@/components/sections/IndustriesTeaser";
import { BuildGrowScale } from "@/components/sections/BuildGrowScale";
import { BusinessOutcomes } from "@/components/sections/BusinessOutcomes";
import { Ecosystem } from "@/components/sections/Ecosystem";
import { HowWeWork } from "@/components/sections/HowWeWork";
import { WhyGraphikosX } from "@/components/sections/WhyGraphikosX";
import { FounderSection } from "@/components/sections/FounderSection";
import { FreeAuditCTA } from "@/components/sections/FreeAuditCTA";
import { homepageSchemaGraph } from "@/lib/schema";

export default function Home() {
  const schema = homepageSchemaGraph();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Hero />
      <CustomerJourney />
      <CostOfWaiting />
      <DigitalPresenceProblem />
      <MeetGraphikosX />
      <Vision />
      <Mission />
      <Philosophy />
      <IndustriesTeaser />
      <BuildGrowScale />
      <BusinessOutcomes />
      <Ecosystem />
      <HowWeWork />
      <WhyGraphikosX />
      <FounderSection />
      <FreeAuditCTA source="homepage-cta" />
    </>
  );
}
