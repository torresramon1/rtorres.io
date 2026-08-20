import type { Metadata } from "next";
import { PublicationsContent } from "./publications-content";
import { PublicationsJsonLd } from "@/components/structured-data";

export const metadata: Metadata = {
  title: "Publications",
  description:
    "Peer-reviewed publications by Ramon Torres on security, privacy, and networks.",
  alternates: { canonical: "/publications" },
  openGraph: {
    title: "Publications | Mohamed Dawoud",
    description: "Peer-reviewed publications by Ramon Torres on security, privacy, cybercrime, and networks.",
    url: "/publications",
  },
};

export default function PublicationsPage() {
  return (
    <>
      <PublicationsJsonLd />
      <PublicationsContent />
    </>
  );
}
