/**
 * Idempotent configuration for the Startup Orillia Discord server.
 *
 *   npx tsx scripts/discord/configure.ts              # PLAN ONLY — prints the diff, writes nothing
 *   npx tsx scripts/discord/configure.ts --apply      # executes the plan
 *   npx tsx scripts/discord/configure.ts --no-interest-roles
 *
 * Safety properties:
 *   - Never deletes a channel, role, or message. Extra items are reported, not removed.
 *   - Matches existing objects by name and reuses them instead of creating duplicates.
 *   - Every write is expressed as an Action, so plan mode and apply mode share one code path.
 *   - Re-running after a successful apply should produce an all-KEEP plan.
 */
import {
  CHANNEL_TYPE_NAME,
  ChannelType,
  GUILD_ID,
  discord,
  discordOptional,
  type Channel,
  type Guild,
  type Overwrite,
  type Role,
} from "./client.js";
import {
  CHANNEL_TOPICS,
  GUILD_DESCRIPTION,
  PINNED_MESSAGES,
  WELCOME_SCREEN_CHANNELS,
  WELCOME_SCREEN_DESCRIPTION,
  type ChannelIds,
} from "./content.js";

interface PinnedMessageSummary {
  id: string;
  content: string;
  author?: { id: string };
}

/**
 * Find this bot's own pinned message in a channel, so re-runs edit in place
 * instead of posting duplicates. Discord moved pins from /channels/{id}/pins
 * to /channels/{id}/messages/pins (which wraps results in `items`), so accept
 * either shape.
 */
async function fetchBotPin(channelId: string, botId: string): Promise<PinnedMessageSummary | null> {
  const raw = await discordOptional<PinnedMessageSummary[] | { items: { message: PinnedMessageSummary }[] }>(
    `/channels/${channelId}/pins`,
  );
  let pins: PinnedMessageSummary[] = [];
  if (Array.isArray(raw)) {
    pins = raw;
  } else if (raw && Array.isArray(raw.items)) {
    pins = raw.items.map((entry) => entry.message ?? (entry as unknown as PinnedMessageSummary));
  } else {
    const fallback = await discordOptional<{ items: { message: PinnedMessageSummary }[] }>(
      `/channels/${channelId}/messages/pins`,
    );
    pins = fallback?.items?.map((entry) => entry.message ?? (entry as unknown as PinnedMessageSummary)) ?? [];
  }
  return pins.find((m) => m.author?.id === botId) ?? null;
}

// ---------------------------------------------------------------------------
// Permissions
// ---------------------------------------------------------------------------

const P = {
  CREATE_INSTANT_INVITE: 1n << 0n,
  KICK_MEMBERS: 1n << 1n,
  BAN_MEMBERS: 1n << 2n,
  ADMINISTRATOR: 1n << 3n,
  MANAGE_CHANNELS: 1n << 4n,
  MANAGE_GUILD: 1n << 5n,
  ADD_REACTIONS: 1n << 6n,
  VIEW_AUDIT_LOG: 1n << 7n,
  PRIORITY_SPEAKER: 1n << 8n,
  STREAM: 1n << 9n,
  VIEW_CHANNEL: 1n << 10n,
  SEND_MESSAGES: 1n << 11n,
  MANAGE_MESSAGES: 1n << 13n,
  EMBED_LINKS: 1n << 14n,
  ATTACH_FILES: 1n << 15n,
  READ_MESSAGE_HISTORY: 1n << 16n,
  MENTION_EVERYONE: 1n << 17n,
  USE_EXTERNAL_EMOJIS: 1n << 18n,
  VIEW_GUILD_INSIGHTS: 1n << 19n,
  CONNECT: 1n << 20n,
  SPEAK: 1n << 21n,
  MUTE_MEMBERS: 1n << 22n,
  DEAFEN_MEMBERS: 1n << 23n,
  MOVE_MEMBERS: 1n << 24n,
  USE_VAD: 1n << 25n,
  CHANGE_NICKNAME: 1n << 26n,
  MANAGE_NICKNAMES: 1n << 27n,
  MANAGE_ROLES: 1n << 28n,
  MANAGE_WEBHOOKS: 1n << 29n,
  MANAGE_GUILD_EXPRESSIONS: 1n << 30n,
  USE_APPLICATION_COMMANDS: 1n << 31n,
  REQUEST_TO_SPEAK: 1n << 32n,
  MANAGE_EVENTS: 1n << 33n,
  MANAGE_THREADS: 1n << 34n,
  CREATE_PUBLIC_THREADS: 1n << 35n,
  USE_EXTERNAL_STICKERS: 1n << 37n,
  SEND_MESSAGES_IN_THREADS: 1n << 38n,
  USE_EMBEDDED_ACTIVITIES: 1n << 39n,
  MODERATE_MEMBERS: 1n << 40n,
  USE_SOUNDBOARD: 1n << 42n,
  CREATE_EVENTS: 1n << 44n,
  USE_EXTERNAL_SOUNDS: 1n << 45n,
  SEND_VOICE_MESSAGES: 1n << 46n,
};

function combine(...bits: bigint[]): bigint {
  return bits.reduce((acc, bit) => acc | bit, 0n);
}

/**
 * What an ordinary member can do everywhere: read, post, react, upload, thread,
 * and use voice including screen share. Deliberately excludes MENTION_EVERYONE
 * and every manage-* permission.
 */
const EVERYONE_PERMISSIONS = combine(
  P.CREATE_INSTANT_INVITE,
  P.VIEW_CHANNEL,
  P.SEND_MESSAGES,
  P.ADD_REACTIONS,
  P.EMBED_LINKS,
  P.ATTACH_FILES,
  P.READ_MESSAGE_HISTORY,
  P.USE_EXTERNAL_EMOJIS,
  P.USE_EXTERNAL_STICKERS,
  P.CONNECT,
  P.SPEAK,
  P.STREAM,
  P.USE_VAD,
  P.REQUEST_TO_SPEAK,
  P.CHANGE_NICKNAME,
  P.USE_APPLICATION_COMMANDS,
  P.CREATE_PUBLIC_THREADS,
  P.SEND_MESSAGES_IN_THREADS,
  P.USE_EMBEDDED_ACTIVITIES,
  P.USE_SOUNDBOARD,
  P.USE_EXTERNAL_SOUNDS,
  P.SEND_VOICE_MESSAGES,
);

/** Everything a member has, plus the moderation surface. Not ADMINISTRATOR — explicit is auditable. */
const ORGANIZER_PERMISSIONS = combine(
  EVERYONE_PERMISSIONS,
  P.KICK_MEMBERS,
  P.BAN_MEMBERS,
  P.MODERATE_MEMBERS,
  P.MANAGE_CHANNELS,
  P.MANAGE_GUILD,
  P.MANAGE_MESSAGES,
  P.MANAGE_THREADS,
  P.MANAGE_NICKNAMES,
  P.MANAGE_ROLES,
  P.MANAGE_WEBHOOKS,
  P.MANAGE_GUILD_EXPRESSIONS,
  P.MANAGE_EVENTS,
  P.CREATE_EVENTS,
  P.MENTION_EVERYONE,
  P.VIEW_AUDIT_LOG,
  P.VIEW_GUILD_INSIGHTS,
  P.PRIORITY_SPEAKER,
  P.MUTE_MEMBERS,
  P.DEAFEN_MEMBERS,
  P.MOVE_MEMBERS,
);

// ---------------------------------------------------------------------------
// Desired state
// ---------------------------------------------------------------------------

const BRAND_ORANGE = 0xe85a1b; // tailwind.config.ts → brand.orange
const BRAND_TEAL = 0x0d7377; // tailwind.config.ts → brand.teal

interface DesiredRole {
  name: string;
  color: number;
  hoist: boolean;
  mentionable: boolean;
  permissions: bigint;
  /** Interest roles exist only to back onboarding question 2. */
  interest?: boolean;
}

/**
 * Listed highest-first; positions are assigned from this order.
 * Grouped as: organizer · supporters (Partner/Mentor/Investor) · builders.
 */
const DESIRED_ROLES: DesiredRole[] = [
  { name: "Organizer", color: BRAND_ORANGE, hoist: true, mentionable: true, permissions: ORGANIZER_PERMISSIONS },
  { name: "Partner", color: BRAND_TEAL, hoist: false, mentionable: true, permissions: 0n },
  { name: "Mentor", color: 0, hoist: false, mentionable: true, permissions: 0n },
  { name: "Investor", color: 0, hoist: false, mentionable: true, permissions: 0n },
  { name: "Founder", color: 0, hoist: false, mentionable: true, permissions: 0n },
  { name: "Builder", color: 0, hoist: false, mentionable: true, permissions: 0n },
  { name: "Student", color: 0, hoist: false, mentionable: true, permissions: 0n },
];

const INTEREST_ROLES: DesiredRole[] = [
  "AI",
  "SaaS",
  "Hardware",
  "Games",
  "Local startups",
  "Design",
  "Marketing",
].map((name) => ({ name, color: 0, hoist: false, mentionable: true, permissions: 0n, interest: true }));

interface DesiredChannel {
  name: string;
  type: number;
  category: string;
  /** Read-only for members: organizers post, everyone else reads. */
  readOnly?: boolean;
  /** Hidden from everyone except Organizer. */
  organizerOnly?: boolean;
  /**
   * Default-template names to adopt instead of creating a duplicate. Only used
   * where the rename is semantically honest and the channel holds no history.
   */
  renameFrom?: string[];
}

interface DesiredCategory {
  name: string;
  renameFrom?: string[];
}

const DESIRED_CATEGORIES: DesiredCategory[] = [
  { name: "START HERE", renameFrom: ["Information"] },
  { name: "COMMUNITY", renameFrom: ["Text Channels"] },
  { name: "LIVE", renameFrom: ["Voice Channels"] },
];

const DESIRED_CHANNELS: DesiredChannel[] = [
  // welcome-and-rules is the target of the server's active invite link — renaming
  // it (rather than creating a new #welcome) keeps that invite pointing somewhere sane.
  { name: "welcome", type: ChannelType.GUILD_TEXT, category: "START HERE", readOnly: true, renameFrom: ["welcome-and-rules"] },
  { name: "introductions", type: ChannelType.GUILD_TEXT, category: "START HERE" },
  { name: "general", type: ChannelType.GUILD_TEXT, category: "COMMUNITY" },
  { name: "building", type: ChannelType.GUILD_TEXT, category: "COMMUNITY" },
  { name: "events", type: ChannelType.GUILD_TEXT, category: "COMMUNITY", renameFrom: ["announcements"] },
  { name: "organizers", type: ChannelType.GUILD_TEXT, category: "COMMUNITY", organizerOnly: true },
  { name: "🎤 Workshop Room", type: ChannelType.GUILD_VOICE, category: "LIVE", renameFrom: ["Meeting Room"] },
  { name: "☕ Coworking", type: ChannelType.GUILD_VOICE, category: "LIVE", renameFrom: ["Lounge"] },
];

// ---------------------------------------------------------------------------
// Plan primitives
// ---------------------------------------------------------------------------

type ActionKind = "CREATE" | "RENAME" | "MOVE" | "UPDATE" | "KEEP" | "NOTE";

interface Action {
  kind: ActionKind;
  target: string;
  detail: string;
  run?: () => Promise<void>;
}

const actions: Action[] = [];

function plan(kind: ActionKind, target: string, detail: string, run?: () => Promise<void>): void {
  actions.push({ kind, target, detail, run });
}

/** Discord lowercases and dash-separates text channel names; match accordingly. */
function normalizeTextName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

/**
 * Locate the channel that should become `desired`: an exact name match first,
 * then any of its renameFrom aliases. Returns whether a rename is needed so the
 * caller can report it as RENAME rather than KEEP.
 */
function findChannel(
  channels: Channel[],
  desired: DesiredChannel,
): { channel: Channel; needsRename: boolean } | undefined {
  const key = (name: string) =>
    desired.type === ChannelType.GUILD_TEXT ? normalizeTextName(name) : name;
  const sameType = channels.filter((c) => c.type === desired.type);

  const exact = sameType.find((c) => key(c.name) === key(desired.name));
  if (exact) return { channel: exact, needsRename: false };

  for (const alias of desired.renameFrom ?? []) {
    const match = sameType.find((c) => key(c.name) === key(alias));
    if (match) return { channel: match, needsRename: true };
  }
  return undefined;
}

function overwritesEqual(current: Overwrite[] | undefined, desired: Overwrite[]): boolean {
  const normalize = (list: Overwrite[]) =>
    [...list]
      .map((o) => `${o.id}:${o.type}:${BigInt(o.allow)}:${BigInt(o.deny)}`)
      .sort()
      .join("|");
  return normalize(current ?? []) === normalize(desired);
}

// ---------------------------------------------------------------------------
// Scheduled events — last Tuesday of the month, mirroring src/lib/events.ts
// ---------------------------------------------------------------------------

/** Eastern Time offset: EDT (UTC-4) Mar–Oct, EST (UTC-5) Nov–Feb. */
function easternOffset(month: number): number {
  return month >= 2 && month <= 9 ? 4 : 5;
}

function lastTuesdayUTC(year: number, month: number, hourET: number): Date {
  const lastDay = new Date(Date.UTC(year, month + 1, 0));
  const dayOfWeek = lastDay.getUTCDay();
  const offsetToTuesday = (dayOfWeek - 2 + 7) % 7;
  const date = lastDay.getUTCDate() - offsetToTuesday;
  return new Date(Date.UTC(year, month, date, hourET + easternOffset(month), 0, 0));
}

function upcomingCoworkingDays(count: number, now: Date): { start: Date; end: Date }[] {
  const results: { start: Date; end: Date }[] = [];
  let year = now.getUTCFullYear();
  let month = now.getUTCMonth();
  while (results.length < count) {
    const start = lastTuesdayUTC(year, month, 9);
    const end = lastTuesdayUTC(year, month, 13);
    if (start.getTime() > now.getTime()) results.push({ start, end });
    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
  }
  return results;
}

const COWORKING_EVENT_NAME = "Startup Orillia Coworking Day";
const COWORKING_LOCATION = "Creative Nomad Studios, 23 Mississaga St W, Orillia, ON";
const COWORKING_DESCRIPTION =
  "Coffee, coworking, and conversation with the Startup Orillia community. Bring your laptop and ship something.\n\nFree. No need to sign up — just show up.";

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const apply = process.argv.includes("--apply");
  const includeInterestRoles = !process.argv.includes("--no-interest-roles");

  const guild = await discord<Guild>("GET", `/guilds/${GUILD_ID}?with_counts=true`);
  const channels = await discord<Channel[]>("GET", `/guilds/${GUILD_ID}/channels`);
  const roles = await discord<Role[]>("GET", `/guilds/${GUILD_ID}/roles`);
  const bot = await discord<{ id: string }>("GET", "/users/@me");

  console.log("=".repeat(72));
  console.log(`${apply ? "APPLYING TO" : "PLAN FOR"}  ${guild.name} (${guild.id})`);
  console.log(`members ~${guild.approximate_member_count ?? "?"}   community=${guild.features.includes("COMMUNITY") ? "on" : "off"}`);
  console.log("=".repeat(72));

  // --- Roles ---------------------------------------------------------------
  const desiredRoles = includeInterestRoles ? [...DESIRED_ROLES, ...INTEREST_ROLES] : DESIRED_ROLES;
  const roleIds = new Map<string, string>();

  const everyone = roles.find((r) => r.id === GUILD_ID);
  if (everyone && BigInt(everyone.permissions) !== EVERYONE_PERMISSIONS) {
    plan(
      "UPDATE",
      "@everyone",
      `base permissions → read/post/react/upload/threads/voice+screenshare, no mention-everyone`,
      async () => {
        await discord("PATCH", `/guilds/${GUILD_ID}/roles/${GUILD_ID}`, {
          permissions: EVERYONE_PERMISSIONS.toString(),
        });
      },
    );
  } else if (everyone) {
    plan("KEEP", "@everyone", "base permissions already correct");
  }

  for (const desired of desiredRoles) {
    const existing = roles.find((r) => r.name.toLowerCase() === desired.name.toLowerCase());
    if (!existing) {
      plan("CREATE", `@${desired.name}`, desired.interest ? "interest role (onboarding Q2)" : "role", async () => {
        const created = await discord<Role>(
          "POST",
          `/guilds/${GUILD_ID}/roles`,
          {
            name: desired.name,
            color: desired.color,
            hoist: desired.hoist,
            mentionable: desired.mentionable,
            permissions: desired.permissions.toString(),
          },
          { reason: "Startup Orillia server configuration" },
        );
        roleIds.set(desired.name, created.id);
      });
      continue;
    }

    roleIds.set(desired.name, existing.id);
    const drift =
      BigInt(existing.permissions) !== desired.permissions ||
      existing.color !== desired.color ||
      existing.hoist !== desired.hoist;
    if (existing.managed) {
      plan("KEEP", `@${desired.name}`, "managed by an integration — left untouched");
    } else if (drift) {
      plan("UPDATE", `@${desired.name}`, "permissions/colour/hoist → desired", async () => {
        await discord("PATCH", `/guilds/${GUILD_ID}/roles/${existing.id}`, {
          color: desired.color,
          hoist: desired.hoist,
          mentionable: desired.mentionable,
          permissions: desired.permissions.toString(),
        });
      });
    } else {
      plan("KEEP", `@${desired.name}`, "already correct");
    }
  }

  // Order the roles this plan owns into a readable stack. Existing roles the
  // plan does not own (e.g. @Admin) and managed bot roles keep their standing —
  // we only position our own, below everything else.
  // Discord ranks equal-position roles by id (newer = higher), and a bot can
  // never reorder roles that outrank its own. Detect that up front so the plan
  // says what to do instead of failing with a bare "Missing Permissions".
  const botMember = await discordOptional<{ roles: string[] }>(`/guilds/${GUILD_ID}/members/${bot.id}`);
  const botRoles = roles.filter((r) => botMember?.roles.includes(r.id));
  const rank = (r: { position: number; id: string }) => [r.position, BigInt(r.id)] as const;
  const botTop = botRoles.sort((a, b) => (rank(a) < rank(b) ? 1 : -1))[0];
  const outranking = roles.filter(
    (r) =>
      botTop &&
      desiredRoles.some((d) => d.name.toLowerCase() === r.name.toLowerCase()) &&
      (r.position > botTop.position || (r.position === botTop.position && BigInt(r.id) > BigInt(botTop.id))),
  );

  if (botTop && outranking.length) {
    plan(
      "NOTE",
      "role order",
      `BLOCKED: ${outranking.length} role(s) outrank @${botTop.name} (bot). ` +
        `Drag "${botTop.name}" above them in Server Settings → Roles, then re-run. ` +
        `Until then @Organizer cannot moderate members holding @${outranking[0].name}.`,
    );
  } else {
    const orderLabel = DESIRED_ROLES.map((r) => r.name).join(" → ") + (includeInterestRoles ? " → interests" : "");
    plan("UPDATE", "role order", orderLabel, async () => {
      const fresh = await discord<Role[]>("GET", `/guilds/${GUILD_ID}/roles`);
      const byName = new Map(fresh.map((r) => [r.name.toLowerCase(), r]));
      const ours = desiredRoles.map((d) => byName.get(d.name.toLowerCase())).filter((r): r is Role => Boolean(r));
      // Assign positions from 1 upward, lowest-priority role first.
      const payload = [...ours].reverse().map((role, index) => ({ id: role.id, position: index + 1 }));
      if (payload.length) await discord("PATCH", `/guilds/${GUILD_ID}/roles`, payload);
    });
  }

  const unmanagedExtras = roles.filter(
    (r) =>
      r.id !== GUILD_ID &&
      !r.managed &&
      !desiredRoles.some((d) => d.name.toLowerCase() === r.name.toLowerCase()),
  );
  for (const extra of unmanagedExtras) {
    plan("NOTE", `@${extra.name}`, "pre-existing role not in the plan — left alone, review manually");
  }

  // --- Categories ----------------------------------------------------------
  const categoryIds = new Map<string, string>();
  const categories = channels.filter((c) => c.type === ChannelType.GUILD_CATEGORY);

  for (const [index, desired] of DESIRED_CATEGORIES.entries()) {
    const exact = categories.find((c) => c.name.toLowerCase() === desired.name.toLowerCase());
    const alias = exact
      ? undefined
      : categories.find((c) =>
          (desired.renameFrom ?? []).some((from) => from.toLowerCase() === c.name.toLowerCase()),
        );
    const existing = exact ?? alias;

    if (!existing) {
      plan("CREATE", `category ${desired.name}`, `position ${index}`, async () => {
        const created = await discord<Channel>(
          "POST",
          `/guilds/${GUILD_ID}/channels`,
          { name: desired.name, type: ChannelType.GUILD_CATEGORY, position: index },
          { reason: "Startup Orillia server configuration" },
        );
        categoryIds.set(desired.name, created.id);
      });
      continue;
    }

    categoryIds.set(desired.name, existing.id);
    if (alias) {
      plan("RENAME", `category ${existing.name}`, `→ ${desired.name} (reusing the default template category)`, async () => {
        await discord("PATCH", `/channels/${existing.id}`, { name: desired.name }, { reason: "Startup Orillia server configuration" });
      });
    } else {
      plan("KEEP", `category ${desired.name}`, `exists (id ${existing.id})`);
    }
  }

  // --- Channels ------------------------------------------------------------
  const channelIds: ChannelIds = {};
  const organizerRoleId = () => roleIds.get("Organizer");

  function desiredOverwrites(desired: DesiredChannel): Overwrite[] {
    const orgId = organizerRoleId();
    if (desired.organizerOnly) {
      const list: Overwrite[] = [
        { id: GUILD_ID, type: 0, allow: "0", deny: P.VIEW_CHANNEL.toString() },
      ];
      if (orgId) {
        list.push({
          id: orgId,
          type: 0,
          allow: combine(P.VIEW_CHANNEL, P.SEND_MESSAGES, P.READ_MESSAGE_HISTORY).toString(),
          deny: "0",
        });
      }
      return list;
    }
    if (desired.readOnly) {
      const list: Overwrite[] = [
        {
          id: GUILD_ID,
          type: 0,
          allow: "0",
          deny: combine(P.SEND_MESSAGES, P.CREATE_PUBLIC_THREADS, P.SEND_MESSAGES_IN_THREADS).toString(),
        },
      ];
      if (orgId) {
        list.push({ id: orgId, type: 0, allow: P.SEND_MESSAGES.toString(), deny: "0" });
      }
      return list;
    }
    return [];
  }

  for (const [index, desired] of DESIRED_CHANNELS.entries()) {
    const match = findChannel(channels, desired);
    const existing = match?.channel;
    const typeName = CHANNEL_TYPE_NAME[desired.type];
    const topic = CHANNEL_TOPICS[desired.name];

    if (!existing) {
      const access = desired.organizerOnly
        ? "organizer-only"
        : desired.readOnly
          ? "read-only for members"
          : "open to members";
      plan("CREATE", `#${desired.name}`, `${typeName} in ${desired.category} · ${access}`, async () => {
        const created = await discord<Channel>(
          "POST",
          `/guilds/${GUILD_ID}/channels`,
          {
            name: desired.name,
            type: desired.type,
            parent_id: categoryIds.get(desired.category),
            position: index,
            ...(topic && desired.type === ChannelType.GUILD_TEXT ? { topic } : {}),
            permission_overwrites: desiredOverwrites(desired),
          },
          { reason: "Startup Orillia server configuration" },
        );
        channelIds[desired.name] = created.id;
      });
      continue;
    }

    channelIds[desired.name] = existing.id;

    if (match?.needsRename) {
      plan("RENAME", `#${existing.name}`, `→ #${desired.name} (empty channel, reused instead of duplicated)`, async () => {
        await discord("PATCH", `/channels/${existing.id}`, { name: desired.name }, { reason: "Startup Orillia server configuration" });
      });
    }

    const wantedParent = categoryIds.get(desired.category);
    if (wantedParent && existing.parent_id !== wantedParent) {
      plan("MOVE", `#${existing.name}`, `→ category ${desired.category}`, async () => {
        await discord("PATCH", `/channels/${existing.id}`, { parent_id: wantedParent });
      });
    }

    const topicMatches = !topic || desired.type !== ChannelType.GUILD_TEXT || existing.topic === topic;
    if (!topicMatches) {
      plan("UPDATE", `#${existing.name}`, "topic → desired", async () => {
        await discord("PATCH", `/channels/${existing.id}`, { topic });
      });
    }

    const wantedOverwrites = desiredOverwrites(desired);
    if (!overwritesEqual(existing.permission_overwrites, wantedOverwrites)) {
      const summary = desired.organizerOnly
        ? "organizer-only visibility"
        : desired.readOnly
          ? "deny @everyone send; allow Organizer"
          : "clear overwrites, inherit from category";
      plan("UPDATE", `#${existing.name}`, `permissions → ${summary}`, async () => {
        await discord("PATCH", `/channels/${existing.id}`, {
          permission_overwrites: wantedOverwrites,
        });
      });
    }

    if (
      !match?.needsRename &&
      existing.parent_id === wantedParent &&
      topicMatches &&
      overwritesEqual(existing.permission_overwrites, wantedOverwrites)
    ) {
      plan("KEEP", `#${existing.name}`, `${typeName} · already correct`);
    }
  }

  // Order our channels within their categories. Pre-existing channels we do not
  // own keep their positions, which sorts them after ours.
  plan("UPDATE", "channel order", "welcome/introductions · general/building/events/organizers · workshop/coworking", async () => {
    const fresh = await discord<Channel[]>("GET", `/guilds/${GUILD_ID}/channels`);
    const payload: { id: string; position: number }[] = [];
    for (const category of DESIRED_CATEGORIES) {
      const inCategory = DESIRED_CHANNELS.filter((c) => c.category === category.name);
      inCategory.forEach((desired, index) => {
        const match = findChannel(fresh, desired);
        if (match) payload.push({ id: match.channel.id, position: index });
      });
    }
    if (payload.length) await discord("PATCH", `/guilds/${GUILD_ID}/channels`, payload);
  });

  const extraChannels = channels.filter(
    (c) =>
      c.type !== ChannelType.GUILD_CATEGORY &&
      !DESIRED_CHANNELS.some((d) => findChannel([c], d)),
  );
  for (const extra of extraChannels) {
    plan(
      "NOTE",
      `#${extra.name}`,
      `pre-existing ${CHANNEL_TYPE_NAME[extra.type] ?? "channel"} not in the plan — left alone, review manually`,
    );
  }

  const extraCategories = channels.filter(
    (c) =>
      c.type === ChannelType.GUILD_CATEGORY &&
      !DESIRED_CATEGORIES.some((d) =>
        [d.name, ...(d.renameFrom ?? [])].some((n) => n.toLowerCase() === c.name.toLowerCase()),
      ),
  );
  for (const extra of extraCategories) {
    plan("NOTE", `category ${extra.name}`, "pre-existing category not in the plan — left alone");
  }

  // --- Community features --------------------------------------------------
  const isCommunity = guild.features.includes("COMMUNITY");
  if (!isCommunity) {
    plan(
      "UPDATE",
      "server",
      "enable COMMUNITY (required for onboarding, welcome screen, forums). " +
        "Side effects: verification level → LOW, explicit content filter → all members, " +
        "default notifications → mentions only",
      async () => {
        await discord("PATCH", `/guilds/${GUILD_ID}`, {
          features: [...guild.features, "COMMUNITY"],
          rules_channel_id: channelIds["welcome"],
          public_updates_channel_id: channelIds["organizers"],
          verification_level: 1,
          explicit_content_filter: 2,
          default_message_notifications: 1,
          description: GUILD_DESCRIPTION,
        });
      },
    );
  } else {
    plan("KEEP", "server", "COMMUNITY already enabled");
    if (guild.description !== GUILD_DESCRIPTION) {
      plan("UPDATE", "server", "description → brand line", async () => {
        await discord("PATCH", `/guilds/${GUILD_ID}`, { description: GUILD_DESCRIPTION });
      });
    }
  }

  // --- Welcome screen ------------------------------------------------------
  plan("UPDATE", "welcome screen", `description + ${WELCOME_SCREEN_CHANNELS.length} channel shortcuts`, async () => {
    await discord("PATCH", `/guilds/${GUILD_ID}/welcome-screen`, {
      enabled: true,
      description: WELCOME_SCREEN_DESCRIPTION,
      welcome_channels: WELCOME_SCREEN_CHANNELS.filter((c) => channelIds[c.channel]).map((c) => ({
        channel_id: channelIds[c.channel],
        description: c.description,
        emoji_name: c.emoji,
      })),
    });
  });

  // --- Onboarding ----------------------------------------------------------
  plan("UPDATE", "onboarding", "2 questions: who are you (multi, required) + interests (multi, optional)", async () => {
    // Discord requires an `id` on every prompt and option even when creating
    // them; it assigns real snowflakes and ignores these placeholders.
    let nextId = 1;
    const placeholderId = () => String(nextId++);

    const roleId = (name: string) => roleIds.get(name);
    const option = (
      title: string,
      description: string | undefined,
      roleNames: string[],
      channelNames: string[] = [],
    ) => ({
      id: placeholderId(),
      title,
      ...(description ? { description } : {}),
      role_ids: roleNames.map(roleId).filter((v): v is string => Boolean(v)),
      channel_ids: channelNames.map((n) => channelIds[n]).filter(Boolean),
    });

    const prompts: Record<string, unknown>[] = [
      {
        id: placeholderId(),
        type: 0,
        title: "Who are you?",
        // Multi-select: angels are often operators too, and mentors are usually
        // founders. Required, so everyone still picks at least one.
        single_select: false,
        required: true,
        in_onboarding: true,
        options: [
          option("Founder", "Running or starting a company", ["Founder"]),
          option("Builder", "Developer, designer, maker — building things", ["Builder"]),
          option("Student", "Learning and building alongside it", ["Student"]),
          option("Mentor", "Experienced and happy to help others", ["Mentor"]),
          option("Investor", "Backing early-stage companies", ["Investor"]),
          option("Curious", "No project yet — here to look around", [], ["introductions"]),
        ],
      },
    ];

    if (includeInterestRoles) {
      prompts.push({
        id: placeholderId(),
        type: 0,
        title: "What are you interested in?",
        single_select: false,
        required: false,
        in_onboarding: true,
        options: INTEREST_ROLES.map((r) => option(r.name, undefined, [r.name])),
      });
    }

    await discord("PUT", `/guilds/${GUILD_ID}/onboarding`, {
      enabled: true,
      mode: 0,
      default_channel_ids: DESIRED_CHANNELS.filter((c) => !c.organizerOnly)
        .map((c) => channelIds[c.name])
        .filter(Boolean),
      prompts,
    });
  });

  // --- Pinned messages -----------------------------------------------------
  for (const message of PINNED_MESSAGES) {
    const channelId = channelIds[message.channel];

    // A channel created by this same run has no pins yet, and its id does not
    // exist until apply time — defer the lookup into the action itself.
    const existingPin = channelId ? await fetchBotPin(channelId, bot.id) : null;

    if (existingPin) {
      plan("UPDATE", `#${message.channel} pin`, `reuse message ${existingPin.id}, update copy if changed`, async () => {
        const body = message.body(channelIds);
        if (existingPin.content !== body) {
          await discord("PATCH", `/channels/${channelId}/messages/${existingPin.id}`, { content: body });
        }
      });
    } else {
      plan("CREATE", `#${message.channel} pin`, "post starter message and pin it", async () => {
        const id = channelIds[message.channel];
        if (!id) throw new Error(`channel #${message.channel} was not created`);
        const alreadyThere = await fetchBotPin(id, bot.id);
        if (alreadyThere) {
          await discord("PATCH", `/channels/${id}/messages/${alreadyThere.id}`, {
            content: message.body(channelIds),
          });
          return;
        }
        const created = await discord<{ id: string }>("POST", `/channels/${id}/messages`, {
          content: message.body(channelIds),
        });
        await discord("PUT", `/channels/${id}/pins/${created.id}`, undefined, {
          reason: "Pin starter message",
        });
      });
    }
  }

  // --- Scheduled events ----------------------------------------------------
  const existingEvents =
    (await discordOptional<{ id: string; name: string; scheduled_start_time: string }[]>(
      `/guilds/${GUILD_ID}/scheduled-events`,
    )) ?? [];

  const now = new Date();
  for (const day of upcomingCoworkingDays(3, now)) {
    const already = existingEvents.find(
      (e) =>
        e.name === COWORKING_EVENT_NAME &&
        Math.abs(Date.parse(e.scheduled_start_time) - day.start.getTime()) < 60 * 60 * 1000,
    );
    const label = day.start.toISOString().slice(0, 10);
    if (already) {
      plan("KEEP", `event ${label}`, "coworking day already scheduled");
    } else {
      plan("CREATE", `event ${label}`, `${COWORKING_EVENT_NAME} · 9:00 AM – 1:00 PM ET`, async () => {
        await discord("POST", `/guilds/${GUILD_ID}/scheduled-events`, {
          name: COWORKING_EVENT_NAME,
          description: COWORKING_DESCRIPTION,
          scheduled_start_time: day.start.toISOString(),
          scheduled_end_time: day.end.toISOString(),
          privacy_level: 2,
          entity_type: 3,
          entity_metadata: { location: COWORKING_LOCATION },
        });
      });
    }
  }

  // --- Output --------------------------------------------------------------
  const order: ActionKind[] = ["CREATE", "RENAME", "MOVE", "UPDATE", "KEEP", "NOTE"];
  console.log("");
  for (const kind of order) {
    const group = actions.filter((a) => a.kind === kind);
    if (!group.length) continue;
    console.log(`--- ${kind} (${group.length}) ---`);
    for (const action of group) console.log(`  ${action.target.padEnd(26)} ${action.detail}`);
    console.log("");
  }

  if (!apply) {
    console.log("=".repeat(72));
    console.log("PLAN ONLY — nothing was changed. Re-run with --apply to execute.");
    console.log("=".repeat(72));
    return;
  }

  console.log("=".repeat(72));
  console.log("APPLYING");
  console.log("=".repeat(72));
  for (const action of actions) {
    if (!action.run) continue;
    process.stdout.write(`  ${action.kind} ${action.target} ... `);
    try {
      await action.run();
      console.log("ok");
    } catch (error) {
      console.log("FAILED");
      console.error(`    ${error instanceof Error ? error.message : error}`);
    }
  }
  console.log("\nDone. Re-run without --apply to verify the plan is now all KEEP.");
}

main().catch((error) => {
  console.error("\nCONFIGURE FAILED:", error instanceof Error ? error.message : error);
  process.exit(1);
});
