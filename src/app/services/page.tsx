import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { ServiceBlock } from "@/components/services/service-block";
import { ServicesCta } from "@/components/services/services-cta";
import { ServicesHero } from "@/components/services/services-hero";
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
                title={service.title}
                detail={detail}
                relevantClients={getRelevantClients(service.categoryIds)}
              />
            );
          })}
        </div>
      </Container>
      <ServicesCta />
    </>
  );
}
