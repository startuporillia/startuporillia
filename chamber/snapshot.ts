import { readFile } from "node:fs/promises";
import { get } from "@vercel/blob";
import { chamberSnapshotSchema, type ChamberSnapshot, type SnapshotDiff } from "./schema.js";

const CACHE_MS = 6 * 60 * 60 * 1000;
let cached: { snapshot: ChamberSnapshot; expiresAt: number; key: string } | undefined;

export const parseSnapshot = (value: unknown): ChamberSnapshot => chamberSnapshotSchema.parse(value);

export const loadSnapshot = async (): Promise<ChamberSnapshot> => {
  const localPath = process.env.CHAMBER_SNAPSHOT_PATH;
  const remoteUrl = process.env.CHAMBER_SNAPSHOT_URL;
  if (!localPath && !remoteUrl) {
    throw new Error("Set CHAMBER_SNAPSHOT_PATH for local development or CHAMBER_SNAPSHOT_URL in production");
  }
  const key = localPath ?? remoteUrl;
  if (cached && cached.key === key && cached.expiresAt > Date.now()) return cached.snapshot;

  const raw = localPath
    ? await readFile(localPath, "utf8")
    : process.env.CHAMBER_BLOB_ACCESS === "private"
      ? await get(remoteUrl!, { access: "private", token: process.env.BLOB_READ_WRITE_TOKEN, useCache: false }).then(async (result) => {
        if (!result || result.statusCode !== 200) throw new Error("Chamber snapshot unavailable in private Blob store");
        return new Response(result.stream).text();
      })
    : await fetch(remoteUrl!, { headers: { accept: "application/json" } }).then((response) => {
      if (!response.ok) throw new Error(`Snapshot request failed: ${response.status}`);
      return response.text();
    });
  const snapshot = parseSnapshot(JSON.parse(raw));
  cached = { snapshot, key, expiresAt: Date.now() + CACHE_MS };
  return snapshot;
};

const futureEvents = (snapshot: ChamberSnapshot): number => snapshot.events.filter((event) => !event.startAt || Date.parse(event.startAt) >= Date.now()).length;

export const compareSnapshots = (current: ChamberSnapshot, previous?: ChamberSnapshot, allowLargeDrop = false): SnapshotDiff => {
  const warnings: string[] = [];
  const previousMembers = new Map(previous?.members.map((member) => [member.id, member]));
  const currentMembers = new Map(current.members.map((member) => [member.id, member]));
  const removed = [...previousMembers.keys()].filter((id) => !currentMembers.has(id));
  const added = [...currentMembers.keys()].filter((id) => !previousMembers.has(id));
  const changed = [...currentMembers.entries()].filter(([id, member]) => {
    const old = previousMembers.get(id);
    return old && JSON.stringify(old) !== JSON.stringify(member);
  });

  if (previous && current.members.length < previous.members.length * 0.75) warnings.push("Member count fell by more than 25%");
  const blankNames = current.members.filter((member) => !member.name.trim()).length;
  if (blankNames > current.members.length * 0.01) warnings.push("More than 1% of member names are blank");
  const withCategories = current.members.filter((member) => member.categories.length > 0).length;
  if (current.members.length && withCategories < current.members.length * 0.5) warnings.push("Categories disappeared from more than half of member records");
  const duplicateIds = current.members.length - new Set(current.members.map((member) => member.id)).size;
  if (duplicateIds > Math.max(2, current.members.length * 0.01)) warnings.push("Member duplicate rate exceeds 1%");
  if (current.members.length === 0) warnings.push("Snapshot contains no members");

  return {
    previous: previous ? { members: previous.members.length, categories: previous.categories.length, futureEvents: futureEvents(previous) } : null,
    current: { members: current.members.length, categories: current.categories.length, futureEvents: futureEvents(current) },
    addedMembers: added.length,
    removedMembers: removed.length,
    changedMembers: changed.length,
    warnings,
    rejected: warnings.length > 0 && !allowLargeDrop,
  };
};

export const formatDiff = (diff: SnapshotDiff): string => [
  "Previous snapshot:",
  diff.previous ? `${diff.previous.members} members\n${diff.previous.categories} categories\n${diff.previous.futureEvents} future events` : "none",
  "",
  "New snapshot:",
  `${diff.current.members} members\n${diff.current.categories} categories\n${diff.current.futureEvents} future events`,
  "",
  `Added members: ${diff.addedMembers}`,
  `Removed members: ${diff.removedMembers}`,
  `Changed members: ${diff.changedMembers}`,
  ...(diff.warnings.length ? ["", "Warnings:", ...diff.warnings.map((warning) => `- ${warning}`)] : []),
].join("\n");
