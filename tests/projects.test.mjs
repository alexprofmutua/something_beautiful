import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('MultiDock listing preserves existing projects and links to its detail route', () => {
  const listing = read('projects/index.html');
  const ids = [...listing.matchAll(/<article class="project-window" id="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(ids, ['neatify', 'where-is-this-williams', 'colorbash', 'go-search', 'multidock']);
  const entry = listing.slice(listing.indexOf('<article class="project-window" id="multidock"'));
  assert.match(entry, /href="\/projects\/multidock\/"/);
  assert.match(entry, /https:\/\/github.com\/alexprofmutua\/MultiDock/);
  assert.match(entry, /Swift 6 · AppKit · SwiftUI · macOS/);
});

test('MultiDock detail includes three intact PNGs and existing shared design', () => {
  const detail = read('projects/multidock/index.html');
  assert.match(detail, /href="\/projects\/#multidock"/);
  for (const stylesheet of ['portfolio.css', 'site-pages.css', 'projects.css']) {
    assert.ok(detail.includes(`/${stylesheet}?`));
  }
  const screenshots = [...detail.matchAll(/<img src="(\/assets\/multidock-[^"]+)" alt="([^"]+)"/g)];
  assert.equal(screenshots.length, 3);
  for (const [, path, alt] of screenshots) {
    assert.ok(alt.length > 30);
    const png = readFileSync(new URL(`..${path}`, import.meta.url));
    assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.equal(png.readUInt32BE(16), 1556);
    assert.equal(png.readUInt32BE(20), 1011);
  }
  const externalLinks = [...detail.matchAll(/<a [^>]*href="https:[^"]+"[^>]*>/g)];
  for (const [link] of externalLinks) {
    assert.match(link, /target="_blank"/);
    assert.match(link, /rel="[^"\n]*noopener[^"\n]*noreferrer/);
  }
});
