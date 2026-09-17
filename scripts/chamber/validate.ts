import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parseSnapshot, compareSnapshots, formatDiff } from "../../chamber/snapshot";

const currentPath = resolve(process.argv[2] ?? process.env.CHAMBER_SNAPSHOT_PATH ?? "fixtures/chamber/chamber-snapshot.local.json");
const previousPath = process.argv[3] ?? process.env.CHAMBER_PREVIOUS_SNAPSHOT_PATH;
const current = parseSnapshot(JSON.parse(await readFile(currentPath, "utf8")));
const previous = previousPath ? parseSnapshot(JSON.parse(await readFile(resolve(previousPath), "utf8"))) : undefined;
const diff = compareSnapshots(current, previous, process.env.CHAMBER_ALLOW_LARGE_DROP === "1");
console.log(formatDiff(diff));
if (diff.rejected) process.exitCode = 1;
