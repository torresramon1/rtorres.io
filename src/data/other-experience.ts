export type OtherExperience = {
  title: string;
  organization: string;
  period: string; // display string used on the CV, e.g. "Sep 2026 - Current"
  sortDate: string; // "YYYY-MM", used to order this entry among CV experience entries
  location: string;
  description: string;
};

// Non-teaching work/research experience shown on the CV. Teaching (TA)
// experience comes from src/data/teaching.ts so it only needs to be entered
// once.
export const otherExperience: OtherExperience[] = [
  {
    title: "LAMAT mentor",
    organization: "University of California, Santa Cruz",
    period: "July 2026 - Aug 2026",
    sortDate: "2026-07",
    location: "Santa Cruz, CA",
    description: "Mentored a LAMAT student during the summer in a network security and sustainability project.",
  },
];
