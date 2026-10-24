import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const source = await readFile(new URL('../contact/contact.js', import.meta.url), 'utf8');
function setup(clipboard) {
  const attributes = new Map();
  let click;
  const button = {
    hidden: true, disabled: false, dataset: {},
    addEventListener(type, handler) { if (type === 'click') click = handler; },
    setAttribute(name, value) { attributes.set(name, value); },
    removeAttribute(name) { attributes.delete(name); },
  };
  const address = { textContent: 'amm22@williams.edu' };
  const feedback = { textContent: '' };
  const elements = { 'copy-email': button, 'contact-email-address': address, 'copy-email-status': feedback };
  runInNewContext(source, { document: { getElementById: id => elements[id] }, navigator: { clipboard } });
  return { button, feedback, attributes, click: () => click() };
}

test('copy email writes the actual address and gives accessible success feedback', async () => {
  let copied;
  let finish;
  const state = setup({ writeText: text => {
    copied = text;
    return new Promise(resolve => { finish = resolve; });
  } });
  assert.equal(state.button.hidden, false);
  const pending = state.click();
  assert.equal(state.button.disabled, true);
  assert.equal(state.attributes.get('aria-busy'), 'true');
  finish();
  await pending;
  assert.equal(copied, 'amm22@williams.edu');
  assert.match(state.feedback.textContent, /Email copied: amm22@williams.edu/);
  assert.equal(state.button.dataset.copied, 'true');
  assert.equal(state.button.disabled, false);
  assert.equal(state.attributes.has('aria-busy'), false);
});

test('clipboard denial does not announce a false success', async () => {
  const state = setup({ writeText: async () => { throw new Error('Not allowed'); } });
  state.button.dataset.copied = 'true';
  await state.click();
  assert.match(state.feedback.textContent, /Couldn't copy/);
  assert.equal(state.button.dataset.copied, undefined);
  assert.equal(state.button.disabled, false);
  assert.equal(state.attributes.has('aria-busy'), false);
});

test('unavailable clipboard retains a manual-copy path', async () => {
  const state = setup(undefined);
  await state.click();
  assert.match(state.feedback.textContent, /select and copy the email address/);
  assert.equal(state.button.disabled, false);
});

test('Contact preserves the actual email and profile destinations without a form', async () => {
  const html = await readFile(new URL('../contact/index.html', import.meta.url), 'utf8');
  assert(html.includes("I'm always interested in connecting with people working on interesting software, exchanging ideas, and exploring new opportunities."));
  assert.match(html, /href="mailto:amm22@williams.edu"/);
  assert.match(html, /id="copy-email-status"[^>]*role="status"[^>]*aria-live="polite"/);
  for (const href of ['https://github.com/alexprofmutua', 'https://www.linkedin.com/in/alex-m-343952389/', 'https://leetcode.com/u/Alex_Prof/']) {
    assert(html.includes('href="' + href + '" target="_blank" rel="noopener noreferrer"'));
  }
  assert(!html.includes('<form'));
});

