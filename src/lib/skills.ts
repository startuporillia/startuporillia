export type SkillMeta = {
  category: string;
  version: string;
  status: "draft" | "beta" | "stable";
  author: string;
  contributors: string[];
  tags: string[];
  usesChamberData: boolean;
  title: string;
  summary: string;
  exampleQuestions: string[];
  expectedOutput: string;
};

export type CatalogSkill = SkillMeta & { slug: string; description: string; raw: string };

const rawSkills = import.meta.glob("/skills/**/SKILL.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;
const metadata = import.meta.glob("/skills/**/skill.meta.json", { import: "default", eager: true }) as Record<string, SkillMeta>;

const frontmatterDescription = (raw: string): string => raw.match(/^---[\s\S]*?\ndescription:\s*(.+)\n[\s\S]*?---/)?.[1]?.trim().replace(/^['"]|['"]$/g, "") ?? "";

export const skills: CatalogSkill[] = Object.entries(rawSkills).map(([path, raw]) => {
  const base = path.replace(/\/SKILL\.md$/, "");
  const slug = base.split("/").pop()!;
  const meta = metadata[`${base}/skill.meta.json`];
  if (!meta) throw new Error(`Missing catalog metadata for ${slug}`);
  return { slug, raw, description: frontmatterDescription(raw), ...meta };
}).sort((a, b) => a.title.localeCompare(b.title));

export const categories = [...new Set(skills.map((skill) => skill.category))].sort();
export const getSkill = (slug?: string): CatalogSkill | undefined => skills.find((skill) => skill.slug === slug);
