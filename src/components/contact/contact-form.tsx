"use client";

/**
 * The production contact form — presentation rebuilt for REBUILD-SPEC.md
 * (floating labels, accent focus, a label->spinner->checkmark submit
 * morph, a height-stable success state, an honest mailto: fallback on
 * error), but the pipeline itself is untouched: same react-hook-form +
 * zodResolver against the same schema the API route validates with, same
 * POST to /api/contact. The submit button is outline, not filled — the
 * one filled-accent button on the site is the homepage CTA, not this.
 *
 * The form/success swap uses a CSS grid stacking trick (both states in
 * the same grid cell) rather than a min-height guess, so the container is
 * always exactly as tall as its taller state — nothing jumps either way.
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations/contact";

type SubmitState = "idle" | "error";

const floatingInputClassName =
  "peer w-full rounded-md border border-border bg-surface px-4 pt-6 pb-2 text-body text-text-primary outline-none transition-colors focus-visible:border-accent focus-visible:ring-3 focus-visible:ring-accent/30 aria-invalid:border-error";

const floatingLabelClassName =
  "pointer-events-none absolute top-4 left-4 origin-left text-body text-text-tertiary transition-all duration-200 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-accent peer-[&:not(:placeholder-shown)]:-translate-y-2.5 peer-[&:not(:placeholder-shown)]:scale-75";

interface FloatingFieldProps {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}

function FloatingField({ id, label, error, children }: FloatingFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        {children}
        <label htmlFor={id} className={floatingLabelClassName}>
          {label}
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-small text-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", message: "", honeypot: "" },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitState("idle");
    setSubmitError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result: { error?: string } = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error ?? "Something went wrong. Please try again.");
      }

      setSubmitted(true);
      reset();
    } catch (error) {
      setSubmitState("error");
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="grid w-full max-w-xl">
      <div
        className={cn(
          "col-start-1 row-start-1 transition-opacity duration-300",
          submitted ? "pointer-events-none opacity-0" : "opacity-100"
        )}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6 text-left">
          {/* Honeypot — visually hidden and unreachable by keyboard, real
              users never interact with it. */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="pointer-events-none absolute left-[-9999px] opacity-0"
            {...register("honeypot")}
          />

          <FloatingField id="name" label="Name" error={errors.name?.message}>
            <input
              id="name"
              type="text"
              placeholder=" "
              autoComplete="name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={floatingInputClassName}
              {...register("name")}
            />
          </FloatingField>

          <FloatingField id="email" label="Email" error={errors.email?.message}>
            <input
              id="email"
              type="email"
              placeholder=" "
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={floatingInputClassName}
              {...register("email")}
            />
          </FloatingField>

          <FloatingField id="message" label="Message" error={errors.message?.message}>
            <textarea
              id="message"
              rows={5}
              placeholder=" "
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
              className={cn(floatingInputClassName, "resize-none")}
              {...register("message")}
            />
          </FloatingField>

          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "relative")}
          >
            <span className={cn("transition-opacity", isSubmitting && "opacity-0")}>
              Send message
            </span>
            {isSubmitting && (
              <Loader2
                className="absolute inset-0 m-auto h-5 w-5 animate-spin"
                aria-hidden="true"
              />
            )}
          </button>

          {submitState === "error" && submitError && (
            <div role="alert" className="flex flex-col gap-1">
              <p className="text-small text-error">{submitError}</p>
              {siteConfig.email && (
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="w-fit text-small text-text-secondary underline underline-offset-4 transition-colors hover:text-text-primary"
                >
                  Or email me directly at {siteConfig.email}
                </a>
              )}
            </div>
          )}
        </form>
      </div>

      <div
        role="status"
        className={cn(
          "col-start-1 row-start-1 flex flex-col items-center justify-center gap-4 text-center transition-opacity duration-300",
          submitted ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-accent">
          <Check className="h-5 w-5 text-accent" aria-hidden="true" />
        </span>
        <p className="font-heading text-h4 text-text-primary">
          Thanks — your message is on its way.
        </p>
        <p className="text-body text-text-secondary">I&apos;ll get back to you soon.</p>
      </div>
    </div>
  );
}
