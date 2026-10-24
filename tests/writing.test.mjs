import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildWriting } from '../writing/build.mjs';
import { renderArticleCard, renderMarkdown, safeUrl, validateArticle } from '../writing/components.mjs';

const fixtureArticle = overrides => ({
  slug: 'fixture-note', title: 'Fixture note', description: 'Only a test fixture.',
  category: 'Developer Tools', date: '2020-01-02', published: true, ...overrides,
});
async function workspace(t, articles = [], exploring = []) {
  const root = await mkdtemp(join(tmpdir(), 'portfolio-writing-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const contentRoot = join(root, 'source');
  const outputRoot = join(root, 'output');
  await mkdir(join(contentRoot, 'content'), { recursive: true });
  const manifest = { articles, exploring };
  const save = () => writeFile(join(contentRoot, 'articles.json'), JSON.stringify(manifest));
  await save();
  const markdown = (slug, body) => writeFile(join(contentRoot, 'content', slug + '.md'), body);
  return { root, contentRoot, outputRoot, manifest, save, markdown };
}

test('empty writing archive preserves all real planned topics and shows no fake controls', async t => {
  const source = JSON.parse(await readFile(new URL('../writing/articles.json', import.meta.url)));
  const space = await workspace(t, source.articles, source.exploring);
  const result = await buildWriting(space);
  assert.deepEqual(result, { articles: 0, featured: 0, filters: false });
  const html = await readFile(join(space.outputRoot, 'index.html'), 'utf8');
  assert.match(html, /Thoughts, notes, and ideas\./);
  assert.match(html, /Nothing published yet/);
  assert.match(html, /Currently exploring/);
  for (const item of source.exploring) assert(html.includes(item.title));
  assert(!html.includes('id="writing-category"'));
  assert(!html.includes('class="featured-writing"'));
  assert(!html.includes('class="planned-writing"'));
});

test('drafts are not rendered and publication metadata must be deliberate', async t => {
  const space = await workspace(t, [{ published: false, title: 'Unfinished fixture' }]);
  assert.equal((await buildWriting(space)).articles, 0);
  for (const date of [undefined, '2020-02-30', 'not-a-date']) assert.throws(() => validateArticle(fixtureArticle({ date })));
  assert.throws(() => validateArticle(fixtureArticle({ slug: '../outside' })));
  assert.throws(() => validateArticle(fixtureArticle({ category: 'Invented category' })));
  assert.throws(() => validateArticle(fixtureArticle({ readingMinutes: 0 })));
});

test('article card supports factual title, description, category, date, reading time, and route', () => {
  const html = renderArticleCard(fixtureArticle({ readingMinutes: 3, title: 'A < B' }));
  assert.match(html, /A &lt; B/);
  assert.match(html, /Developer Tools/);
  assert.match(html, /datetime="2020-01-02"/);
  assert.match(html, /3 min read/);
  assert.match(html, /href="\/writing\/fixture-note\/"/);
});

test('Markdown renders structure and highlighted code with accessible images', () => {
  const source = '## Decision\n\nA paragraph with [a link](https://example.com), **emphasis**, and `code`.\n\n' +
    '\n~~~javascript\nconst answer = 42;\n~~~\n\n![Test image](/assets/profile-placeholder-tree.png)\n\n## Decision';
  const html = renderMarkdown(source);
  assert.match(html, /<h2 id="decision">/);
  assert.match(html, /<h2 id="decision-2">/);
  assert.match(html, /class="token keyword"/);
  assert.match(html, /<pre tabindex="0">/);
  assert.match(html, /alt="Test image"/);
  assert.match(html, /loading="lazy"/);
  assert.match(html, /<strong>emphasis<\/strong>/);
  assert.match(renderMarkdown('~~~unlisted\n<a>\n~~~'), /&lt;a&gt;/);
});

test('unsafe URLs and raw HTML cannot become executable article content', () => {
  assert.match(renderMarkdown('<script>alert(1)</script>'), /&lt;script&gt;/);
  for (const value of ['javascript:alert(1)', 'data:text/html,test', '//external.test', 'https://example.com/\\path', undefined]) assert.throws(() => safeUrl(value));
  assert.throws(() => renderMarkdown('[bad](javascript:alert(1))'));
  assert.throws(() => renderMarkdown('![](/assets/example.png)'));
  assert.equal(safeUrl('/projects/'), '/projects/');
});

test('published article creates a real static route and useful social metadata', async t => {
  const space = await workspace(t, [fixtureArticle({ cover: { src: '/assets/profile-placeholder-tree.png', alt: 'Tree' } })]);
  await space.markdown('fixture-note', '## Implementation\n\nDocumented test content.');
  await buildWriting({ ...space, siteUrl: 'https://portfolio.example' });
  const html = await readFile(join(space.outputRoot, 'fixture-note/index.html'), 'utf8');
  assert.match(html, /<title>Fixture note · Alex Mutua<\/title>/);
  assert.match(html, /property="og:type" content="article"/);
  assert.match(html, /property="article:published_time" content="2020-01-02"/);
  assert.match(html, /rel="canonical" href="https:\/\/portfolio.example\/writing\/fixture-note\/"/);
  assert.match(html, /property="og:image" content="https:\/\/portfolio.example\/assets\/profile-placeholder-tree.png"/);
  assert.match(html, /<h2 id="implementation">/);
  assert(!html.includes('prism.cjs'));
  assert(!html.includes('marked.mjs'));
});

test('featured area and category controls only appear when real content supports them', async t => {
  const entries = Array.from({ length: 7 }, (_, index) => fixtureArticle({
    slug: 'fixture-' + index, title: 'Fixture ' + index,
    category: index % 2 ? 'Cybersecurity' : 'Learning Notes',
    featured: index === 0,
  }));
  const space = await workspace(t, entries);
  for (const entry of entries) await space.markdown(entry.slug, 'Fixture content, not a public article.');
  assert.deepEqual(await buildWriting(space), { articles: 7, featured: 1, filters: true });
  let html = await readFile(join(space.outputRoot, 'index.html'), 'utf8');
  assert.equal((html.match(/href="\/writing\/fixture-0\/"/g) || []).length, 1);
  assert.match(html, /id="writing-category"/);
  assert.match(html, /<option value="Cybersecurity">/);
  space.manifest.articles = [entries[0]];
  await space.save();
  assert.deepEqual(await buildWriting(space), { articles: 1, featured: 1, filters: false });
  html = await readFile(join(space.outputRoot, 'index.html'), 'utf8');
  assert(!html.includes('id="writing-category"'));
  assert(!html.includes('id="archive-title"'));
  await assert.rejects(access(join(space.outputRoot, 'fixture-1/index.html')));
});

test('generator refuses duplicate slugs, multiple featured articles, and empty posts', async t => {
  const space = await workspace(t, [fixtureArticle()]);
  await space.markdown('fixture-note', '');
  await assert.rejects(buildWriting(space), /empty article/);
  await space.markdown('fixture-note', 'Real test content.');
  space.manifest.articles.push(fixtureArticle());
  await space.save();
  await assert.rejects(buildWriting(space), /Duplicate/);
  space.manifest.articles = [fixtureArticle({ featured: true }), fixtureArticle({ slug: 'other-fixture', featured: true })];
  await space.markdown('other-fixture', 'More test content.');
  await space.save();
  await assert.rejects(buildWriting(space), /at most one/);
});

test('build protects independently authored pages and is deterministic', async t => {
  const space = await workspace(t, [fixtureArticle()]);
  await space.markdown('fixture-note', 'A test paragraph.');
  await mkdir(join(space.outputRoot, 'fixture-note'), { recursive: true });
  await writeFile(join(space.outputRoot, 'fixture-note/index.html'), '<h1>Manually authored</h1>');
  await assert.rejects(buildWriting(space), /independently authored/);
  await rm(join(space.outputRoot, 'fixture-note/index.html'));
  await buildWriting(space);
  const before = await readFile(join(space.outputRoot, 'index.html'), 'utf8');
  await buildWriting(space);
  assert.equal(await readFile(join(space.outputRoot, 'index.html'), 'utf8'), before);
});

