export type WorkshopCategory = "ai" | "growth" | "build" | "systems";

export interface WorkshopIdea {
  title: string;
  description: string;
  audience: string;
  category: WorkshopCategory;
}

export const WORKSHOP_CATEGORY_LABEL: Record<WorkshopCategory, string> = {
  ai: "AI & Modern Work",
  growth: "Growth, Business & Clients",
  build: "Build & Launch",
  systems: "Systems & Productivity",
};

export const WORKSHOP_CATEGORY_ORDER: WorkshopCategory[] = [
  "ai",
  "growth",
  "build",
  "systems",
];

export const workshopIdeas: WorkshopIdea[] = [
  // AI & Modern Work
  {
    title: "Claude Code 101",
    description: "Set up Claude Code on a real project and learn practical workflows for debugging, refactoring, and shipping faster with AI assistance.",
    audience: "Engineers, technical founders, technical professionals",
    category: "ai",
  },
  {
    title: "Claude Cowork 101",
    description: "Set up Claude Cowork on your desktop and learn how to delegate research, drafts, analysis, and multi-step tasks to Claude across your real files and apps.",
    audience: "Researchers, analysts, operators, anyone whose work isn't code",
    category: "ai",
  },
  {
    title: "AI Workflows for Real Tasks",
    description: "Bring a recurring task from your work or business. Leave with reusable prompts and workflows that actually save time.",
    audience: "Anyone curious about AI tools",
    category: "ai",
  },
  {
    title: "AI for Operators: Internal Tools Without Code",
    description: "Automate a real workflow using modern no-code AI tools like Make, Zapier, Gumloop, and Lindy. No engineering team required.",
    audience: "Operators, small business teams, agencies",
    category: "ai",
  },
  {
    title: "AI for Marketing Graphics & Brand Content",
    description: "Create on-brand social posts, ads, banners, and visual assets using the latest AI tools like Canva AI, Midjourney, Microsoft Designer, Adobe Firefly, and Claude Design.",
    audience: "Marketers, small business owners, content creators",
    category: "ai",
  },
  {
    title: "AI-Generated Video & Short-Form Content",
    description: "Produce short-form video, voiceovers, and motion content using modern AI tools like Runway, Veo, Pika, ElevenLabs, and Opus Clip.",
    audience: "Marketers, creators, local businesses",
    category: "ai",
  },

  // Growth, Business & Clients
  {
    title: "Your First 100 Customers",
    description: "Practical customer acquisition before paid ads and automation. Leave with a simple 30-day outreach plan.",
    audience: "Early-stage founders",
    category: "growth",
  },
  {
    title: "Pricing Without Undercharging",
    description: "Pricing frameworks, positioning, and difficult pricing conversations. Leave with a stronger offer and pricing structure.",
    audience: "Freelancers, consultants",
    category: "growth",
  },
  {
    title: "Cold Outreach That Doesn't Suck",
    description: "Write and refine real outreach messages live, get feedback, and learn what actually gets replies.",
    audience: "Founders, freelancers, sellers",
    category: "growth",
  },
  {
    title: "Hiring Your First Contractor Without Getting Burned",
    description: "How to scope work, avoid common mistakes, and find reliable people without wasting weeks.",
    audience: "Solo founders, scaling freelancers",
    category: "growth",
  },

  // Build & Launch
  {
    title: "Idea to Landing Page in 90 Minutes",
    description: "Use modern AI and website tools to launch a live landing page by the end of the session.",
    audience: "Anyone with an idea",
    category: "build",
  },
  {
    title: "Designing in Figma Without Being a Designer",
    description: "Learn enough Figma to create clean landing pages, mockups, and product concepts without starting from scratch.",
    audience: "Founders, marketers, ops",
    category: "build",
  },

  // Systems & Productivity
  {
    title: "Spreadsheet Power Hour",
    description: "Real formulas, real workflows, real examples. Learn the spreadsheet skills people actually use day to day.",
    audience: "Ops, finance, anyone",
    category: "systems",
  },
  {
    title: "Structured Note-Taking & Personal Knowledge",
    description: "Set up a simple personal knowledge system for notes, ideas, projects, and information you actually want to find again.",
    audience: "Curious professionals",
    category: "systems",
  },
];
