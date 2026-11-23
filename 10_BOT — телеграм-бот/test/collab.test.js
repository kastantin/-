import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleUpdate, COLLAB_TIMEOUT_MS, MAX_COLLAB_ANSWER } from '../src/handlers.js';

const config = Object.freeze({
  channelUsername: 'obshchepit_yama',
  tiktokUrl: 'https://www.tiktok.com/@vyzhivi_v_obshepite',
  currentEpisode: 1,
  adminId: 42,
});

const from = { id: 7, first_name: 'Аня', username: 'brand_anya' };
const msg = (text) => ({ update_id: 1, message: { chat: { id: 7, type: 'private' }, from, text } });

// Прогоняет диалог, перенося сессию между сообщениями, как это делает index.js.
function talk(texts, overrides = {}) {
  let session = null;
  const results = texts.map((text) => {
    const res = handleUpdate(msg(text), {
      config, botUsername: 'kostya_oficiant_bot', now: 1000, canSubmitIdea: () => true,
      collabSession: session, ...overrides,
    });
    if (res.collabSession !== undefined) session = res.collabSession;
    return res;
  });
  return { results, session };
}

test('/collab проходит 4 вопроса и пересылает заявку владельцу', () => {
  const { results, session } = talk(['/collab', 'Кофейня «Зерно»', 'Костя пьёт наш кофе в серии', '10 000 ₽', '@zerno_coffee']);

  assert.match(results[0].actions[0].params.text, /1\/4/);
  assert.match(results[1].actions[0].params.text, /2\/4/);
  assert.match(results[3].actions[0].params.text, /4\/4/);

  const last = results[4];
  assert.equal(last.collab.brand, 'Кофейня «Зерно»');
  assert.equal(last.collab.contact, '@zerno_coffee');
  assert.equal(last.notifyAdmin.params.chat_id, 42);
  assert.match(last.notifyAdmin.params.text, /Новая заявка/);
  assert.match(last.actions[0].params.text, /Заявка передана/);
  assert.equal(session, null);
});

test('ответы в заявке не считаются идеями', () => {
  const { results } = talk(['/collab', 'Бренд']);
  assert.equal(results[1].idea, null);
});

test('кнопка из меню (/start collab) тоже начинает заявку', () => {
  const { results } = talk(['/start collab']);
  assert.match(results[0].actions[0].params.text, /Сотрудничество/);
});

test('/cancel отменяет заявку, после неё текст снова идея', () => {
  const { results, session } = talk(['/collab', 'Бренд', '/cancel', 'Пусть Костя споёт']);
  assert.match(results[2].actions[0].params.text, /отменена/);
  assert.equal(session, null);
  assert.equal(results[3].idea.text, 'Пусть Костя споёт');
});

test('без ADMIN_ID заявки не принимаются', () => {
  const { results, session } = talk(['/collab'], { config: { ...config, adminId: null } });
  assert.match(results[0].actions[0].params.text, /не настроен/);
  assert.equal(session, null);
});

test('слишком длинный ответ не принимается, шаг не меняется', () => {
  const { results, session } = talk(['/collab', 'б'.repeat(MAX_COLLAB_ANSWER + 1)]);
  assert.match(results[1].actions[0].params.text, /Слишком длинно/);
  assert.equal(session.step, 0);
});

test('HTML в ответах экранируется в сообщении владельцу', () => {
  const { results } = talk(['/collab', '<b>Бренд</b>', 'x', 'y', 'z']);
  assert.match(results[4].notifyAdmin.params.text, /&lt;b&gt;Бренд&lt;\/b&gt;/);
});

test('заявка старше 30 минут сбрасывается', () => {
  const stale = Object.freeze({ step: 2, answers: Object.freeze({ brand: 'a', offer: 'b' }), startedAt: 0 });
  const res = handleUpdate(msg('Просто идея'), {
    config, botUsername: 'kostya_oficiant_bot', now: COLLAB_TIMEOUT_MS + 1,
    canSubmitIdea: () => true, collabSession: stale,
  });
  assert.equal(res.collabSession, null);
  assert.equal(res.idea.text, 'Просто идея');
});

test('в /start есть кнопка «Сотрудничество»', () => {
  const { results } = talk(['/start']);
  const buttons = results[0].actions[0].params.reply_markup.inline_keyboard.flat();
  const collab = buttons.find((b) => b.text.includes('Сотрудничество'));
  assert.equal(collab.url, 'https://t.me/kostya_oficiant_bot?start=collab');
});
