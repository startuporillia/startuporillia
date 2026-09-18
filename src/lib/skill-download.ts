import { strToU8, zipSync } from "fflate";
import type { CatalogSkill } from "./skills";

export function downloadSkills(selection: CatalogSkill[], filename: string) {
  const files: Record<string, Uint8Array> = {};
  for (const skill of selection) {
    const { raw, slug, description: _description, ...meta } = skill;
    files[`${slug}/SKILL.md`] = strToU8(raw);
    files[`${slug}/skill.meta.json`] = strToU8(JSON.stringify(meta, null, 2));
  }
  const url = URL.createObjectURL(new Blob([zipSync(files)], { type: "application/zip" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
