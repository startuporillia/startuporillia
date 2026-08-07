/**
 * Read-only inventory of the Startup Orillia Discord server.
 *
 *   npx tsx scripts/discord/inspect.ts [--json <path>]
 *
 * Makes no writes. Run this before and after any configuration change.
 */
import { writeFileSync } from "node:fs";
import {
  CHANNEL_TYPE_NAME,
  ChannelType,
  GUILD_ID,
  discord,
  discordOptional,
  type Channel,
  type Guild,
  type Role,
} from "./client.js";

/** Permission bits worth calling out by name in the report. */
const PERMISSION_BITS: [string, bigint][] = [
  ["ADMINISTRATOR", 1n << 3n],
  ["MANAGE_CHANNELS", 1n << 4n],
  ["MANAGE_GUILD", 1n << 5n],
  ["VIEW_AUDIT_LOG", 1n << 7n],
  ["MANAGE_MESSAGES", 1n << 13n],
  ["VIEW_CHANNEL", 1n << 10n],
  ["SEND_MESSAGES", 1n << 11n],
  ["EMBED_LINKS", 1n << 14n],
  ["ATTACH_FILES", 1n << 15n],
  ["ADD_REACTIONS", 1n << 6n],
  ["MENTION_EVERYONE", 1n << 17n],
  ["CONNECT", 1n << 20n],
  ["SPEAK", 1n << 21n],
  ["MUTE_MEMBERS", 1n << 22n],
  ["MOVE_MEMBERS", 1n << 24n],
  ["USE_VAD", 1n << 25n],
  ["CHANGE_NICKNAME", 1n << 26n],
  ["MANAGE_NICKNAMES", 1n << 27n],
  ["MANAGE_ROLES", 1n << 28n],
  ["MANAGE_WEBHOOKS", 1n << 29n],
  ["MANAGE_GUILD_EXPRESSIONS", 1n << 30n],
  ["USE_APPLICATION_COMMANDS", 1n << 31n],
  ["MANAGE_EVENTS", 1n << 33n],
  ["MANAGE_THREADS", 1n << 34n],
  ["CREATE_PUBLIC_THREADS", 1n << 35n],
  ["CREATE_PRIVATE_THREADS", 1n << 36n],
  ["SEND_MESSAGES_IN_THREADS", 1n << 38n],
  ["USE_EMBEDDED_ACTIVITIES", 1n << 39n],
  ["MODERATE_MEMBERS", 1n << 40n],
  ["STREAM", 1n << 9n],
  ["PRIORITY_SPEAKER", 1n << 8n],
  ["KICK_MEMBERS", 1n << 1n],
  ["BAN_MEMBERS", 1n << 2n],
  ["CREATE_INSTANT_INVITE", 1n << 0n],
  ["USE_EXTERNAL_EMOJIS", 1n << 18n],
  ["USE_SOUNDBOARD", 1n << 42n],
  ["CREATE_EVENTS", 1n << 44n],
];

function decodePermissions(bitfield: string): string[] {
  const bits = BigInt(bitfield);
  return PERMISSION_BITS.filter(([, bit]) => (bits & bit) === bit).map(([name]) => name);
}

function hex(color: number): string {
  return color === 0 ? "default" : `#${color.toString(16).padStart(6, "0")}`;
}

async function main(): Promise<void> {
  const jsonFlag = process.argv.indexOf("--json");
  const jsonPath = jsonFlag !== -1 ? process.argv[jsonFlag + 1] : null;

  const bot = await discord<{ id: string; username: string }>("GET", "/users/@me");
  const guild = await discord<Guild>("GET", `/guilds/${GUILD_ID}?with_counts=true`);
  const channels = await discord<Channel[]>("GET", `/guilds/${GUILD_ID}/channels`);
  const roles = await discord<Role[]>("GET", `/guilds/${GUILD_ID}/roles`);
  const onboarding = await discordOptional<Record<string, unknown>>(`/guilds/${GUILD_ID}/onboarding`);
  const welcomeScreen = await discordOptional<Record<string, unknown>>(`/guilds/${GUILD_ID}/welcome-screen`);
  const events = await discordOptional<unknown[]>(`/guilds/${GUILD_ID}/scheduled-events`);
  const automod = await discordOptional<unknown[]>(`/guilds/${GUILD_ID}/auto-moderation/rules`);
  const invites = await discordOptional<unknown[]>(`/guilds/${GUILD_ID}/invites`);
  const emojis = await discordOptional<unknown[]>(`/guilds/${GUILD_ID}/emojis`);
  const members = await discordOptional<{ user: { id: string; username: string; bot?: boolean } }[]>(
    `/guilds/${GUILD_ID}/members?limit=100`,
  );

  const roleById = new Map(roles.map((r) => [r.id, r]));
  const everyone = roleById.get(GUILD_ID);

  console.log("=".repeat(72));
  console.log(`BOT        ${bot.username} (${bot.id})`);
  console.log(`GUILD      ${guild.name} (${guild.id})`);
  console.log(`OWNER      ${guild.owner_id}${guild.owner_id === bot.id ? " (bot is owner)" : ""}`);
  console.log(`MEMBERS    ~${guild.approximate_member_count ?? "?"} (online ~${guild.approximate_presence_count ?? "?"})`);
  console.log(`LOCALE     ${guild.preferred_locale}   BOOST TIER ${guild.premium_tier}`);
  console.log(`DESC       ${guild.description ?? "(none)"}`);
  console.log("=".repeat(72));

  console.log("\n--- COMMUNITY STATUS ---");
  const isCommunity = guild.features.includes("COMMUNITY");
  console.log(`COMMUNITY enabled : ${isCommunity ? "YES" : "NO"}`);
  console.log(`features          : ${guild.features.length ? guild.features.join(", ") : "(none)"}`);
  console.log(`verification_level: ${guild.verification_level}`);
  console.log(`explicit_filter   : ${guild.explicit_content_filter}`);
  console.log(`rules_channel     : ${guild.rules_channel_id ?? "(none)"}`);
  console.log(`updates_channel   : ${guild.public_updates_channel_id ?? "(none)"}`);
  console.log(`system_channel    : ${guild.system_channel_id ?? "(none)"}`);

  console.log("\n--- ROLES (highest first) ---");
  for (const role of [...roles].sort((a, b) => b.position - a.position)) {
    const perms = decodePermissions(role.permissions);
    const flags = [
      role.managed ? "managed" : null,
      role.hoist ? "hoisted" : null,
      role.mentionable ? "mentionable" : null,
    ].filter(Boolean);
    const label = role.id === GUILD_ID ? "@everyone" : `@${role.name}`;
    console.log(`  [pos ${String(role.position).padStart(2)}] ${label}  ${hex(role.color)}${flags.length ? `  (${flags.join(", ")})` : ""}`);
    console.log(`            id=${role.id}`);
    console.log(`            perms: ${perms.length ? perms.join(" ") : "(none)"}`);
  }

  console.log("\n--- CHANNELS ---");
  const categories = channels
    .filter((c) => c.type === ChannelType.GUILD_CATEGORY)
    .sort((a, b) => a.position - b.position);
  const orphans = channels
    .filter((c) => c.type !== ChannelType.GUILD_CATEGORY && !c.parent_id)
    .sort((a, b) => a.position - b.position);

  const describeChannel = (channel: Channel, indent: string): void => {
    const type = CHANNEL_TYPE_NAME[channel.type] ?? `type${channel.type}`;
    console.log(`${indent}#${channel.name}  [${type}]  pos=${channel.position}  id=${channel.id}`);
    if (channel.topic) console.log(`${indent}   topic: ${channel.topic}`);
    if (channel.rate_limit_per_user) console.log(`${indent}   slowmode: ${channel.rate_limit_per_user}s`);
    if (channel.bitrate) console.log(`${indent}   bitrate: ${channel.bitrate}  user_limit: ${channel.user_limit ?? 0}`);
    if (channel.available_tags?.length) {
      console.log(`${indent}   tags: ${channel.available_tags.map((t) => `${t.emoji_name ?? ""}${t.name}`).join(", ")}`);
    }
    for (const overwrite of channel.permission_overwrites ?? []) {
      const target =
        overwrite.type === 0
          ? overwrite.id === GUILD_ID
            ? "@everyone"
            : `@${roleById.get(overwrite.id)?.name ?? overwrite.id}`
          : `member:${overwrite.id}`;
      const allow = decodePermissions(overwrite.allow);
      const deny = decodePermissions(overwrite.deny);
      console.log(`${indent}   overwrite ${target}`);
      if (allow.length) console.log(`${indent}     allow: ${allow.join(" ")}`);
      if (deny.length) console.log(`${indent}     deny : ${deny.join(" ")}`);
    }
  };

  for (const category of categories) {
    console.log(`\n  ▼ ${category.name}  [category]  pos=${category.position}  id=${category.id}`);
    for (const overwrite of category.permission_overwrites ?? []) {
      const target =
        overwrite.type === 0
          ? overwrite.id === GUILD_ID
            ? "@everyone"
            : `@${roleById.get(overwrite.id)?.name ?? overwrite.id}`
          : `member:${overwrite.id}`;
      const allow = decodePermissions(overwrite.allow);
      const deny = decodePermissions(overwrite.deny);
      console.log(`      overwrite ${target}`);
      if (allow.length) console.log(`        allow: ${allow.join(" ")}`);
      if (deny.length) console.log(`        deny : ${deny.join(" ")}`);
    }
    const children = channels
      .filter((c) => c.parent_id === category.id)
      .sort((a, b) => a.position - b.position);
    if (!children.length) console.log("      (empty)");
    for (const child of children) describeChannel(child, "      ");
  }

  if (orphans.length) {
    console.log("\n  ▼ (no category)");
    for (const channel of orphans) describeChannel(channel, "      ");
  }

  console.log("\n--- @everyone BASE PERMISSIONS ---");
  console.log(everyone ? decodePermissions(everyone.permissions).join(" ") || "(none)" : "(role not found)");

  console.log("\n--- ONBOARDING ---");
  console.log(onboarding ? JSON.stringify(onboarding, null, 2) : "(not available — requires COMMUNITY)");

  console.log("\n--- WELCOME SCREEN ---");
  console.log(welcomeScreen ? JSON.stringify(welcomeScreen, null, 2) : "(not configured / requires COMMUNITY)");

  console.log("\n--- SCHEDULED EVENTS ---");
  console.log(events?.length ? JSON.stringify(events, null, 2) : "(none)");

  console.log("\n--- AUTOMOD RULES ---");
  console.log(automod?.length ? JSON.stringify(automod, null, 2) : "(none)");

  console.log("\n--- INVITES ---");
  console.log(invites?.length ? JSON.stringify(invites, null, 2) : "(none)");

  console.log("\n--- CUSTOM EMOJIS ---");
  console.log(emojis?.length ? `${emojis.length} custom emoji` : "(none)");

  console.log("\n--- MEMBERS (first 100) ---");
  if (!members) {
    console.log("(could not list — SERVER MEMBERS INTENT is probably disabled)");
  } else {
    for (const member of members) {
      console.log(`  ${member.user.username}${member.user.bot ? " [bot]" : ""} (${member.user.id})`);
    }
  }

  if (jsonPath) {
    writeFileSync(
      jsonPath,
      JSON.stringify(
        { bot, guild, channels, roles, onboarding, welcomeScreen, events, automod, invites, members },
        null,
        2,
      ),
    );
    console.log(`\nRaw inventory written to ${jsonPath}`);
  }
}

main().catch((error) => {
  console.error("\nINSPECTION FAILED:", error instanceof Error ? error.message : error);
  process.exit(1);
});
