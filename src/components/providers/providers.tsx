import type { ReactNode } from "react";

import { SmoothScroller } from "@/components/providers/smooth-scroller";

export function Providers({ children }: { children: ReactNode }) {
  return <SmoothScroller>{children}</SmoothScroller>;
}
