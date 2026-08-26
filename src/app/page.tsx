import { Fragment } from "react";

import { AccentLine } from "@/components/motion/accent-line";
import { homepageSections } from "@/components/sections/homepage-sections";

export default function Home() {
  return (
    <>
      {homepageSections.map(({ id, component: SectionComponent }, index) => (
        <Fragment key={id}>
          {index > 0 && <AccentLine />}
          <SectionComponent />
        </Fragment>
      ))}
    </>
  );
}
