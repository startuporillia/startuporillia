import { toNodeHandler } from "@modelcontextprotocol/node";
import { chamberMcpHandler } from "../chamber/mcp.js";

export const config = { runtime: "nodejs", maxDuration: 30 };

const buckets = new Map<string, { minute: number; count: number }>();
const nodeHandler = toNodeHandler(chamberMcpHandler, { onerror: (error) => console.error("MCP request failed", error) });

export default async function handler(req: Parameters<typeof nodeHandler>[0], res: Parameters<typeof nodeHandler>[1]): Promise<void> {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(",")[0]?.trim() ?? "unknown";
  const minute = Math.floor(Date.now() / 60_000);
  const bucket = buckets.get(ip);
  const count = bucket?.minute === minute ? bucket.count + 1 : 1;
  buckets.set(ip, { minute, count });
  if (count > 120) {
    res.writeHead(429, { "content-type": "application/json", "retry-after": "60" });
    res.end(JSON.stringify({ error: "Rate limit exceeded" }));
    return;
  }
  await nodeHandler(req, res);
}
