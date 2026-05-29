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
https://leonincs.github.io/SumPages/knowledgegraph/
```

## Publish

In GitHub:

1. Open `Settings` -> `Pages`.
2. Set `Source` to `Deploy from a branch`.
3. Select branch `main` and folder `/ (root)`.
4. Save.
