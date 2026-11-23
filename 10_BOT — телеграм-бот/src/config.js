import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TOKEN_PATTERN = /^\d+:[A-Za-z0-9_-]{30,}$/;
const USERNAME_PATTERN = /^[A-Za-z][A-Za-z0-9_]{3,31}$/;

const DEFAULTS = Object.freeze({
  channelUsername: 'obshchepit_yama',
  tiktokUrl: 'https://www.tiktok.com/@vyzhivi_v_obshepite',
  currentEpisode: '1',
});

function readToken(env) {
  const token = (env.BOT_TOKEN ?? '').trim();
  if (!TOKEN_PATTERN.test(token)) {
    throw new Error('BOT_TOKEN не задан или выглядит неверно — впиши токен от BotFather в файл .env');
  }
  return token;
}

function readChannel(env) {
  const channel = (env.CHANNEL_USERNAME || DEFAULTS.channelUsername).trim().replace(/^@/, '');
  if (!USERNAME_PATTERN.test(channel)) {
    throw new Error('CHANNEL_USERNAME должен быть адресом канала латиницей, например obshchepit_yama');
  }
  return channel;
}

function readTiktokUrl(env) {
  const url = (env.TIKTOK_URL || DEFAULTS.tiktokUrl).trim();
  if (!url.startsWith('https://')) {
    throw new Error('TIKTOK_URL должен начинаться с https://');
  }
  return url;
}

function readEpisode(env) {
  const episode = Number(env.CURRENT_EPISODE || DEFAULTS.currentEpisode);
  if (!Number.isInteger(episode) || episode < 1) {
    throw new Error('CURRENT_EPISODE должен быть целым числом от 1');
  }
  return episode;
}

function readAdminId(env) {
  const raw = (env.ADMIN_ID ?? '').trim();
  if (raw === '') return null;
  const id = Number(raw);
  if (!Number.isSafeInteger(id)) {
    throw new Error('ADMIN_ID должен быть числом — узнай его командой /id в личке у бота');
  }
  return id;
}

/**
 * Читает и проверяет настройки из переменных окружения (.env).
 * @param {Record<string, string | undefined>} env
 */
export function loadConfig(env = process.env) {
  return Object.freeze({
    token: readToken(env),
    channelUsername: readChannel(env),
    tiktokUrl: readTiktokUrl(env),
    currentEpisode: readEpisode(env),
    adminId: readAdminId(env),
    dataDir: env.DATA_DIR?.trim() || path.join(BOT_DIR, 'data'),
  });
}
