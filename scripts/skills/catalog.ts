import { readdir, readFile } from "node:fs/promises";
import { resolve, relative, dirname, basename } from "node:path";
import { z } from "zod";

export const metaSchema = z.object({
  category: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  status: z.enum(["draft", "beta", "stable"]),
  author: z.string().min(1),
  contributors: z.array(z.string()),
  tags: z.array(z.string()),
  usesChamberData: z.boolean(),
  title: z.string().min(1),
  summary: z.string().min(1),
  exampleQuestions: z.array(z.string().min(1)).min(1),
  expectedOutput: z.string().min(1),
});

export type SkillMeta = z.infer<typeof metaSchema>;
export type SkillSource = { directory: string; skillPath: string; raw: string; name: string; description: string; meta: SkillMeta };

export const parseFrontmatter = (raw: string): { name: string; description: string } => {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error("SKILL.md requires YAML frontmatter");
  const fields = new Map(match[1].split(/\r?\n/).map((line) => {
    const index = line.indexOf(":");
    return index < 0 ? [line.trim(), ""] : [line.slice(0, index).trim(), line.slice(index + 1).trim().replace(/^['"]|['"]$/g, "")];
  }));
  const name = fields.get("name") ?? "";
  const description = fields.get("description") ?? "";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) || name.length > 64) throw new Error(`Invalid skill name: ${name}`);
  if (!description || description.length > 1024) throw new Error(`Invalid description for ${name || "skill"}`);
  return { name, description };
};

const walk = async (directory: string): Promise<string[]> => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => entry.isDirectory() ? walk(resolve(directory, entry.name)) : [resolve(directory, entry.name)]));
  return nested.flat();
};

export const loadSkills = async (root = resolve("skills")): Promise<SkillSource[]> => {
  const files = await walk(root);
  const skillFiles = files.filter((file) => basename(file) === "SKILL.md");
  const skills = await Promise.all(skillFiles.map(async (skillPath) => {
    const directory = dirname(skillPath);
    const raw = await readFile(skillPath, "utf8");
    const frontmatter = parseFrontmatter(raw);
    if (basename(directory) !== frontmatter.name) throw new Error(`${relative(root, skillPath)} name must match its parent directory`);
    const meta = metaSchema.parse(JSON.parse(await readFile(resolve(directory, "skill.meta.json"), "utf8")));
    const references = [...raw.matchAll(/\[[^\]]+\]\((?!https?:|#)([^)]+)\)/g)].map((match) => resolve(directory, match[1]));
    const missing = references.filter((reference) => !files.includes(reference));
    if (missing.length) throw new Error(`${frontmatter.name} references missing files: ${missing.join(", ")}`);
    return { directory, skillPath, raw, ...frontmatter, meta };
  }));
  return skills.sort((a, b) => a.meta.title.localeCompare(b.meta.title));
};
