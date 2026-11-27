import { COLORS } from '../../config';

// Серия 6 «Тайный гость»: элементы экрана, не зависящие от озвучки.
// Все компоненты — чистые (значение приходит пропсами), анимацию задаёт сцена.

const HEAVY = 'Segoe UI Black, Arial Black, sans-serif';
const BOLD = 'Segoe UI, Arial, sans-serif';
const HAND = 'Segoe Print, Comic Sans MS, sans-serif';

export const HUD_RED = '#d6332a';
export const HUD_PANEL = 'rgba(30, 29, 33, 0.92)';

// Сквозное табло «КОСТЯ 0 : 0 БЕКС»; scale — для вертикали (крупнее)
export function Scoreboard({ kostya, beks, scale = 1, flash }: { kostya: number; beks: number; scale?: number; flash?: 'kostya' | 'beks' }) {
  const cell = (value: number, hot: boolean) => (
    <span
      style={{
        fontFamily: HEAVY,
        fontSize: 54,
        minWidth: 52,
        textAlign: 'center',
        color: hot ? '#ffd23f' : COLORS.paper,
        transform: hot ? 'scale(1.25)' : 'none',
      }}
    >
      {value}
    </span>
  );
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 16,
        background: HUD_PANEL,
        border: `3px solid ${COLORS.ink}`,
        borderRadius: 18,
        padding: '6px 26px',
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
      }}
    >
      <span style={{ fontFamily: BOLD, fontWeight: 800, fontSize: 24, letterSpacing: 1, color: COLORS.paper }}>КОСТЯ</span>
      {cell(kostya, flash === 'kostya')}
      <span style={{ fontFamily: HEAVY, fontSize: 44, color: '#8c8a96' }}>:</span>
      {cell(beks, flash === 'beks')}
      <span style={{ fontFamily: BOLD, fontWeight: 800, fontSize: 24, letterSpacing: 1, color: COLORS.paper }}>БЕКС</span>
    </div>
  );
}

// Таймер смены: «ПЯТНИЦА · СМЕНА» → «ПЯТНИЦА · 21:40»
export function ShiftTimer({ label, urgent = false }: { label: string; urgent?: boolean }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        background: urgent ? HUD_RED : HUD_PANEL,
        border: `3px solid ${COLORS.ink}`,
        borderRadius: 14,
        padding: '6px 18px',
        transform: 'rotate(-1.5deg)',
      }}
    >
      <span style={{ fontFamily: HEAVY, fontSize: 30, color: urgent ? COLORS.paper : '#ff5a4a', letterSpacing: 1 }}>{label}</span>
    </div>
  );
}

// Секундомер «15:00 НА ГОРЯЧЕЕ»: seconds — осталось секунд
export function Stopwatch({ seconds, size = 1 }: { seconds: number; size?: number }) {
  const clamped = Math.max(0, Math.round(seconds));
  const mm = String(Math.floor(clamped / 60)).padStart(2, '0');
  const ss = String(clamped % 60).padStart(2, '0');
  const low = clamped <= 300;
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: '#efe9da',
        border: `4px solid ${COLORS.ink}`,
        borderRadius: 22,
        padding: '8px 26px 10px',
        transform: `scale(${size})`,
        transformOrigin: 'top center',
      }}
    >
      <span style={{ fontFamily: HEAVY, fontSize: 76, lineHeight: 1, color: low ? HUD_RED : COLORS.ink, fontVariantNumeric: 'tabular-nums' }}>
        {mm}:{ss}
      </span>
      <span style={{ fontFamily: BOLD, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: COLORS.ink }}>НА ГОРЯЧЕЕ</span>
    </div>
  );
}

// Доска с чек-листом тайного гостя: shown — сколько пунктов уже написано мелом
export const CHECKLIST_ITEMS = ['Приветствие — 30 с', 'Повтор заказа', 'Допродажа десерта', 'Горячее — 15 мин', 'Прощание по имени'] as const;

export function ChecklistBoard({ shown = CHECKLIST_ITEMS.length, width = 760 }: { shown?: number; width?: number }) {
  return (
    <div style={{ width, background: '#2f4a3e', border: `10px solid #8b6b4a`, borderRadius: 14, padding: '26px 38px', boxSizing: 'border-box' }}>
      <div style={{ fontFamily: HAND, fontSize: 44, color: '#f4f0e6', marginBottom: 14, textDecoration: 'underline' }}>Тайный гость</div>
      {CHECKLIST_ITEMS.map((item, i) => (
        <div key={item} style={{ fontFamily: HAND, fontSize: 40, color: '#f4f0e6', lineHeight: 1.5, opacity: i < shown ? 1 : 0 }}>
          ✓ {item}
        </div>
      ))}
    </div>
  );
}

// Листок со ставками на кухне
export const BETS = [
  { who: 'Ахма', pick: 'Бекс — пончик' },
  { who: 'Надир', pick: 'Ничья — чай' },
] as const;

export function BetsSheet({ shown = BETS.length }: { shown?: number }) {
  return (
    <div style={{ width: 520, background: '#f6efc8', border: `4px solid ${COLORS.ink}`, borderRadius: 8, padding: '18px 28px', transform: 'rotate(-2deg)' }}>
      <div style={{ fontFamily: HAND, fontSize: 38, color: COLORS.ink, marginBottom: 10, textDecoration: 'underline' }}>Ставки</div>
      {BETS.map((bet, i) => (
        <div key={bet.who} style={{ fontFamily: HAND, fontSize: 34, color: COLORS.ink, lineHeight: 1.5, opacity: i < shown ? 1 : 0 }}>
          {bet.who}: <b>{bet.pick}</b>
        </div>
      ))}
    </div>
  );
}

// Мелкая бегущая строка итогов опроса (сц. 2)
export function PollTicker({ text }: { text: string }) {
  return (
    <div style={{ background: HUD_PANEL, borderRadius: 8, padding: '4px 18px', fontFamily: BOLD, fontWeight: 700, fontSize: 20, color: COLORS.paper, whiteSpace: 'nowrap' }}>
      {text}
    </div>
  );
}
