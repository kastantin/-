import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleUpdate, parseCommand, MAX_IDEA_LENGTH } from '../src/handlers.js';

const config = Object.freeze({
  channelUsername: 'obshchepit_yama',
  tiktokUrl: 'https://www.tiktok.com/@vyzhivi_v_obshepite',
  currentEpisode: 1,
  adminId: 42,
});

function makeCtx(overrides = {}) {
  return { config, botUsername: 'kostya_oficiant_bot', now: 0, canSubmitIdea: () => true, ...overrides };
}

function privateMessage(text, from = { id: 7, first_name: 'Аня', username: 'anya' }) {
  return { update_id: 1, message: { chat: { id: from.id, type: 'private' }, from, text } };
}

test('/start в личке присылает приветствие с кнопкой канала', () => {
  const { actions } = handleUpdate(privateMessage('/start'), makeCtx());
  assert.equal(actions.length, 1);
  assert.match(actions[0].params.text, /Аня/);
  const urls = actions[0].params.reply_markup.inline_keyboard.flat().map((b) => b.url);
  assert.ok(urls.includes('https://t.me/obshchepit_yama'));
});

test('/start idea просит написать идею', () => {
  const { actions } = handleUpdate(privateMessage('/start idea'), makeCtx());
  assert.match(actions[0].params.text, /Пиши идею/);
});

test('обычный текст в личке сохраняется как идея к следующей серии', () => {
  const { idea, actions } = handleUpdate(privateMessage('Пусть Костя споёт гостю'), makeCtx());
  assert.equal(idea.text, 'Пусть Костя споёт гостю');
  assert.equal(idea.episode, 2);
  assert.equal(idea.username, 'anya');
  assert.match(actions[0].params.text, /серии 2/);
});

test('слишком длинная идея не сохраняется', () => {
  const { idea, actions } = handleUpdate(privateMessage('а'.repeat(MAX_IDEA_LENGTH + 1)), makeCtx());
  assert.equal(idea, null);
  assert.match(actions[0].params.text, /длинновата/);
});

test('идея во время паузы не сохраняется', () => {
  const { idea, actions } = handleUpdate(privateMessage('Ещё идея'), makeCtx({ canSubmitIdea: () => false }));
  assert.equal(idea, null);
  assert.match(actions[0].params.text, /Не так быстро/);
});

test('стикер без текста — просьба написать словами', () => {
  const update = { update_id: 1, message: { chat: { id: 7, type: 'private' }, from: { id: 7, first_name: 'Аня' } } };
  const { idea, actions } = handleUpdate(update, makeCtx());
  assert.equal(idea, null);
  assert.match(actions[0].params.text, /только текст/);
});

test('новый участник группы получает приветствие с экранированным именем', () => {
  const update = {
    update_id: 2,
    message: {
      chat: { id: -100, type: 'supergroup' },
      new_chat_members: [{ id: 9, first_name: '<b>Хакер</b>', is_bot: false }],
    },
  };
  const { actions } = handleUpdate(update, makeCtx());
  assert.equal(actions.length, 1);
  assert.match(actions[0].params.text, /&lt;b&gt;Хакер&lt;\/b&gt;/);
  const urls = actions[0].params.reply_markup.inline_keyboard.flat().map((b) => b.url);
  assert.ok(urls.includes('https://t.me/kostya_oficiant_bot?start=idea'));
});

test('ботов в группе не приветствуем', () => {
  const update = {
    update_id: 3,
    message: { chat: { id: -100, type: 'supergroup' }, new_chat_members: [{ id: 1, first_name: 'Bot', is_bot: true }] },
  };
  assert.equal(handleUpdate(update, makeCtx()).actions.length, 0);
});

test('обычные сообщения в группе бот игнорирует', () => {
  const update = { update_id: 4, message: { chat: { id: -100, type: 'supergroup' }, from: { id: 7 }, text: 'привет' } };
  const res = handleUpdate(update, makeCtx());
  assert.equal(res.actions.length, 0);
  assert.equal(res.idea, null);
});

test('/ideas доступна только админу', () => {
  const stranger = handleUpdate(privateMessage('/ideas'), makeCtx());
  assert.equal(stranger.listIdeasFor, null);
  assert.match(stranger.actions[0].params.text, /только для автора/);

  const admin = handleUpdate(privateMessage('/ideas', { id: 42, first_name: 'Автор' }), makeCtx());
  assert.equal(admin.listIdeasFor, 42);
});

test('/id показывает Telegram ID', () => {
  const { actions } = handleUpdate(privateMessage('/id'), makeCtx());
  assert.match(actions[0].params.text, /<code>7<\/code>/);
});

test('parseCommand понимает команду с именем бота и параметром', () => {
  assert.deepEqual(parseCommand('/start@kostya_oficiant_bot idea'), { name: 'start', payload: 'idea' });
  assert.equal(parseCommand('просто текст'), null);
});
