
import { execSync } from "node:child_process";
import { rmSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const output = resolve(root, "dist");

const apps = ["customer", "owner", "admin"];

rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });

for (const app of apps) {
  const outDir = resolve(output, app);

  console.log(`\nBuilding ${app}...`);

  execSync(
    `npm run build --workspace=${app} -- --base=/${app}/ --outDir="${outDir}"`,
    { cwd: root, stdio: "inherit", shell: true }
  );
}

console.log("\nAll three apps built.");
