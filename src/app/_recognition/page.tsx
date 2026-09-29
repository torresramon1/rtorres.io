import { Metadata } from "next";
import { RecognitionContent } from "./recognition-content";

export const metadata: Metadata = {
  title: "Recognition",
  description:
    "Fellowships, media coverage, and recognition for Ramon Torres's work in security and privacy.",
  alternates: { canonical: "/recognition" },
  openGraph: {
    title: "Recognition | Ramon Torres",
    description: "Fellowships, media coverage, and recognition for Ramon Torres's work in security and privacy.",
    url: "/recognition",
  },
};

export default function RecognitionPage() {
  return <RecognitionContent />;
}
