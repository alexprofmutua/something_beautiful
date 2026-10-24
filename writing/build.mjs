import { readFile, writeFile, mkdir, unlink } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CATEGORIES, FILTER_THRESHOLD, escapeHtml, validateArticle, articleByline, renderArticleCard, renderMarkdown, renderMetadata } from './components.mjs';

const writingRoot = dirname(fileURLToPath(import.meta.url));
const generatedMarker = '<!-- Generated from Markdown by writing/build.mjs. -->';
const validSlug = value => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
function template(source, values) {
  return source.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
    if (!(key in values)) throw new Error('Missing template value: ' + key);
    return values[key];
  });
}
async function optionalRead(path) {
  try { return await readFile(path, 'utf8'); }
  catch (error) { if (error.code === 'ENOENT') return ''; throw error; }
}

export async function buildWriting({ contentRoot = writingRoot, outputRoot = writingRoot, siteUrl = '' } = {}) {
  const manifest = JSON.parse(await readFile(join(contentRoot, 'articles.json'), 'utf8'));
  if (!Array.isArray(manifest.articles) || !Array.isArray(manifest.exploring)) throw new Error('articles.json needs articles and exploring arrays.');
  const articles = [];
  const slugs = new Set();
  for (const entry of manifest.articles) {
    if (entry.published !== undefined && typeof entry.published !== 'boolean') throw new Error('published must be true or false.');
    if (entry.published !== true) continue;
    validateArticle(entry);
    if (slugs.has(entry.slug)) throw new Error('Duplicate article slug: ' + entry.slug);
    slugs.add(entry.slug);
    const markdown = await readFile(join(contentRoot, 'content', entry.slug + '.md'), 'utf8');
    if (!markdown.trim()) throw new Error(entry.slug + ': cannot publish an empty article.');
    articles.push({ ...entry, readingMinutes: entry.readingMinutes ?? Math.max(1, Math.ceil(markdown.trim().split(/\s+/).length / 200)), content: renderMarkdown(markdown) });
  }
  articles.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
  const featured = articles.filter(article => article.featured === true);
  if (featured.length > 1) throw new Error('Choose at most one featured article.');
  const archive = articles.filter(article => !article.featured);
  const categories = CATEGORIES.filter(category => archive.some(article => article.category === category));
  const useFilters = archive.length >= FILTER_THRESHOLD && categories.length >= 2;
  const layout = await readFile(join(writingRoot, 'templates/layout.html'), 'utf8');
  const indexTemplate = await readFile(join(writingRoot, 'templates/index.html'), 'utf8');
  const articleTemplate = await readFile(join(writingRoot, 'templates/article.html'), 'utf8');
  const exploring = manifest.exploring.map(item => {
    if (typeof item.title !== 'string' || !item.title.trim() || typeof item.status !== 'string' || !item.status.trim()) throw new Error('Exploring topics need a title and status.');
    return '<li><span>' + escapeHtml(item.title) + '</span><span class="exploring-status">' + escapeHtml(item.status) + '</span></li>';
  }).join('\n      ');
  const filters = useFilters ? '<div class="writing-filters" hidden><label for="writing-category">Category</label><select id="writing-category"><option value="">All articles</option>' +
    categories.map(category => '<option value="' + escapeHtml(category) + '">' + escapeHtml(category) + '</option>').join('') +
    '</select><p id="writing-count" role="status" aria-live="polite">' + archive.length + ' articles</p></div>' : '';
  const archiveContent = articles.length === 0 ?
    '<div class="writing-empty"><h2 id="archive-title">Nothing published yet.</h2><p>I’ll share my notes here when they’re ready.</p></div>' :
    '<h2 id="archive-title">' + (featured.length ? 'More writing' : 'All writing') + '</h2>' + filters +
    '<div id="article-list">' + archive.map(article => renderArticleCard(article)).join('\n') + '</div>';
  const archiveHtml = articles.length && !archive.length ? '' : '<section class="writing-archive" aria-labelledby="archive-title">' + archiveContent + '</section>';
  const featuredHtml = featured.length ? '<section class="featured-writing" aria-labelledby="featured-title"><h2 id="featured-title">Featured</h2>' + renderArticleCard(featured[0], { featured: true }) + '</section>' : '';
  const main = template(indexTemplate, { FEATURED: featuredHtml, ARCHIVE: archiveHtml, EXPLORING: exploring });
  const pages = new Map([['index.html', template(layout, {
    TITLE: 'Writing · Alex Mutua',
    META: renderMetadata({ title: 'Writing · Alex Mutua', description: 'Technical articles, development notes, lessons learned, and personal reflections by Alex Mutua.', path: '/writing/', siteUrl }),
    SCRIPT: useFilters ? '<script src="/writing/filter.js" defer></script>' : '',
    MAIN: main,
  })]]);
  for (const article of articles) {
    const cover = article.cover ? '<figure class="article-cover"><img src="' + escapeHtml(article.cover.src) + '" alt="' + escapeHtml(article.cover.alt) + '" decoding="async"></figure>' : '';
    const main = template(articleTemplate, {
      BYLINE: articleByline(article), ARTICLE_TITLE: escapeHtml(article.title),
      DESCRIPTION: escapeHtml(article.description), COVER: cover, CONTENT: article.content,
    });
    const path = article.slug + '/index.html';
    const existing = await optionalRead(join(outputRoot, path));
    if (existing && !existing.includes(generatedMarker)) throw new Error('Refusing to overwrite an independently authored page: ' + path);
    pages.set(path, template(layout, {
      TITLE: escapeHtml(article.title + ' · Alex Mutua'),
      META: renderMetadata({ title: article.title, description: article.description, path: '/writing/' + article.slug + '/', siteUrl, article }),
      SCRIPT: '', MAIN: main,
    }));
  }
  const previous = JSON.parse(await optionalRead(join(outputRoot, '.generated.json')) || '[]');
  if (!Array.isArray(previous)) throw new Error('Invalid generated article inventory.');
  for (const [path, html] of pages) {
    await mkdir(dirname(join(outputRoot, path)), { recursive: true });
    await writeFile(join(outputRoot, path), html);
  }
  // Unpublishing only removes pages previously owned by this generator.
  for (const slug of previous) {
    if (!validSlug(slug) || slugs.has(slug)) continue;
    const path = join(outputRoot, slug, 'index.html');
    if ((await optionalRead(path)).includes(generatedMarker)) await unlink(path);
  }
  await writeFile(join(outputRoot, '.generated.json'), JSON.stringify([...slugs], null, 2) + '\n');
  return { articles: articles.length, featured: featured.length, filters: useFilters };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    const options = {};
    for (let i = 0; i < args.length; i += 2) {
      const key = { '--content': 'contentRoot', '--out': 'outputRoot', '--site-url': 'siteUrl' }[args[i]];
      if (!key || !args[i + 1]) throw new Error('Usage: node writing/build.mjs [--content DIR] [--out DIR] [--site-url https://your-domain]');
      options[key] = key === 'siteUrl' ? args[i + 1] : resolve(args[i + 1]);
    }
    console.log('Writing:', await buildWriting(options));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

