/**
 * Minimal Discord REST client for the Startup Orillia server config tooling.
 *
 * Credentials come from .env.local (gitignored via *.local):
 *   DISCORD_BOT_TOKEN=...
 *   DISCORD_GUILD_ID=...
 *
 * The token is never logged. Errors print status + Discord's error body only.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const API = "https://discord.com/api/v10";

/** Load .env.local without clobbering vars already in the shell env. */
function loadEnvLocal(): void {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (!match) continue;
      const [, key, value] = match;
      if (!process.env[key]) process.env[key] = value.replace(/^["']|["']$/g, "");
    }
  } catch {
    // Optional — vars may come from the shell instead.
  }
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}. Add it to .env.local`);
  return value;
}

loadEnvLocal();

export const GUILD_ID = requireEnv("DISCORD_GUILD_ID");
const TOKEN = requireEnv("DISCORD_BOT_TOKEN");

export class DiscordError extends Error {
  constructor(
    readonly status: number,
    readonly method: string,
    readonly path: string,
    readonly body: unknown,
  ) {
    super(`${method} ${path} → ${status}: ${JSON.stringify(body)}`);
    this.name = "DiscordError";
  }
}

interface RequestOptions {
  /** Written to the server audit log. */
  reason?: string;
}

/**
 * Perform a Discord API request, retrying once per 429 as instructed by the
 * rate-limit headers. Returns null for 204 responses.
 */
export async function discord<T = unknown>(
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
  path: string,
  body?: unknown,
  options: RequestOptions = {},
): Promise<T> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const headers: Record<string, string> = {
      Authorization: `Bot ${TOKEN}`,
      "Content-Type": "application/json",
    };
    if (options.reason) headers["X-Audit-Log-Reason"] = options.reason;

    const response = await fetch(`${API}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (response.status === 429) {
      const retry = await response.json().catch(() => ({ retry_after: 1 }));
      const waitMs = Math.ceil(((retry as { retry_after?: number }).retry_after ?? 1) * 1000) + 250;
      await new Promise((r) => setTimeout(r, waitMs));
      continue;
    }

    if (response.status === 204) return null as T;

    const payload = await response.json().catch(() => null);
    if (!response.ok) throw new DiscordError(response.status, method, path, payload);
    return payload as T;
  }
  throw new Error(`${method} ${path} — rate limited after 5 attempts`);
}

/** GET that returns null on 404/403 instead of throwing (for optional resources). */
export async function discordOptional<T>(path: string): Promise<T | null> {
  try {
    return await discord<T>("GET", path);
  } catch (error) {
    if (error instanceof DiscordError && [403, 404].includes(error.status)) return null;
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Types (only the fields this tooling reads)
// ---------------------------------------------------------------------------

export const ChannelType = {
  GUILD_TEXT: 0,
  DM: 1,
  GUILD_VOICE: 2,
  GUILD_CATEGORY: 4,
  GUILD_ANNOUNCEMENT: 5,
  GUILD_STAGE_VOICE: 13,
  GUILD_FORUM: 15,
  GUILD_MEDIA: 16,
} as const;

export const CHANNEL_TYPE_NAME: Record<number, string> = {
  0: "text",
  2: "voice",
  4: "category",
  5: "announcement",
  13: "stage",
  15: "forum",
  16: "media",
};

export interface Overwrite {
  id: string;
  type: 0 | 1; // 0 = role, 1 = member
  allow: string;
  deny: string;
}

export interface Channel {
  id: string;
  type: number;
  name: string;
  position: number;
  parent_id: string | null;
  topic?: string | null;
  nsfw?: boolean;
  rate_limit_per_user?: number;
  bitrate?: number;
  user_limit?: number;
  permission_overwrites?: Overwrite[];
  available_tags?: { id: string; name: string; emoji_name: string | null; moderated: boolean }[];
  default_reaction_emoji?: { emoji_id: string | null; emoji_name: string | null } | null;
}

export interface Role {
  id: string;
  name: string;
  color: number;
  hoist: boolean;
  position: number;
  permissions: string;
  managed: boolean;
  mentionable: boolean;
}

export interface Guild {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  features: string[];
  verification_level: number;
  default_message_notifications: number;
  explicit_content_filter: number;
  system_channel_id: string | null;
  rules_channel_id: string | null;
  public_updates_channel_id: string | null;
  safety_alerts_channel_id?: string | null;
  premium_tier: number;
  approximate_member_count?: number;
  approximate_presence_count?: number;
  preferred_locale: string;
}
