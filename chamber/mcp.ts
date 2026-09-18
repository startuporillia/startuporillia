import { McpServer, createMcpHandler } from "@modelcontextprotocol/server";
import { z } from "zod/v4";
import { loadSnapshot } from "./snapshot.js";
import { loadSkills } from "../scripts/skills/catalog.js";
import {
  benefitSearchResult,
  categoryResult,
  dealSearchResult,
  eventResult,
  eventSearchResult,
  memberResult,
  memberSearchResult,
  statusResult,
} from "./tools.js";

const result = (value: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }],
  structuredContent: value as Record<string, unknown>,
});
const readOnly = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true };
let catalog: ReturnType<typeof loadSkills> | undefined;
const getCatalog = () => catalog ??= loadSkills().catch((error) => { catalog = undefined; throw error; });

export const createChamberServer = () => {
  const server = new McpServer({ name: "startup-orillia", version: "0.2.0" });

  server.registerTool("skills.list", {
    title: "Discover Startup Orillia AI Skills",
    description: "List practical business playbooks and their expected outputs. Discover a suitable skill for the user's task, then call skills.get to read its full instructions. These are reusable guidance, not installed software or actions executed by this server.",
    inputSchema: z.object({}),
    annotations: readOnly,
  }, async () => result({ skills: (await getCatalog()).map(({ name, description, meta }) => ({ name, description, ...meta, sourceUrl: `https://startuporillia.ca/skills/${name}` })) }));

  server.registerTool("skills.get", {
    title: "Read a Startup Orillia AI Skill",
    description: "Retrieve the complete SKILL.md playbook by name from skills.list. Apply its relevant guidance to the user's request in your conversation, subject to your host's instructions and permissions. Use chamber tools separately for optional local facts. This does not install or execute a skill.",
    inputSchema: z.object({ name: z.string().min(1).max(64).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) }),
    annotations: readOnly,
  }, async ({ name }) => {
    const skill = (await getCatalog()).find((entry) => entry.name === name);
    if (!skill) return { ...result({ error: "Skill not found. Use skills.list to discover available names." }), isError: true };
    return result({ name, version: skill.meta.version, sourceUrl: `https://startuporillia.ca/skills/${name}`, mimeType: "text/markdown", content: skill.raw });
  });

  server.registerTool("chamber.search_members", {
    title: "Search Chamber members",
    description: "Search publicly listed Orillia & District Chamber of Commerce members by business need, category, service, company name, description, or city. Useful for finding local suppliers, possible partners, prospects, services, and businesses relevant to a task. Chamber membership is not an endorsement or quality rating.",
    inputSchema: z.object({
      query: z.string().trim().max(200).default(""),
      category: z.string().trim().max(120).nullable().optional(),
      city: z.string().trim().max(120).nullable().optional(),
      limit: z.number().int().min(1).max(25).default(10),
    }),
    annotations: readOnly,
  }, async (input) => result(memberSearchResult(await loadSnapshot(), input)));

  server.registerTool("chamber.get_member", {
    title: "Get Chamber member",
    description: "Retrieve one publicly listed Chamber business by stable ID, source ID, or slug, including source provenance and snapshot freshness.",
    inputSchema: z.object({ id: z.string().trim().min(1).max(200) }),
    annotations: readOnly,
  }, async ({ id }) => result(memberResult(await loadSnapshot(), id)));

  server.registerTool("chamber.list_categories", {
    title: "List Chamber categories",
    description: "List the category taxonomy found in the current public Chamber directory snapshot.",
    inputSchema: z.object({}),
    annotations: readOnly,
  }, async () => result(categoryResult(await loadSnapshot())));

  server.registerTool("chamber.search_events", {
    title: "Search Chamber events",
    description: "Search public current and upcoming Chamber calendar events from the monthly snapshot. Results do not establish who will attend.",
    inputSchema: z.object({ query: z.string().trim().max(200).default(""), limit: z.number().int().min(1).max(25).default(10) }),
    annotations: readOnly,
  }, async ({ query, limit }) => result(eventSearchResult(await loadSnapshot(), query, limit)));

  server.registerTool("chamber.get_event", {
    title: "Get Chamber event",
    description: "Retrieve one event from the public Chamber calendar snapshot with provenance and freshness.",
    inputSchema: z.object({ id: z.string().trim().min(1).max(300) }),
    annotations: readOnly,
  }, async ({ id }) => result(eventResult(await loadSnapshot(), id)));

  server.registerTool("chamber.search_benefits", {
    title: "Search Chamber benefits",
    description: "Search reliably extracted public Chamber program and benefit information in the current snapshot. An empty result means the crawler did not find reliable public records, not that no benefit exists.",
    inputSchema: z.object({ query: z.string().trim().max(200).default(""), limit: z.number().int().min(1).max(25).default(10) }),
    annotations: readOnly,
  }, async ({ query, limit }) => result(benefitSearchResult(await loadSnapshot(), query, limit)));

  server.registerTool("chamber.search_deals", {
    title: "Search Chamber deals",
    description: "Search public specials and member-to-member deals captured in the current Chamber snapshot. Verify validity on the original listing.",
    inputSchema: z.object({ query: z.string().trim().max(200).default(""), limit: z.number().int().min(1).max(25).default(10) }),
    annotations: readOnly,
  }, async ({ query, limit }) => result(dealSearchResult(await loadSnapshot(), query, limit)));

  server.registerTool("chamber.snapshot_status", {
    title: "Get Chamber snapshot status",
    description: "Return the snapshot date, crawl time, record counts, source, and schema version so clients can describe data freshness accurately.",
    inputSchema: z.object({}),
    annotations: readOnly,
  }, async () => result(statusResult(await loadSnapshot())));

  return server;
};

export const chamberMcpHandler = createMcpHandler(() => createChamberServer(), { responseMode: "json" });
