export interface AboutTimelineEntry {
  year: string;
  description: string;
}

export interface AboutContent {
  statement: string;
  storyParagraphs: string[];
  philosophy: string;
  enjoys: string[];
  timeline: AboutTimelineEntry[];
}

/**
 * Real, user-provided personal content — no company, client, or
 * employer names (by explicit instruction), technical experience woven
 * into the narrative rather than listed, no separate "fun facts"
 * section (personality comes through the writing itself). This is the
 * one page on the site written in first person.
 */
export const aboutContent: AboutContent = {
  statement: "I don't just build websites. I build things people remember.",

  storyParagraphs: [
    "Four years ago I started freelancing with one goal: get good enough to compete with the best creative agencies and developers out there. There was no roadmap — just a habit of saying yes to hard problems and figuring them out as I went.",
    "Since then I've built and shipped a wide range of digital products — responsive frontends, WordPress builds from the theme layer up, WooCommerce stores, UI systems, API integrations, sites tuned for speed and SEO from the ground up. Somewhere along the way, Git stopped being a tool I used and became just how I think about work: in small, deliberate, reviewable steps.",
    "My goal was never just to launch a website. It's to build things people actually remember using. That's why I spend as much time studying interaction design, motion, and modern frontend tooling — React, Next.js among them — as I do writing code. The best products happen where design and engineering stop being separate disciplines.",
    "I compete with my own past work more than anyone else's. Every project is a chance to raise the bar I set for myself last time — a little faster, a little more considered, a little closer to the standard set by the studios I admire most.",
  ],

  philosophy:
    "Great digital products should feel effortless. A beautiful interface means very little if it doesn't solve a real problem — every project has to balance how it looks with how it works, how fast it loads, and how long it'll hold up. The details most people never consciously notice are usually the difference between something ordinary and something memorable.",

  enjoys: [
    "Premium websites",
    "Interactive frontend experiences",
    "Modern UI systems",
    "WordPress solutions",
    "Social media campaigns",
    "Motion graphics and reels",
    "Automation and AI-powered workflows",
    "Performance-focused web experiences",
  ],

  timeline: [
    {
      year: "2021",
      description:
        "Started freelancing and building websites while learning modern web technologies from the ground up.",
    },
    {
      year: "2022",
      description:
        "Moved into full responsive frontend builds, WordPress theme customization, and UI-focused projects.",
    },
    {
      year: "2023",
      description:
        "Took on increasingly complex builds — sharpening SEO fundamentals, performance optimization, and end-to-end client solutions.",
    },
    {
      year: "2024 — Present",
      description:
        "Focused on premium frontend experiences, modern development workflows, interactive interfaces, and creative work across social and motion.",
    },
  ],
};
