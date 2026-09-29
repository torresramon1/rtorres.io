"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/data/site-config";
import { ongoingProjects } from "@/data/projects";
import { FadeIn } from "@/components/animations/fade-in";
import { motion, useReducedMotion } from "framer-motion";
import { TiltCard } from "@/components/interactive/tilt-card";
import { PublicationsSection } from "@/components/sections/publications-section";

/* ─────────────────────────────────────────
   SECTION HEADING WITH "VIEW ALL" LINK
   ───────────────────────────────────────── */

function SectionHeading({ title, href, id }: { title: string; href?: string; id?: string }) {
  return (
    <div className="flex items-baseline justify-between mb-6">
      <h2 id={id} className="text-xl font-bold tracking-tight">{title}</h2>
      {href && (
        <Link
          href={href}
          className="text-xs font-mono text-foreground-tertiary hover:text-accent transition-colors duration-150 flex items-center gap-1"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN
   ───────────────────────────────────────── */

export function HomeContent() {
  return (
    <div className="min-h-screen pt-16 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ═══════════════════════════════════════
            PROFILE
            ═══════════════════════════════════════ */}
        <FadeIn direction="none">
          <section className="pb-12 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
            {/* Profile photo with 3D tilt */}
            <TiltCard className="flex-shrink-0" maxTilt={8}>
              <div className="w-52 h-52 sm:w-72 sm:h-72 rounded-2xl overflow-hidden border-2 border-border">
                <Image
                  src="/profile_pic.jpeg"
                  alt={siteConfig.name}
                  width={288}
                  height={288}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            </TiltCard>

            {/* Bio */}
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
                {siteConfig.name}
              </h1>

              {/* Affiliation badge */}
              <p className="font-mono text-xs text-foreground-quaternary tracking-wide mb-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent mr-1.5 align-middle" />
                PhD Student · UC Santa Cruz
              </p>


              <div className="space-y-3 text-base text-foreground-secondary leading-relaxed">
                <p>
                  I am a PhD student in Computer Science & Engineering at{" "}
                  <a href="https://www.ucsc.edu" target="_blank" rel="noopener noreferrer" className="gradient-link">
                    UC Santa Cruz
                  </a>
                  , working with{" "}
                  <a href={siteConfig.advisor.url} target="_blank" rel="noopener noreferrer" className="gradient-link">
                    Prof. Ram Sundara Raman
                  </a>
                  . My research sits at the intersection of privacy-preserving systems, internet measurement, and censorsip circumvention. I study how anonymity and privacy tools like Tor perform and scale. I also measure how content and services are blocked or restricted around the world. My work combines systems building, and empirical measurement to better understand the tools that keep the internet open and private. 
                </p>
              </div>

              {/* Social links — moved up into bio */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-4 text-sm justify-center sm:justify-start">
                <a href={siteConfig.social.googleScholar} target="_blank" rel="noopener noreferrer" className="gradient-link text-foreground-tertiary">
                  Scholar
                </a>
                <span className="text-foreground-quaternary">&middot;</span>
                <a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer" className="gradient-link text-foreground-tertiary">
                  GitHub
                </a>
                <span className="text-foreground-quaternary">&middot;</span>
                <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" className="gradient-link text-foreground-tertiary">
                  LinkedIn
                </a>
                <span className="text-foreground-quaternary">&middot;</span>
                <a href={`mailto:${siteConfig.email}`} className="gradient-link text-foreground-tertiary">
                  Email
                </a>
              </div>
            </div>
          </section>
        </FadeIn>


        {/* ═══════════════════════════════════════
            ONGOING PROJECTS
            ═══════════════════════════════════════ */}
        <FadeIn direction="none" delay={0.08}>
          <section className="mb-16" aria-labelledby="section-projects">
            <SectionHeading title="Ongoing Projects" id="section-projects" />

            <div className="space-y-6">
              {ongoingProjects.map((project) => (
                <a
                  key={project.title}
                  href={project.link || "#"}
                  target={project.link ? "_blank" : undefined}
                  rel={project.link ? "noopener noreferrer" : undefined}
                  className="group card-hover block rounded-xl border border-border hover:border-accent/30 hover:bg-accent-subtle overflow-hidden"
                >
                  {/* Header bar */}
                  <div className="px-5 py-4 border-b border-border bg-muted/30">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse flex-shrink-0" />
                        <h3 className="text-base font-semibold tracking-tight group-hover:text-accent transition-colors duration-150">
                          {project.title}
                        </h3>
                      </div>
                      <span className="font-mono text-xs text-accent font-medium tracking-wide uppercase">
                        {project.status}
                      </span>
                    </div>
                    <p className="text-sm text-foreground-secondary mt-2 leading-relaxed">
                      {project.summary}
                    </p>
                  </div>

                  {/* Body */}
                  <div className="px-5 py-4 space-y-4">
                    {/* Highlights */}
                    <ul className="space-y-2">
                      {project.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-foreground-secondary">
                          <span className="w-1 h-1 rounded-full bg-foreground-quaternary mt-2 flex-shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>

                    {/* Footer: collaborators + tags */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
                      <div className="flex flex-wrap items-center gap-2">
                        {project.collaborators.map((c, i) => (
                          <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-xs font-mono text-foreground-tertiary">
                            {c}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span key={tag} className="text-xs text-foreground-quaternary">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* ── divider ── */}
        <hr className="border-border mb-16" />

        {/* ═══════════════════════════════════════
            PUBLICATIONS
            ═══════════════════════════════════════ */}
        <FadeIn direction="none" delay={0.1}>
          <section id="publications" className="mb-16 scroll-mt-20" aria-labelledby="section-publications">
            <SectionHeading title="Publications" id="section-publications" />
            <PublicationsSection />
          </section>
        </FadeIn>

      </div>
    </div>
  );
}
