import { createHash } from "node:crypto";

export const cleanText = (value?: string | null): string | undefined => {
  const cleaned = value
    ?.replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned || undefined;
};

export const canonicalUrl = (value: string | null | undefined, base: string): string | undefined => {
  if (!value) return undefined;
  try {
    const url = new URL(value, base);
    if (!/^https?:$/.test(url.protocol)) return undefined;
    url.hash = "";
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_|fbclid|gclid)/i.test(key)) url.searchParams.delete(key);
    }
    return url.toString();
  } catch {
    return undefined;
  }
};

export const normalizePhone = (value?: string | null): string | undefined => {
  const text = cleanText(value);
  if (!text) return undefined;
  const digits = text.replace(/\D/g, "");
  if (digits.length === 10) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  return text;
};

export const slugify = (value: string): string => value
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/&/g, " and ")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "") || "item";

export const stableId = (sourceUrl: string): string =>
  createHash("sha256").update(sourceUrl.toLowerCase()).digest("hex").slice(0, 24);

export const uniqueSorted = (values: Array<string | undefined>): string[] => {
  const unique = new Map<string, string>();
  for (const value of values) {
    const cleaned = cleanText(value);
    if (cleaned && !unique.has(cleaned.toLocaleLowerCase())) unique.set(cleaned.toLocaleLowerCase(), cleaned);
  }
  return [...unique.values()].sort((a, b) => a.localeCompare(b));
};

export const sourceIdFromUrl = (url: string): string | undefined =>
  url.match(/-(\d+)(?:\/?(?:\?.*)?)?$/)?.[1];
