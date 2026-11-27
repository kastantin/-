// Серия 6 «Тайный гость» — тайминг по сценарию 01_SCRIPTS/ep06_tajnyj_gost.md и по озвучке 05_VOICE/ep06 (30 FPS).
// Реплики ставятся в сцену по порядку, длина сцены считается из длины файлов; все кадры — от начала своей сцены.
// Эпизодических героев (бабушка, гости, гостья со стола 7) озвучивает диктор: их реплики субтитруются как реплики диктора.
import { FILES, VOICE_DATA } from './voice-data';

export const EP06 = { episode: 6, title: 'Тайный гость', ladderStep: 0 } as const;
export const FPS = 30;

export const VOICE_RATE = 1.15;
export const NARRATOR_RATE = 1.4;

export type SceneId =
  | 'cold'
  | 'pass'
  | 'cashier'
  | 'board'
  | 'split'
  | 'serve'
  | 'bets'
  | 'mirror'
  | 'greet'
  | 'seven'
  | 'order'
  | 'passline'
  | 'thought'
  | 'freeze'
  | 'fork';

export type Speaker = 'kostya' | 'eduard' | 'beks' | 'gena' | 'owner' | 'narrator';

// Сцены вертикальной версии 9:16 (сценарий: 1, 2, 5, 8, 9, 10, 11, 12, 14, 15)
export const VERTICAL_SCENES: ReadonlyArray<SceneId> = ['cold', 'pass', 'split', 'mirror', 'greet', 'seven', 'order', 'passline', 'freeze', 'fork'];

export function voiceFrames(sec: number, rate = VOICE_RATE): number {
  return Math.round((sec * FPS) / rate);
}

function durationOf(id: string): number {
  const file = FILES[id];
  const data = file ? VOICE_DATA[file] : undefined;
  if (!data) throw new Error(`Нет озвучки для ${id}`);
  return data.dur;
}

function speechOf(id: string): ReadonlyArray<readonly [number, number]> {
  const file = FILES[id];
  const data = file ? VOICE_DATA[file] : undefined;
  return data ? data.speech : [[0, 0]];
}

// text — субтитр; mat — где в файле звучит мат (секунды): голос глушится, звучит «мяу»;
// offscreen — голос за кадром (рот не двигается); gap — пауза перед репликой в кадрах (по умолчанию 8)
type Item = {
  id: string;
  speaker: Speaker;
  gap?: number;
  text?: string;
  highlight?: string;
  mat?: readonly [number, number];
  offscreen?: boolean;
};

const n = (id: string, text?: string, gap?: number): Item => ({ id, speaker: 'narrator', gap, text });

const PLAN: ReadonlyArray<{ id: SceneId; lead: number; tail: number; clips: ReadonlyArray<Item> }> = [
  {
    id: 'cold',
    lead: 0,
    tail: 10,
    clips: [
      n('narr_bab', '— Я просто ищу туалет, — заявила бабушка.', 0),
      { id: 'eduard_s01', speaker: 'eduard', gap: 6, offscreen: true, text: 'Сегодня тайный гость. Любой стол — проверка.', highlight: 'Любой стол — проверка.' },
    ],
  },
  {
    id: 'pass',
    lead: 4,
    tail: 8,
    clips: [
      { id: 'gena_s02', speaker: 'gena', gap: 0, text: 'Ревизор. Ну [[охренеть]]. А я, между прочим, не готовился!', mat: [1.55, 2.49] },
      { id: 'kostya_s02', speaker: 'kostya', gap: 8, text: 'Вы выбрали честно. Это хуже подлости: на подлость хоть можно свалить.', highlight: 'Это хуже подлости' },
    ],
  },
  {
    id: 'cashier',
    lead: 10,
    tail: 10,
    clips: [
      { id: 'margarita_s03', speaker: 'owner', gap: 0, text: 'Соседей проверили — я заказала свою проверку. Тайный гость. Лучший балл — старший официант.', highlight: 'Лучший балл — старший официант.' },
      { id: 'eduard_s03', speaker: 'eduard', gap: 8, text: 'Я ничего не видел. Но анкету мне тоже заполнят.' },
    ],
  },
  {
    id: 'board',
    lead: 20,
    tail: 10,
    clips: [
      { id: 'kostya_s04', speaker: 'kostya', gap: 0, text: 'Пятнадцать минут на горячее? У нас раздача — как марафон.', highlight: 'как марафон.' },
      { id: 'beks_s04', speaker: 'beks', gap: 8, text: 'Для меня — как разминка.' },
    ],
  },
  {
    id: 'split',
    lead: 6,
    tail: 8,
    clips: [
      n('narr_stihi', 'Мужчина с блокнотом писал стихи. Женщина просто снимала борщ для инстаграма.', 0),
      { id: 'kostya_s05', speaker: 'kostya', gap: 6, text: 'Тоже хорошо.' },
      { id: 'beks_s05', speaker: 'beks', gap: 4, text: 'Тоже хорошо.' },
    ],
  },
  {
    id: 'serve',
    lead: 14,
    tail: 10,
    clips: [
      { id: 'kostya_s06a', speaker: 'kostya', gap: 0, text: 'Бекс подаёт блюда. Я подаю надежды.', highlight: 'Я подаю надежды.' },
      n('narr_dima', '— А надежды — на какой стол?'),
      { id: 'kostya_s06b', speaker: 'kostya', gap: 6, text: 'На первый.' },
      n('narr_nadezhdy', 'Надежд в меню не значилось.'),
    ],
  },
  {
    id: 'bets',
    lead: 6,
    tail: 12,
    clips: [n('narr_stavki', undefined, 0)],
  },
  {
    id: 'mirror',
    lead: 10,
    tail: 10,
    clips: [
      { id: 'beks_s08', speaker: 'beks', gap: 0, text: 'Тридцать секунд: поздороваться, представиться, предложить аперитив. Не зубами — глазами.', highlight: 'Не зубами — глазами.' },
      { id: 'kostya_s08', speaker: 'kostya', gap: 8, text: 'Это лицо человека, вспомнившего про налоги.' },
    ],
  },
  {
    id: 'greet',
    lead: 4,
    tail: 10,
    clips: [
      n('narr_gost', '— Я ещё не сел, — напомнил гость.', 0),
      { id: 'kostya_s09', speaker: 'kostya', gap: 8, text: 'Тогда пока приветствие, сидя — десерт.', highlight: 'десерт.' },
    ],
  },
  {
    id: 'seven',
    lead: 12,
    tail: 12,
    clips: [
      { id: 'eduard_s10', speaker: 'eduard', gap: 0, text: 'Я ничего не видел… Нет, видел. Это она. Стол семь. Я узнаю этот взгляд.', highlight: 'Это она. Стол семь.' },
    ],
  },
  {
    id: 'order',
    lead: 6,
    tail: 14,
    clips: [n('narr_stejk', '— Фирменный стейк. Время пошло, — сказала гостья и нажала секундомер.', 0)],
  },
  {
    id: 'passline',
    lead: 8,
    tail: 10,
    clips: [
      { id: 'gena_s12', speaker: 'gena', gap: 0, text: 'Стейк закончился! Последний у Бекса на четвёртом!', highlight: 'Стейк закончился!' },
      { id: 'beks_s12', speaker: 'beks', gap: 8, text: 'Скажи, что готовится. Купим время.' },
    ],
  },
  {
    id: 'thought',
    lead: 10,
    tail: 14,
    clips: [{ id: 'kostya_s13', speaker: 'kostya', gap: 0, text: 'Соврать — или признать. Купить время — или потерять лицо.' }],
  },
  {
    id: 'freeze',
    lead: 10,
    tail: 16,
    clips: [{ id: 'eduard_s14', speaker: 'eduard', gap: 0, text: 'Я всё видел. Но лучше бы не видел.', highlight: 'лучше бы не видел.' }],
  },
  {
    id: 'fork',
    lead: 2,
    tail: 30,
    clips: [n('narr_slushayu', '— Я слушаю, — сказала гостья, не отрывая глаз от секундомера.', 0), n('narr_A', undefined, 6), n('narr_B', undefined, 6), n('narr_svoy', undefined, 6)],
  },
];

export type PlacedClip = Item & { at: number; end: number; rate: number; onScreen: boolean; file: string };

function place(): { scenes: { id: SceneId; from: number; to: number }[]; clips: Record<SceneId, PlacedClip[]> } {
  const clips = {} as Record<SceneId, PlacedClip[]>;
  const scenes: { id: SceneId; from: number; to: number }[] = [];
  let start = 0;
  for (const scene of PLAN) {
    let cursor = scene.lead;
    const placed: PlacedClip[] = [];
    scene.clips.forEach((item, i) => {
      const rate = item.speaker === 'narrator' ? NARRATOR_RATE : VOICE_RATE;
      const at = i === 0 ? scene.lead + (item.gap ?? 0) : cursor + (item.gap ?? 8);
      const end = at + voiceFrames(durationOf(item.id), rate);
      cursor = end;
      placed.push({ ...item, at, end, rate, onScreen: item.speaker !== 'narrator' && !item.offscreen, file: FILES[item.id] ?? '' });
    });
    clips[scene.id] = placed;
    const length = cursor + scene.tail;
    scenes.push({ id: scene.id, from: start, to: start + length });
    start += length;
  }
  return { scenes, clips };
}

const PLACED = place();

export const SCENES: ReadonlyArray<{ id: SceneId; from: number; to: number }> = PLACED.scenes;
export const VOICE: Record<SceneId, PlacedClip[]> = PLACED.clips;
export const EP06_DURATION = SCENES[SCENES.length - 1].to;

// Вертикаль: те же сцены, но только отмеченные в сценарии; нарезка идёт подряд
export const VERTICAL: ReadonlyArray<{ id: SceneId; from: number; to: number }> = (() => {
  let start = 0;
  return VERTICAL_SCENES.map((id) => {
    const scene = SCENES.find((s) => s.id === id);
    if (!scene) throw new Error(`Нет сцены ${id}`);
    const length = scene.to - scene.from;
    const out = { id, from: start, to: start + length };
    start += length;
    return out;
  });
})();
export const EP06_VERTICAL_DURATION = VERTICAL[VERTICAL.length - 1].to;

export function sceneLength(id: SceneId): number {
  const scene = SCENES.find((s) => s.id === id);
  if (!scene) throw new Error(`Нет сцены ${id}`);
  return scene.to - scene.from;
}

function find(scene: SceneId, id: string): PlacedClip {
  const clip = VOICE[scene].find((c) => c.id === id);
  if (!clip) throw new Error(`Нет реплики ${id} в сцене ${scene}`);
  return clip;
}

export function clipAt(scene: SceneId, id: string): number {
  return find(scene, id).at;
}

export function clipEnd(scene: SceneId, id: string): number {
  return find(scene, id).end;
}

// Кадр внутри сцены, на котором в реплике звучит секунда `sec`
export function clipSecond(scene: SceneId, id: string, sec: number): number {
  const clip = find(scene, id);
  return clip.at + voiceFrames(sec, clip.rate);
}

// Отрезки речи персонажа в кадрах сцены — по ним двигается рот
export function speechSpans(scene: SceneId, who: Speaker): { from: number; to: number }[] {
  return VOICE[scene]
    .filter((c) => c.speaker === who && c.onScreen)
    .flatMap((c) => speechOf(c.id).map(([a, b]) => ({ from: c.at + voiceFrames(a, c.rate), to: c.at + voiceFrames(b, c.rate) })));
}

// --- Субтитры ------------------------------------------------------------------------
// Мат в тексте — в двойных скобках: [[слово]]; он заменяется на 🤬 (единственная версия для всех площадок).
export type Ep06Cue = { from: number; to: number; text: string; speaker: Speaker; highlight?: string };

const SUBTITLE_PAD = 6;

export const SUBTITLES = Object.fromEntries(
  SCENES.map((s) => [
    s.id,
    VOICE[s.id]
      .filter((c) => c.text)
      .map((c) => ({ from: c.at, to: Math.min(c.end + SUBTITLE_PAD, s.to - s.from), text: c.text ?? '', speaker: c.speaker, highlight: c.highlight })),
  ]),
) as Record<SceneId, Ep06Cue[]>;

export const REMARKS: Record<SceneId, { text: string; from: number; to: number }[]> = Object.fromEntries(
  SCENES.map((s) => [s.id, s.id === 'fork' ? [{ text: 'Что делать Косте?', from: 0, to: s.to - s.from }] : []]),
) as Record<SceneId, { text: string; from: number; to: number }[]>;

// --- «Мяу» вместо мата (так же, как в сериях 2–5) --------------------------------------
export const CENSOR_MEOWS = ['meow_a.mp3', 'meow_b.mp3', 'meow_c.mp3'] as const;
export const CENSOR_VOLUME = 0.9;
export const CENSOR_TONE = 0.6;
export const MEOW_FRAMES = 15;

// Рот говорящего в координатах сцены (1080×720) после камеры; size — плашка 🤬 (уточняется по кадру)
const MAT_MOUTHS: Partial<Record<SceneId, { x: number; y: number; size: number }>> = {
  pass: { x: 330, y: 330, size: 140 },
};

export type MatSpot = { scene: SceneId; from: number; to: number; x: number; y: number; size: number };

export const MAT_SPOTS: MatSpot[] = SCENES.flatMap(({ id }) => {
  const mouth = MAT_MOUTHS[id];
  if (!mouth) return [];
  return VOICE[id]
    .filter((c) => c.mat)
    .map((c) => {
      const [a, b] = c.mat ?? [0, 0];
      return { scene: id, from: c.at + voiceFrames(a, c.rate) - 2, to: c.at + voiceFrames(b, c.rate) + 4, ...mouth };
    });
});

// --- Экранные данные: табло, таймер смены, секундомер -------------------------------------
export const SCORE: Record<SceneId, readonly [number, number]> = {
  cold: [0, 0],
  pass: [0, 0],
  cashier: [0, 0],
  board: [0, 0],
  split: [0, 0],
  serve: [0, 1],
  bets: [0, 1],
  mirror: [0, 1],
  greet: [1, 1],
  seven: [2, 2],
  order: [2, 2],
  passline: [2, 2],
  thought: [2, 2],
  freeze: [2, 2],
  fork: [2, 2],
};

// Сцены, где очко только что изменилось (табло «подпрыгивает»): кто и когда
export const SCORE_FLASH: Partial<Record<SceneId, { who: 'kostya' | 'beks'; at: number }>> = {
  serve: { who: 'beks', at: 4 },
  greet: { who: 'kostya', at: clipEnd('greet', 'kostya_s09') - 6 },
};

export const TIMER_LABEL: Partial<Record<SceneId, { label: string; urgent: boolean }>> = {
  pass: { label: 'ПЯТНИЦА · СМЕНА', urgent: false },
  cashier: { label: 'ПЯТНИЦА · СМЕНА', urgent: false },
  board: { label: 'ПЯТНИЦА · СМЕНА', urgent: false },
  split: { label: 'ПЯТНИЦА · СМЕНА', urgent: false },
  serve: { label: 'ПЯТНИЦА · СМЕНА', urgent: false },
  bets: { label: 'ПЯТНИЦА · СМЕНА', urgent: false },
  mirror: { label: 'ПЯТНИЦА · СМЕНА', urgent: false },
  greet: { label: 'ПЯТНИЦА · СМЕНА', urgent: false },
  seven: { label: 'ПЯТНИЦА · 21:40', urgent: true },
  order: { label: 'ПЯТНИЦА · 21:40', urgent: true },
  passline: { label: 'ПЯТНИЦА · 21:40', urgent: true },
  thought: { label: 'ПЯТНИЦА · 21:40', urgent: true },
  freeze: { label: 'ПЯТНИЦА · 21:40', urgent: true },
  fork: { label: 'ПЯТНИЦА · 21:40', urgent: true },
};

// Секундомер «НА ГОРЯЧЕЕ» (секунд осталось на начало сцены); сцена 13 по сценарию — «11:40»
export const STOPWATCH_START: Partial<Record<SceneId, number>> = {
  order: 900,
  passline: 820,
  thought: 700,
  freeze: 580,
  fork: 420,
};

// --- Сценические события (привязаны к репликам) -------------------------------------
export const BOARD_EV = {
  itemsAt: [0, 1, 2, 3, 4].map((i) => clipAt('board', 'kostya_s04') + 6 * i),
} as const;

export const BETS_EV = {
  sheetAt: clipAt('bets', 'narr_stavki'),
  firstAt: clipSecond('bets', 'narr_stavki', 2.6),
  secondAt: clipSecond('bets', 'narr_stavki', 6.4),
} as const;

export const FORK = {
  options: [
    { badge: 'А', lines: ['Признать: стейка', 'нет, предложить', 'замену и десерт', 'за счёт заведения'], at: clipAt('fork', 'narr_A') },
    { badge: 'Б', lines: ['Выкрутиться:', '«скоро будет»', 'и тянуть время'], at: clipAt('fork', 'narr_B') },
    { badge: 'custom', lines: ['Свой вариант —', 'в комментариях'], at: clipAt('fork', 'narr_svoy') },
  ],
  voteText: 'Голосуй в Telegram',
  voteAt: clipEnd('fork', 'narr_svoy') + 8,
  footnote: 'Голоса растут: 0 → 0 → 2 → 3 → 3. Следующий — 4?',
  footnoteAt: clipEnd('fork', 'narr_svoy') + 20,
} as const;

// --- Звуки: дубли _a из 06_MUSIC_SFX (звуки серии 6 пока не заказаны — используем общие) -----
export type SfxClip = { file: string; at: number; volume: number; duration?: number; fade?: number };

export const SFX: Record<SceneId, SfxClip[]> = {
  cold: [{ file: 'whoosh_a.mp3', at: 0, volume: 0.4 }],
  pass: [{ file: 'plate_rattle_a.mp3', at: 0, volume: 0.4, duration: 40, fade: 10 }],
  cashier: [{ file: 'cash_register_a.mp3', at: 2, volume: 0.6 }],
  board: BOARD_EV.itemsAt.map((at) => ({ file: 'checklist_tick_a.mp3', at, volume: 0.8 })),
  split: [{ file: 'camera_shutter_a.mp3', at: clipAt('split', 'narr_stihi') + 40, volume: 0.7 }],
  serve: [{ file: 'notify_ding_a.mp3', at: 4, volume: 0.7 }],
  bets: [{ file: 'card_pop_b.mp3', at: BETS_EV.sheetAt, volume: 0.6 }],
  mirror: [],
  greet: [{ file: 'notify_ding_a.mp3', at: clipEnd('greet', 'kostya_s09') - 6, volume: 0.7 }],
  seven: [{ file: 'card_pop_b.mp3', at: clipSecond('seven', 'eduard_s10', 3.3), volume: 0.6 }],
  order: [{ file: 'checklist_tick_a.mp3', at: clipEnd('order', 'narr_stejk') - 8, volume: 0.9 }],
  passline: [{ file: 'plate_rattle_a.mp3', at: 0, volume: 0.35, duration: 40, fade: 10 }],
  thought: [],
  freeze: [{ file: 'record_scratch_a.mp3', at: clipEnd('freeze', 'eduard_s14') + 4, volume: 0.8 }],
  fork: [...FORK.options.map((o) => ({ file: 'card_pop_b.mp3', at: o.at, volume: 0.7 })), { file: 'card_pop_b.mp3', at: FORK.voteAt, volume: 0.9 }],
};
