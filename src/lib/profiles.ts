import type { WorkshopTrack } from "./workshops";

export interface Profile {
  /** URL-safe identifier, e.g. "dave-caplan". */
  slug: string;
  name: string;
  /** Short role + affiliation line, e.g. "Founder, Startup Orillia · CTO, Twos". */
  title: string;
  /** 2-3 sentence bio shown on cards and at the top of workshop detail pages. */
  bio: string;
  /** Absolute or root-relative image path served from /public. */
  photo: string;
  linkedin?: string;
  website?: string;
  /** Short topical tags (max ~5) shown as chips. */
  tags?: string[];
  /** Tracks this person is willing to lead workshops in. */
  teaches?: WorkshopTrack[];
}

export const profiles: Profile[] = [
  {
    slug: "dave-caplan",
    name: "Dave Caplan",
    title: "Founder, Startup Orillia · CTO, Twos",
    bio: "Builder, CTO, and founder. Currently CTO of Twos, building at the intersection of AI and human conversation. Two decades writing code, shipping products, and scaling teams across five companies (with three acquisitions along the way). These days most curious about AI, agentic workflows, tiny startups, and the kinds of communities that help ambitious people learn and build faster together.",
    photo: "/dave.jpg",
    linkedin: "https://www.linkedin.com/in/davecap/",
    website: "https://twos.net",
    tags: ["Founder", "CTO", "Builder", "AI", "Community"],
    teaches: ["ai", "founder", "build", "ops"],
  },
  {
    slug: "stephen-tracy",
    name: "Stephen Tracy",
    title: "Founder, Mozaik · Building TalentQuill",
    bio: "Award-winning data and AI expert with a 15-year career spanning agency analyst to Chief Data Officer, Singapore to Toronto. Built data teams at IPG, Publicis, and YouGov; co-founded Milieu Insight, one of Southeast Asia's fastest-growing customer intelligence platforms. Today runs Mozaik, a Toronto-based intelligence consultancy, and is building TalentQuill, an AI-powered skills assessment platform. Has developed multiple best-selling courses on data and AI, reaching 50,000+ students globally.",
    photo: "/stephen-tracy.jpg",
    tags: ["Data", "AI", "Brand", "Founder", "BI"],
    teaches: ["ai", "founder", "build"],
  },
];

export const getProfile = (slug: string): Profile | undefined =>
  profiles.find((p) => p.slug === slug);
