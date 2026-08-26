"use client";

/**
 * The Motion Reel's click-through lightbox — plays the selected clip
 * larger, with sound (unmuted, unlike the grid's silent autoplay), and
 * traps focus while open. Mirrors the focus-management pattern already
 * established in layout/navigation.tsx's mobile overlay: focus the first
 * interactive element on open, Escape closes and returns focus, Tab
 * cycles without ever leaving the dialog.
 */

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

import { getClientById } from "@/data/clients";
import type { Reel } from "@/data/reels";
import type { Showreel } from "@/data/showreels";
import { zIndex } from "@/lib/motion-tokens";

interface MotionReelLightboxProps {
  items: (Reel | Showreel)[];
  initialIndex: number;
  onClose: () => void;
}

export function MotionReelLightbox({ items, initialIndex, onClose }: MotionReelLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const item = items[initialIndex];
  const client = getClientById(item.clientId);

  useEffect(() => {
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
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
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedRef.current?.focus();
    };
  }, [onClose]);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
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
        <X aria-hidden size={28} />
      </button>

      <div className="flex max-h-full flex-col items-center gap-4">
        <video
          src={item.src}
          controls
          autoPlay
          loop
          playsInline
          className="max-h-[80vh] w-auto rounded-lg"
        />
        {client && (
          <p className="font-mono text-caption tracking-caption text-text-secondary uppercase">
            {client.name} — {item.title}
          </p>
        )}
      </div>
    </div>
  );
}
