import { readFileSync, readdirSync, statSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RAW_DIR = resolve(__dirname, "..", "raw");
const LOG_PATH = resolve(__dirname, "..", "wiki", "log.md");

function getRawFiles(): string[] {
  const entries = readdirSync(RAW_DIR);
  return entries
    .filter((e) => {
      if (e.startsWith(".")) return false;
      const full = resolve(RAW_DIR, e);
      const stat = statSync(full);
      return stat.isFile() ? e.endsWith(".md") : stat.isDirectory();
    })
    .sort();
}

function getIngestedFiles(): Set<string> {
  let log: string;
  try {
    log = readFileSync(LOG_PATH, "utf-8");
  } catch {
    return new Set();
  }

  const ingested = new Set<string>();
  const sourceLines = log.match(/^- sources:.*$/gm) ?? [];
  for (const line of sourceLines) {
    const files = line.replace(/^- sources:\s*/, "").split(/,\s*/);
    for (const f of files) {
      ingested.add(f.trim());
    }
  }
  return ingested;
}

const rawFiles = getRawFiles();
const ingested = getIngestedFiles();
const pending = rawFiles.filter((f) => !ingested.has(f));

if (pending.length === 0) {
  console.log("No pending files. All raw sources have been ingested.");
} else {
  console.log(`${pending.length} pending file(s):\n`);
  for (const f of pending) {
    console.log(`  - ${f}`);
  }
}
