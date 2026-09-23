import { profiles, type Profile } from "./profiles";

/** Founding-year membership fee, CAD. Change here and the page follows. */
export const EXPERT_NETWORK_FEE_CAD = 250;

/** Seats in the founding cohort. The page draws one circle per seat. */
export const EXPERT_NETWORK_SEATS = 5;

/** Areas we're recruiting for. Rendered as cards on the page; names are the chips on the application form. */
export const EXPERTISE_AREAS = [
  { name: "Growth & marketing", detail: "Customer acquisition, positioning, conversion, digital marketing and go-to-market." },
  { name: "AI & automation", detail: "AI workflows, process automation, internal tools and operational efficiency." },
  { name: "CRM & business systems", detail: "CRM implementation, workflow design, integrations and business software." },
  { name: "Software & integrations", detail: "Custom software, APIs, system integrations and technical architecture." },
  { name: "Product & digital experience", detail: "Product strategy, UX, prototyping and launching digital products." },
  { name: "Scaling & operations", detail: "Helping businesses grow using better systems, processes and technology." },
  { name: "Data & analytics", detail: "Reporting, measurement, dashboards and using data to make better decisions." },
] as const;

export type ExpertiseArea = (typeof EXPERTISE_AREAS)[number]["name"];

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
    detail: "Startup Orillia works with local businesses, startups and nonprofits to surface real challenges, and makes sure there's a genuine problem, a decision-maker and intent to invest before bringing it to the Network.",
  },
  {
    title: "Problem Exchange",
    detail: "The organization presents its challenge to relevant members and answers questions. Members who can help follow up privately with a lightweight note: why they're a fit and how they'd approach the next step.",
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

/** Accepted members — profiles with an `expertNetwork` entry. Fills seats on the page. */
export const expertMembers: Profile[] = profiles.filter((p) => p.expertNetwork);

export const openSeats = Math.max(0, EXPERT_NETWORK_SEATS - expertMembers.length);
