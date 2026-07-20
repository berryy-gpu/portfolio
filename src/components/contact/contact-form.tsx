"use client";

/**
 * The production contact form — react-hook-form for state/validation UX,
 * zodResolver against the same schema the API route validates with,
 * posts to /api/contact. Handles its own loading/success/error states
 * (per Sprint 8's loading/error-state requirement) rather than assuming
 * the request always succeeds instantly.
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { buttonVariants } from "@/components/ui/button";
import { FormField, formInputClassName } from "@/components/ui/form-field";
import { cn } from "@/lib/utils";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/validations/contact";

type SubmitState = "idle" | "error";

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

  if (submitted) {
    return (
      <div role="status" className="flex flex-col items-center gap-2 text-center">
        <p className="font-heading text-h4 text-text-primary">
          Thanks — your message is on its way.
        </p>
        <p className="text-body text-text-secondary">I&apos;ll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex w-full max-w-xl flex-col gap-6 text-left"
    >
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

      <FormField id="name" label="Name" error={errors.name?.message}>
        <input
          id="name"
          type="text"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={formInputClassName}
          {...register("name")}
        />
      </FormField>

      <FormField id="email" label="Email" error={errors.email?.message}>
        <input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={formInputClassName}
          {...register("email")}
        />
      </FormField>

      <FormField id="message" label="Message" error={errors.message?.message}>
        <textarea
          id="message"
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={cn(formInputClassName, "resize-none")}
          {...register("message")}
        />
      </FormField>

      <button
        type="submit"
        disabled={isSubmitting}
        className={buttonVariants({ variant: "default", size: "lg" })}
      >
        {isSubmitting ? "Sending…" : "Send message"}
      </button>

      {submitState === "error" && submitError && (
        <p role="alert" className="text-small text-error">
          {submitError}
        </p>
      )}
    </form>
  );
}
