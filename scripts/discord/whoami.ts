/**
 * Diagnostic: which bot are we, and which servers can it see?
 *
 *   npx tsx scripts/discord/whoami.ts
 *
 * Use this when inspect.ts reports "Unknown Guild" — it tells you whether the
 * bot was actually invited to the server and what the real guild ID is.
 */
import { GUILD_ID, discord } from "./client.js";

async function main(): Promise<void> {
  const bot = await discord<{ id: string; username: string }>("GET", "/users/@me");
  console.log(`Bot           : ${bot.username} (application id ${bot.id})`);
  console.log(`Configured ID : ${GUILD_ID}  (${GUILD_ID.length} chars)`);

  if (!/^\d{17,20}$/.test(GUILD_ID)) {
    console.log("  ⚠ That does not look like a Discord snowflake (expect 17-20 digits).");
  }

  const guilds = await discord<{ id: string; name: string; owner: boolean; permissions: string }[]>(
    "GET",
    "/users/@me/guilds",
  );

  console.log(`\nServers this bot has been invited to: ${guilds.length}`);
  if (!guilds.length) {
    console.log("  (none — the bot has not been added to any server yet)");
  }
  for (const guild of guilds) {
    const admin = (BigInt(guild.permissions) & (1n << 3n)) === 1n << 3n;
    const marker = guild.id === GUILD_ID ? "  <-- matches DISCORD_GUILD_ID" : "";
    console.log(`  ${guild.name}`);
    console.log(`    id=${guild.id}  owner=${guild.owner}  administrator=${admin}${marker}`);
  }
}

main().catch((error) => {
  console.error("\nFAILED:", error instanceof Error ? error.message : error);
  process.exit(1);
});
