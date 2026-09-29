import { HomeContent } from "@/components/sections/home-content";
import { PublicationsJsonLd } from "@/components/structured-data";

export default function Home() {
  return (
    <>
      <PublicationsJsonLd />
      <HomeContent />
    </>
  );
}
