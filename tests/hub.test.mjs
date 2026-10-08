import test from 'node:test';
import assert from 'node:assert/strict';

import { buildJournalIndex, searchJournal } from '../src/lib/journal-index.mjs';
import { getNewsletterState, isMailerLiteReady } from '../src/lib/newsletter-state.mjs';
import { routeManifest } from '../src/lib/routes.mjs';
import { registerWebMCPTools } from '../src/lib/webmcp.mjs';

const entries = [
  {
    slug: 'after-the-bell',
    title: 'After the Bell',
    description: 'Finding purpose after cancer treatment.',
    category: 'Recovery & Resilience',
    publishedAt: '2026-10-01',
  },
  {
    slug: 'the-work-before-sunrise',
    title: 'The Work Before Sunrise',
    description: 'What daily horse care teaches about responsibility.',
    category: 'Ranch Work',
    publishedAt: '2026-09-20',
  },
];

test('journal index sorts newest first and exposes canonical article paths', () => {
  const index = buildJournalIndex(entries);

  assert.deepEqual(index.map(({ slug, href }) => ({ slug, href })), [
    { slug: 'after-the-bell', href: '/journal/after-the-bell/' },
    { slug: 'the-work-before-sunrise', href: '/journal/the-work-before-sunrise/' },
  ]);
});

test('journal search matches title, description, and category without case sensitivity', () => {
  const index = buildJournalIndex(entries);

  assert.deepEqual(searchJournal(index, 'HORSE').map((entry) => entry.slug), ['the-work-before-sunrise']);
  assert.deepEqual(searchJournal(index, 'recovery').map((entry) => entry.slug), ['after-the-bell']);
  assert.deepEqual(searchJournal(index, 'purpose').map((entry) => entry.slug), ['after-the-bell']);
  assert.equal(searchJournal(index, '   ').length, 2);
});

test('newsletter readiness requires an absolute HTTPS MailerLite action', () => {
  assert.equal(isMailerLiteReady(''), false);
  assert.equal(isMailerLiteReady('#'), false);
  assert.equal(isMailerLiteReady('http://example.com/form'), false);
  assert.equal(isMailerLiteReady('https://assets.mailerlite.com/jsonp/example/forms/subscribe'), true);
});

test('newsletter state reports validation, loading, success, and failure messages', () => {
  assert.deepEqual(getNewsletterState('invalid', 'bad-address'), {
    status: 'error',
    message: 'Enter a valid email address.',
  });
  assert.equal(getNewsletterState('loading').status, 'loading');
  assert.equal(getNewsletterState('success').status, 'success');
  assert.equal(getNewsletterState('failure').status, 'error');
});

test('route manifest uses sagespurranch.farm as the canonical origin for every public route', () => {
  assert.equal(routeManifest.home.canonical, 'https://sagespurranch.farm/');
  assert.equal(routeManifest.about.canonical, 'https://sagespurranch.farm/about/');
  assert.equal(routeManifest.programs.canonical, 'https://sagespurranch.farm/programs/');
  assert.equal(routeManifest.events.canonical, 'https://sagespurranch.farm/events/');
  assert.equal(routeManifest.journal.canonical, 'https://sagespurranch.farm/journal/');
  assert.equal(routeManifest.contact.canonical, 'https://sagespurranch.farm/contact/');
});

test('WebMCP tools expose search, navigation, and signup-start behavior with cleanup', async () => {
  const registered = new Map();
  const signals = [];
  const visibleState = { query: '', navigatedTo: '', signupStarted: false };
  const documentLike = {
    modelContext: {
      async registerTool(tool, options) {
        registered.set(tool.name, tool);
        signals.push(options.signal);
      },
    },
  };

  const cleanup = await registerWebMCPTools({
    documentLike,
    journalEntries: buildJournalIndex(entries),
    onSearch(query) { visibleState.query = query; },
    onNavigate(href) { visibleState.navigatedTo = href; },
    onStartSignup() { visibleState.signupStarted = true; },
  });

  assert.deepEqual([...registered.keys()], ['search_journal', 'open_story', 'start_founding_signup']);

  const searchResult = await registered.get('search_journal').execute({ query: 'ranch' });
  assert.equal(visibleState.query, 'ranch');
  assert.deepEqual(searchResult.matches.map((entry) => entry.slug), ['the-work-before-sunrise']);

  const navigationResult = await registered.get('open_story').execute({ slug: 'after-the-bell' });
  assert.equal(visibleState.navigatedTo, '/journal/after-the-bell/');
  assert.deepEqual(navigationResult, { href: '/journal/after-the-bell/', status: 'navigated' });

  assert.deepEqual(await registered.get('start_founding_signup').execute({}), { status: 'ready' });
  assert.equal(visibleState.signupStarted, true);

  cleanup();
  assert.equal(signals.every((signal) => signal.aborted), true);
});
