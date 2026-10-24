import { createRequire } from 'node:module';
import { Marked } from './vendor/marked.mjs';

const require = createRequire(import.meta.url);
const Prism = require('./vendor/prism.cjs');
require('./vendor/prism-python.cjs');
require('./vendor/prism-bash.cjs');
require('./vendor/prism-json.cjs');

export const CATEGORIES = ['Software Engineering', 'Cybersecurity', 'Developer Tools', 'Learning Notes', 'Reflections'];
export const FILTER_THRESHOLD = 5;
export const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);

export function safeUrl(value, image = false) {
  if (typeof value !== 'string') throw new Error('URLs must be strings.');
  const href = String(value).trim();
  if (!href || /[\u0000-\u0020\u007f\\]/.test(href) || href.startsWith('//')) throw new Error('Unsafe or empty URL: ' + value);
  const url = new URL(href, 'https://portfolio.invalid/');
  if (!(image ? ['https:', 'http:'] : ['https:', 'http:', 'mailto:']).includes(url.protocol)) throw new Error('Unsupported URL scheme: ' + value);
  return href;
}

export function validateArticle(article) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug || '')) throw new Error('Articles need a lowercase, hyphenated slug.');
  for (const key of ['title', 'description']) {
    if (typeof article[key] !== 'string' || !article[key].trim()) throw new Error(article.slug + ': missing ' + key);
  }
  const date = article.date;
  const parsed = new Date(date + 'T00:00:00Z');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '') || !Number.isFinite(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new Error(article.slug + ': supply the actual publication date as YYYY-MM-DD.');
  }
  if (article.category && !CATEGORIES.includes(article.category)) throw new Error(article.slug + ': unknown category.');
  if (article.readingMinutes !== undefined && (!Number.isInteger(article.readingMinutes) || article.readingMinutes < 1)) throw new Error(article.slug + ': invalid reading time.');
  if (article.featured !== undefined && typeof article.featured !== 'boolean') throw new Error(article.slug + ': featured must be true or false.');
  if (article.cover) {
    safeUrl(article.cover.src, true);
    if (!article.cover.alt?.trim()) throw new Error(article.slug + ': cover images need descriptive alt text.');
  }
}

export function articleByline(article) {
  const date = new Date(article.date + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
  return '<p class="article-byline">' +
    [article.category ? '<span>' + escapeHtml(article.category) + '</span>' : '',
      '<time datetime="' + article.date + '">' + date + '</time>',
      '<span>' + article.readingMinutes + ' min read</span>'].filter(Boolean).join('<span aria-hidden="true"> · </span>') + '</p>';
}

export function renderArticleCard(article, { featured = false } = {}) {
  return '<article class="writing-entry' + (featured ? ' writing-entry--featured' : '') + '" data-category="' + escapeHtml(article.category || '') + '">' +
    articleByline(article) +
    '<h3><a href="/writing/' + article.slug + '/">' + escapeHtml(article.title) + '<span aria-hidden="true"> ↗</span></a></h3>' +
    '<p class="writing-description">' + escapeHtml(article.description) + '</p></article>';
}

export function renderMarkdown(source) {
  const ids = new Map();
  const markdown = new Marked({
    gfm: true,
    renderer: {
      html({ text }) { return escapeHtml(text); },
      heading({ tokens, depth, text }) {
        const level = Math.max(2, depth);
        const base = text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'section';
        const count = (ids.get(base) || 0) + 1;
        ids.set(base, count);
        return '<h' + level + ' id="' + escapeHtml(base + (count > 1 ? '-' + count : '')) + '">' + this.parser.parseInline(tokens) + '</h' + level + '>\n';
      },
      code({ text, lang }) {
        const requested = (lang || '').split(/\s/)[0].toLowerCase();
        const language = ({ js: 'javascript', html: 'markup', xml: 'markup', sh: 'bash', shell: 'bash', py: 'python', txt: 'plain', text: 'plain' })[requested] || requested || 'plain';
        const grammar = Object.hasOwn(Prism.languages, language) ? Prism.languages[language] : undefined;
        const content = grammar && typeof grammar === 'object' ? Prism.highlight(text, grammar, language) : escapeHtml(text);
        return '<pre tabindex="0"><code class="language-' + escapeHtml(language) + '">' + content + '</code></pre>\n';
      },
      link({ href, title, tokens }) {
        const link = safeUrl(href);
        return '<a href="' + escapeHtml(link) + '"' + (title ? ' title="' + escapeHtml(title) + '"' : '') + '>' + this.parser.parseInline(tokens) + '</a>';
      },
      image({ href, title, text }) {
        const src = safeUrl(href, true);
        if (!text?.trim()) throw new Error('Article images need descriptive alt text.');
        return '<img src="' + escapeHtml(src) + '" alt="' + escapeHtml(text) + '"' + (title ? ' title="' + escapeHtml(title) + '"' : '') + ' loading="lazy" decoding="async">';
      },
    },
  });
  return markdown.parse(source);
}

export function renderMetadata({ title, description, path, siteUrl = '', article }) {
  const tags = [
    '<meta name="description" content="' + escapeHtml(description) + '">',
    '<meta name="author" content="Alex Mutua">',
    '<meta property="og:title" content="' + escapeHtml(title) + '">',
    '<meta property="og:description" content="' + escapeHtml(description) + '">',
    '<meta property="og:type" content="' + (article ? 'article' : 'website') + '">',
  ];
  if (article) tags.push('<meta property="article:published_time" content="' + article.date + '">');
  if (siteUrl) {
    const origin = new URL(siteUrl);
    if (!['http:', 'https:'].includes(origin.protocol) || origin.pathname !== '/' || origin.search || origin.hash) throw new Error('Site URL must be an HTTP(S) origin.');
    const url = new URL(path, origin).href;
    tags.push('<link rel="canonical" href="' + escapeHtml(url) + '">', '<meta property="og:url" content="' + escapeHtml(url) + '">');
    if (article?.cover) tags.push('<meta property="og:image" content="' + escapeHtml(new URL(article.cover.src, origin).href) + '">', '<meta property="og:image:alt" content="' + escapeHtml(article.cover.alt) + '">');
  }
  tags.push('<meta name="twitter:card" content="' + (siteUrl && article?.cover ? 'summary_large_image' : 'summary') + '">');
  return tags.join('\n  ');
}

