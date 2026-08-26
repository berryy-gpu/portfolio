import type { ReactNode } from "react";

import { QualityProvider } from "@/components/providers/quality-provider";
import { SmoothScroller } from "@/components/providers/smooth-scroller";
import { SoundProvider } from "@/components/providers/sound-provider";
import { TransitionProvider } from "@/components/providers/transition-provider";
import { WebGLProvider } from "@/components/providers/webgl-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QualityProvider>
      <WebGLProvider>
        <SmoothScroller>
          <SoundProvider>
            <TransitionProvider>{children}</TransitionProvider>
          </SoundProvider>
        </SmoothScroller>
      </WebGLProvider>
    </QualityProvider>
  );
}
