import { NextResponse } from "next/server";

import { renderContactEmail } from "@/lib/contact-email-template";
import { getResendClient } from "@/lib/resend";
import { contactFormSchema } from "@/lib/validations/contact";
import { siteConfig } from "@/data/site";

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

  const resend = getResendClient();
  if (!resend) {
    console.error("Contact form submitted but RESEND_API_KEY is unset.");
    return NextResponse.json(
      { error: "Contact isn't configured yet. Please try again later." },
      { status: 500 }
    );
  }

  const { name, email, message } = parsed.data;

  try {
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "Portfolio Contact <onboarding@resend.dev>",
      to: siteConfig.email,
      replyTo: email,
      subject: `New project inquiry from ${name}`,
      html: renderContactEmail({ name, email, message }),
    });

    if (error) {
      console.error("Resend returned an error", error);
      return NextResponse.json(
        { error: "Something went wrong sending your message. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send contact email", error);
    return NextResponse.json(
      { error: "Something went wrong sending your message. Please try again." },
      { status: 500 }
    );
  }
}
