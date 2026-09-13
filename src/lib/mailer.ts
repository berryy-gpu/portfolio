import nodemailer, { type Transporter } from "nodemailer";

let cachedTransporter: Transporter | null = null;

/**
 * Lazily constructed — reading the SMTP_* env vars at call time (not
 * module load time) so missing config fails gracefully inside the route
 * handler instead of crashing the build. Returns null when required vars
 * are unset; callers are responsible for handling that (see
 * api/contact/route.ts). Mirrors this project's previous email-client
 * accessor's lazy-singleton shape.
 *
 * Env vars are explicitly parsed rather than passed through as raw
 * strings: `SMTP_PORT` must become a real number (Nodemailer expects
 * `port: number`), and `SMTP_SECURE` must be compared against the literal
 * string `"true"` rather than passed through `Boolean(...)` — every
 * non-empty string (including `"false"`) is truthy in JS, so
 * `Boolean(process.env.SMTP_SECURE)` would silently force TLS-on-connect
 * even when the value is explicitly `"false"`.
 */
export function getMailer(): Transporter | null {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;

  if (!host || !port || !user || !password) return null;

  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user, pass: password },
    });
  }

  return cachedTransporter;
}
