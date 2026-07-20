/**
 * The notification email's HTML body — kept separate from the route
 * handler so the template can be reasoned about (and changed) on its
 * own. Plain HTML string rather than a React-Email component: this
 * project already avoids adding dependencies it doesn't need, and one
 * simple template doesn't justify pulling in the React Email renderer.
 *
 * User-submitted values are escaped before interpolation — this is
 * untrusted input going straight into an HTML email body, so this is a
 * real XSS/HTML-injection boundary, not a formality.
 */

interface ContactEmailData {
  name: string;
  email: string;
  message: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function renderContactEmail({ name, email, message }: ContactEmailData): string {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; color: #0B0B0A; line-height: 1.6;">
      <h2 style="margin: 0 0 4px; font-size: 20px;">New project inquiry</h2>
      <p style="margin: 0 0 24px; color: #6E6B63; font-size: 13px;">Sent from the portfolio contact form</p>
      <p style="margin: 0 0 8px;"><strong>Name:</strong> ${safeName}</p>
      <p style="margin: 0 0 16px;"><strong>Email:</strong> ${safeEmail}</p>
      <p style="margin: 0 0 8px;"><strong>Message:</strong></p>
      <p style="margin: 0;">${safeMessage}</p>
    </div>
  `.trim();
}
