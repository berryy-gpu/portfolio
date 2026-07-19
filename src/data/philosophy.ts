export interface PhilosophyStage {
  id: string;
  title: string;
  description: string;
}

/**
 * The six-stage Working Philosophy from the Master Design Specification —
 * the approved process content for "From Idea to Impact." Structured here
 * rather than left in planning docs so the section can stay data-driven.
 */
export const philosophyStages: PhilosophyStage[] = [
  {
    id: "discovery",
    title: "Discovery",
    description: "Understand the business problem before any decision.",
  },
  {
    id: "communication",
    title: "Communication",
    description: "Honest, direct — no silent gaps.",
  },
  {
    id: "planning",
    title: "Planning",
    description: "Scoped, milestone-based, realistic.",
  },
  {
    id: "execution",
    title: "Execution",
    description: "Iterative, with feedback checkpoints.",
  },
  {
    id: "delivery",
    title: "Delivery",
    description: "Polished, tested, performance-checked.",
  },
  {
    id: "long-term-support",
    title: "Long-term Support",
    description: "The relationship continues past launch.",
  },
];
