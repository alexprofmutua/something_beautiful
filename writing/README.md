# Writing workflow

The live archive is generated static HTML. It currently has no published articles.
All five existing planned topics remain visible under Currently exploring.

## Update topics

Edit the `exploring` array in `writing/articles.json`, then run:

```sh
node writing/build.mjs
```

## Write an article

1. Create `writing/content/your-article.md`.
2. Add its metadata to the `articles` array in `writing/articles.json`.
3. Keep `published` false while drafting.
4. When the article is ready, supply its actual publication date and set `published` to true.
5. Run `node writing/build.mjs` and review the generated page at `/writing/your-article/`.

Draft metadata example, not a published article:

```json
{
  "slug": "your-article",
  "title": "Your article title",
  "description": "A short, specific description.",
  "category": "Developer Tools",
  "published": false
}
```

A published entry requires `date` in `YYYY-MM-DD` format. Missing dates and empty
Markdown fail the build. Do not substitute the build date for a publication date.
Reading time is estimated at 200 words per minute, or you can supply a positive
integer in `readingMinutes`.

Optional categories:

- Software Engineering
- Cybersecurity
- Developer Tools
- Learning Notes
- Reflections

Set `featured: true` on at most one published article. Featured writing appears
separately and is not duplicated in the archive. Category filtering appears only
when the remaining archive contains at least five articles in two or more categories.
With JavaScript disabled, all articles remain visible.

Use `cover: { "src": "/assets/your-image.png", "alt": "Description of the image" }`
for an optional cover and social image. Keep images small and provide meaningful alt text.
Markdown supports headings, paragraphs, lists, links, images, tables, and fenced code.
Use `javascript`, `python`, `bash`, `json`, `css`, or `html` after the opening
code fence for highlighting. Other languages display as escaped plain code.
The page title supplies the H1; start article sections with `##`.
Raw HTML is escaped and unsafe URL schemes are rejected.

## Metadata and publishing

Before domain launch, build normally. Once the real site origin is known:

```sh
node writing/build.mjs --site-url https://your-domain
```

This adds absolute canonical URLs, Open Graph URLs, and cover-image URLs.
No domain, publication dates, or social images are invented when those values are absent.
Commit the generated HTML with the content sources. Static hosts need no Node runtime.

The templates are in `writing/templates/`. Reusable article rendering is in
`writing/components.mjs`; styling is scoped in `writing/writing.css`.
The generator will not overwrite independently authored detail pages. When an
article is unpublished, it removes only its own previously generated HTML.
Draft flags hide content from the archive; they do not make source files private
on a public repository or static host.

## Checks

```sh
node --test tests/*.test.mjs
```

Tests use temporary article fixtures, never live placeholder posts.
For isolated previews, the builder also accepts `--content DIR` and `--out DIR`.
The content directory needs `articles.json` and a `content/` folder.

## Build-time libraries

Marked 15.0.12 parses Markdown. Prism 1.30.0 highlights code during generation.
Both are pinned and vendored in `writing/vendor/`, with their upstream licenses.
They are not loaded in the browser, and building does not require network access.

