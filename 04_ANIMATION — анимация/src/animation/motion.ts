// Общие правила «оживления»: дрожание контура, моргание, движение рта

// Контур перерисовывается раз в 4 кадра — как у рисованной анимации «на четвёрках»
const BOIL_STEP_FRAMES = 4;
const BOIL_VARIANTS = 12;

export function boilSeedAt(frame: number): number {
  return (Math.floor(frame / BOIL_STEP_FRAMES) % BOIL_VARIANTS) + 1;
}

// Моргание: глаза закрыты 4 кадра, пауза 2.5–4 с, у каждого персонажа свой сдвиг
const BLINK_FRAMES = 4;
const BLINK_PERIOD_MIN = 75;
const BLINK_PERIOD_SPREAD = 45;

export function isBlinking(frame: number, offset: number): boolean {
  const period = BLINK_PERIOD_MIN + ((offset * 37) % BLINK_PERIOD_SPREAD);
  return (frame + offset * 13) % period < BLINK_FRAMES;
}

// Рот при разговоре меняет положение раз в 3 кадра; примерно 2 из 3 фаз — открыт
const MOUTH_STEP_FRAMES = 3;

export function isMouthOpen(frame: number, offset = 0): boolean {
  const step = Math.floor(frame / MOUTH_STEP_FRAMES) + offset * 7;
  // целочисленный хэш даёт «живой» неровный ритм без случайности между рендерами
  const hash = Math.imul(step + 1, 2654435761) >>> 0;
  return hash % 3 !== 0;
}

// Реплика или событие в кадрах сцены: [from, to)
export type Span = { from: number; to: number };

export function inSpan(frame: number, span: Span): boolean {
  return frame >= span.from && frame < span.to;
}

// Значение по ключевым точкам «с какого кадра — какое состояние»
export function stepValue<T>(frame: number, keys: ReadonlyArray<readonly [number, T]>): T {
  let current = keys[0][1];
  for (const [from, value] of keys) {
    if (frame >= from) current = value;
  }
  return current;
}
