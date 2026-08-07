/** Read-only: who holds which role. Run before touching any existing role. */
import { GUILD_ID, discord, type Role } from "./client.js";

async function main(): Promise<void> {
  const roles = await discord<Role[]>("GET", `/guilds/${GUILD_ID}/roles`);
  const byId = new Map(roles.map((r) => [r.id, r.name]));
  const guild = await discord<{ owner_id: string }>("GET", `/guilds/${GUILD_ID}`);
  const members = await discord<{ user: { id: string; username: string; bot?: boolean }; roles: string[] }[]>(
    "GET",
    `/guilds/${GUILD_ID}/members?limit=100`,
  );
  for (const m of members) {
    const names = m.roles.map((id) => `@${byId.get(id) ?? id}`);
    const owner = m.user.id === guild.owner_id ? "  <-- SERVER OWNER" : "";
    console.log(`${m.user.username}${m.user.bot ? " [bot]" : ""}: ${names.length ? names.join(", ") : "(no roles)"}${owner}`);
  }
}
main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
