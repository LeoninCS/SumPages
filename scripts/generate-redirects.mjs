import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const redirectsPath = join(root, "redirects.json");
const redirects = JSON.parse(await readFile(redirectsPath, "utf8"));

const reservedPaths = new Set([
  ".git",
  "scripts",
  "README.md",
  "redirects.json",
  "index.html",
  "404.html",
  ".nojekyll",
]);

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function assertRedirect(entry) {
  if (!slugPattern.test(entry.slug)) {
    throw new Error(`Invalid slug: ${entry.slug}`);
  }

  if (reservedPaths.has(entry.slug)) {
    throw new Error(`Reserved slug: ${entry.slug}`);
  }

  new URL(entry.target);
}

function redirectHtml({ target, title }) {
  const safeTarget = escapeHtml(target);
  const safeTitle = escapeHtml(title);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${safeTitle}</title>
    <link rel="canonical" href="${safeTarget}">
    <meta http-equiv="refresh" content="0; url=${safeTarget}">
    <script>
      location.replace(${JSON.stringify(target)});
    </script>
  </head>
  <body>
    <a href="${safeTarget}">${safeTitle}</a>
  </body>
</html>
`;
}

function routerHtml() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>SumPages</title>
    <script>
      (async () => {
        const base = "/SumPages/";
        const path = location.pathname.startsWith(base)
          ? location.pathname.slice(base.length)
          : location.pathname.replace(/^\\//, "");
        const slug = path.split("/").filter(Boolean)[0] || new URLSearchParams(location.search).get("to");

        if (!slug) return;

        const response = await fetch(base + "redirects.json", { cache: "no-store" });
        const redirects = await response.json();
        const match = redirects.find((item) => item.slug === slug);

        if (match) {
          location.replace(match.target);
        }
      })();
    </script>
  </head>
  <body></body>
</html>
`;
}

const seen = new Set();

for (const entry of redirects) {
  assertRedirect(entry);

  if (seen.has(entry.slug)) {
    throw new Error(`Duplicate slug: ${entry.slug}`);
  }

  seen.add(entry.slug);
  const pageDir = join(root, entry.slug);

  await rm(pageDir, { recursive: true, force: true });
  await mkdir(pageDir, { recursive: true });
  await writeFile(
    join(pageDir, "index.html"),
    redirectHtml({
      target: entry.target,
      title: entry.title || entry.slug,
    }),
  );
}

await writeFile(join(root, "index.html"), routerHtml());
await writeFile(join(root, "404.html"), routerHtml());
await writeFile(join(root, ".nojekyll"), "");

console.log(`Generated ${redirects.length} redirects.`);
