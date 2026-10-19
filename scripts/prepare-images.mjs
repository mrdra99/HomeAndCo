import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile, access, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// Generated before dev/build: static files work on Pages without an image server.
const root = process.cwd();
const uploads = path.join(root, "public/uploads");
const output = path.join(root, "public/_images");
const sizes = JSON.parse(await readFile(path.join(root, "lib/image-sizes.json"), "utf8"));
const widths = [...sizes.imageSizes, ...sizes.deviceSizes].sort((a, b) => a - b);
const manifest = {};
const jobs = [];
const expected = new Set();
let generated = 0;

async function scan(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === "responsive") continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await scan(file);
    else if (/\.(webp|jpe?g|png|avif)$/i.test(entry.name)) {
      const bytes = await readFile(file);
      const metadata = await sharp(bytes).metadata();
      // Animated images retain their original file and playback.
      if (!metadata.width || !metadata.height || metadata.pages > 1) continue;
      const src = "/" + path.relative(path.join(root, "public"), file).split(path.sep).join("/");
      const flyer = src.startsWith("/uploads/flyers/");
      const options = flyer
        ? { quality: 88, thumbnailQuality: 82, thumbnailMaxWidth: 960, effort: 4 }
        : { quality: 80, effort: 4 };
      const digest = createHash("sha256").update(JSON.stringify(options)).update(bytes).digest("hex").slice(0, 12);
      const name = path.parse(file).name;
      const prefix = `/_images/${name}-${digest}`;
      const width = metadata.autoOrient?.width ?? metadata.width;
      manifest[src] = { prefix, width };
      for (const size of new Set([...widths.filter((value) => value < width), width])) {
        const name = `${path.basename(prefix)}-${size}.webp`;
        if (expected.has(name)) continue;
        expected.add(name);
        jobs.push(async () => {
          const target = path.join(output, name);
          try { await access(target); return; } catch { /* First build for this source. */ }
          await sharp(bytes).rotate().resize({ width: size, withoutEnlargement: true })
            .webp({ quality: flyer && size <= 960 ? 82 : options.quality, effort: options.effort }).toFile(target);
          generated++;
        });
      }
    }
  }
}

await mkdir(output, { recursive: true });
await scan(uploads);
let cursor = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < jobs.length) await jobs[cursor++]();
}));
// This directory contains generated assets only; discard obsolete content hashes.
for (const name of await readdir(output)) {
  if (name.endsWith(".webp") && !expected.has(name)) await unlink(path.join(output, name));
}
const target = path.join(root, "lib/image-manifest.json");
const json = JSON.stringify(Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b))), null, 2) + "\n";
let previous = "";
try { previous = await readFile(target, "utf8"); } catch { /* First generation. */ }
if (previous !== json) await writeFile(target, json);
console.log(`Responsive images: ${Object.keys(manifest).length} sources, ${generated} new variants.`);
