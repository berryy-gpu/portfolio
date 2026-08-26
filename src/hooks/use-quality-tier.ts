import { useContext } from "react";

import { QualityContext } from "@/components/providers/quality-provider";

/** Reads the current render-quality tier ('high' | 'medium' | 'low') set by QualityProvider. */
export function useQualityTier() {
  return useContext(QualityContext);
}
