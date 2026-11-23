import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { csvEscape, saveIdea, readLastIdeas } from '../src/ideas.js';

const idea = (text, n = 1) => ({
  date: '2026-11-18T18:00:00.000Z', episode: 2, userId: n, username: 'anya', name: 'Аня', text,
});

test('csvEscape экранирует ; кавычки и переносы', () => {
  assert.equal(csvEscape('просто'), 'просто');
  assert.equal(csvEscape('а;б'), '"а;б"');
  assert.equal(csvEscape('он сказал "нет"'), '"он сказал ""нет"""');
  assert.equal(csvEscape('строка1\nстрока2'), '"строка1\nстрока2"');
});

test('csvEscape не даёт идее стать формулой в Excel', () => {
  assert.equal(csvEscape('=HYPERLINK("x")'), '"\'=HYPERLINK(""x"")"');
  assert.equal(csvEscape('+7 999'), "'+7 999");
});

test('saveIdea пишет jsonl и csv с заголовком один раз', async (t) => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'skatert-bot-'));
  t.after(() => rm(dir, { recursive: true, force: true }));

  await saveIdea(dir, idea('первая', 1));
  await saveIdea(dir, idea('вторая', 2));

  const csv = await readFile(path.join(dir, 'ideas.csv'), 'utf8');
  assert.ok(csv.startsWith('﻿Дата;Серия'));
  assert.equal(csv.match(/Дата;Серия/g).length, 1);

  const last = await readLastIdeas(dir, 1);
  assert.deepEqual(last.map((i) => i.text), ['вторая']);
});

test('readLastIdeas без файла возвращает пустой список', async (t) => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'skatert-bot-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  assert.deepEqual(await readLastIdeas(dir, 10), []);
});
