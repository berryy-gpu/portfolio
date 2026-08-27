"use client";

/**
 * /gallery's click-through lightbox (REBUILD-SPEC.md step 8) — a flat
 * sequence across every item on the page (images, reels, showreels, in
 * document order), with real keyboard arrow-key navigation and a focus
 * trap. Extends the focus-management pattern already established in
 * motion-reel-lightbox.tsx (Escape closes and returns focus, Tab cycles
 * without leaving the dialog) with actual prev/next stepping, which that
 * component didn't need.
 */

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { zIndex } from "@/lib/motion-tokens";

export interface GalleryLightboxItem {
  type: "image" | "video";
  src: string;
  alt: string;
  clientName: string;
  /** Real intrinsic dimensions — only present (and required) for image
   *  items, so next/image can size the lightbox view without a layout
   *  shift and without falling back to a plain <img> (which would skip
   *  Next's automatic AVIF/WebP negotiation). */
  width?: number;
  height?: number;
}

interface GalleryLightboxProps {
  items: GalleryLightboxItem[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

export function GalleryLightbox({ items, index, onIndexChange, onClose }: GalleryLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const item = items[index];

  const goTo = (delta: number) => {
    onIndexChange((index + delta + items.length) % items.length);
  };

  useEffect(() => {
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    return () => {
      previouslyFocusedRef.current?.focus();
    };
    // Only run this focus-capture/restore once for the lightbox's mount
    // lifetime, not on every index change.
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "ArrowRight") {
        goTo(1);
        return;
      }

      if (event.key === "ArrowLeft") {
        goTo(-1);
        return;
      }

      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button, [href], video, input, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, items.length, onClose]);

  if (!item) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${item.clientName} — ${index + 1} of ${items.length}`}
      style={{ zIndex: zIndex.modal }}
      className="fixed inset-0 flex items-center justify-center bg-background/95 p-6 backdrop-blur-functional"
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-6 right-6 text-text-primary transition-colors hover:text-accent"
      >
        <X aria-hidden="true" size={28} />
      </button>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(-1)}
            aria-label="Previous"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary transition-colors hover:text-accent md:left-8"
          >
            <ChevronLeft aria-hidden="true" size={32} />
          </button>
          <button
            type="button"
            onClick={() => goTo(1)}
            aria-label="Next"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-primary transition-colors hover:text-accent md:right-8"
          >
            <ChevronRight aria-hidden="true" size={32} />
          </button>
        </>
      )}

      <div className="flex max-h-full flex-col items-center gap-4">
        {item.type === "video" ? (
          <video
            key={item.src}
            src={item.src}
            controls
            autoPlay
            loop
            playsInline
            className="max-h-[80vh] w-auto rounded-lg"
          />
        ) : (
          <Image
            key={item.src}
            src={item.src}
            alt={item.alt}
            width={item.width ?? 1200}
            height={item.height ?? 800}
            className="h-auto max-h-[80vh] w-auto rounded-lg object-contain"
          />
        )}
        <p className="font-mono text-caption tracking-caption text-text-secondary uppercase">
          {item.clientName} — {index + 1} / {items.length}
        </p>
      </div>
    </div>
  );
}
