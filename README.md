# SumPages

Static redirect hub for project links.

## Add Or Update A Link

Edit `redirects.json`:

```json
{
  "slug": "knowledgegraph",
  "target": "https://github.com/LeoninCS/KnowledgeGraph",
  "title": "KnowledgeGraph"
}
```

Then regenerate redirect pages:

```bash
node scripts/generate-redirects.mjs
```

The public link is:

```text
https://leonincs.github.io/SumPages/fork-skill/
```

## Publish

In GitHub:

1. Open `Settings` -> `Pages`.
2. Set `Source` to `GitHub Actions`.
3. Open `Actions` and run `Deploy GitHub Pages` if it has not started.
4. Save.
