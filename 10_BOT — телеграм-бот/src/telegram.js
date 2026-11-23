// Минимальный клиент Telegram Bot API на встроенном fetch — без библиотек.
const API_BASE = 'https://api.telegram.org';
export const POLL_TIMEOUT_S = 30;
const REQUEST_MARGIN_MS = 10_000;

export class TelegramError extends Error {
  constructor(method, code, description) {
    super(`Telegram ${method}: ${code} ${description}`);
    this.name = 'TelegramError';
    this.code = code;
  }
}

export function createApi(token, fetchImpl = fetch) {
  return async function call(method, params = {}) {
    let response;
    try {
      response = await fetchImpl(`${API_BASE}/bot${token}/${method}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(params),
        signal: AbortSignal.timeout(POLL_TIMEOUT_S * 1000 + REQUEST_MARGIN_MS),
      });
    } catch (err) {
      // Не пробрасываем исходную ошибку целиком: в ней может оказаться URL с токеном.
      throw new Error(`Нет связи с Telegram (${method}): ${err.name}`);
    }
    const data = await response.json().catch(() => null);
    if (!data?.ok) {
      throw new TelegramError(method, data?.error_code ?? response.status, data?.description ?? 'нет ответа');
    }
    return data.result;
  };
}
