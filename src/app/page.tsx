import { FeaturedWork } from "@/components/sections/featured-work";
import { Hero } from "@/components/sections/hero";
import { ServicesOverview } from "@/components/sections/services-overview";

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <FeaturedWork />
    </>
  );
}
