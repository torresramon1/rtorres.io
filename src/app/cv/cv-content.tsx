"use client";

import { Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/animations/fade-in";
import { siteConfig } from "@/data/site-config";
import { ongoingProjects } from "@/data/projects";

// TODO: Fill in your education history. Add or remove objects as needed.
const education = [
  {
    degree: "Ph.D. in Computer Science", // TODO: e.g. "Ph.D. in Computer Science"
    institution: "Universiy of California, Santa Cruz", // TODO: e.g. "University of Example"
    period: "2026 - Present", // TODO: e.g. "Sep 2022 - Present"
    advisor: "Ramakrishnan Sundara Raman", // TODO: e.g. "Prof. Jane Doe" — set to null if no advisor
    focus: "Networky Security, Privacy, Censorship circumvention", // TODO: e.g. "Machine Learning & Computer Vision"
  },
  {
	degree: "BS in Computer Science",
	institution: "California Polytechnic State University, San Luis Obispo",
	period: "2022-2024",
  },
];

// TODO: Fill in your work/research experience. Add or remove objects as needed.
const experience = [
  {
    title: "CSE 150 TA", // TODO: e.g. "Research Intern"
    organization: "University of California, Santa Cruz", // TODO: e.g. "Example Lab"
    period: "Sep 2025 - Dec 2025", // TODO: e.g. "Jun 2023 - Aug 2023"
    location: "Santa Cruz, CA",
    description: "Led weekly lab sections and guided students through hands-on networking assignments", // TODO: brief description of your responsibilities/contributions
  },
];

// TODO: Fill in your talks and presentations. Add or remove objects as needed.
const presentations = [
  {
    title: "YOUR_TALK_TITLE", // TODO: paper or talk title
    event: "YOUR_EVENT", // TODO: e.g. "NeurIPS 2024"
    location: "YOUR_LOCATION", // TODO: e.g. "Vancouver, Canada"
    year: "2024", // TODO: year
    type: "YOUR_TYPE", // TODO: e.g. "Conference Talk" or "Workshop Talk" or "Poster"
  },
];

// TODO: Fill in your service and outreach. Add or remove objects as needed.
const service = [
  {
    title: "YOUR_SERVICE_ROLE", // TODO: e.g. "Program Committee Member, USENIX Security 2025"
    organization: "YOUR_ORG", // TODO: e.g. "USENIX"
    year: "2025", // TODO: year
    description: "YOUR_SERVICE_DESCRIPTION", // TODO: brief description
    link: "https://YOUR_SERVICE_URL", // TODO: remove field if no link
  },
];

const jumpLinks = [
  { id: "education", label: "Education" },
  { id: "ongoing", label: "Ongoing Projects" },
  { id: "experience", label: "Experience" },
  { id: "presentations", label: "Talks" },
  { id: "service", label: "Service" },
];

export function CVContent() {
  return (
    <div className="pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader title="Curriculum Vitae" description="Last updated: Aug 2026">
          <div className="flex gap-2 mt-4 print:hidden">
            <Button size="sm" onClick={() => window.print()}>
              <Download className="mr-2 h-4 w-4" />
              Print / Save as PDF
            </Button>
          </div>
        </PageHeader>

        {/* Jump Navigation */}
        <nav className="mb-10 print:hidden" aria-label="CV sections">
          <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
            {jumpLinks.map((section, i) => (
              <span key={section.id} className="inline-flex items-center">
                <a
                  href={`#${section.id}`}
                  className="font-mono text-xs tracking-wide text-foreground-tertiary hover:text-foreground transition-colors"
                >
                  {section.label}
                </a>
                {i < jumpLinks.length - 1 && (
                  <span className="mx-2 text-foreground-quaternary select-none">&middot;</span>
                )}
              </span>
            ))}
          </div>
        </nav>

        {/* Contact Info */}
        <FadeIn>
          <div className="mb-16">
            <p className="font-mono text-sm text-foreground-secondary">{siteConfig.name}</p>
            <p className="font-mono text-xs text-foreground-tertiary mt-1">{siteConfig.title}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 font-mono text-xs text-foreground-tertiary">
              <a href={`mailto:${siteConfig.email}`} className="link-accent">
                {siteConfig.email}
              </a>
              {/* TODO: update or remove this website link */}
              <a href="https://rtorres.io" className="link-accent">
                rtorres.io
              </a>
            </div>
          </div>
        </FadeIn>

        {/* Education */}
        <section id="education" className="mb-12 scroll-mt-20">
          <h2 className="font-mono text-xs tracking-widest uppercase text-foreground-quaternary mb-6">
            EDUCATION
          </h2>
          <StaggerChildren className="space-y-6">
            {education.map((edu) => (
              <StaggerItem key={edu.degree}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                  <div>
                    <h3 className="text-sm font-medium">{edu.degree}</h3>
                    <p className="text-sm text-foreground-secondary">{edu.institution}</p>
                    {edu.advisor && (
                      <p className="text-sm text-foreground-tertiary mt-1">Advisor: {edu.advisor}</p>
                    )}
                    <p className="text-sm text-foreground-tertiary">Focus: {edu.focus}</p>
                  </div>
                  <span className="font-mono text-xs text-foreground-quaternary shrink-0">
                    {edu.period}
                  </span>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </section>

        <hr className="my-8" />

        {/* Ongoing Projects */}
        <section id="ongoing" className="mb-12 scroll-mt-20">
          <h2 className="font-mono text-xs tracking-widest uppercase text-foreground-quaternary mb-6">
            ONGOING PROJECTS
          </h2>
          <StaggerChildren className="space-y-5">
            {ongoingProjects.map((project) => (
              <StaggerItem key={project.title}>
                <div>
                  <h3 className="text-sm font-medium">
                    {project.link ? (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="link-accent">
                        {project.title}
                      </a>
                    ) : (
                      project.title
                    )}
                  </h3>
                  <p className="text-sm text-foreground-secondary">{project.collaborators.join(", ")}</p>
                  <p className="text-sm text-foreground-tertiary mt-1">{project.summary}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </section>

        <hr className="my-8" />

        {/* Experience */}
        <section id="experience" className="mb-12 scroll-mt-20">
          <h2 className="font-mono text-xs tracking-widest uppercase text-foreground-quaternary mb-6">
            EXPERIENCE
          </h2>
          <StaggerChildren className="space-y-6">
            {experience.map((exp) => (
              <StaggerItem key={exp.title + exp.organization}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                  <div>
                    <h3 className="text-sm font-medium">{exp.title}</h3>
                    <p className="text-sm text-foreground-secondary">{exp.organization}</p>
                    {exp.location && (
                      <p className="text-xs text-foreground-tertiary mt-0.5">{exp.location}</p>
                    )}
                    <p className="text-sm text-foreground-tertiary mt-1">{exp.description}</p>
                  </div>
                  <span className="font-mono text-xs text-foreground-quaternary shrink-0">
                    {exp.period}
                  </span>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </section>

        <hr className="my-8" />

        {/* Presentations */}
        <section id="presentations" className="mb-12 scroll-mt-20">
          <h2 className="font-mono text-xs tracking-widest uppercase text-foreground-quaternary mb-6">
            TALKS & PRESENTATIONS
          </h2>
          <StaggerChildren className="space-y-5">
            {presentations.map((talk) => (
              <StaggerItem key={talk.title}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                  <div>
                    <h3 className="text-sm font-medium">{talk.title}</h3>
                    <p className="text-sm text-foreground-secondary">{talk.event}</p>
                    <p className="text-xs text-foreground-tertiary">
                      {talk.location} &middot; {talk.type}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-foreground-quaternary shrink-0">
                    {talk.year}
                  </span>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </section>

        <hr className="my-8" />

        {/* Service */}
        <section id="service" className="mb-12 scroll-mt-20">
          <h2 className="font-mono text-xs tracking-widest uppercase text-foreground-quaternary mb-6">
            SERVICE & OUTREACH
          </h2>
          <StaggerChildren className="space-y-5">
            {service.map((item) => (
              <StaggerItem key={item.title}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                  <div>
                    <h3 className="text-sm font-medium">
                      {"link" in item && item.link ? (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="link-accent">
                          {item.title}
                        </a>
                      ) : (
                        item.title
                      )}
                    </h3>
                    <p className="text-sm text-foreground-secondary">{item.organization}</p>
                    <p className="text-sm text-foreground-tertiary">{item.description}</p>
                  </div>
                  <span className="font-mono text-xs text-foreground-quaternary shrink-0">
                    {item.year}
                  </span>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </section>

        <hr className="my-8" />

        {/* Publications CTA */}
        <div className="text-center py-8 print:hidden">
          <h3 className="font-serif text-lg font-semibold mb-1">Publications</h3>
          <p className="text-sm text-foreground-tertiary mb-4">
            See my full list of publications with links to papers and code.
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link href="/publications">
              View Publications
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
