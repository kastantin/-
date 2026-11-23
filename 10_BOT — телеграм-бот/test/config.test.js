import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/config.js';

const FAKE_TOKEN = '123456:' + 'A'.repeat(35);

test('без токена — понятная ошибка', () => {
  assert.throws(() => loadConfig({}), /BOT_TOKEN/);
});

test('значения по умолчанию', () => {
  const config = loadConfig({ BOT_TOKEN: FAKE_TOKEN });
  assert.equal(config.channelUsername, 'obshchepit_yama');
  assert.equal(config.currentEpisode, 1);
  assert.equal(config.adminId, null);
});

test('ADMIN_ID и канал с @ читаются', () => {
  const config = loadConfig({ BOT_TOKEN: FAKE_TOKEN, ADMIN_ID: '42', CHANNEL_USERNAME: '@obshchepit_yama' });
  assert.equal(config.adminId, 42);
  assert.equal(config.channelUsername, 'obshchepit_yama');
});

test('кривой ADMIN_ID — ошибка', () => {
  assert.throws(() => loadConfig({ BOT_TOKEN: FAKE_TOKEN, ADMIN_ID: 'abc' }), /ADMIN_ID/);
});
