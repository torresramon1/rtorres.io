export interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  type: "journal" | "conference" | "workshop" | "preprint";
  abstract: string;
  tags: string[];
  image?: string;
  links: {
    paper?: string;
    pdf?: string;
    code?: string;
    slides?: string;
    video?: string;
    doi?: string;
  };
  citations?: number;
  selected?: boolean;
  bibtex?: string;
}

// TODO: Replace the example below with your own publications.
// Duplicate the object block for each additional paper.
export const publications: Publication[] = [
  /*{
    id: "example-paper-2024", // TODO: unique slug, e.g. "my-paper-venue-year"
    title: "YOUR_PAPER_TITLE", // TODO: full paper title
    authors: ["YOUR_NAME", "CO_AUTHOR_NAME"], // TODO: list all authors in order
    venue: "YOUR_VENUE_NAME", // TODO: e.g. "IEEE S&P 2024" or "NeurIPS 2024"
    year: 2024, // TODO: publication year
    type: "conference", // TODO: "journal" | "conference" | "workshop" | "preprint"
    abstract: "YOUR_ABSTRACT", // TODO: paper abstract
    tags: ["YOUR_TAG_1", "YOUR_TAG_2"], // TODO: topic tags for filtering
    image: "/publications/YOUR_IMAGE.png", // TODO: optional thumbnail — place image in /public/publications/
    links: {
      paper: "https://LINK_TO_PAPER", // TODO: link to paper page
      pdf: "https://LINK_TO_PDF",     // TODO: direct PDF link
      code: "https://github.com/YOUR_REPO", // TODO: code repo — remove if none
      doi: "10.XXXX/XXXXX",           // TODO: DOI — remove if none
    },
    citations: 0, // TODO: citation count
    selected: true, // TODO: set true to feature on home page
    bibtex: `@inproceedings{YOURKEY2024,
  title={YOUR_PAPER_TITLE},
  author={YOUR_NAME and CO_AUTHOR_NAME},
  booktitle={YOUR_VENUE_NAME},
  year={2024}
}`,
  },*/
];

export const publicationYears = [
  ...new Set(publications.map((pub) => pub.year.toString())),
].sort((a, b) => parseInt(b) - parseInt(a));

export const allTags = Array.from(
  new Set(publications.flatMap((pub) => pub.tags))
).sort();
