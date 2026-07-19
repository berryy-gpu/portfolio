import { homepageSections } from "@/components/sections/homepage-sections";

export default function Home() {
  return (
    <>
      {homepageSections.map(({ id, component: SectionComponent }) => (
        <SectionComponent key={id} />
      ))}
    </>
  );
}
