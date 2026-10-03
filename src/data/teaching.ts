export type Course = {
  semester: string;
  role: string;
  code: string;
  title: string;
  institution: string;
  instructor?: string; // omit if you were the instructor
  location: string;
  period: string; // display string used on the CV, e.g. "Sep 2026 - Current"
  sortDate: string; // "YYYY-MM", used to order this course among CV experience entries
  highlights: string[]; // bullets shown on the Teaching page
  cvSummary: string; // one-line summary shown on the CV
};

// Single source of truth for teaching experience — consumed by both the
// Teaching page and the CV's Experience section. Add a new course here once
// and it will show up in both places.
export const courses: Course[] = [
  {
    semester: "Fall 2026",
    role: "Teaching Assistant",
    code: "CSE 156",
    title: "Network Programming",
    institution: "University of California, Santa Cruz",
    instructor: "Prof. Mike Parsa",
    location: "Santa Cruz, CA",
    period: "Sep 2026 - Current",
    sortDate: "2026-09",
    highlights: [
      "Led weekly lab sections, guided students through hands-on networking assignments.",
      "Held regular office hours to support student understanding of course material.",
    ],
    cvSummary: "Led weekly lab sections and guided students through hands-on networking assignments",
  },
  {
    semester: "Fall 2025",
    role: "Teaching Assistant",
    code: "CSE 150",
    title: "Introduction to Computer Networks",
    institution: "University of California, Santa Cruz",
    instructor: "Prof. Christina Parsa",
    location: "Santa Cruz, CA",
    period: "Sep 2025 - Dec 2025",
    sortDate: "2025-09",
    highlights: [
      "Led weekly lab sections, guided students through hands-on networking assignments.",
      "Held regular office hours to support student understanding of course material.",
      "Graded exams and lab assignments, provided feedback aligned with course objectives.",
    ],
    cvSummary: "Led weekly lab sections and guided students through hands-on networking assignments",
  },
];
