import { profiles, type Profile } from "./profiles";

/** Founding-year membership fee, CAD. Change here and the page follows. */
export const EXPERT_NETWORK_FEE_CAD = 250;

/** Seats available in the founding cohort. The page draws one circle per seat. */
export const EXPERT_NETWORK_SEATS = 8;

/** Areas we're recruiting for. Rendered as chips; also the options on the application form. */
export const EXPERTISE_AREAS = [
  "Software",
  "AI & automation",
  "Product",
  "UX / design",
  "Data",
  "Digital strategy",
  "Technical architecture",
] as const;

export type ExpertiseArea = (typeof EXPERTISE_AREAS)[number];

export const MEMBER_BENEFITS = [
  {
    title: "Paid opportunities",
    detail: "Warm introductions when a relevant project comes through Startup Orillia. There is no guaranteed volume of work.",
  },
  {
    title: "Visibility",
    detail: "A public profile showing what you're good at and what people can come to you for.",
  },
  {
    title: "First look",
    detail: "Early visibility into problems and opportunities surfaced through Startup Orillia and its local relationships.",
  },
  {
    title: "Trusted referral",
    detail: "Be part of a small, vetted network Startup Orillia can confidently recommend when relevant opportunities arise.",
  },
] as const;

export const CONNECTION_STEPS = [
  { title: "A business brings us a problem", detail: "Startups, businesses and nonprofits tell us what they're trying to solve." },
  { title: "We identify relevant experts", detail: "We look for Network members whose experience fits the problem." },
  { title: "You have a conversation", detail: "A short intro call to see whether there's a fit on both sides." },
  { title: "You work together directly", detail: "If it's a match, it becomes a normal paid engagement between you and them." },
] as const;

export const ELIGIBILITY = [
  "Have 2+ years of hands-on experience building, launching or delivering technology or digital products",
  "Have a connection to Orillia or the surrounding area",
  "Have expertise a local business could realistically hire them for",
] as const;

export const APPLICATION_STEPS = [
  { title: "Apply", detail: "Tell us about your experience, what you've shipped, and what a business could hire you for." },
  { title: "Review", detail: "We look at practical experience, demonstrated expertise, local connection and the overall mix of skills in the Network." },
  { title: "Conversation", detail: "A brief conversation about your experience, the kinds of work you're interested in, and whether the Network is a good fit." },
  { title: "Offer", detail: "Selected applicants are offered one of the founding memberships. Joining is entirely optional." },
] as const;

export const EXAMPLE_PROBLEMS = [
  "Can AI automate this workflow?",
  "We need two systems integrated.",
  "Can someone help scope this app?",
  "Our product needs a better UX.",
] as const;

/** Accepted members — profiles with an `expertNetwork` entry. Fills seats on the page. */
export const expertMembers: Profile[] = profiles.filter((p) => p.expertNetwork);

export const openSeats = Math.max(0, EXPERT_NETWORK_SEATS - expertMembers.length);
