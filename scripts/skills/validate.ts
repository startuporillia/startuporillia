import { loadSkills } from "./catalog";

const skills = await loadSkills();
const names = skills.map((skill) => skill.name);
const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
if (duplicates.length) throw new Error(`Duplicate skill names: ${[...new Set(duplicates)].join(", ")}`);
console.log(`Validated ${skills.length} portable Agent Skills packages`);
for (const skill of skills) console.log(`- ${skill.name} (${skill.meta.status} ${skill.meta.version})`);
