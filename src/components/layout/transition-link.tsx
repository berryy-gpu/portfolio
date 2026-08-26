"use client";

/**
 * Drop-in replacement for next/link that routes through the page
 * transition overlay instead of navigating directly. Always renders a
 * real next/link `<a href>` under the hood, so middle-click, ctrl/cmd-
 * click, and crawlers all still work — only a plain left-click is
 * intercepted. Prefetches on pointerenter so the destination is warm by
 * the time the wipe-in finishes.
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

interface TransitionLinkProps
  extends LinkProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> {
  /** Shown in the overlay while covered — usually the destination page's name. */
  label: string;
}

export const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  function TransitionLink(
    { href, label, onClick, onPointerEnter, children, ...rest },
    ref
  ) {
    const { beginTransition } = usePageTransition();
    const router = useRouter();

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;

      const isModifiedClick =
        event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
      if (isModifiedClick) return;

      event.preventDefault();
      beginTransition(href.toString(), label);
    };

    const handlePointerEnter = (event: PointerEvent<HTMLAnchorElement>) => {
      onPointerEnter?.(event);
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
