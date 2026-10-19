#!/usr/bin/env node
// Tiny zero-dependency Markdown -> static HTML build. No framework, no
// bundler: edit a .md file in content/, run `npm run build`, done.

import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, "content");
const outDir = path.join(__dirname, "dist");

// Pages link style.css?v=<hash of its contents>, so a CSS change gets a new
// URL and browsers/Cloudflare (which cache it for hours) can't serve a stale
// copy alongside fresh HTML.
const cssVersion = crypto
  .createHash("sha256")
  .update(fs.readFileSync(path.join(__dirname, "style.css")))
  .digest("hex")
  .slice(0, 10);

// "Updated" in the footer is the last commit's date, not the build time, so
// rebuilding (e.g. a container restart) doesn't bump it. Falls back to now
// if git isn't available.
const lastUpdated = (() => {
  try {
    const iso = execFileSync("git", ["log", "-1", "--format=%cI"], { cwd: __dirname, encoding: "utf8" }).trim();
    if (iso) return new Date(iso);
  } catch {}
  return new Date();
})().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const pages = [
  { file: "index.md", nav: "Home", title: "Ramon Torres" },
  { file: "teaching.md", nav: "Teaching", title: "Teaching · Ramon Torres" },
  { file: "publications.md", nav: "Publications", title: "Publications · Ramon Torres" },
];

const siteFooter = `Ramon Torres · <a href="mailto:rtorre25@ucsc.edu">Email</a> · <a href="https://linkedin.com/in/ramonTorres25">LinkedIn</a>`;

// Footer stats line: page weight and an estimated CO2e per visit, using the
// Sustainable Web Design Model v4 (what websitecarbon.com uses). Energy per
// GB transferred, operational + embodied for data centers (0.055 + 0.012),
// networks (0.059 + 0.013), and user devices (0.080 + 0.081), at the model's
// default global grid intensity. Counts every visit as a first visit (no
// caching) and assumes non-green hosting. Computed once per page at build
// time (see withStats).
// Constants: https://sustainablewebdesign.org/estimating-digital-emissions/
const swdKwhPerGb = 0.055 + 0.012 + 0.059 + 0.013 + 0.08 + 0.081; // 0.300
const swdGramsPerKwh = 494;
const carbonMethodUrl = "https://www.websitecarbon.com/how-does-it-work/";
const carbonModelUrl = "https://sustainablewebdesign.org/estimating-digital-emissions/";

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderInline(text) {
  let out = escapeHtml(text);
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");
  out = out.replace(/_([^_]+)_/g, "<em>$1</em>");
  out = out.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, url) => `<img src="${url}" alt="${alt}">`);
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => `<a href="${url}">${label}</a>`);
  return out;
}

// Renders a flat run of lines (headings, paragraphs, lists, horizontal
// rules) with no blockquote handling — used both at the top level and for
// the body of a blockquote/callout.
function renderLines(lines) {
  const html = [];
  let listOpen = false;
  let paragraph = [];

  // Consecutive text lines form one paragraph, joined with spaces, so long
  // paragraphs can be wrapped across lines in the source.
  const closeParagraph = () => {
    if (paragraph.length) {
      html.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };
  const closeList = () => {
    closeParagraph();
    if (listOpen) {
      html.push("</ul>");
      listOpen = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.trim() === "") {
      closeList();
      continue;
    }
    if (/^-{3,}$/.test(line.trim())) {
      closeList();
      html.push("<hr>");
      continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      closeList();
      const level = heading[1].length;
      html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      continue;
    }
    const listItem = line.match(/^[-*]\s+(.*)$/);
    if (listItem) {
      closeParagraph();
      if (!listOpen) {
        html.push("<ul>");
        listOpen = true;
      }
      html.push(`<li>${renderInline(listItem[1])}</li>`);
      continue;
    }
    if (listOpen) closeList();
    paragraph.push(line.trim());
  }
  closeList();
  return html.join("\n");
}

// GitHub-style callouts: a blockquote whose first line is "[!NOTE]",
// "[!TIP]", "[!IMPORTANT]", "[!WARNING]", or "[!CAUTION]", optionally
// followed by a custom title, e.g. "[!NOTE] Tor Sustainability" — falls
// back to the type's generic label ("Note") when no title is given.
const calloutLabels = {
  NOTE: "Note",
  TIP: "Tip",
  IMPORTANT: "Important",
  WARNING: "Warning",
  CAUTION: "Caution",
};

function renderBlockquote(quoteLines) {
  const lines = [...quoteLines];
  while (lines.length && lines[0].trim() === "") lines.shift();
  while (lines.length && lines[lines.length - 1].trim() === "") lines.pop();

  const calloutMatch = lines[0] && lines[0].trim().match(/^\[!([A-Z]+)\]\s*(.*)$/);
  const defaultLabel = calloutMatch && calloutLabels[calloutMatch[1]];

  if (defaultLabel) {
    const type = calloutMatch[1].toLowerCase();
    const title = calloutMatch[2].trim() || defaultLabel;
    const body = renderLines(lines.slice(1));
    return `<div class="callout callout-${type}">\n<p class="callout-title">${renderInline(title)}</p>\n${body}\n</div>`;
  }

  return `<blockquote>\n${renderLines(lines)}\n</blockquote>`;
}

// Splits lines into runs of consecutive blockquote ("> ...") lines vs.
// everything else, stripping the leading "> " marker from quoted lines.
function groupBlocks(lines) {
  const blocks = [];
  let current = null;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const quoteMatch = line.match(/^>\s?(.*)$/);
    const type = quoteMatch ? "quote" : "normal";
    const content = quoteMatch ? quoteMatch[1] : line;

    if (!current || current.type !== type) {
      current = { type, lines: [] };
      blocks.push(current);
    }
    current.lines.push(content);
  }
  return blocks;
}

// Card status pills are colored by keywords in the status text; anything
// unmatched gets a neutral pill.
const statusKinds = [
  [/review|submitted/i, "review"],
  [/progress|ongoing|active/i, "active"],
  [/accepted|published/i, "done"],
];

// Renders a "::: cards" block: each "### Title" section becomes a card. The
// line right under the title is the meta line, whose text after the last "·"
// becomes the status pill; a "Tags: a, b" line becomes tag pills; everything
// else renders as normal Markdown. With no sections, it shows emptyText (the
// rest of the "::: cards" line) as a muted note instead.
function renderCards(markdown, emptyText) {
  const sections = markdown.split(/^(?=###\s)/m).filter((section) => /^###\s/.test(section));
  if (!sections.length) {
    return `<p class="cards-empty">${renderInline(emptyText.trim() || "Nothing here yet.")}</p>`;
  }

  const cards = sections.map((section) => {
    const [heading, ...rest] = section.trim().split("\n");
    const html = [`<h3>${renderInline(heading.replace(/^###\s+/, ""))}</h3>`];

    if (rest.length && rest[0].trim() !== "") {
      const meta = rest.shift().trim();
      const dot = meta.lastIndexOf("·");
      const text = dot === -1 ? meta : meta.slice(0, dot).trim();
      let pill = "";
      if (dot !== -1) {
        const status = meta.slice(dot + 1).trim();
        const kind = statusKinds.find(([pattern]) => pattern.test(status));
        pill = `<span class="status status-${kind ? kind[1] : "other"}">${renderInline(status)}</span>`;
      }
      html.push(`<p class="card-meta"><span>${renderInline(text)}</span>${pill}</p>`);
    }

    const tagsIndex = rest.findIndex((line) => /^Tags:/i.test(line.trim()));
    const tagsLine = tagsIndex === -1 ? null : rest.splice(tagsIndex, 1)[0];
    html.push(renderLines(rest));
    if (tagsLine) {
      const tags = tagsLine.trim().replace(/^Tags:\s*/i, "").split(",").map((tag) => tag.trim()).filter(Boolean);
      html.push(`<p class="card-tags">${tags.map((tag) => `<span class="tag">${renderInline(tag)}</span>`).join("")}</p>`);
    }
    return `<article class="card">\n${html.filter(Boolean).join("\n")}\n</article>`;
  });

  return `<div class="cards">\n${cards.join("\n")}\n</div>`;
}

function renderMarkdown(markdown) {
  const blocks = groupBlocks(markdown.split("\n"));
  return blocks
    .map((block) => (block.type === "quote" ? renderBlockquote(block.lines) : renderLines(block.lines)))
    .join("\n");
}

// Minimal Markdown -> HTML covering the subset this site uses: headings,
// paragraphs, bold/italic, links, inline code, unordered lists, horizontal
// rules, blockquotes/callouts, and "::: cards [empty text]" ... ":::" card
// blocks. HTML
// comments (<!-- ... -->) are stripped before rendering, so .md files can
// carry editor-only TODO notes. Separate consecutive callouts/blockquotes
// with a blank line, or they'll merge into one block.
function markdownToHtml(markdown) {
  const stripped = markdown.replace(/<!--[\s\S]*?-->/g, "").replace(/\r\n/g, "\n");
  // split() with two capture groups cycles: plain Markdown, a card block's
  // empty text, its body, then plain Markdown again, ...
  const parts = stripped.split(/^::: cards(.*)\n([\s\S]*?)^:::[ \t]*$/m);
  const html = [];
  for (let i = 0; i < parts.length; i += 3) {
    html.push(renderMarkdown(parts[i]));
    if (i + 2 < parts.length) html.push(renderCards(parts[i + 2], parts[i + 1]));
  }
  return html.join("\n");
}

// Opens the browser's print dialog, where "Save as PDF" produces the CV
// download; print styles in style.css handle the PDF formatting.
//const printButtonHtml = `<p class="print-button"><button type="button" onclick="window.print()">Download CV (PDF)</button></p>`;

// Light/dark toggle. With no saved choice the site follows the OS setting
// (prefers-color-scheme in style.css); clicking stores an explicit choice in
// localStorage and sets data-theme on <html>. The head script runs before
// first paint so a saved choice never flashes the wrong theme.
const themeInitScript = `<script>
try {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") document.documentElement.dataset.theme = saved;
} catch (e) {}
</script>`;

const themeToggleScript = `<script>
(() => {
  const button = document.querySelector(".theme-toggle");
  const root = document.documentElement;
  const current = () =>
    root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const label = () => {
    const next = current() === "dark" ? "light" : "dark";
    button.textContent = next === "dark" ? "☾ Dark" : "☀ Light";
    button.setAttribute("aria-label", "Switch to " + next + " mode");
  };
  button.addEventListener("click", () => {
    const next = current() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    label();
  });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", label);
  label();
})();
</script>`;

// Shared content: a line of `{{include file.md}}` is replaced with that
// file from content/ before rendering, so one source (e.g. projects.md) can
// feed several pages. The included file's top-level "# Title" is dropped.
// `{{include file.md summary}}` trims each entry — a callout or a "### Title"
// section — to its header lines (the title plus everything before the first
// blank line) and the first body paragraph or first bullet, for the CV's
// short form. `{{include file.md cards}}` wraps the
// file in a "::: cards" block (see renderCards). Any "::: cards" fences in
// the included file itself (e.g. teaching.md) are dropped first.
function summarizeEntries(markdown) {
  const out = [];
  let state = null; // null outside an entry, then "header" -> "body" -> ("paragraph" ->) "done"
  let entryIsQuote = false;

  for (const line of markdown.split("\n")) {
    const quote = line.match(/^>\s?(.*)$/);
    const content = (quote ? quote[1] : line).trim();
    if (quote ? /^\[![A-Z]+\]/.test(content) : /^###\s/.test(line)) {
      state = "header";
      entryIsQuote = Boolean(quote);
    } else if (Boolean(quote) !== entryIsQuote || /^#{1,2}\s/.test(line)) {
      state = null;
    }

    if (state === null || state === "header") {
      if (content === "" && state === "header") state = "body";
      out.push(line);
    } else if (state === "body" && content !== "") {
      out.push(line);
      // A paragraph continues onto following lines; a bullet stands alone.
      state = /^[-*]\s|^#/.test(content) ? "done" : "paragraph";
    } else if (state === "paragraph") {
      if (content === "" || /^[-*]\s|^#|^Tags:/i.test(content)) state = "done";
      else out.push(line);
    }
  }
  return out.join("\n");
}

function expandIncludes(markdown) {
  return markdown.replace(/^\{\{\s*include\s+(\S+?)(?:\s+(summary|cards))?\s*\}\}\s*$/gm, (_, file, mode) => {
    const included = fs
      .readFileSync(path.join(contentDir, file), "utf8")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/^#\s.*$/m, "")
      .replace(/^:::.*$/gm, "")
      .trim();
    if (mode === "summary") return summarizeEntries(included);
    if (mode === "cards") return `::: cards\n${included}\n:::`;
    return included;
  });
}

function layout({ title, bodyHtml, navHtml, statsHtml }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<link rel="icon" href="images/icon.png">
<link rel="stylesheet" href="style.css?v=${cssVersion}">
${themeInitScript}
</head>
<body>
<nav class="site-nav"><span>${navHtml}</span><button type="button" class="theme-toggle">Theme</button></nav>
<main class="markdown-body">
${bodyHtml}
</main>
<footer class="site-footer">
<p>${siteFooter}</p>
<p class="site-stats">${statsHtml}</p>
</footer>
${themeToggleScript}
</body>
</html>
`;
}

// Resources a page makes the browser fetch from another origin: absolute
// (or protocol-relative) URLs in src/srcset/data attributes, <link> hrefs
// other than plain references (canonical/alternate/me), and CSS url() or
// @import. Plain <a> links aren't requests until clicked, so they don't count.
function thirdPartyRequests(html, css) {
  const external = /^(?:https?:)?\/\//i;
  const urls = new Set();
  for (const [, attr, value] of html.matchAll(/\s(src|srcset|data)="([^"]+)"/gi)) {
    const candidates = attr.toLowerCase() === "srcset" ? value.split(",").map((entry) => entry.trim().split(/\s+/)[0]) : [value];
    for (const url of candidates) if (external.test(url)) urls.add(url);
  }
  for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) {
    const href = tag.match(/\shref="([^"]+)"/i);
    if (href && external.test(href[1]) && !/\srel="(?:canonical|alternate|me)"/i.test(tag)) urls.add(href[1]);
  }
  for (const [, url] of css.matchAll(/(?:url\(\s*["']?|@import\s+["'])([^"')\s]+)/gi)) {
    if (external.test(url)) urls.add(url);
  }
  return urls;
}

// Page weight = the HTML (measured with the stats placeholder, a few bytes
// off), style.css, and each image the page references (incl. the favicon).
// Also counts third-party requests, warning about any so they're deliberate.
function withStats(html, file) {
  const css = fs.readFileSync(path.join(__dirname, "style.css"), "utf8");
  const images = new Set([...html.matchAll(/(?:src|href)="(images\/[^"]+)"/g)].map((match) => match[1]));
  let bytes = Buffer.byteLength(html) + Buffer.byteLength(css);
  for (const image of images) bytes += fs.statSync(path.join(__dirname, image)).size;

  const thirdParty = thirdPartyRequests(html, css);
  if (thirdParty.size) console.warn(`${file}: ${thirdParty.size} third-party request(s): ${[...thirdParty].join(", ")}`);

  const grams = (bytes / 1e9) * swdKwhPerGb * swdGramsPerKwh;
  const stats =
    `${Math.round(bytes / 1000)} KB · ≈${Number(grams.toPrecision(2))} g CO₂e per visit ` +
    `(<a href="${carbonMethodUrl}">estimate</a>, <a href="${carbonModelUrl}">model</a>) · ` +
    `${thirdParty.size} third-party request${thirdParty.size === 1 ? "" : "s"} · updated ${lastUpdated}`;
  return html.replace("{{stats}}", stats);
}

function build() {
  fs.mkdirSync(outDir, { recursive: true });

  const navHtml = pages
    .map((page) => `<a href="${page.file.replace(/\.md$/, ".html")}">${page.nav}</a>`)
    .join(" · ");

  for (const page of pages) {
    const markdown = fs.readFileSync(path.join(contentDir, page.file), "utf8");
    let bodyHtml = markdownToHtml(expandIncludes(markdown));
    if (page.printButton) {
      bodyHtml = bodyHtml.replace("</h1>", `</h1>\n${printButtonHtml}`);
    }
    const html = withStats(layout({ title: page.title, bodyHtml, navHtml, statsHtml: "{{stats}}" }), page.file);
    const outFile = page.file.replace(/\.md$/, ".html");
    fs.writeFileSync(path.join(outDir, outFile), html);
  }

  fs.copyFileSync(path.join(__dirname, "style.css"), path.join(outDir, "style.css"));

  const imagesDir = path.join(__dirname, "images");
  if (fs.existsSync(imagesDir)) {
    fs.cpSync(imagesDir, path.join(outDir, "images"), { recursive: true });
  }

  console.log(`Built ${pages.length} pages to ${path.relative(process.cwd(), outDir)}/`);
}

build();
