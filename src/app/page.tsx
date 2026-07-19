import { CraftInMotion } from "@/components/sections/craft-in-motion";
import { FeaturedWork } from "@/components/sections/featured-work";
import { FromIdeaToImpact } from "@/components/sections/from-idea-to-impact";
import { Hero } from "@/components/sections/hero";
import { ServicesOverview } from "@/components/sections/services-overview";

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <FeaturedWork />
      <CraftInMotion />
      <FromIdeaToImpact />
    </>
  );
}
