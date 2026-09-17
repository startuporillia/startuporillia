import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { get, put } from "@vercel/blob";
import { parseSnapshot, compareSnapshots } from "../../chamber/snapshot";

const path = resolve(process.argv[2] ?? process.env.CHAMBER_SNAPSHOT_PATH ?? "fixtures/chamber/chamber-snapshot.local.json");
const token = process.env.BLOB_READ_WRITE_TOKEN ?? process.env.CHAMBER_BLOB_READ_WRITE_TOKEN;
if (!token) throw new Error("BLOB_READ_WRITE_TOKEN is required");
const bytes = await readFile(path);
const snapshot = parseSnapshot(JSON.parse(bytes.toString("utf8")));
const previousBlob = await get("chamber/latest.json", { access: process.env.CHAMBER_BLOB_ACCESS === "public" ? "public" : "private", token, useCache: false });
const previous = previousBlob?.statusCode === 200 ? parseSnapshot(await new Response(previousBlob.stream).json()) : undefined;
const diff = compareSnapshots(snapshot, previous, process.env.CHAMBER_ALLOW_LARGE_DROP === "1");
if (diff.rejected) throw new Error(`Publication rejected: ${diff.warnings.join("; ")}`);
const immutablePath = `chamber/snapshots/${snapshot.generatedAt.replace(/[:.]/g, "-")}.json`;
const options = { access: process.env.CHAMBER_BLOB_ACCESS === "public" ? "public" as const : "private" as const, addRandomSuffix: false, token, contentType: "application/json" };

const immutable = await put(immutablePath, bytes, options);
const latest = await put("chamber/latest.json", bytes, { ...options, allowOverwrite: true, cacheControlMaxAge: 60 });
console.log(`Published immutable snapshot: ${immutable.url}`);
console.log(`Updated chamber/latest.json after immutable upload succeeded`);
console.log(`CHAMBER_SNAPSHOT_URL=${latest.url}`);
