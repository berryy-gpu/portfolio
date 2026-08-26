// Walks public/images/projects and public/images/profile, writing a WebP
// (q80) and AVIF (q65) sibling next to every source raster. Anything taller
// than 3000px also gets a "-preview" variant capped at 3000px tall (same
// format as the source, quality-matched) for contexts that don't need the
// full print-resolution original. Originals are never deleted or modified.
import { readdir, stat } from "node:fs/promises";
import { join, extname, basename, dirname } from "node:path";
import sharp from "sharp";

const TARGET_DIRS = [
  "public/images/projects",
  "public/images/profile",
];

const RASTER_EXTENSIONS = new Set([".png", ".jpg", ".jpeg"]);
const PREVIEW_MAX_HEIGHT = 3000;

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(1)} ${units[unitIndex]}`;
}

async function collectRasterFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectRasterFiles(fullPath)));
    } else if (RASTER_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

async function processFile(filePath) {
  const dir = dirname(filePath);
  const ext = extname(filePath);
  const nameNoExt = basename(filePath, ext);

  const sourceStat = await stat(filePath);
  const image = sharp(filePath);
  const metadata = await image.metadata();

  const row = {
    file: filePath,
    originalSize: sourceStat.size,
    outputs: [],
  };

  const webpPath = join(dir, `${nameNoExt}.webp`);
  await sharp(filePath).webp({ quality: 80 }).toFile(webpPath);
  const webpStat = await stat(webpPath);
  row.outputs.push({ label: "webp", path: webpPath, size: webpStat.size });

  const avifPath = join(dir, `${nameNoExt}.avif`);
  await sharp(filePath).avif({ quality: 65 }).toFile(avifPath);
  const avifStat = await stat(avifPath);
  row.outputs.push({ label: "avif", path: avifPath, size: avifStat.size });

  if (metadata.height && metadata.height > PREVIEW_MAX_HEIGHT) {
    const previewExt = ext.toLowerCase() === ".png" ? "png" : "jpeg";
    const previewPath = join(dir, `${nameNoExt}-preview${ext}`);
    const previewSharp = sharp(filePath).resize({ height: PREVIEW_MAX_HEIGHT });
    if (previewExt === "png") {
      await previewSharp.png({ quality: 80 }).toFile(previewPath);
    } else {
      await previewSharp.jpeg({ quality: 80 }).toFile(previewPath);
    }
    const previewStat = await stat(previewPath);
    row.outputs.push({
      label: "preview",
      path: previewPath,
      size: previewStat.size,
    });

    const previewWebpPath = join(dir, `${nameNoExt}-preview.webp`);
    await sharp(filePath)
      .resize({ height: PREVIEW_MAX_HEIGHT })
      .webp({ quality: 80 })
      .toFile(previewWebpPath);
    const previewWebpStat = await stat(previewWebpPath);
    row.outputs.push({
      label: "preview-webp",
      path: previewWebpPath,
      size: previewWebpStat.size,
    });
  }

  return row;
}

async function main() {
  const rows = [];

  for (const dir of TARGET_DIRS) {
    let files;
    try {
      files = await collectRasterFiles(dir);
    } catch (error) {
      if (error.code === "ENOENT") {
        console.warn(`Skipping missing directory: ${dir}`);
        continue;
      }
      throw error;
    }

    for (const file of files) {
      // Skip anything we generated ourselves on a re-run.
      const name = basename(file);
      if (name.includes("-preview.")) continue;

      const row = await processFile(file);
      rows.push(row);
    }
  }

  let totalOriginal = 0;
  let totalBestOutput = 0;

  console.log(
    "\nFile".padEnd(52) +
      "Original".padEnd(12) +
      "WebP".padEnd(12) +
      "AVIF".padEnd(12) +
      "Preview".padEnd(12) +
      "Savings"
  );
  console.log("-".repeat(110));

  for (const row of rows) {
    const webp = row.outputs.find((o) => o.label === "webp");
    const avif = row.outputs.find((o) => o.label === "avif");
    const preview = row.outputs.find((o) => o.label === "preview");

    const bestOutput = Math.min(webp?.size ?? Infinity, avif?.size ?? Infinity);
    const savingsPct = (
      ((row.originalSize - bestOutput) / row.originalSize) *
      100
    ).toFixed(0);

    totalOriginal += row.originalSize;
    totalBestOutput += bestOutput;

    console.log(
      row.file.replace(/\\/g, "/").padEnd(52) +
        formatBytes(row.originalSize).padEnd(12) +
        formatBytes(webp?.size ?? 0).padEnd(12) +
        formatBytes(avif?.size ?? 0).padEnd(12) +
        (preview ? formatBytes(preview.size) : "-").padEnd(12) +
        `${savingsPct}%`
    );
  }

  console.log("-".repeat(110));
  console.log(
    `TOTAL: ${formatBytes(totalOriginal)} -> ${formatBytes(totalBestOutput)} best-format ` +
      `(${(((totalOriginal - totalBestOutput) / totalOriginal) * 100).toFixed(0)}% smaller)`
  );
  console.log(`\n${rows.length} source images processed. Originals left untouched.\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
