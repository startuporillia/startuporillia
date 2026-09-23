import { profiles, type Profile } from "./profiles";

/** Founding-year membership fee, CAD. Change here and the page follows. */
export const EXPERT_NETWORK_FEE_CAD = 250;

/** Seats in the founding cohort. The page draws one circle per seat. */
export const EXPERT_NETWORK_SEATS = 5;

/** Areas we're recruiting for. Chips on the page and on the application form. */
export const EXPERTISE_AREAS = [
  "Growth & marketing",
  "AI & automation",
  "CRM & business systems",
  "Software & integrations",
  "Product & digital experience",
  "Scaling & operations",
  "Data & analytics",
] as const;

export type ExpertiseArea = (typeof EXPERTISE_AREAS)[number];

/** What businesses actually say when they show up. Shown before we explain the process. */
export const EXAMPLE_PROBLEMS = [
  "We need more leads, but our sales process is a mess.",
  "We're doing too much manually.",
  "Our CRM isn't working for us.",
  "We need these systems to talk to each other.",
  "We think AI could help, but we don't know where.",
  "We've grown quickly and our processes haven't kept up.",
  "We want to launch a new digital product.",
  "We need to understand why customers aren't converting.",
] as const;

export const OPPORTUNITY_STEPS = [
  {
    title: "We source and qualify opportunities",
    detail: "Startup Orillia works with local businesses, startups and nonprofits to surface real challenges. Before bringing something to the Network, we make sure there's a genuine problem to solve, a decision-maker involved, and a realistic path toward paid work.",
  },
  {
    title: "We bring it to the Network",
    detail: "Some opportunities are shared directly with relevant members. Others become a Problem Exchange, where the organization presents its challenge to interested members and answers questions. Members who see a fit follow up privately with why they can help and what they think the next step should be.",
  },
  {
    title: "The organization chooses",
    detail: "The business decides who, if anyone, it wants to pursue. Scope, pricing and the engagement are agreed directly between the business and the expert.",
  },
] as const;

export const MEMBER_BENEFITS = [
  {
    title: "Qualified opportunities",
    detail: "Early access to business opportunities Startup Orillia has already reviewed for fit, seriousness and commercial intent.",
  },
  {
    title: "Problem Exchanges",
    detail: "Join selected sessions where local organizations present real business challenges, ask questions, and hear different perspectives before deciding who they want to work with.",
  },
  {
    title: "Visibility",
    detail: "A public profile showing what you've done and the kinds of problems organizations can come to you for.",
  },
  {
    title: "Trusted referral",
    detail: "Be one of a small number of experienced professionals Startup Orillia can confidently bring into conversations when a local organization needs help.",
  },
] as const;

export const ELIGIBILITY = [
  "Have at least 2 years of meaningful hands-on experience in their field",
  "Have a connection to Orillia or the surrounding area",
  "Have expertise a local organization could realistically hire them for",
] as const;

export const APPLICATION_STEPS = [
  { title: "Apply", detail: "Tell us about your experience, what you've delivered, and what a business could hire you for." },
  { title: "Review", detail: "We look at practical experience, demonstrated expertise, local connection and the overall mix of skills in the Network." },
  { title: "Conversation", detail: "A brief conversation about your experience, the kinds of work you're interested in, and whether the Network is a good fit." },
  { title: "Offer", detail: "Selected applicants are offered one of the founding memberships. Joining is entirely optional." },
] as const;

export interface NetworkLead {
  name: string;
  title: string;
  /** Root-relative path in /public. Omit to render initials. */
  photo?: string;
  linkedin?: string;
}

/** People running the Network. Shown beneath the seats, outside the cohort. */
export const NETWORK_LEADS: NetworkLead[] = [
  {
    name: "Dave Caplan",
    title: "Expert Network Lead · Startup Orillia",
    photo: "/dave.jpg",
    linkedin: "https://www.linkedin.com/in/davecap/",
  },
  {
    name: "Jordan Rossman",
    title: "Expert Network Lead · Founder, RubyKay Labs",
  },
];

/** Accepted members — profiles with an `expertNetwork` entry. Fills seats on the page. */
export const expertMembers: Profile[] = profiles.filter((p) => p.expertNetwork);

export const openSeats = Math.max(0, EXPERT_NETWORK_SEATS - expertMembers.length);
