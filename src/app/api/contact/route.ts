import { NextResponse } from "next/server";

import { renderContactEmail } from "@/lib/contact-email-template";
import { getMailer } from "@/lib/mailer";
import { contactFormSchema } from "@/lib/validations/contact";
import { siteConfig } from "@/data/site";

// Nodemailer needs real Node.js APIs (net/tls sockets) — not available on
// the Edge runtime, which Next.js would otherwise be free to pick for a
// route this simple.
export const runtime = "nodejs";

/**
 * The one server-side boundary for the contact form. Validates with the
 * same Zod schema the client form uses (imported, not duplicated), so
 * the two can never drift. A filled honeypot field returns a fake
 * success — real users never see or fill it, so this quietly drops bot
 * submissions without telling them why.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the form and try again.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  if (parsed.data.honeypot) {
    return NextResponse.json({ success: true });
  }

  if (!siteConfig.email) {
    console.error("Contact form submitted but siteConfig.email is unset.");
    return NextResponse.json(
      { error: "Contact isn't configured yet. Please try again later." },
      { status: 500 }
    );
  }

  const mailer = getMailer();
  if (!mailer) {
    console.error("Contact form submitted but SMTP_* env vars are unset.");
    return NextResponse.json(
      { error: "Contact isn't configured yet. Please try again later." },
      { status: 500 }
    );
  }

  const { name, email, message } = parsed.data;

  try {
    await mailer.sendMail({
      // Many SMTP providers (Gmail included) reject a `from` address that
      // doesn't match the authenticated account, so this is SMTP_USER
      // itself, not a separately configurable sender address.
      from: `Portfolio Contact <${process.env.SMTP_USER}>`,
      to: siteConfig.email,
      replyTo: email,
      subject: `New project inquiry from ${name}`,
      html: renderContactEmail({ name, email, message }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send contact email", error);
    return NextResponse.json(
      { error: "Something went wrong sending your message. Please try again." },
      { status: 500 }
    );
  }
}
