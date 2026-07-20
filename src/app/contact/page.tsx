import type { Metadata } from "next";

import { ContactContent } from "@/components/contact/contact-content";

import { contactDescription } from "./page-meta";

export const metadata: Metadata = {
  title: "Contact",
  description: contactDescription,
};

export default function ContactPage() {
  return <ContactContent />;
}
