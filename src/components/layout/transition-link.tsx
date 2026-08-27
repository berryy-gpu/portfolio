"use client";

/**
 * Drop-in replacement for next/link that routes through the page
 * transition overlay instead of navigating directly. Always renders a
 * real next/link `<a href>` under the hood, so middle-click, ctrl/cmd-
 * click, and crawlers all still work — only a plain left-click is
 * intercepted. Prefetches on pointerenter so the destination is warm by
 * the time the wipe-in finishes.
 *
 * playClick fires on every real (non-modified) click, unconditionally —
 * SoundProvider already no-ops when sound isn't enabled, so this doesn't
 * need its own gating. playHover is opt-in via `withHoverSound` (default
 * off) — this component is used for dozens of links site-wide (footer
 * nav, badges, etc.) that shouldn't all get a hover cue; callers that
 * are a deliberate, discrete interaction (primary nav, work/CTA cards)
 * opt in explicitly.
 */

import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type PointerEvent,
} from "react";

import { usePageTransition } from "@/components/providers/transition-provider";
import { useSound } from "@/components/providers/sound-provider";

interface TransitionLinkProps
  extends LinkProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> {
  /** Shown in the overlay while covered — usually the destination page's name. */
  label: string;
  /** Opt-in hover cue — see docstring above. */
  withHoverSound?: boolean;
}

export const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  function TransitionLink(
    { href, label, withHoverSound = false, onClick, onPointerEnter, children, ...rest },
    ref
  ) {
    const { beginTransition } = usePageTransition();
    const router = useRouter();
    const { playClick, playHover } = useSound();

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;

      const isModifiedClick =
        event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
      if (isModifiedClick) return;

      playClick();
      event.preventDefault();
      beginTransition(href.toString(), label);
    };

    const handlePointerEnter = (event: PointerEvent<HTMLAnchorElement>) => {
      onPointerEnter?.(event);
      if (withHoverSound) playHover();
      router.prefetch(href.toString());
    };

    return (
      <Link
        ref={ref}
        href={href}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        {...rest}
      >
        {children}
      </Link>
    );
  }
);
