// Все тексты бота в одном месте — правь здесь.

const IDEA_PREVIEW_LENGTH = 300;

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const channelUrl = (config) => `https://t.me/${config.channelUsername}`;

export function privateKeyboard(config, botUsername) {
  return {
    inline_keyboard: [
      [{ text: '📺 Смотреть серии и голосовать', url: channelUrl(config) }],
      [{ text: '🎵 Мы в TikTok', url: config.tiktokUrl }],
      [{ text: '🤝 Сотрудничество', url: `https://t.me/${botUsername}?start=collab` }],
    ],
  };
}

export function groupKeyboard(config, botUsername) {
  return {
    inline_keyboard: [
      [{ text: '📺 Смотреть серии', url: channelUrl(config) }],
      [{ text: '🎵 Мы в TikTok', url: config.tiktokUrl }],
      [{ text: '💡 Предложить идею Косте', url: `https://t.me/${botUsername}?start=idea` }],
    ],
  };
}

export function groupWelcome(names) {
  return [
    `Привет, <b>${escapeHtml(names)}</b>! 👋 Добро пожаловать в чат канала «Общепитная яма» 🍽`,
    '',
    'Здесь решается судьба официанта Кости из мультсериала «Скатерть»:',
    '🗳 Голосуем — что Костя сделает в следующей серии',
    '💡 Предлагаем свои идеи — лучшая попадёт в серию, а автор в титры',
    '😂 Обсуждаем серии, гостей-скандалистов и каламбуры Кости',
    '',
    'Новые серии — в канале, кнопка ниже 👇',
    'Там же опрос к каждой серии — успей проголосовать!',
    '',
    'Костя уже несёт меню. Присаживайтесь 🍴',
  ].join('\n');
}

export function privateGreeting(firstName) {
  return [
    `Привет, <b>${escapeHtml(firstName)}</b>! Я Костя, официант ресторана «Скатерть» 🍽`,
    '',
    'Мечтаю стать управляющим, а что со мной будет дальше — решаете вы.',
    '',
    '🗳 Голосование за каждую серию — в канале',
    '💡 Есть идея для сюжета? Просто напиши её мне одним сообщением — лучшая попадёт в серию, а автор в титры ✨',
  ].join('\n');
}

export const IDEA_PROMPT =
  '💡 Пиши идею одним сообщением: что Костя должен сделать в следующей серии?';

export function ideaThanks(episode) {
  return `Записал! 📝 Идея пойдёт на обсуждение к серии ${episode}. Если её выберут — ты в титрах ✨`;
}

export function ideaTooLong(maxLength) {
  return `Идея длинновата 😅 Уложись, пожалуйста, в ${maxLength} символов.`;
}

export const IDEA_COOLDOWN = 'Не так быстро — Костя ещё записывает прошлую идею ✍️ Попробуй через минуту.';
export const SAVE_FAILED = 'Ой, блокнот упал под стол 🙈 Идея не сохранилась — попробуй ещё раз чуть позже.';
export const TEXT_ONLY = 'Я понимаю только текст ✍️ Напиши идею словами.';
export const UNKNOWN_COMMAND = 'Не знаю такой команды 🤔 Все команды — в кнопке «Меню» рядом с полем ввода.';
export const ADMIN_ONLY = 'Эта команда только для автора сериала.';

// ── Сотрудничество ────────────────────────────────────────────

export const COLLAB_INTRO = [
  '🤝 <b>Сотрудничество с «Общепитной ямой»</b>',
  '',
  'Реклама в серии, интеграция бренда в сюжет, бартер, совместный проект — расскажите, что придумали.',
  'Всего 4 вопроса. Передумали — /cancel',
].join('\n');

const COLLAB_QUESTIONS = Object.freeze([
  '1/4. Как вас зовут и какой бренд или компанию вы представляете?',
  '2/4. Что предлагаете? Например: реклама в серии, Костя пробует ваш продукт, бартер, совместный проект.',
  '3/4. Какой бюджет или формат? Если пока не знаете — напишите «обсудим».',
  '4/4. Как с вами связаться? @ник в Telegram, почта или телефон.',
]);

export const COLLAB_STEP_COUNT = COLLAB_QUESTIONS.length;

export function collabQuestion(step) {
  return COLLAB_QUESTIONS[step];
}

export const COLLAB_DONE =
  'Спасибо! 🙌 Заявка передана автору сериала — он свяжется с вами в ближайшее время.';
export const COLLAB_CANCELLED = 'Заявка отменена. Если передумаете — /collab';
export const NOTHING_TO_CANCEL = 'Отменять нечего 🙂';
export const COLLAB_UNAVAILABLE =
  'Приём заявок пока не настроен 🙈 Напишите в комментариях канала — автор увидит.';

export function collabAnswerTooLong(maxLength) {
  return `Слишком длинно 😅 Уложитесь, пожалуйста, в ${maxLength} символов.`;
}

export function collabForAdmin(collab) {
  const who = escapeHtml(collab.name || 'без имени');
  const username = collab.username ? ` (@${escapeHtml(collab.username)})` : '';
  return [
    '🤝 <b>Новая заявка на сотрудничество</b>',
    '',
    `👤 От: <a href="tg://user?id=${Number(collab.userId)}">${who}</a>${username} · ID <code>${Number(collab.userId)}</code>`,
    `🏷 Кто / бренд: ${escapeHtml(collab.brand)}`,
    `💡 Предложение: ${escapeHtml(collab.offer)}`,
    `💰 Бюджет / формат: ${escapeHtml(collab.budget)}`,
    `📞 Контакт: ${escapeHtml(collab.contact)}`,
  ].join('\n');
}

export function yourId(id) {
  return `Твой Telegram ID: <code>${escapeHtml(id)}</code>`;
}

function formatIdea(idea, index) {
  const author = idea.username ? `@${idea.username}` : idea.name || `id ${idea.userId}`;
  const text = idea.text.length > IDEA_PREVIEW_LENGTH
    ? `${idea.text.slice(0, IDEA_PREVIEW_LENGTH)}…`
    : idea.text;
  return `${index + 1}. [серия ${idea.episode}] <b>${escapeHtml(author)}</b>: ${escapeHtml(text)}`;
}

export function ideasList(ideas) {
  if (ideas.length === 0) return 'Идей пока нет 🤷';
  return ['💡 Последние идеи:', '', ...ideas.map(formatIdea)].join('\n\n');
}
