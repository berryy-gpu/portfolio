import type { ReactNode } from "react";

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}

/** A reusable label + input-slot + error wrapper — not contact-specific,
 *  so any future form on the site can reuse it instead of re-deriving
 *  the same label/error/spacing pattern. */
export function FormField({ id, label, error, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-small text-text-secondary">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-small text-error">
          {error}
        </p>
      )}
    </div>
  );
}

export const formInputClassName =
  "w-full rounded-md border border-border bg-surface px-4 py-3 text-body text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-error";
