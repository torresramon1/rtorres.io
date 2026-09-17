export type OngoingProject = {
  title: string;
  collaborators: string[];
  summary: string;
  highlights: string[];
  status: string;
  tags: string[];
  link?: string;
  irb?: string;
};

// TODO: Fill in current/ongoing projects. Add or remove objects as needed.
export const ongoingProjects: OngoingProject[] = [
  {
    title: "Tor Sustainability",
    collaborators: ["RANDLab (UCSC)"],
    summary: "Measuring the Carbon footprint of Tor and making it carbon efficient with carbon aware routing.",
    highlights: [
      "Measuring Tor's carbon footprint",
      "Carbon aware routing",
    ],
    status: "In Progress",
    tags: ["Tor", "Sustainability", "Privacy", "Networks", "Measurement"],
    link: "",
    irb: "",
  },
];
