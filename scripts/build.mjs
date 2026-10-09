import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { build } from "esbuild";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(resolve(root, "index.html"), resolve(dist, "index.html"));
await cp(resolve(root, "src"), resolve(dist, "src"), { recursive: true });
await cp(resolve(root, "public"), resolve(dist, "public"), { recursive: true });
await cp(resolve(root, "favicon-v2h.svg"), resolve(dist, "favicon-v2h.svg"));
await build({ entryPoints: [resolve(root, "src/scripts/lesson-composer.js")], outfile: resolve(dist, "src/scripts/lesson-composer.bundle.js"), bundle: true, format: "esm", minify: true, target: ["es2020"], legalComments: "linked" });

console.log("Built static site in dist/");
