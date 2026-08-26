import type { Metadata } from "next";

import { Process } from "@/components/sections/process";
import { Container } from "@/components/ui/container";
import { Faq } from "@/components/services/faq";
import { ServiceBlock } from "@/components/services/service-block";
import { ServicesCta } from "@/components/services/services-cta";
import { ServicesHero } from "@/components/services/services-hero";
import { TechStack } from "@/components/services/tech-stack";
import { getServiceDetail, getRelevantClients } from "@/data/service-detail";
import { services } from "@/data/services";

import { servicesDescription } from "./page-meta";

export const metadata: Metadata = {
  title: "Services",
  description: servicesDescription,
};

export default function ServicesPage() {
  const sortedServices = [...services].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  return (
    <>
      <ServicesHero />
      <Container>
        <div className="flex flex-col">
          {sortedServices.map((service, index) => {
            const detail = getServiceDetail(service.id);
            if (!detail) return null;

            return (
              <ServiceBlock
                key={service.id}
                index={index}
                service={service}
                detail={detail}
                relevantClients={getRelevantClients(service.categoryIds)}
              />
            );
          })}
        </div>
      </Container>
      <Process />
      <TechStack />
      <Faq />
      <ServicesCta />
    </>
  );
}
