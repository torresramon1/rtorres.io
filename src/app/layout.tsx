import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono, Source_Serif_4 } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { PersonJsonLd } from "@/components/structured-data";
import { BackToTop } from "@/components/back-to-top";
import { ScrollProgress } from "@/components/scroll-progress";
import { CursorGlow } from "@/components/interactive/cursor-glow";
import { KonamiConfetti } from "@/components/interactive/konami-confetti";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "Ramon Torres | Security & Privacy Researcher",
    template: "%s | Ramon Torres",
  },
  description:
    "PhD Student in Computer Science at UC Santa Cruz, researching privacy tools and Internet censorship.",
  keywords: [
    "Ramon Torres",
    "Security Research",
    "Privacy",
    "PhD Student",
    "UC Santa Cruz",
    "Cybersecurity",
    "Computer Science",
  ],
  authors: [{ name: "Ramon Torres" }],
  creator: "Ramon Torres",
  metadataBase: new URL("https://ramontorres.github.io"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ramontorres.github.io",
    title: "Ramon Torres | Security & Privacy Researcher",
    description:
      "PhD Student in Computer Science at UC Santa Cruz, researching privacy tools and Internet censorship.",
    siteName: "Ramon Torres",
    images: [
      {
        url: "/profile_pic.jpeg",
        width: 1200,
        height: 630,
        alt: "Ramon Torres - Security & Privacy Researcher at UC Santa Cruz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ramon Torres | Security & Privacy Researcher",
    description:
      "PhD Student in Computer Science at UC Santa Cruz, researching privacy tools and Internet censorship.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} ${sourceSerif.variable} font-sans antialiased`}
      >
        <PersonJsonLd />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-accent-foreground focus:rounded-md focus:text-sm focus:font-medium"
          >
            Skip to main content
          </a>
          <ScrollProgress />
          <CursorGlow />
          <KonamiConfetti />
          <div className="relative min-h-screen flex flex-col">
            <Navigation />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
