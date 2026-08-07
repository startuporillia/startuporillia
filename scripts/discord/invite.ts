/**
 * Create (or reuse) a permanent invite for the website.
 *
 *   npx tsx scripts/discord/invite.ts
 *
 * Site links must never expire, so this looks for an existing never-expiring,
 * unlimited-use invite to #welcome before creating a new one.
 */
import { ChannelType, GUILD_ID, discord, type Channel } from "./client.js";

interface Invite { code: string; max_age: number; max_uses: number; channel: { id: string; name: string }; uses: number }

async function main(): Promise<void> {
  const channels = await discord<Channel[]>("GET", `/guilds/${GUILD_ID}/channels`);
  const welcome = channels.find((c) => c.type === ChannelType.GUILD_TEXT && c.name === "welcome");
  if (!welcome) throw new Error("#welcome not found");

  const existing = await discord<Invite[]>("GET", `/guilds/${GUILD_ID}/invites`);
  const permanent = existing.find((i) => i.max_age === 0 && i.max_uses === 0 && i.channel?.id === welcome.id);

  if (permanent) {
    console.log(`Reusing permanent invite: https://discord.gg/${permanent.code}  (uses: ${permanent.uses})`);
    return;
  }

  const created = await discord<Invite>(
    "POST",
    `/channels/${welcome.id}/invites`,
    { max_age: 0, max_uses: 0, temporary: false, unique: true },
    { reason: "Permanent invite for startuporillia.ca" },
  );
  console.log(`Created permanent invite: https://discord.gg/${created.code}`);
  console.log("  never expires, unlimited uses, lands in #welcome");
}
main().catch((e) => { console.error("FAILED:", e instanceof Error ? e.message : e); process.exit(1); });
