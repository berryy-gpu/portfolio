import { z } from "zod";

/**
 * Single source of truth for the contact form's shape — used by both
 * the client form (react-hook-form + zodResolver) and the API route,
 * so validation can never drift between the two.
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(100, "That name looks too long."),
  email: z.string().trim().min(1, "Please enter your email.").email("Enter a valid email address."),
  message: z
    .string()
    .trim()
    .min(10, "Tell me a bit more about the project.")
    .max(2000, "Please keep it under 2000 characters."),
  /** Honeypot — real users never see or fill this in; bots often do. */
  honeypot: z.string().max(0).optional().or(z.literal("")),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
