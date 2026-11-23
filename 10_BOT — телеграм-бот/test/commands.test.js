import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PUBLIC_COMMANDS, ADMIN_COMMANDS, menuRequests } from '../src/commands.js';

test('команды в формате Telegram: латиница в нижнем регистре, описание до 256 символов', () => {
  for (const { command, description } of ADMIN_COMMANDS) {
    assert.match(command, /^[a-z0-9_]{1,32}$/);
    assert.ok(description.length >= 1 && description.length <= 256);
  }
});

test('служебных команд нет в общем меню', () => {
  const names = PUBLIC_COMMANDS.map((c) => c.command);
  assert.ok(!names.includes('ideas'));
  assert.ok(!names.includes('id'));
});

test('без ADMIN_ID ставится только общее меню и кнопка', () => {
  const requests = menuRequests(null);
  assert.equal(requests.length, 2);
  assert.deepEqual(requests[1].params, { menu_button: { type: 'commands' } });
});

test('с ADMIN_ID владелец получает своё меню', () => {
  const adminMenu = menuRequests(42).at(-1);
  assert.deepEqual(adminMenu.params.scope, { type: 'chat', chat_id: 42 });
  assert.ok(adminMenu.params.commands.some((c) => c.command === 'ideas'));
});
