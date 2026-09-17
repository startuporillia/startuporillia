import { describe, expect, it } from "vitest";
import { loadSkills } from "../scripts/skills/catalog";

describe("skill packages", () => {
  it("validates metadata, unique names, and referenced files", async () => {
    const skills = await loadSkills();
    expect(skills).toHaveLength(12);
    expect(new Set(skills.map((skill) => skill.name)).size).toBe(12);
    expect(skills.every((skill) => skill.raw.length > 1_500)).toBe(true);
    expect(skills.every((skill) => /Startup Orillia MCP/i.test(skill.raw) && /source/i.test(skill.raw))).toBe(true);
  });
});
