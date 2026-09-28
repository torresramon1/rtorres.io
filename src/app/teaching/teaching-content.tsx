"use client";

import { FadeIn } from "@/components/animations/fade-in";
import { PageHeader } from "@/components/page-header";
import { siteConfig } from "@/data/site-config";

// TODO: Add your courses here. Add or remove objects as needed.
const courses = [
  {
    semester: "Fall 2026", // TODO: e.g. "Spring 2025"
    role: "Teaching Assistant", // TODO: e.g. "Lead Graduate Teaching Assistant" or "Instructor"
    code: "CSE 156", // TODO: e.g. "CS 101"
    title: "Network Programming", // TODO: e.g. "Introduction to Programming"
    institution: "University of California, Santa Cruz", // TODO: e.g. "University of Example"
    instructor: "Prof. Mike Parsa", // TODO: e.g. "Prof. Jane Doe" — remove field if you were the instructor
    highlights: [
      "Led weekly lab sections, guided students through hands-on networking assignments.", // TODO: bullet point describing what you did or taught
      "Held regular office hours to support student understanding of course material.",
      //"Graded exams and lab assignments, provided feedback aligned with course objectives.",
    ],
  },
  {
    semester: "Fall 2025", // TODO: e.g. "Spring 2025"
    role: "Teaching Assistant", // TODO: e.g. "Lead Graduate Teaching Assistant" or "Instructor"
    code: "CSE 150", // TODO: e.g. "CS 101"
    title: "Introduction to Computer Networks", // TODO: e.g. "Introduction to Programming"
    institution: "University of California, Santa Cruz", // TODO: e.g. "University of Example"
    instructor: "Prof. Christina Parsa", // TODO: e.g. "Prof. Jane Doe" — remove field if you were the instructor
    highlights: [
      "Led weekly lab sections, guided students through hands-on networking assignments.", // TODO: bullet point describing what you did or taught
      "Held regular office hours to support student understanding of course material.",
      "Graded exams and lab assignments, provided feedback aligned with course objectives.",
    ],
  },
];

export function TeachingContent() {
  return (
    <div className="pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Teaching"
          description="Courses and classroom experience."
        />

        {/* Teaching */}
        <FadeIn direction="none">
          <section className="mb-16">
            <h2 className="font-serif text-xl font-semibold tracking-tight mb-6 pb-2 border-b border-border">
              Teaching
            </h2>
            {courses.map((course) => (
              <div key={course.code} className="mb-8">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                  <h3 className="font-semibold text-sm">
                    <span className="font-mono">{course.code}</span>: &lsquo;{course.title}&rsquo;
                  </h3>
                  <span className="font-mono text-xs text-foreground-tertiary">{course.semester}</span>
                </div>
                <p className="text-sm text-foreground-secondary mb-1">
                  {course.role} — {course.institution}
                </p>
                {course.instructor && (
                  <p className="font-mono text-xs text-foreground-quaternary mb-3">
                    Instructor: {course.instructor}
                  </p>
                )}
                <ul className="space-y-1.5 text-sm text-foreground-secondary">
                  {course.highlights.map((h, i) => (
                    <li key={i} className="pl-4 relative before:content-['–'] before:absolute before:left-0 before:text-foreground-quaternary">
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        </FadeIn>
      </div>
    </div>
  );
}
