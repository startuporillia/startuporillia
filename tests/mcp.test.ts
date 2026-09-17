import { resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { Client, InMemoryTransport } from "@modelcontextprotocol/client";
import { createChamberServer } from "../chamber/mcp";

process.env.CHAMBER_SNAPSHOT_PATH = resolve("fixtures/chamber/synthetic-snapshot.json");

async function connected() {
  const server = createChamberServer();
  const client = new Client({ name: "chamber-test", version: "1.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  await client.connect(clientTransport);
  return { client, server };
}

const open: Array<{ client: Client; server: ReturnType<typeof createChamberServer> }> = [];
afterEach(async () => {
  await Promise.all(open.splice(0).map(async ({ client, server }) => { await client.close(); await server.close(); }));
});

describe("Chamber MCP", () => {
  it("initializes and lists all read-only tools", async () => {
    const pair = await connected(); open.push(pair);
    const result = await pair.client.listTools();
    expect(result.tools.map((tool) => tool.name)).toEqual(expect.arrayContaining([
      "chamber.search_members", "chamber.get_member", "chamber.list_categories", "chamber.search_events", "chamber.get_event", "chamber.search_benefits", "chamber.search_deals", "chamber.snapshot_status",
    ]));
    expect(result.tools.every((tool) => tool.annotations?.readOnlyHint)).toBe(true);
  });

  it("returns exact/fuzzy search, freshness, and source provenance", async () => {
    const pair = await connected(); open.push(pair);
    const response = await pair.client.callTool({ name: "chamber.search_members", arguments: { query: "sign company" } });
    const payload = response.structuredContent as { snapshotDate: string; results: Array<{ name: string; sourceUrl: string }> };
    expect(payload.snapshotDate).toBe("2026-09-01");
    expect(payload.results[0].name).toBe("Example Sign Studio");
    expect(payload.results[0].sourceUrl).toMatch(/^https:\/\/business\.orillia\.com/);
  });

  it("returns status and an empty no-result set", async () => {
    const pair = await connected(); open.push(pair);
    const status = await pair.client.callTool({ name: "chamber.snapshot_status", arguments: {} });
    expect((status.structuredContent as { memberCount: number }).memberCount).toBe(5);
    const none = await pair.client.callTool({ name: "chamber.search_members", arguments: { query: "deep sea submarine manufacturing" } });
    expect((none.structuredContent as { results: unknown[] }).results).toEqual([]);
  });
});
