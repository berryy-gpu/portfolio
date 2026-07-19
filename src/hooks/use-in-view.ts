import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether an element is currently intersecting the viewport.
 * Used for functional visibility state (e.g. gating video playback) —
 * not for one-time entrance reveals, which is what useScrollReveal is for.
 */
export function useInView<T extends HTMLElement>(threshold = 0.5) {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}
