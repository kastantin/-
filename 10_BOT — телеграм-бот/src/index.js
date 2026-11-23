// Запуск: npm start (в папке бота). Остановка: Ctrl+C.
import { setTimeout as sleep } from 'node:timers/promises';
import { loadConfig } from './config.js';
import { createApi, POLL_TIMEOUT_S } from './telegram.js';
import { handleUpdate, errorReply, ideasReply } from './handlers.js';
import { saveIdea, saveCollab, readLastIdeas } from './ideas.js';
import { menuRequests } from './commands.js';

const IDEA_COOLDOWN_MS = 60_000;
const IDEAS_LIST_LIMIT = 10;
const RETRY_DELAY_MS = 5_000;

const log = {
  info: (...args) => console.info(new Date().toISOString(), ...args),
  error: (...args) => console.error(new Date().toISOString(), 'ОШИБКА', ...args),
};

async function runActions(api, actions) {
  for (const { method, params } of actions) {
    await api(method, params);
  }
}

function applySession(collabSessions, userId, collabSession) {
  if (userId === undefined || collabSession === undefined) return;
  if (collabSession === null) collabSessions.delete(userId);
  else collabSessions.set(userId, collabSession);
}

async function deliverCollab(api, config, collab, notifyAdmin) {
  await saveCollab(config.dataDir, collab);
  log.info(`Новая заявка на сотрудничество от ${collab.username ? '@' + collab.username : collab.userId}`);
  try {
    await api(notifyAdmin.method, notifyAdmin.params);
  } catch (err) {
    // Заявка уже в data/collabs.jsonl — не теряется. Частая причина: владелец не нажал /start у бота.
    log.error('Не удалось переслать заявку владельцу (она сохранена в collabs.jsonl):', err.message);
  }
}

async function processUpdate(update, { api, config, botUsername, lastIdeaAt, collabSessions }) {
  const now = Date.now();
  const userId = update.message?.from?.id;
  const ctx = {
    config,
    botUsername,
    now,
    canSubmitIdea: (id) => now - (lastIdeaAt.get(id) ?? 0) >= IDEA_COOLDOWN_MS,
    collabSession: userId === undefined ? null : collabSessions.get(userId) ?? null,
  };
  const { actions, idea, listIdeasFor, collab, notifyAdmin, collabSession } = handleUpdate(update, ctx);
  applySession(collabSessions, userId, collabSession);

  if (collab) {
    try {
      await deliverCollab(api, config, collab, notifyAdmin);
    } catch (err) {
      log.error('Не удалось сохранить заявку:', err.message);
      const reply = errorReply(update.message.chat.id);
      await api(reply.method, reply.params);
      return;
    }
  }

  if (idea) {
    try {
      await saveIdea(config.dataDir, idea);
      lastIdeaAt.set(idea.userId, now);
      log.info(`Новая идея от ${idea.username ? '@' + idea.username : idea.userId}`);
    } catch (err) {
      log.error('Не удалось сохранить идею:', err.message);
      const reply = errorReply(update.message.chat.id);
      await api(reply.method, reply.params);
      return;
    }
  }

  if (listIdeasFor !== null) {
    const ideas = await readLastIdeas(config.dataDir, IDEAS_LIST_LIMIT, (_line, err) =>
      log.error('Битая строка в ideas.jsonl пропущена:', err.message));
    const reply = ideasReply(listIdeasFor, ideas);
    await api(reply.method, reply.params);
  }

  await runActions(api, actions);
}

async function pollForever(state) {
  let offset = 0;
  for (;;) {
    let updates;
    try {
      updates = await state.api('getUpdates', {
        offset,
        timeout: POLL_TIMEOUT_S,
        allowed_updates: ['message'],
      });
    } catch (err) {
      log.error(err.message, `— повтор через ${RETRY_DELAY_MS / 1000} с`);
      await sleep(RETRY_DELAY_MS);
      continue;
    }
    for (const update of updates) {
      offset = update.update_id + 1;
      try {
        await processUpdate(update, state);
      } catch (err) {
        log.error(`Апдейт ${update.update_id} не обработан:`, err.message);
      }
    }
  }
}

async function setupMenu(api, adminId) {
  for (const { method, params } of menuRequests(adminId)) {
    try {
      await api(method, params);
    } catch (err) {
      // Без меню бот всё равно работает — не останавливаемся.
      log.error('Меню команд не установлено:', err.message);
    }
  }
}

async function main() {
  const config = loadConfig();
  const api = createApi(config.token);
  const me = await api('getMe');
  log.info(`Бот @${me.username} запущен. Идеи сохраняются в ${config.dataDir}. Ctrl+C — остановить.`);
  await setupMenu(api, config.adminId);
  if (config.adminId === null) {
    log.info('ADMIN_ID не задан — команда /ideas выключена. Узнай свой ID командой /id.');
  }
  await pollForever({ api, config, botUsername: me.username, lastIdeaAt: new Map(), collabSessions: new Map() });
}

main().catch((err) => {
  log.error(err.message);
  process.exitCode = 1;
});
