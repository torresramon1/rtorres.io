#!/usr/bin/env node
// Tiny zero-dependency Markdown -> static HTML build. No framework, no
// bundler: edit a .md file in content/, run `npm run build`, done.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, "content");
const outDir = path.join(__dirname, "dist");

const pages = [
  { file: "index.md", nav: "Home", title: "Ramon Torres" },
  //{ file: "cv.md", nav: "CV", title: "CV · Ramon Torres", printButton: true },
  { file: "teaching.md", nav: "Teaching", title: "Teaching · Ramon Torres" },
  { file: "publications.md", nav: "Publications", title: "Publications · Ramon Torres" },
];

const siteFooter = `Ramon Torres · <a href="mailto:rtorre25@ucsc.edu">Email</a> · <a href="https://linkedin.com/in/ramonTorres25">LinkedIn</a>`;

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

  const closeList = () => {
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
      if (!listOpen) {
        html.push("<ul>");
        listOpen = true;
      }
      html.push(`<li>${renderInline(listItem[1])}</li>`);
      continue;
    }
    closeList();
    html.push(`<p>${renderInline(line)}</p>`);
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

// Minimal Markdown -> HTML covering the subset this site uses: headings,
// paragraphs, bold/italic, links, inline code, unordered lists, horizontal
// rules, and blockquotes/callouts. HTML comments (<!-- ... -->) are stripped
// before rendering, so .md files can carry editor-only TODO notes. Separate
// consecutive callouts/blockquotes with a blank line, or they'll merge into
// one block.
function markdownToHtml(markdown) {
  const stripped = markdown.replace(/<!--[\s\S]*?-->/g, "");
  const lines = stripped.replace(/\r\n/g, "\n").split("\n");
  const blocks = groupBlocks(lines);
  return blocks
    .map((block) => (block.type === "quote" ? renderBlockquote(block.lines) : renderLines(block.lines)))
    .join("\n");
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
// `{{include file.md summary}}` trims each callout to its header lines (the
// title plus everything before the first blank line) and the first body
// line — the summary sentence or first bullet — for the CV's short form.
function summarizeCallouts(markdown) {
  const out = [];
  let state = null; // null outside a callout, then "header" -> "body" -> "done"

  for (const line of markdown.split("\n")) {
    const quote = line.match(/^>\s?(.*)$/);
    if (!quote) {
      state = null;
      out.push(line);
      continue;
    }
    const content = quote[1].trim();
    if (/^\[![A-Z]+\]/.test(content)) state = "header";

    if (state === null || state === "header") {
      if (content === "" && state === "header") state = "body";
      out.push(line);
    } else if (state === "body" && content !== "") {
      out.push(line);
      state = "done";
    }
  }
  return out.join("\n");
}

function expandIncludes(markdown) {
  return markdown.replace(/^\{\{\s*include\s+(\S+?)(\s+summary)?\s*\}\}\s*$/gm, (_, file, summary) => {
    const included = fs
      .readFileSync(path.join(contentDir, file), "utf8")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/^#\s.*$/m, "")
      .trim();
    return summary ? summarizeCallouts(included) : included;
  });
}

function layout({ title, bodyHtml, navHtml }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<link rel="icon" href="images/icon.png">
<link rel="stylesheet" href="style.css">
${themeInitScript}
</head>
<body>
<nav class="site-nav"><span>${navHtml}</span><button type="button" class="theme-toggle">Theme</button></nav>
<main class="markdown-body">
${bodyHtml}
</main>
<footer class="site-footer">
<p>${siteFooter}</p>
</footer>
${themeToggleScript}
</body>
</html>
`;
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
    const html = layout({ title: page.title, bodyHtml, navHtml });
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
