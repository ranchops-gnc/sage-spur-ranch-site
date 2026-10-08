import test from 'node:test';
import assert from 'node:assert/strict';

import { journalEntries, publicSiteCopy } from '../src/lib/site-content.mjs';

const approvedCategories = new Set([
  'Ranch Work',
  'Recovery & Resilience',
  'Cowboy Life',
  'Chosen Family',
]);

test('journal content has unique slugs, approved categories, and publication metadata', () => {
  assert.ok(journalEntries.length >= 4);
  assert.equal(new Set(journalEntries.map((entry) => entry.slug)).size, journalEntries.length);

  for (const entry of journalEntries) {
    assert.equal(approvedCategories.has(entry.category), true);
    assert.match(entry.publishedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(entry.title.length > 5);
    assert.ok(entry.description.length > 20);
  }
});

test('public copy stays interest-led and excludes private deal language', () => {
  const serialized = JSON.stringify({ journalEntries, publicSiteCopy }).toLowerCase();

  for (const prohibited of ['letter of intent', 'valuation', 'projected revenue', 'investment return']) {
    assert.equal(serialized.includes(prohibited), false, `public copy contains ${prohibited}`);
  }

  assert.match(publicSiteCopy.community, /interest list/i);
  assert.doesNotMatch(publicSiteCopy.community, /subscribe(d|r)?/i);
});
