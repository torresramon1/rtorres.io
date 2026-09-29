import { Metadata } from "next";
import { ServiceContent } from "./service-content";

export const metadata: Metadata = {
  title: "Service & Outreach",
  description:
    "Professional service, community outreach, and mentorship by Ramon Torres.",
  alternates: { canonical: "/service" },
  openGraph: {
    title: "Service & Outreach | Ramon Torres",
    description: "Professional service, community outreach, and mentorship by Ramon Torres.",
    url: "/service",
  },
};

export default function ServicePage() {
  return <ServiceContent />;
}
