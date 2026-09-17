import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { loadSnapshot } from "../../chamber/snapshot.js";

const target = resolve(process.argv[2] ?? "fixtures/chamber/previous.json");
const snapshot = await loadSnapshot();
await mkdir(dirname(target), { recursive: true });
await writeFile(target, JSON.stringify(snapshot));
console.log(`Downloaded previous snapshot: ${snapshot.snapshotId}, ${snapshot.members.length} members`);
