/**
 * Read-only: how much real content lives in each channel?
 *
 *   npx tsx scripts/discord/messages.ts
 *
 * Used to decide whether a channel is safe to rename/repurpose or holds
 * history worth preserving.
 */
import { CHANNEL_TYPE_NAME, ChannelType, GUILD_ID, discord, discordOptional, type Channel } from "./client.js";

async function main(): Promise<void> {
  const channels = await discord<Channel[]>("GET", `/guilds/${GUILD_ID}/channels`);
  const text = channels.filter((c) => c.type === ChannelType.GUILD_TEXT);

  for (const channel of text) {
    const messages = await discordOptional<
      { id: string; content: string; author: { username: string; bot?: boolean }; timestamp: string; pinned: boolean }[]
    >(`/channels/${channel.id}/messages?limit=100`);

    if (messages === null) {
      console.log(`#${channel.name}  — cannot read (missing permission)`);
      continue;
    }
    const human = messages.filter((m) => !m.author.bot);
    console.log(`\n#${channel.name}  [${CHANNEL_TYPE_NAME[channel.type]}]  ${messages.length} message(s), ${human.length} from humans`);
    for (const message of messages.slice(0, 10).reverse()) {
      const when = message.timestamp.slice(0, 10);
      const who = `${message.author.username}${message.author.bot ? " [bot]" : ""}`;
      const body = (message.content || "(embed/attachment only)").replace(/\s+/g, " ").slice(0, 120);
      console.log(`    ${when}  ${who}${message.pinned ? " [pinned]" : ""}: ${body}`);
    }
  }
}

main().catch((error) => {
  console.error("FAILED:", error instanceof Error ? error.message : error);
  process.exit(1);
});
