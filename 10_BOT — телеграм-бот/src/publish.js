// Публикация поста серии и опроса в канал через бота.
// Пробный прогон (ничего не отправляет):  node --env-file-if-exists=.env src/publish.js publish/ep01.json
// Отправка в канал:                       node --env-file-if-exists=.env src/publish.js publish/ep01.json --send
// Бот должен быть админом канала с правом публиковать сообщения.
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { loadConfig } from './config.js';
import { createApi } from './telegram.js';

const MAX_POST_LENGTH = 4096;
const MAX_QUESTION_LENGTH = 300;
const MAX_OPTION_LENGTH = 100;

/**
 * Проверяет файл серии и собирает запросы к Telegram.
 * @param {unknown} data содержимое publish/epNN.json
 * @param {string} channelUsername
 */
export function buildRequests(data, channelUsername) {
  const { postHtml, poll } = data ?? {};
  if (typeof postHtml !== 'string' || postHtml.trim() === '' || postHtml.length > MAX_POST_LENGTH) {
    throw new Error(`postHtml: нужен текст поста до ${MAX_POST_LENGTH} символов`);
  }
  if (typeof poll?.question !== 'string' || poll.question.length > MAX_QUESTION_LENGTH) {
    throw new Error(`poll.question: нужен вопрос до ${MAX_QUESTION_LENGTH} символов`);
  }
  const options = poll.options;
  if (!Array.isArray(options) || options.length < 2 || options.length > 10) {
    throw new Error('poll.options: нужно от 2 до 10 вариантов');
  }
  const badOption = options.find((o) => typeof o !== 'string' || o.length === 0 || o.length > MAX_OPTION_LENGTH);
  if (badOption !== undefined) throw new Error(`poll.options: вариант до ${MAX_OPTION_LENGTH} символов — «${badOption}»`);

  const chatId = `@${channelUsername}`;
  return [
    { method: 'sendMessage', params: { chat_id: chatId, text: postHtml, parse_mode: 'HTML' } },
    {
      method: 'sendPoll',
      params: {
        chat_id: chatId,
        question: poll.question,
        options: options.map((text) => ({ text })),
        is_anonymous: true,
        allows_multiple_answers: false,
      },
    },
  ];
}

async function main() {
  const [file, flag] = process.argv.slice(2);
  if (!file) throw new Error('Укажи файл серии, например: publish/ep01.json');
  const send = flag === '--send';

  const config = loadConfig();
  const data = JSON.parse(await readFile(file, 'utf8'));
  const requests = buildRequests(data, config.channelUsername);

  if (!send) {
    console.info('ПРОБНЫЙ ПРОГОН — ничего не отправлено. Для публикации добавь --send.\n');
    for (const { method, params } of requests) console.info(method, JSON.stringify(params, null, 2), '\n');
    return;
  }

  const api = createApi(config.token);
  for (const { method, params } of requests) {
    const message = await api(method, params);
    console.info(`${method}: опубликовано → https://t.me/${config.channelUsername}/${message.message_id}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error('ОШИБКА', err.message);
    process.exitCode = 1;
  });
}
