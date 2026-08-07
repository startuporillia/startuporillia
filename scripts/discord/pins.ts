/** Read-only: verify starter messages are posted and pinned. */
import { ChannelType, GUILD_ID, discord, discordOptional, type Channel } from "./client.js";

interface Pin { id: string; content: string; author?: { username: string } }

async function main(): Promise<void> {
  const channels = await discord<Channel[]>("GET", `/guilds/${GUILD_ID}/channels`);
  for (const c of channels.filter((c) => c.type === ChannelType.GUILD_TEXT)) {
    const raw = await discordOptional<Pin[] | { items: { message: Pin }[] }>(`/channels/${c.id}/pins`);
    const pins: Pin[] = Array.isArray(raw) ? raw : (raw?.items?.map((i) => i.message) ?? []);
    if (!pins.length) { console.log(`#${c.name}: no pins`); continue; }
    for (const p of pins) {
      const firstLine = (p.content || "").split("\n")[0];
      console.log(`#${c.name}: PINNED by ${p.author?.username} — "${firstLine}" (${p.content.length} chars)`);
    }
  }
}
main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
