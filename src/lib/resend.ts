import { Resend } from "resend";

let cachedClient: Resend | null = null;

/**
 * Lazily constructed — reading process.env.RESEND_API_KEY at call time
 * (not module load time) so a missing key fails gracefully inside the
 * route handler instead of crashing the build. Returns null when unset;
 * callers are responsible for handling that (see api/contact/route.ts).
 */
export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  if (!cachedClient) {
    cachedClient = new Resend(apiKey);
  }

  return cachedClient;
}
