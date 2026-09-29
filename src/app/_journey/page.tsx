import { Metadata } from "next";
import { JourneyContent } from "./journey-content";

export const metadata: Metadata = {
  title: "My Journey",
  description:
    "The story of Ramon Torres - from Zefta, Egypt to UC Santa Cruz, pursuing research in security and privacy.",
  alternates: { canonical: "/journey" },
  openGraph: {
    title: "My Journey | Ramon Torres",
    description: "The story of Ramon Torres - from Zefta, Egypt to UC Santa Cruz, pursuing research in security and privacy.",
    url: "/journey",
  },
};

export default function JourneyPage() {
  return <JourneyContent />;
}
