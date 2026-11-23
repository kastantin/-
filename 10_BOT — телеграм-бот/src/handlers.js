// Логика бота без сети и диска: на вход апдейт Telegram, на выход — что сделать.
import * as texts from './texts.js';

export const MAX_IDEA_LENGTH = 1000;
export const MAX_COLLAB_ANSWER = 500;
export const COLLAB_TIMEOUT_MS = 30 * 60_000;
const COLLAB_FIELDS = Object.freeze(['brand', 'offer', 'budget', 'contact']);

/**
 * collabSession: undefined — не менять, null — удалить, объект — сохранить.
 * notifyAdmin: сообщение владельцу канала (отправляется отдельно, после сохранения заявки).
 */
const EMPTY = Object.freeze({
  actions: [],
  idea: null,
  listIdeasFor: null,
  collab: null,
  notifyAdmin: null,
  collabSession: undefined,
});

const result = (fields) => Object.freeze({ ...EMPTY, ...fields });

function send(chatId, text, extra = {}) {
  return {
    method: 'sendMessage',
    params: {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      link_preview_options: { is_disabled: true },
      ...extra,
    },
  };
}

export function parseCommand(text) {
  const match = /^\/([a-z_]+)(?:@\w+)?(?:\s+([\s\S]*))?$/i.exec(text);
  if (!match) return null;
  return { name: match[1].toLowerCase(), payload: (match[2] ?? '').trim() };
}

const fullName = (from) => [from.first_name, from.last_name].filter(Boolean).join(' ');

function isActiveSession(session, now) {
  return Boolean(session) && now - session.startedAt < COLLAB_TIMEOUT_MS;
}

function handleNewMembers(msg, ctx) {
  const people = msg.new_chat_members.filter((member) => !member.is_bot);
  if (people.length === 0) return EMPTY;
  const names = people.map((member) => member.first_name).join(', ');
  const keyboard = texts.groupKeyboard(ctx.config, ctx.botUsername);
  return result({ actions: [send(msg.chat.id, texts.groupWelcome(names), { reply_markup: keyboard })] });
}

function startCollab(chatId, ctx) {
  if (ctx.config.adminId === null) {
    return result({ actions: [send(chatId, texts.COLLAB_UNAVAILABLE)], collabSession: null });
  }
  return result({
    actions: [send(chatId, `${texts.COLLAB_INTRO}\n\n${texts.collabQuestion(0)}`)],
    collabSession: Object.freeze({ step: 0, answers: Object.freeze({}), startedAt: ctx.now }),
  });
}

function handleCommand(msg, command, ctx, session) {
  const chatId = msg.chat.id;
  const reply = (text, extra) => result({ actions: [send(chatId, text, extra)] });

  switch (command?.name) {
    case 'start':
      if (command.payload === 'idea') return reply(texts.IDEA_PROMPT);
      if (command.payload === 'collab') return startCollab(chatId, ctx);
      return reply(texts.privateGreeting(msg.from.first_name), {
        reply_markup: texts.privateKeyboard(ctx.config, ctx.botUsername),
      });
    case 'collab':
      return startCollab(chatId, ctx);
    case 'cancel':
      return session
        ? result({ actions: [send(chatId, texts.COLLAB_CANCELLED)], collabSession: null })
        : reply(texts.NOTHING_TO_CANCEL);
    case 'id':
      return reply(texts.yourId(msg.from.id));
    case 'ideas':
      if (ctx.config.adminId === null || msg.from.id !== ctx.config.adminId) {
        return reply(texts.ADMIN_ONLY);
      }
      return result({ listIdeasFor: chatId });
    default:
      return reply(texts.UNKNOWN_COMMAND);
  }
}

function handleCollabAnswer(msg, text, session, ctx) {
  const chatId = msg.chat.id;
  if (text.length > MAX_COLLAB_ANSWER) {
    return result({ actions: [send(chatId, texts.collabAnswerTooLong(MAX_COLLAB_ANSWER))] });
  }
  const answers = Object.freeze({ ...session.answers, [COLLAB_FIELDS[session.step]]: text });
  const nextStep = session.step + 1;

  if (nextStep < texts.COLLAB_STEP_COUNT) {
    return result({
      actions: [send(chatId, texts.collabQuestion(nextStep))],
      collabSession: Object.freeze({ ...session, step: nextStep, answers }),
    });
  }

  const collab = Object.freeze({
    date: new Date(ctx.now).toISOString(),
    userId: msg.from.id,
    username: msg.from.username ?? '',
    name: fullName(msg.from),
    ...answers,
  });
  return result({
    collab,
    notifyAdmin: send(ctx.config.adminId, texts.collabForAdmin(collab)),
    actions: [send(chatId, texts.COLLAB_DONE)],
    collabSession: null,
  });
}

function handleIdea(msg, text, ctx) {
  const chatId = msg.chat.id;
  if (text.length > MAX_IDEA_LENGTH) {
    return result({ actions: [send(chatId, texts.ideaTooLong(MAX_IDEA_LENGTH))] });
  }
  if (!ctx.canSubmitIdea(msg.from.id)) {
    return result({ actions: [send(chatId, texts.IDEA_COOLDOWN)] });
  }
  const episode = ctx.config.currentEpisode + 1;
  const idea = Object.freeze({
    date: new Date(ctx.now).toISOString(),
    episode,
    userId: msg.from.id,
    username: msg.from.username ?? '',
    name: fullName(msg.from),
    text,
  });
  return result({ idea, actions: [send(chatId, texts.ideaThanks(episode))] });
}

function handlePrivate(msg, ctx, session) {
  const text = typeof msg.text === 'string' ? msg.text.trim() : '';
  if (!text) return result({ actions: [send(msg.chat.id, texts.TEXT_ONLY)] });

  if (text.startsWith('/')) {
    const res = handleCommand(msg, parseCommand(text), ctx, session);
    // Любая другая команда посреди заявки прерывает её.
    return session && res.collabSession === undefined ? result({ ...res, collabSession: null }) : res;
  }
  if (session) return handleCollabAnswer(msg, text, session, ctx);
  return handleIdea(msg, text, ctx);
}

/**
 * @param update апдейт Telegram
 * @param ctx { config, botUsername, now, canSubmitIdea(userId), collabSession }
 */
export function handleUpdate(update, ctx) {
  const msg = update?.message;
  if (!msg?.chat) return EMPTY;

  if (Array.isArray(msg.new_chat_members)) {
    return msg.chat.type === 'private' ? EMPTY : handleNewMembers(msg, ctx);
  }
  // В группах бот молчит — отвечает только в личке.
  if (msg.chat.type !== 'private' || !msg.from) return EMPTY;

  const stored = ctx.collabSession ?? null;
  const session = isActiveSession(stored, ctx.now) ? stored : null;
  const res = handlePrivate(msg, ctx, session);
  // Просроченную заявку убираем.
  return stored && !session && res.collabSession === undefined ? result({ ...res, collabSession: null }) : res;
}

export function errorReply(chatId) {
  return send(chatId, texts.SAVE_FAILED);
}

export function ideasReply(chatId, ideas) {
  return send(chatId, texts.ideasList(ideas));
}
