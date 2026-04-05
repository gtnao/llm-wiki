import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import TurndownService from "turndown";
// @ts-expect-error -- no type definitions available
import { gfm } from "turndown-plugin-gfm";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RAW_DIR = resolve(__dirname, "..", "raw");

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u3000-\u9fff\u4e00-\u9faf]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function extractSourceName(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, "").split(".")[0];
  } catch {
    return "unknown";
  }
}

async function clip(url: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    console.error(`Failed to fetch: ${response.status} ${response.statusText}`);
    process.exit(1);
  }

  const html = await response.text();
  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  if (article == null || article.content == null) {
    console.error("Failed to extract article content");
    process.exit(1);
  }

  const turndown = new TurndownService();
  turndown.use(gfm);
  const markdown = turndown.turndown(article.content);

  const date = todayString();
  const source = extractSourceName(url);
  const slug = slugify(article.title ?? "untitled");
  const filename = `${date}_${source}_${slug}.md`;

  const frontmatter = [
    "---",
    `title: "${(article.title ?? "").replace(/"/g, '\\"')}"`,
    `url: ${url}`,
    `date: ${date}`,
    `type: article`,
    "---",
  ].join("\n");

  const content = `${frontmatter}\n\n${markdown}\n`;
  const filepath = resolve(RAW_DIR, filename);

  writeFileSync(filepath, content, "utf-8");
  console.log(`Saved: ${filepath}`);
}

const url = process.argv[2];
if (!url) {
  console.error("Usage: tsx tools/clip.ts <url>");
  process.exit(1);
}

clip(url);
