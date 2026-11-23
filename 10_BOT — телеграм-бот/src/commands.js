// Меню команд (кнопка «Меню» рядом с полем ввода). Бот ставит его сам при запуске.

export const PUBLIC_COMMANDS = Object.freeze([
  { command: 'start', description: '🍽 Меню и ссылки на серии' },
  { command: 'collab', description: '🤝 Сотрудничество и реклама' },
  { command: 'cancel', description: '✖️ Отменить заявку' },
]);

// Только у владельца канала: обычные команды + служебные.
export const ADMIN_COMMANDS = Object.freeze([
  ...PUBLIC_COMMANDS,
  { command: 'ideas', description: '💡 Последние идеи зрителей' },
  { command: 'id', description: '🆔 Мой Telegram ID' },
]);

/**
 * Запросы к Telegram для установки меню.
 * @param {number | null} adminId
 * @returns {{ method: string, params: object }[]}
 */
export function menuRequests(adminId) {
  const requests = [
    { method: 'setMyCommands', params: { commands: PUBLIC_COMMANDS, scope: { type: 'all_private_chats' } } },
    { method: 'setChatMenuButton', params: { menu_button: { type: 'commands' } } },
  ];
  if (adminId === null) return requests;
  return [
    ...requests,
    { method: 'setMyCommands', params: { commands: ADMIN_COMMANDS, scope: { type: 'chat', chat_id: adminId } } },
  ];
}
