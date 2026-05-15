/**
 * Workshop catalog.
 *
 * Each workshop has a status that drives the UI on its detail page:
 *   - "interest"   → embedded "Notify me" form
 *   - "scheduled"  → date/price/Luma RSVP via ReserveSeatForm
 *   - "sold-out"   → Luma waitlist link
 *   - "past"       → "schedule a return" form
 *
 * Levels are per-track. A person can be AI L2 and Founder L4 simultaneously.
 * Level numbers (1-5) and labels are shared across tracks for UI consistency,
 * but L2 in AI is independent from L2 in Founder.
 *
 * See CLAUDE.md → "Workshops + community profiles" for the editor playbook.
 */

import type { Event } from "./events";

export type WorkshopTrack = "ai" | "founder" | "build" | "ops";
export type WorkshopLevel = 1 | 2 | 3 | 4 | 5;
export type WorkshopStatus = "interest" | "scheduled" | "sold-out" | "past";

export interface WorkshopPrice {
  /** Ticket price (CAD). */
  regular: number;
  currency: "CAD";
}

export interface WorkshopAgendaItem {
  /** e.g. "6:00 - 6:15" or "Hour 1". */
  time: string;
  topic: string;
  /** Optional one-line elaboration. */
  detail?: string;
}

export interface Workshop {
  /** URL-safe identifier — drives /workshops/:slug. */
  slug: string;
  title: string;
  /** One-line promise. Shown in catalog + hero. */
  tagline: string;
  track: WorkshopTrack;
  /** Single level, or a range like [2, 3] for workshops that span. */
  level: WorkshopLevel | [WorkshopLevel, WorkshopLevel];
  durationMinutes: number;
  capacity: { min: number; max: number };
  status: WorkshopStatus;

  /** Profile.slug of the lead instructor. */
  leadSlug: string;
  /** Optional co-leads. */
  coLeadSlugs?: string[];

  // Syllabus
  /** Who this workshop is for. 2-4 bullets. */
  whoFor: string[];
  /** Tangible take-aways. "A working landing page", "A 30-day outreach plan". */
  youWillLeaveWith: string[];
  /** Outcome-driven learning goals using observable verbs. */
  whatYouWillLearn: string[];
  /** Optional time-blocked agenda. */
  agenda?: WorkshopAgendaItem[];
  /** Advisory only — never enforced. */
  prerequisites?: string[];

  /** Anchor pricing — set on every workshop so attendees see a real number. */
  price: WorkshopPrice;

  // Scheduling state (when status === "scheduled" | "sold-out" | "past")
  /** UTC start time of the scheduled session. */
  scheduledDate?: Date;
  /** Human-readable time label, e.g. "Wed June 3 · 9:00 AM - 12:00 PM EDT". */
  scheduledTimeLabel?: string;
  /** Luma event page URL for ticketing. */
  lumaUrl?: string;

  // Interest mode (when status === "interest")
  // The /workshops/:slug page renders an embedded WorkshopInterestForm
  // (currently posts to Formspree; Neon-backed /api/interest is dormant).

  /** Long-form description shown above the syllabus on detail pages. */
  description: string;
}

export const TRACK_LABEL: Record<WorkshopTrack, string> = {
  ai: "AI & Modern Work",
  founder: "Founder Skills",
  build: "Build & Launch",
  ops: "Ops & Productivity",
};

export const TRACK_SHORT_LABEL: Record<WorkshopTrack, string> = {
  ai: "AI",
  founder: "Founder",
  build: "Build",
  ops: "Ops",
};

export const TRACK_ORDER: WorkshopTrack[] = ["ai", "founder", "build", "ops"];

export const LEVEL_LABEL: Record<WorkshopLevel, string> = {
  1: "Foundations",
  2: "Working",
  3: "Building",
  4: "Shipping",
  5: "Leading",
};

export const LEVEL_DESCRIPTION: Record<WorkshopLevel, string> = {
  1: "No prior experience required. You'll leave understanding the concepts and why they matter.",
  2: "You've touched the tools once or twice. You'll leave able to use them on a real task.",
  3: "You use these regularly. You'll leave with a working artifact integrated into your own work.",
  4: "You're competent. You'll leave with advanced techniques, edge-case handling, and measurable improvements.",
  5: "You're shipping this work professionally. You'll leave with sharper edges, new patterns from peers, and a sounding board for your hardest problems.",
};

export const STATUS_LABEL: Record<WorkshopStatus, string> = {
  interest: "Coming soon",
  scheduled: "Scheduled",
  "sold-out": "Sold out",
  past: "Completed",
};

/** Normalize a single-level or range into a [min, max] tuple. */
export const levelRange = (
  level: WorkshopLevel | [WorkshopLevel, WorkshopLevel],
): [WorkshopLevel, WorkshopLevel] =>
  Array.isArray(level) ? level : [level, level];

/** Short label for a workshop's level, e.g. "L2 Working" or "L2-L3 Working-Building". */
export const formatLevelLabel = (
  level: WorkshopLevel | [WorkshopLevel, WorkshopLevel],
): string => {
  if (Array.isArray(level)) {
    return `L${level[0]}-L${level[1]} ${LEVEL_LABEL[level[0]]}-${LEVEL_LABEL[level[1]]}`;
  }
  return `L${level} ${LEVEL_LABEL[level]}`;
};

/** Short label for a workshop's level, e.g. "L2" or "L2-L3". */
export const formatLevelShort = (
  level: WorkshopLevel | [WorkshopLevel, WorkshopLevel],
): string => (Array.isArray(level) ? `L${level[0]}-L${level[1]}` : `L${level}`);

/**
 * Standard pricing tiers (CAD), aligned with the bands documented in CLAUDE.md.
 * Workshops can override per-instance if a particular session warrants it.
 *
 *  short      ~90 min    $125
 *  compact    ~2 hr      $165
 *  halfDay    ~3 hr      $295   ← workhorse
 *  intensive  ~4 hr      $395
 *
 * The default workshop slot is Wednesday 9 AM EDT/EST.
 */
export const PRICE_TIERS = {
  short: { regular: 125, currency: "CAD" },
  compact: { regular: 165, currency: "CAD" },
  halfDay: { regular: 295, currency: "CAD" },
  intensive: { regular: 395, currency: "CAD" },
} satisfies Record<string, WorkshopPrice>;

/* -------------------------------------------------------------------------- */
/*  Catalog                                                                   */
/* -------------------------------------------------------------------------- */

export const workshops: Workshop[] = [
  /* ============================ AI & Modern Work ============================ */
  {
    slug: "claude-code-101",
    price: PRICE_TIERS.halfDay,
    title: "Claude Code 101",
    tagline: "Set up Claude Code on a real project and ship faster with AI in the loop.",
    track: "ai",
    level: 2,
    durationMinutes: 180,
    capacity: { min: 5, max: 15 },
    status: "scheduled",
    scheduledDate: new Date(Date.UTC(2026, 5, 17, 13, 0, 0)),
    scheduledTimeLabel: "Wed June 17 · 9:00 AM - 12:00 PM EDT",
    leadSlug: "dave-caplan",
    whoFor: [
      "Engineers and technical founders curious about agentic coding",
      "Developers who have tried Cursor or Copilot but not yet Claude Code",
      "Technical operators who want to debug and refactor faster",
    ],
    youWillLeaveWith: [
      "Claude Code installed and configured on your own machine",
      "A CLAUDE.md tailored to one of your real projects",
      "Three reusable workflows for debugging, refactoring, and feature work",
    ],
    whatYouWillLearn: [
      "Install and authenticate Claude Code; choose the right model for the job",
      "Write a CLAUDE.md that actually changes Claude's behaviour",
      "Use subagents, parallel tool calls, and plan mode to ship faster",
      "Avoid the 5 most common Claude Code anti-patterns",
    ],
    agenda: [
      { time: "0:00 - 0:20", topic: "Setup + first conversation", detail: "Install, authenticate, point at a real repo." },
      { time: "0:20 - 1:00", topic: "Anatomy of a good CLAUDE.md", detail: "Build one live for your own project." },
      { time: "1:00 - 1:15", topic: "Break" },
      { time: "1:15 - 2:15", topic: "Workflows: debug, refactor, feature", detail: "Run three real tasks end-to-end." },
      { time: "2:15 - 2:45", topic: "Subagents, plan mode, MCP servers" },
      { time: "2:45 - 3:00", topic: "Q&A + how to keep going" },
    ],
    prerequisites: [
      "Bring your own laptop with a real codebase you'd like to work on",
      "Comfortable using a terminal and git",
    ],
    description:
      "Claude Code is the most capable agentic coding tool currently available, but the difference between a 2x speedup and a 10x speedup is in how you set it up. This hands-on workshop gets you from zero to a real workflow on one of your actual projects, with the kind of taste and conventions you only pick up by watching someone do it live.",
  },
  {
    slug: "claude-cowork-101",
    price: PRICE_TIERS.compact,
    title: "Claude Cowork 101",
    tagline: "Delegate research, drafts, and multi-step work to Claude — across your real files and apps.",
    track: "ai",
    level: 1,
    durationMinutes: 120,
    capacity: { min: 5, max: 15 },
    status: "interest",
    leadSlug: "dave-caplan",
    whoFor: [
      "Researchers, analysts, and operators whose work isn't code",
      "Anyone using ChatGPT casually who wants Claude doing more than just chat",
      "Curious professionals new to AI as a desktop coworker",
    ],
    youWillLeaveWith: [
      "Claude Cowork installed on your desktop and connected to your tools",
      "A set of three real tasks you delegated during the session",
      "A starter library of prompts and workflows for your specific job",
    ],
    whatYouWillLearn: [
      "Install Claude Cowork and grant it access to the right apps and files",
      "Frame a task so Claude actually finishes it (vs. just sounding helpful)",
      "Chain together research → draft → review without losing context",
      "Recognize when to delegate vs. when to do it yourself",
    ],
    prerequisites: ["Bring your laptop and one work task you've been putting off"],
    description:
      "Most professionals are still using AI like a chat toy. Claude Cowork is what happens when Claude can read your files, browse your apps, and finish multi-step work while you're in another meeting. This is the on-ramp from \"I use ChatGPT sometimes\" to \"AI is part of how I work.\"",
  },
  {
    slug: "ai-workflows-for-real-tasks",
    price: PRICE_TIERS.halfDay,
    title: "AI Workflows for Real Tasks",
    tagline: "Bring a recurring task. Leave with a workflow that actually saves you time.",
    track: "ai",
    level: 2,
    durationMinutes: 180,
    capacity: { min: 5, max: 15 },
    status: "interest",
    leadSlug: "dave-caplan",
    whoFor: [
      "Anyone using AI tools casually and wondering what they're missing",
      "Operators, founders, and freelancers with repeatable work",
      "People who've watched AI demos and want their own version",
    ],
    youWillLeaveWith: [
      "Two working AI workflows mapped to your real recurring tasks",
      "A reusable prompt template and evaluation checklist",
      "A list of things to automate next, ranked by ROI",
    ],
    whatYouWillLearn: [
      "Identify which recurring tasks are good candidates for AI",
      "Build prompts that are robust enough to use more than once",
      "Combine multiple tools (Claude, ChatGPT, Notion, sheets) into one flow",
      "Measure whether a workflow is actually saving time",
    ],
    prerequisites: ["Bring a real recurring task from your work or business"],
    description:
      "Most AI demos look magical until you try to apply them to your own work. This workshop flips that: bring one task you do every week, leave with a workflow you'll actually use the day after. No theory, no \"the future of AI\" — just hands-on time turning something annoying into something automated.",
  },
  {
    slug: "ai-internal-tools-no-code",
    price: PRICE_TIERS.intensive,
    title: "AI for Operators: Internal Tools Without Code",
    tagline: "Automate a real workflow with modern no-code AI tools. No engineering team required.",
    track: "ai",
    level: 3,
    durationMinutes: 240,
    capacity: { min: 5, max: 15 },
    status: "interest",
    leadSlug: "dave-caplan",
    whoFor: [
      "Operators and ops leads at small businesses or agencies",
      "Founders who keep hitting \"I wish we could automate this\"",
      "Small teams who don't have an internal eng resource (yet)",
    ],
    youWillLeaveWith: [
      "One end-to-end AI workflow built for your business during the session",
      "Accounts and templates in Make, Zapier, Gumloop, and/or Lindy",
      "A 90-day automation roadmap with effort vs. impact rankings",
    ],
    whatYouWillLearn: [
      "Pick the right no-code AI tool for the shape of your workflow",
      "Chain triggers, AI steps, and integrations without writing code",
      "Handle errors, edge cases, and human-in-the-loop review",
      "Calculate ROI on an internal tool before you build it",
    ],
    prerequisites: ["A real workflow in mind", "A laptop and accounts in your existing stack"],
    description:
      "Two years ago you needed an engineering team to build internal tools. Today, an operator with the right toolkit can build something useful before lunch. This half-day workshop walks you through building one real internal workflow end-to-end, then sends you home with a roadmap for the next ten.",
  },
  {
    slug: "ai-marketing-graphics",
    price: PRICE_TIERS.halfDay,
    title: "AI for Marketing Graphics & Brand Content",
    tagline: "Create on-brand social posts, ads, and visuals with the latest AI design tools.",
    track: "ai",
    level: 2,
    durationMinutes: 180,
    capacity: { min: 5, max: 15 },
    status: "interest",
    leadSlug: "dave-caplan",
    whoFor: [
      "Marketers and small business owners doing their own graphics",
      "Content creators who want to stop paying for stock and ship faster",
      "Agencies who want to bring AI into their production workflow",
    ],
    youWillLeaveWith: [
      "A week's worth of on-brand social and ad creative made during the session",
      "Reusable prompts and style references for your brand",
      "Workflows in Canva AI, Midjourney, Microsoft Designer, Adobe Firefly, and Claude Design",
    ],
    whatYouWillLearn: [
      "Pick the right AI design tool for the format you need",
      "Prompt for brand consistency, not just \"a nice image\"",
      "Combine AI tools with hand editing in Canva/Figma without losing time",
      "Avoid the \"AI slop\" tells that hurt credibility",
    ],
    prerequisites: ["Bring a few brand reference assets (logo, colors, a recent post)"],
    description:
      "AI design tools have gone from \"weird novelty\" to \"professional marketers use them daily\" faster than almost any other category. This workshop is hands-on across the actual tools real marketers use today — not generic prompt theory, but on-brand content you can post the same week.",
  },
  {
    slug: "ai-video-short-form",
    price: PRICE_TIERS.halfDay,
    title: "AI Video & Short-Form Content",
    tagline: "Produce short-form video, voiceovers, and motion with modern AI tools.",
    track: "ai",
    level: 2,
    durationMinutes: 180,
    capacity: { min: 5, max: 15 },
    status: "interest",
    leadSlug: "dave-caplan",
    whoFor: [
      "Marketers and creators making reels, shorts, and TikToks",
      "Local businesses who want to start posting video without a crew",
      "Anyone who has filmed something and given up in editing",
    ],
    youWillLeaveWith: [
      "Three short-form videos produced during the session",
      "A repeatable production pipeline: script → voice → visuals → cut",
      "Accounts and template projects in Runway, Veo, Pika, ElevenLabs, and Opus Clip",
    ],
    whatYouWillLearn: [
      "Choose the right tool for each piece of the pipeline",
      "Write scripts that work for AI voiceover and platform algorithms",
      "Generate b-roll and motion when you don't have footage",
      "Edit at speed with AI cutting tools without sacrificing quality",
    ],
    prerequisites: ["Laptop with audio, headphones helpful"],
    description:
      "The bar for short-form video used to be \"a creator with editing skills.\" The bar in 2026 is \"an operator with the right AI stack.\" This workshop gets you from idea to three posted-quality short videos in one sitting.",
  },

  {
    slug: "ai-for-public-sector",
    price: PRICE_TIERS.halfDay,
    title: "AI for Public Sector Work",
    tagline: "Practical AI for municipal staff, public servants, and anyone bound by FIPPA. Privacy-respecting workflows for the work you actually do.",
    track: "ai",
    level: 2,
    durationMinutes: 180,
    capacity: { min: 5, max: 15 },
    status: "interest",
    leadSlug: "dave-caplan",
    whoFor: [
      "Municipal staff drafting reports, council briefs, and public communications",
      "Public-sector employees working under FIPPA, MFIPPA, or similar records frameworks",
      "Anyone told to \"be careful with AI\" at work who wants a practical playbook instead",
    ],
    youWillLeaveWith: [
      "AI workflows you can use Monday morning without violating privacy or records rules",
      "A simple decision framework for what's safe to put into which AI tool",
      "Working prompt templates for briefs, plain-language rewriting, and meeting prep",
    ],
    whatYouWillLearn: [
      "Tell the difference between consumer AI, enterprise AI (Copilot for Microsoft 365), and on-device AI — and when to use each",
      "Redact, summarize, and rewrite without exposing protected information",
      "Use AI for plain-language writing, council reports, and stakeholder communication",
      "Recognize where AI is a productivity multiplier and where it's a liability in regulated work",
    ],
    agenda: [
      { time: "0:00 - 0:20", topic: "The public-sector AI landscape in 2026", detail: "What's changed, what's available, what's coming." },
      { time: "0:20 - 1:00", topic: "What's safe to put in a chatbot", detail: "FIPPA, MFIPPA, records retention — in plain English." },
      { time: "1:00 - 1:15", topic: "Break" },
      { time: "1:15 - 2:15", topic: "Hands-on: writing, summarizing, plain-language rewriting" },
      { time: "2:15 - 2:45", topic: "Briefs, council reports, FOI response templates" },
      { time: "2:45 - 3:00", topic: "Q&A + your next AI workflow" },
    ],
    prerequisites: [
      "A laptop and a real (anonymized if needed) task from your work",
      "Familiarity with how your organization handles records and privacy is helpful but not required",
    ],
    description:
      "Public-sector workers have been told to \"be careful with AI\" without much guidance on what to actually do. This workshop bridges that gap. By the end you'll know what you can and can't put into common AI tools, you'll have working prompts for the writing tasks you do every week, and you'll have a clear-eyed sense of where AI helps and where it's a liability in a regulated environment.",
  },
  {
    slug: "ai-for-real-estate",
    price: PRICE_TIERS.halfDay,
    title: "AI Marketing Stack for Real Estate Agents",
    tagline: "AI listings, AI photos, AI video, AI follow-up. The modern marketing stack top agents now run.",
    track: "ai",
    level: 2,
    durationMinutes: 180,
    capacity: { min: 5, max: 15 },
    status: "interest",
    leadSlug: "dave-caplan",
    whoFor: [
      "Real estate agents working in Orillia, Muskoka, and Simcoe",
      "New agents building a marketing system from scratch",
      "Established agents whose current process runs on willpower and a VA",
    ],
    youWillLeaveWith: [
      "AI-drafted listing copy for one of your active or recent listings",
      "Enhanced and virtually staged photos for a real property",
      "A short-form listing video produced during the session",
      "An AI-assisted drip nurture sequence in your voice",
    ],
    whatYouWillLearn: [
      "Write listing copy that converts — with AI, without sounding like AI",
      "Use AI photo tools (virtual staging, sky replacement, twilight conversion) the right way",
      "Produce short-form property video without a videographer",
      "Draft inquiries, follow-ups, and nurture sequences with AI while keeping your voice",
    ],
    agenda: [
      { time: "0:00 - 0:15", topic: "The agent's AI stack in 2026" },
      { time: "0:15 - 1:00", topic: "AI listing copy that converts", detail: "Hands-on with one of your listings." },
      { time: "1:00 - 1:30", topic: "AI photo tools: staging, sky, twilight, exterior cleanup" },
      { time: "1:30 - 1:45", topic: "Break" },
      { time: "1:45 - 2:30", topic: "Short-form listing video", detail: "Runway, HeyGen, ElevenLabs voiceover." },
      { time: "2:30 - 2:50", topic: "AI for follow-up and nurture", detail: "Personalized email, SMS, and birthday touches at scale." },
      { time: "2:50 - 3:00", topic: "Q&A" },
    ],
    prerequisites: [
      "Laptop, phone with a camera, and at least one active or recent listing",
      "Your current CRM is helpful but not required",
    ],
    description:
      "Most agents are running their marketing on willpower. This workshop replaces willpower with an AI stack: AI listing copy, AI photo enhancement, AI short-form video, and AI-assisted follow-up. You'll leave with working versions of each, built around a real listing of yours, and a publishing cadence you can sustain.",
  },
  {
    slug: "ai-for-trades",
    price: PRICE_TIERS.halfDay,
    title: "AI Tools for Trades & Contractors",
    tagline: "AI quoting, AI invoicing, AI review responses, AI after-hours chat. Run a tighter business without hiring.",
    track: "ai",
    level: 1,
    durationMinutes: 180,
    capacity: { min: 5, max: 15 },
    status: "interest",
    leadSlug: "dave-caplan",
    whoFor: [
      "Trades and contractors who'd rather be on-site than doing paperwork",
      "Owner-operators losing jobs to faster-responding competitors",
      "Anyone whose evenings get eaten by quoting, invoicing, and chasing payments",
    ],
    youWillLeaveWith: [
      "An AI-drafted quote template built around your real work",
      "An AI-powered after-hours auto-reply for missed-call leads",
      "AI workflows for invoice follow-up and review responses",
      "A Google Business Profile cleaned up with AI assistance",
    ],
    whatYouWillLearn: [
      "Turn site photos and voice notes into professional quotes in minutes, not hours",
      "Set up AI auto-replies that capture leads while you're on a roof",
      "Use AI to chase late invoices without sounding aggressive",
      "Generate review responses, social posts, and customer follow-ups without staring at a blank screen",
    ],
    agenda: [
      { time: "0:00 - 0:20", topic: "The AI stack for a one-truck shop in 2026" },
      { time: "0:20 - 1:00", topic: "AI-drafted quotes from photos and voice notes" },
      { time: "1:00 - 1:30", topic: "After-hours: missed-call SMS, auto-reply, lead capture" },
      { time: "1:30 - 1:45", topic: "Break" },
      { time: "1:45 - 2:15", topic: "Invoicing + payment follow-up with AI assistance" },
      { time: "2:15 - 2:45", topic: "AI for reviews, social, and Google Business Profile" },
      { time: "2:45 - 3:00", topic: "Q&A + your 30-day rollout" },
    ],
    prerequisites: [
      "A laptop and phone",
      "A few real examples of quotes, invoices, or customer messages (anonymized is fine)",
    ],
    description:
      "Trades and contractors lose more revenue to slow quoting and bad follow-up than to actual competition. This workshop is a practical AI setup session — by the end you'll have AI helping draft quotes from site photos, capture leads after hours, chase invoices automatically, and respond to reviews without it eating your weekend.",
  },

  {
    slug: "bi-stack-beyond-excel",
    price: PRICE_TIERS.halfDay,
    title: "Beyond Excel: Build Your Business Intelligence Stack in Under an Hour",
    tagline: "Deploy enterprise-grade BI infrastructure using free, open-source tools — in less time than your next team meeting.",
    track: "ai",
    level: 2,
    durationMinutes: 180,
    capacity: { min: 5, max: 15 },
    status: "scheduled",
    scheduledDate: new Date(Date.UTC(2026, 6, 8, 13, 0, 0)),
    scheduledTimeLabel: "Wed July 8 · 9:00 AM - 12:00 PM EDT",
    leadSlug: "stephen-tracy",
    whoFor: [
      "Business owners and operators hitting the limits of Excel or Google Sheets",
      "Operations and finance leads who manage reporting manually and want always-on dashboards",
      "Founders at early-stage companies who want data infrastructure that scales — without hiring a data team",
      "Anyone who has ever wanted to just ask their data a question and get a straight answer",
    ],
    youWillLeaveWith: [
      "A real Excel file converted into a live Postgres database via Supabase",
      "A working Metabase Open Source deployment connected to your database",
      "Functional dashboards for financial, marketing, or operational reporting",
      "An AI-powered text-to-SQL workflow using MetaBot — query your data in plain English",
    ],
    whatYouWillLearn: [
      "Explain the core limitations of spreadsheets and make the case for purpose-built BI infrastructure",
      "Convert an existing Excel file into a live Postgres database using Supabase — no developer experience required",
      "Deploy and configure Metabase Open Source and connect it to a database from scratch",
      "Build functional dashboards for financial, marketing, or operations reporting",
      "Use AI and MetaBot to query business data in plain English — no SQL required",
    ],
    agenda: [
      { time: "0:00 - 0:05", topic: "Welcome and framing" },
      { time: "0:05 - 0:20", topic: "The Excel ceiling", detail: "Why spreadsheets hold your business back as you scale." },
      { time: "0:20 - 0:30", topic: "The modern SMB data stack", detail: "What Metabase and Supabase are, and why they matter." },
      { time: "0:30 - 0:55", topic: "Live demo: Excel → Postgres via Supabase" },
      { time: "0:55 - 1:20", topic: "Live demo: deploying Metabase Open Source" },
      { time: "1:20 - 1:30", topic: "Break" },
      { time: "1:30 - 2:00", topic: "Building dashboards", detail: "Financial, marketing, and operational reporting in Metabase." },
      { time: "2:00 - 2:20", topic: "Talking to your data", detail: "AI-powered text-to-SQL with MetaBot." },
      { time: "2:20 - 2:45", topic: "Hands-on: connect your data, build a chart", detail: "Bring your own data and apply what you've seen." },
      { time: "2:45 - 3:00", topic: "Wrap-up, bonus course overview, and Q&A" },
    ],
    prerequisites: [
      "A laptop and a real Excel or Google Sheets file you'd like to convert (anonymized is fine)",
      "Comfort with spreadsheets — you've hit their limits, not started yesterday",
    ],
    description:
      "Spreadsheets are essential — but they're slow, fragile, and hard to extract insight from at scale. The good news: enterprise-grade BI tools are more accessible today than most businesses realize. In this hands-on session you'll follow a complete live walkthrough — converting a real Excel file into a Postgres database using Supabase, deploying Metabase Open Source, and building your first dashboards. You'll also learn how to use AI and Metabase's MetaBot to query your data in plain English, so your whole team can get answers without anyone writing a line of SQL.",
  },
  {
    slug: "prompt-to-prototype-claude-design",
    price: PRICE_TIERS.halfDay,
    title: "From Prompt to Prototype: A Step-by-Step Guide to Claude Design",
    tagline: "A practical, hands-on walkthrough of Claude Design — from your first prompt to a production-ready design system you can hand straight off to Claude Code.",
    track: "ai",
    level: 2,
    durationMinutes: 180,
    capacity: { min: 5, max: 15 },
    status: "scheduled",
    scheduledDate: new Date(Date.UTC(2026, 6, 15, 13, 0, 0)),
    scheduledTimeLabel: "Wed July 15 · 9:00 AM - 12:00 PM EDT",
    leadSlug: "stephen-tracy",
    whoFor: [
      "Founders and product builders who want to ship polished, consistent UIs without a dedicated design resource",
      "Developers using Claude Code who want stronger design thinking and consistency in their builds",
      "Non-designers responsible for product, marketing, or presentation visuals",
      "Small business operators exploring app prototyping or building internal tools for the first time",
    ],
    youWillLeaveWith: [
      "A complete design system built from scratch in Claude Design",
      "A live design-to-code handoff applied to a web application via Claude Code",
      "A working library of prompt strategies for design — batching, iterative evaluation, structured feedback",
    ],
    whatYouWillLearn: [
      "Where Claude Design excels and where its limitations are — so you use it appropriately from day one",
      "Select the right model for the design task at hand and understand why it matters",
      "Build a complete design system from scratch in Claude Design",
      "Execute a full design-to-code handoff: finalize a system in Claude Design and apply it via Claude Code",
      "Apply prompt strategies — batching, evaluation loops, structured feedback — that improve output quality across iterations",
    ],
    agenda: [
      { time: "0:00 - 0:05", topic: "Welcome and session framing" },
      { time: "0:05 - 0:20", topic: "What Claude Design is", detail: "Capabilities, limitations, comparisons with Figma and Miro." },
      { time: "0:20 - 0:30", topic: "Model selection for design work", detail: "When different models produce meaningfully different output." },
      { time: "0:30 - 0:50", topic: "Design systems deep dive", detail: "Why they matter and how Claude Design approaches them." },
      { time: "0:50 - 1:25", topic: "Live demo: building a design system from scratch in Claude Design" },
      { time: "1:25 - 1:40", topic: "Break" },
      { time: "1:40 - 2:15", topic: "Live demo: handing off to Claude Code", detail: "Applying the design system to a live web app." },
      { time: "2:15 - 2:40", topic: "Hands-on: build and hand off your own", detail: "Each attendee builds a small system and runs the Claude Code handoff." },
      { time: "2:40 - 2:55", topic: "Prompt strategies", detail: "Batching, evaluation loops, structured feedback to improve output quality." },
      { time: "2:55 - 3:00", topic: "Q&A and wrap-up" },
    ],
    prerequisites: [
      "A laptop with a Claude account",
      "Prior exposure to Claude or Claude Code is helpful but not required",
    ],
    description:
      "Claude Design changes what's possible for founders, builders, and operators who don't have a design team but can't afford to ship something that looks like they don't. This 90-minute session is a structured, step-by-step introduction: what Claude Design is, where it's genuinely good, and where it falls short — so you walk in with the right expectations and walk out with real capability. You'll build a design system from scratch, hand it off to Claude Code to apply across a web application, and learn the prompting strategies (batching, evaluation loops) that improve output quality across iterations.",
  },
  {
    slug: "brand-architecture-ai-framework",
    price: PRICE_TIERS.intensive,
    title: "Brand Architecture with AI and the B.R.A.N.D Framework",
    tagline: "From AI-powered customer research to a fully realized brand architecture — using Claude and the B.R.A.N.D framework to build, audit, or refresh your brand from the ground up.",
    track: "ai",
    level: 2,
    durationMinutes: 240,
    capacity: { min: 5, max: 15 },
    status: "scheduled",
    scheduledDate: new Date(Date.UTC(2026, 6, 22, 13, 0, 0)),
    scheduledTimeLabel: "Wed July 22 · 9:00 AM - 1:00 PM EDT",
    leadSlug: "stephen-tracy",
    whoFor: [
      "Founders and startup operators building a brand from scratch with a structured, research-backed approach",
      "Business owners at established SMBs auditing, optimizing, or refreshing a brand that has drifted",
      "Marketing leads or brand managers leveraging AI to do more with less",
      "Entrepreneurs preparing to launch a new product, service, or business with customer insight baked in",
    ],
    youWillLeaveWith: [
      "A clearly defined Ideal Customer Profile (ICP) and buyer persona built with AI-powered research",
      "A documented brand architecture built with Claude and the B.R.A.N.D system prompt — or a clear roadmap to one",
      "A repeatable review process for auditing and refreshing an existing brand",
    ],
    whatYouWillLearn: [
      "Build a clearly defined ICP and buyer persona using AI — and why this is the non-negotiable first step",
      "Identify the key components of brand architecture and articulate why they matter for growth and differentiation",
      "Use Claude and the B.R.A.N.D system prompt to build a complete brand architecture from scratch",
      "Audit an existing brand: identify gaps, inconsistencies, and opportunities to sharpen positioning with AI",
    ],
    agenda: [
      { time: "0:00 - 0:10", topic: "Welcome and framing", detail: "Why brand architecture is the most underleveraged asset in most SMBs." },
      { time: "0:10 - 0:30", topic: "What is brand architecture", detail: "Key components, common mistakes, what separates brands that connect." },
      { time: "0:30 - 0:45", topic: "The customer-first principle", detail: "Why ICP and buyer persona must come before any brand decisions." },
      { time: "0:45 - 1:15", topic: "AI-powered customer research", detail: "Live demo + guided exercise: building ICP and buyer persona with Claude." },
      { time: "1:15 - 1:25", topic: "Break" },
      { time: "1:25 - 1:40", topic: "The B.R.A.N.D framework", detail: "What it is, how it works, how it structures brand architecture." },
      { time: "1:40 - 2:15", topic: "Live demo: B.R.A.N.D system prompt with Claude", detail: "Building a brand architecture from scratch." },
      { time: "2:15 - 2:40", topic: "Auditing an existing brand", detail: "Review, stress-test, and refresh using AI." },
      { time: "2:40 - 2:50", topic: "Break" },
      { time: "2:50 - 3:30", topic: "Workshop exercise", detail: "Build or audit your own brand architecture using B.R.A.N.D." },
      { time: "3:30 - 3:50", topic: "Group share-out and discussion" },
      { time: "3:50 - 4:00", topic: "Wrap-up and next steps" },
    ],
    prerequisites: [
      "A laptop and a Claude account",
      "An existing brand or a product/business you're preparing to launch",
    ],
    description:
      "Most businesses underinvest in brand architecture — not because they don't care, but because they lack a clear process for building one grounded in real customer insight. A brand that isn't built on a deeply understood customer is just aesthetics: it looks the part but fails to resonate. This workshop fixes that by combining AI-powered customer research with structured brand architecture. You'll build a precise ICP and buyer persona using Claude and Gemini, then use the B.R.A.N.D framework and a purpose-built system prompt to construct or refresh a complete brand architecture. Whether you're a founder building from scratch or an established operator auditing what you already have, you'll leave with a documented brand architecture that's actionable, differentiated, and built on real customer understanding.",
  },

  /* ============================== Founder Skills ============================ */
  {
    slug: "first-100-customers",
    price: PRICE_TIERS.intensive,
    title: "Your First 100 Customers",
    tagline: "Practical customer acquisition before paid ads. Leave with a 30-day outreach plan.",
    track: "founder",
    level: 2,
    durationMinutes: 240,
    capacity: { min: 5, max: 15 },
    status: "interest",
    leadSlug: "dave-caplan",
    whoFor: [
      "Early-stage founders pre- or post-launch with under 100 paying users",
      "Solo builders who've shipped but haven't sold yet",
      "Side-project owners ready to turn it into a real business",
    ],
    youWillLeaveWith: [
      "A 30-day outreach plan with named accounts and channels",
      "A customer interview script you can use the same week",
      "A simple tracker for pipeline and learnings",
    ],
    whatYouWillLearn: [
      "Decide which acquisition channel is right for your stage (and which to ignore)",
      "Write outbound messages that get replies",
      "Run customer conversations that produce real signal, not polite nodding",
      "Recognize when you have product-market fit (and when you don't)",
    ],
    prerequisites: ["A product or idea concrete enough to talk to a customer about"],
    description:
      "Every founder has heard \"do things that don't scale.\" Almost nobody has a clear plan for what that actually looks like Monday morning. This workshop walks you through the unglamorous early-customer playbook used by founders who got to traction without ads — and leaves you with a 30-day plan you can start executing immediately.",
  },
  {
    slug: "pricing-without-undercharging",
    price: PRICE_TIERS.halfDay,
    title: "Pricing Without Undercharging",
    tagline: "Pricing frameworks, positioning, and the difficult conversations. Leave with a stronger offer.",
    track: "founder",
    level: 3,
    durationMinutes: 180,
    capacity: { min: 5, max: 15 },
    status: "interest",
    leadSlug: "dave-caplan",
    whoFor: [
      "Freelancers and consultants who suspect they're underpriced",
      "Founders re-pricing a product or service",
      "Agency owners structuring retainers and packages",
    ],
    youWillLeaveWith: [
      "A revised pricing structure for one of your offers",
      "A script for raising prices with existing clients",
      "A pricing one-pager you can send to prospects",
    ],
    whatYouWillLearn: [
      "Apply value-based, tiered, and outcome-based pricing models",
      "Defend a price without discounting reflexively",
      "Handle the four common pricing objections",
      "Decide when to raise, hold, or restructure",
    ],
    prerequisites: ["Bring one offer or service you're currently selling"],
    description:
      "Most freelancers and founders are 30-50% underpriced and don't know it. The blockers are rarely the market — they're the framing, the positioning, and the conversations the seller is afraid to have. This workshop is a working session where you'll restructure one of your offers and rehearse the pricing conversation that matches it.",
  },
  {
    slug: "cold-outreach-that-works",
    price: PRICE_TIERS.halfDay,
    title: "Cold Outreach That Doesn't Suck",
    tagline: "Write real outreach live, get feedback, and learn what actually gets replies.",
    track: "founder",
    level: 2,
    durationMinutes: 180,
    capacity: { min: 5, max: 15 },
    status: "interest",
    leadSlug: "dave-caplan",
    whoFor: [
      "Founders and operators who need to start the conversations",
      "Freelancers building a pipeline from cold",
      "Anyone who has \"start sending emails\" on their list for three weeks",
    ],
    youWillLeaveWith: [
      "Five sent, peer-reviewed outreach messages by end of session",
      "A reusable template library for first-touch, follow-up, and break-up",
      "A short list of named accounts and contacts to keep working",
    ],
    whatYouWillLearn: [
      "Research and prioritize the right target list (not the easy one)",
      "Write opening lines that get past the 3-second scan",
      "Sequence follow-ups without sounding desperate",
      "Use AI for personalization without sounding like a bot",
    ],
    prerequisites: ["Laptop", "A sense of who you'd like to talk to"],
    description:
      "There are no shortcuts to a pipeline, but there is a craft. Most cold outreach fails not because the channel is dead, but because the message is generic, the targeting is lazy, and the follow-up never happens. This workshop is a writing-intensive session that ends with messages actually sent.",
  },
  {
    slug: "hiring-first-contractor",
    price: PRICE_TIERS.compact,
    title: "Hiring Your First Contractor",
    tagline: "Scope work, avoid common mistakes, and find reliable people without wasting weeks.",
    track: "founder",
    level: 2,
    durationMinutes: 120,
    capacity: { min: 5, max: 15 },
    status: "interest",
    leadSlug: "dave-caplan",
    whoFor: [
      "Solo founders and freelancers ready to delegate for the first time",
      "Small business owners getting buried in operational work",
      "Anyone who has been burned by a bad contractor and wants a better playbook",
    ],
    youWillLeaveWith: [
      "A written scope and SOW for one thing you'd like to delegate",
      "A vetting checklist and trial-week structure",
      "A short list of where to actually find good people",
    ],
    whatYouWillLearn: [
      "Write a scope that exposes weak contractors quickly",
      "Run a paid trial week without committing to a bad fit",
      "Set expectations, communication cadence, and quality bars",
      "Recognize the early warning signs of a bad engagement",
    ],
    description:
      "Hiring the wrong first contractor sets a founder back weeks and burns trust. Hiring the right one is the moment your business starts to scale. This is a focused playbook session on how to do the second one — and avoid the first one — based on patterns that hold up across design, dev, marketing, and ops.",
  },

  /* =============================== Build & Launch =========================== */
  {
    slug: "landing-page-in-90-minutes",
    price: PRICE_TIERS.compact,
    title: "Idea to Landing Page in 90 Minutes",
    tagline: "Launch a live landing page for your idea by the end of the session.",
    track: "build",
    level: 1,
    durationMinutes: 120,
    capacity: { min: 5, max: 15 },
    status: "scheduled",
    scheduledDate: new Date(Date.UTC(2026, 5, 24, 13, 0, 0)),
    scheduledTimeLabel: "Wed June 24 · 9:00 - 11:00 AM EDT",
    leadSlug: "dave-caplan",
    whoFor: [
      "Anyone with an idea they've been sitting on",
      "Founders who don't have a live page yet",
      "Builders curious how fast a real page comes together with AI",
    ],
    youWillLeaveWith: [
      "A live URL pointing at a real landing page for your idea",
      "A waitlist or interest form connected to your email",
      "Cleanup notes and a plan for what to improve next",
    ],
    whatYouWillLearn: [
      "Pick the right tool for your idea (Framer, Lovable, Carrd, Tally, simple HTML)",
      "Write a hero that explains what your thing is in 10 seconds",
      "Wire a waitlist that actually emails you when someone signs up",
      "Buy a domain and point it correctly without rabbit-holing",
    ],
    prerequisites: ["An idea, a laptop, and 90 minutes of focus"],
    description:
      "The hardest part of starting something used to be having a live presence. Now it's a 90-minute workshop. By the end you'll have a real URL you can share, a waitlist you can promote, and the muscle memory to spin up the next one in an afternoon.",
  },
  {
    slug: "figma-for-non-designers",
    price: PRICE_TIERS.halfDay,
    title: "Designing in Figma Without Being a Designer",
    tagline: "Enough Figma to make clean landing pages, mockups, and product concepts.",
    track: "build",
    level: 2,
    durationMinutes: 180,
    capacity: { min: 5, max: 15 },
    status: "interest",
    leadSlug: "dave-caplan",
    whoFor: [
      "Founders, marketers, and ops folks tired of relying on a designer for everything",
      "Builders who want to communicate ideas visually",
      "Anyone who has opened Figma, gotten overwhelmed, and quit",
    ],
    youWillLeaveWith: [
      "A Figma file with a working landing page mockup of your own",
      "A library of components and styles to reuse",
      "Comfort with frames, auto-layout, constraints, and components",
    ],
    whatYouWillLearn: [
      "Navigate Figma confidently without watching three hours of YouTube first",
      "Use auto-layout the way real designers actually use it",
      "Steal from existing design systems without it looking stolen",
      "Hand off a file a developer or AI tool can actually build from",
    ],
    prerequisites: ["A laptop with Figma installed (free account is fine)"],
    description:
      "Figma is the lingua franca of modern product work, and you don't need to be a designer to be fluent in it. This workshop is the fast-track for builders, founders, and operators who want to stop sketching in Google Slides and start producing real mockups.",
  },

  /* ============================ Ops & Productivity ========================== */
  {
    slug: "spreadsheet-power-hour",
    price: PRICE_TIERS.short,
    title: "Spreadsheet Power Hour",
    tagline: "Real formulas, real workflows, real examples. The spreadsheet skills people actually use.",
    track: "ops",
    level: 1,
    durationMinutes: 90,
    capacity: { min: 5, max: 15 },
    status: "interest",
    leadSlug: "dave-caplan",
    whoFor: [
      "Ops and finance folks who use spreadsheets daily and want to be faster",
      "Founders and operators tired of doing things manually",
      "Anyone whose Google Sheets skills topped out in 2012",
    ],
    youWillLeaveWith: [
      "A practice sheet preloaded with real exercises you keep",
      "Working examples of LOOKUPs, ARRAYFORMULAs, QUERY, and modern AI cells",
      "A list of three workflows in your job ready to automate next",
    ],
    whatYouWillLearn: [
      "Use modern formulas (LET, LAMBDA, QUERY, ARRAYFORMULA) without losing your mind",
      "Apply AI cells (Sheets AI, =GPT-style functions) to real cleanup and analysis",
      "Structure a sheet so other humans can use it without breaking it",
      "Recognize when a sheet should become a real tool",
    ],
    prerequisites: ["Laptop, Google account"],
    description:
      "Spreadsheets are the most underrated software on earth — and most people use 5% of them. This is a fast, dense, hands-on session designed to give you the 30% of spreadsheet skill that does 80% of the work.",
  },
  {
    slug: "structured-note-taking",
    price: PRICE_TIERS.compact,
    title: "Structured Note-Taking & Personal Knowledge",
    tagline: "A simple personal knowledge system for notes, ideas, and projects you can actually find again.",
    track: "ops",
    level: 1,
    durationMinutes: 120,
    capacity: { min: 5, max: 15 },
    status: "interest",
    leadSlug: "dave-caplan",
    whoFor: [
      "Curious professionals drowning in tabs, screenshots, and \"I'll remember this later\"",
      "Operators and consultants juggling multiple clients or projects",
      "Anyone who has tried Notion / Obsidian / Roam and abandoned them",
    ],
    youWillLeaveWith: [
      "A simple, lasting note system set up in your tool of choice",
      "Three templates: meeting notes, project brief, weekly review",
      "A weekly habit loop you can keep doing without ceremony",
    ],
    whatYouWillLearn: [
      "Pick a tool that fits your brain (not the influencer's)",
      "Capture quickly without organizing in the moment",
      "Build a tagging and linking structure light enough to maintain",
      "Run a 15-minute weekly review that actually keeps you ahead",
    ],
    description:
      "The best personal knowledge system is the one you'll still be using in six months. This workshop strips away the productivity-influencer noise and gives you something simple, durable, and yours.",
  },
];

export const getWorkshop = (slug: string): Workshop | undefined =>
  workshops.find((w) => w.slug === slug);

export const getWorkshopsByTrack = (track: WorkshopTrack): Workshop[] =>
  workshops.filter((w) => w.track === track);

export const getWorkshopsByStatus = (status: WorkshopStatus): Workshop[] =>
  workshops.filter((w) => w.status === status);

/* -------------------------------------------------------------------------- */
/*  Event adapter                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Convert a scheduled workshop into an `Event` so it can be rendered by the
 * Events page alongside coworking days and partner events. Only meaningful
 * when `workshop.scheduledDate` and `workshop.scheduledTimeLabel` are set.
 */
export const workshopAsEvent = (w: Workshop): Event => {
  if (!w.scheduledDate || !w.scheduledTimeLabel) {
    throw new Error(`Workshop ${w.slug} is missing scheduled date/time`);
  }

  // scheduledTimeLabel is "Wed June 17 · 9:00 AM - 12:00 PM EDT"
  // Split on the · separator to populate the Events page's date / time fields.
  const [datePart, timePart = ""] = w.scheduledTimeLabel.split(" · ");

  const cost = `$${w.price.regular} ${w.price.currency}`;

  const endDate = new Date(w.scheduledDate.getTime() + w.durationMinutes * 60_000);

  return {
    title: w.title,
    description: w.tagline,
    date: datePart,
    time: timePart,
    location: "Creative Nomad Studios, 23 Mississaga St W, Orillia, ON",
    cost,
    type: "workshop",
    rsvpUrl: w.lumaUrl,
    startDate: w.scheduledDate,
    endDate,
    detailUrl: `/workshops/${w.slug}`,
  };
};
