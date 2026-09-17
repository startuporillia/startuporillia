import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { resolve, relative } from "node:path";
import { zipSync, strToU8 } from "fflate";
import { loadSkills } from "./catalog";

const output = resolve(process.argv[2] ?? "dist/skills");
await mkdir(output, { recursive: true });

const collect = async (directory: string, root = directory): Promise<Record<string, Uint8Array>> => {
  const files: Record<string, Uint8Array> = {};
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) Object.assign(files, await collect(path, root));
    else files[relative(root, path)] = new Uint8Array(await readFile(path));
  }
  return files;
};

for (const skill of await loadSkills()) {
  const files = await collect(skill.directory);
  const prefixed = Object.fromEntries(Object.entries(files).map(([name, bytes]) => [`${skill.name}/${name}`, bytes]));
  await writeFile(resolve(output, `${skill.name}.zip`), zipSync(prefixed, { level: 9 }));
}
await writeFile(resolve(output, "catalog.json"), strToU8(JSON.stringify((await loadSkills()).map(({ name, description, meta }) => ({ name, description, ...meta })), null, 2)));
console.log(`Packaged skills in ${output}`);
