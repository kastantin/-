// Серия 4 «Холодная война» — тайминг по сценарию 01_SCRIPTS/ep04_holodnaya_vojna.md (30 FPS).
// Реплики ставятся в сцену по порядку, длина сцены считается из длины озвучки. Пока файлов озвучки нет —
// длительности берутся из таблицы оценок EST; когда озвучка записана, voice-data.ts и FILES подставляют настоящие.
// Все кадры — от начала своей сцены.
import { FILES, VOICE_DATA } from './voice-data';

export const EP04 = { episode: 4, title: 'Холодная война', ladderStep: 0 } as const;
export const FPS = 30;

// Озвучка героев играет чуть быстрее оригинала (высота голоса сохраняется), рассказчик — бодрее
export const VOICE_RATE = 1.15;
export const NARRATOR_RATE = 1.4;

export type SceneId =
  | 'printer'
  | 'comments'
  | 'counter'
  | 'onion'
  | 'split'
  | 'call'
  | 'rule'
  | 'slowmo'
  | 'freeze'
  | 'sotnya'
  | 'alive'
  | 'guest'
  | 'office'
  | 'heels'
  | 'closeup'
  | 'fork';

export type Speaker = 'kostya' | 'eduard' | 'dima' | 'gena' | 'beks' | 'guest' | 'owner' | 'narrator';

export function voiceFrames(sec: number, rate = VOICE_RATE): number {
  return Math.round((sec * FPS) / rate);
}

// Оценки длительности реплик (сек), пока нет озвучки
const EST: Record<string, number> = {
  gena_cheki: 3.8,
  narr_comments: 3.6,
  kostya_demo: 7.2,
  kostya_ledenik: 4.4,
  gena_kuhne: 4.8,
  gost_sorok: 3.0,
  kostya_idu: 2.4,
  beks_kuhnya: 5.6,
  kostya_druzyam: 2.6,
  beks_nikto: 3.8,
  narr_rule: 5.2,
  narr_lesson: 4.6,
  dima_chaevye: 8.2,
  gena_chto: 2.0,
  gena_luk: 1.8,
  gena_sotnya: 7.0,
  kostya_mest: 4.4,
  gost_bystro: 2.4,
  eduard_voyna: 5.2,
  owner_pare: 2.2,
  eduard_shepot: 4.0,
  kostya_beda: 5.0,
  narr_chto: 1.4,
  narr_A: 4.6,
  narr_B: 3.4,
  narr_svoy: 2.8,
  narr_golos: 5.6,
  narr_titry: 3.6,
};

function durationOf(id: string): number {
  const file = FILES[id];
  const data = file ? VOICE_DATA[file] : undefined;
  return data ? data.dur : (EST[id] ?? 3);
}

function speechOf(id: string): ReadonlyArray<readonly [number, number]> {
  const file = FILES[id];
  const data = file ? VOICE_DATA[file] : undefined;
  return data ? data.speech : [[0, durationOf(id)]];
}

// --- Реплики ---------------------------------------------------------------------
// text — субтитр (рассказчик не субтитруется: он читает то, что уже написано на экране);
// mat — где в файле звучит мат (секунды): голос там глушится, звучит «мяу»;
// gap — пауза перед репликой в кадрах (по умолчанию 8)
type Item = {
  id: string;
  speaker: Speaker;
  gap?: number;
  text?: string;
  highlight?: string;
  mat?: readonly [number, number];
};

const n = (id: string, gap?: number): Item => ({ id, speaker: 'narrator', gap });

const PLAN: ReadonlyArray<{ id: SceneId; lead: number; tail: number; clips: ReadonlyArray<Item> }> = [
  {
    id: 'printer',
    lead: 36,
    tail: 12,
    clips: [{ id: 'gena_cheki', speaker: 'gena', gap: 0, text: 'Забыл сказать, Константин. Чеки теперь печатаются… с очередью.', highlight: 'с очередью.' }],
  },
  {
    id: 'comments',
    lead: 4,
    tail: 8,
    clips: [
      n('narr_comments'),
      { id: 'kostya_demo', speaker: 'kostya', gap: 8, text: 'Двое написали «отдать друзьям». Третий прислал мем. Четвёртый — я сам. Демократия, [[блять]].', mat: [7.0, 7.66] },
    ],
  },
  {
    id: 'counter',
    lead: 12,
    tail: 10,
    clips: [{ id: 'kostya_ledenik', speaker: 'kostya', gap: 0, text: 'Двенадцать минут на раздаче — это уже не борщ. Это ледник.', highlight: 'Это ледник.' }],
  },
  {
    id: 'onion',
    lead: 24,
    tail: 10,
    clips: [{ id: 'gena_kuhne', speaker: 'gena', gap: 0, text: 'Кухне — ничего. Значит, и от кухни — ничего. Взаимно.', highlight: 'Взаимно.' }],
  },
  {
    id: 'split',
    lead: 4,
    tail: 8,
    clips: [
      { id: 'gost_sorok', speaker: 'guest', text: 'Молодой человек! Мы тут уже сорок минут!' },
      { id: 'kostya_idu', speaker: 'kostya', gap: 8, text: 'Уже иду… бегу… лечу.', highlight: 'лечу.' },
    ],
  },
  {
    id: 'call',
    lead: 40,
    tail: 8,
    clips: [
      { id: 'beks_kuhnya', speaker: 'beks', gap: 0, text: 'Ты кухню обидел. Кухню нельзя обижать. Кухня кормит.', highlight: 'Кухня кормит.' },
      { id: 'kostya_druzyam', speaker: 'kostya', gap: 6, text: 'Я же друзьям отдал, как обещал!' },
      { id: 'beks_nikto', speaker: 'beks', gap: 6, text: 'Друзьям — да. Теперь тебя кормить никто не будет.', highlight: 'никто не будет.' },
    ],
  },
  {
    id: 'rule',
    lead: 6,
    tail: 14,
    clips: [n('narr_rule'), n('narr_lesson', 14)],
  },
  {
    id: 'slowmo',
    lead: 20,
    tail: 16,
    clips: [{ id: 'dima_chaevye', speaker: 'dima', gap: 60, text: 'Гена… вот. Это мои чаевые за три дня. Триста рублей. Это за хлеб — за вчерашний.', highlight: 'за вчерашний.' }],
  },
  {
    id: 'freeze',
    lead: 30,
    tail: 24,
    clips: [
      { id: 'gena_chto', speaker: 'gena', gap: 0, text: 'Ты чё, [[блять]], совсем?', mat: [0.6, 0.95] },
      { id: 'gena_luk', speaker: 'gena', gap: 30, text: 'Лук. Это лук.', highlight: 'Это лук.' },
    ],
  },
  {
    id: 'sotnya',
    lead: 24,
    tail: 12,
    clips: [{ id: 'gena_sotnya', speaker: 'gena', gap: 0, text: 'Сотня — за уважение. Остальное — себе. А этому — передай: сначала спрашивает кухню.', highlight: 'сначала спрашивает кухню.' }],
  },
  {
    id: 'alive',
    lead: 30,
    tail: 24,
    clips: [{ id: 'kostya_mest', speaker: 'kostya', gap: 0, text: 'Кухня мстит. Зато остывает быстро — месть тоже.', highlight: 'месть тоже.' }],
  },
  {
    id: 'guest',
    lead: 36,
    tail: 30,
    clips: [{ id: 'gost_bystro', speaker: 'guest', gap: 0, text: 'А быстро, горячо и вкусно.', highlight: 'горячо и вкусно.' }],
  },
  {
    id: 'office',
    lead: 14,
    tail: 12,
    clips: [{ id: 'eduard_voyna', speaker: 'eduard', gap: 0, text: 'Холодную войну закончил… Молодец. Но у меня к тебе другой вопрос.', highlight: 'другой вопрос.' }],
  },
  {
    id: 'heels',
    lead: 96,
    tail: 24,
    clips: [
      { id: 'owner_pare', speaker: 'owner', gap: 0, text: 'Эдуард Борисович, на пару слов.' },
      { id: 'eduard_shepot', speaker: 'eduard', gap: 14, text: 'Хозяйка. Спросила про твоих друзей. Трое, без трудовых.', highlight: 'без трудовых.' },
    ],
  },
  {
    id: 'closeup',
    lead: 10,
    tail: 30,
    clips: [{ id: 'kostya_beda', speaker: 'kostya', gap: 0, text: 'Друзья познаются в беде. А я, кажется, в проблеме. [[Пиздец]].', mat: [4.42, 5.1] }],
  },
  {
    id: 'fork',
    lead: 2,
    tail: 30,
    clips: [n('narr_chto'), n('narr_A', 6), n('narr_B', 6), n('narr_svoy', 6), n('narr_golos', 6), n('narr_titry', 8)],
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
      placed.push({ ...item, at, end, rate, onScreen: item.speaker !== 'narrator' && item.speaker !== 'owner', file: FILES[item.id] ?? '' });
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
export const EP04_DURATION = SCENES[SCENES.length - 1].to;

export function sceneStart(id: SceneId): number {
  const scene = SCENES.find((s) => s.id === id);
  if (!scene) throw new Error(`Нет сцены ${id}`);
  return scene.from;
}

export function sceneLength(id: SceneId): number {
  const scene = SCENES.find((s) => s.id === id);
  if (!scene) throw new Error(`Нет сцены ${id}`);
  return scene.to - scene.from;
}

// Кадр начала реплики внутри сцены
export function clipAt(scene: SceneId, id: string): number {
  const clip = VOICE[scene].find((c) => c.id === id);
  if (!clip) throw new Error(`Нет реплики ${id} в сцене ${scene}`);
  return clip.at;
}

export function clipEnd(scene: SceneId, id: string): number {
  const clip = VOICE[scene].find((c) => c.id === id);
  if (!clip) throw new Error(`Нет реплики ${id} в сцене ${scene}`);
  return clip.end;
}

// Кадр внутри сцены, на котором в реплике звучит секунда `sec`
export function clipSecond(scene: SceneId, id: string, sec: number): number {
  const clip = VOICE[scene].find((c) => c.id === id);
  if (!clip) throw new Error(`Нет реплики ${id} в сцене ${scene}`);
  return clip.at + voiceFrames(sec, clip.rate);
}

// Отрезки речи персонажа в кадрах сцены — по ним двигается рот
export function speechSpans(scene: SceneId, who: Speaker): { from: number; to: number }[] {
  return VOICE[scene]
    .filter((c) => c.speaker === who && c.onScreen)
    .flatMap((c) => speechOf(c.id).map(([a, b]) => ({ from: c.at + voiceFrames(a, c.rate), to: c.at + voiceFrames(b, c.rate) })));
}

// --- Субтитры: из реплик персонажей ----------------------------------------------
// Мат в тексте — в двойных скобках: [[слово]]; он заменяется на 🤬 (единственная версия для всех площадок).
export type Ep04Cue = { from: number; to: number; text: string; speaker: Speaker; highlight?: string };

const SUBTITLE_PAD = 6;

export const SUBTITLES = Object.fromEntries(
  SCENES.map((s) => [
    s.id,
    VOICE[s.id]
      .filter((c) => c.text)
      .map((c) => ({ from: c.at, to: Math.min(c.end + SUBTITLE_PAD, s.to - s.from), text: c.text ?? '', speaker: c.speaker, highlight: c.highlight })),
  ]),
) as Record<SceneId, Ep04Cue[]>;

// Ремарки: «Урок первый…» читает рассказчик; на развилке — «Что делать Косте?»
export const REMARKS: Record<SceneId, { text: string; from: number; to: number }[]> = Object.fromEntries(
  SCENES.map((s) => {
    const len = s.to - s.from;
    if (s.id === 'rule') return [s.id, [{ text: 'Урок первый: не ссорься с теми, кто готовит тебе еду.', from: clipAt('rule', 'narr_lesson'), to: len }]];
    if (s.id === 'fork') return [s.id, [{ text: 'Что делать Косте?', from: 0, to: len }]];
    return [s.id, []];
  }),
) as Record<SceneId, { text: string; from: number; to: number }[]>;

// --- «Мяу» вместо мата (так же, как в сериях 2 и 3) ------------------------------------
export const CENSOR_MEOWS = ['meow_a.mp3', 'meow_b.mp3', 'meow_c.mp3'] as const;
export const CENSOR_VOLUME = 0.9;
export const CENSOR_TONE = 0.6;
export const MEOW_FRAMES = 15;

// Рот говорящего в координатах сцены (1080×720) после камеры; size — плашка 🤬
const MAT_MOUTHS: Partial<Record<SceneId, { x: number; y: number; size: number }>> = {
  comments: { x: 830, y: 462, size: 150 },
  freeze: { x: 540, y: 424, size: 190 },
  closeup: { x: 540, y: 523, size: 260 },
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

// --- Счётчик «ЧЕКОВ НА СТОЛАХ КОСТИ» в углу ----------------------------------------------
// Значение на начале и конце сцены; внутри сцены плавно меняется. Нет записи — счётчика нет.
export const COUNTER: Partial<Record<SceneId, readonly [number, number]>> = {
  counter: [14, 14],
  onion: [14, 16],
  split: [16, 18],
  call: [18, 21],
  slowmo: [23, 23],
  freeze: [23, 23],
  sotnya: [23, 23],
  alive: [23, 0],
  guest: [0, 0],
};

// --- Сценические события (привязаны к репликам) -------------------------------------
export const PRINTER = { rainFrom: 0, rainCount: 46 } as const;

export const COMMENTS_EV = {
  rowsAt: [0, 1, 2, 3].map((i) => clipAt('comments', 'narr_comments') + Math.round((voiceFrames(durationOf('narr_comments'), NARRATOR_RATE) / 4) * i)),
} as const;

export const RULE = {
  chipsAt: [0, 20, 40].map((d) => clipAt('rule', 'narr_lesson') + d),
} as const;

export const FREEZE = {
  twitchFrom: clipAt('freeze', 'gena_chto') + 10,
  turnAt: clipAt('freeze', 'gena_luk') - 4,
  sniffAt: clipAt('freeze', 'gena_luk'),
} as const;

const sotnya = clipAt('sotnya', 'gena_sotnya');
export const SOTNYA = {
  takeAt: sotnya + 14,
  giveBackAt: sotnya + 34,
  sweepFrom: sotnya + 70,
  sweepTo: sotnya + 120,
  nodAt: sotnya + 140,
} as const;

export const GUEST = { smileAt: clipAt('guest', 'gost_bystro') + 12, dingAt: 4 } as const;

export const HEELS = {
  shadowFrom: 0,
  shadowTo: clipAt('heels', 'owner_pare') - 4,
  knockAt: clipAt('heels', 'owner_pare') - 14,
} as const;

export const FORK = {
  options: [
    { badge: 'А', lines: ['Признаться', 'хозяйке: честно,', 'про всех троих'], at: clipAt('fork', 'narr_A') },
    { badge: 'Б', lines: ['Сказать, что это', 'была пробная', 'смена'], at: clipAt('fork', 'narr_B') },
    { badge: 'custom', lines: ['Свой вариант —', 'пишите', 'в комментариях'], at: clipAt('fork', 'narr_svoy') },
  ],
  voteText: 'Голосуй в Telegram',
  voteAt: clipAt('fork', 'narr_golos'),
  footnote: 'В прошлый раз писали комментарии. Пишите ещё.',
  footnoteAt: clipSecond('fork', 'narr_golos', 1.5),
  creditAt: clipAt('fork', 'narr_titry'),
  credit: 'спасибо за идею: qqebo, Питер Гриффин',
} as const;

// --- Звуки (дубли _a из 06_MUSIC_SFX; дубли пользователь пока не выбирал) ---------------
// duration — обрезка длинного звука (в кадрах), fade — плавное затухание в конце
export type SfxClip = { file: string; at: number; volume: number; duration?: number; fade?: number };

const L = (id: SceneId) => sceneLength(id);
const kitchen = (id: SceneId, volume = 0.18): SfxClip => ({ file: 'kitchen_ambience_a.mp3', at: 0, volume, duration: L(id), fade: 12 });

export const SFX: Record<SceneId, SfxClip[]> = {
  printer: [
    { file: 'receipt_printer_a.mp3', at: 0, volume: 0.75, duration: L('printer'), fade: 10 },
    { file: 'paper_rain_a.mp3', at: 16, volume: 0.5, duration: 60, fade: 15 },
  ],
  comments: COMMENTS_EV.rowsAt.map((at) => ({ file: 'card_pop_b.mp3', at, volume: 0.7 })),
  counter: [kitchen('counter')],
  onion: [kitchen('onion', 0.12), { file: 'knife_chop_a.mp3', at: 0, volume: 0.8, duration: L('onion'), fade: 12 }],
  split: [kitchen('split', 0.15)],
  call: [
    { file: 'phone_ring_a.mp3', at: 0, volume: 0.6, duration: 40, fade: 8 },
    { file: 'car_rain_wipers_a.mp3', at: 36, volume: 0.35, duration: L('call') - 36, fade: 15 },
  ],
  rule: RULE.chipsAt.map((at) => ({ file: 'checklist_tick_a.mp3', at, volume: 0.8 })),
  slowmo: [{ file: 'sad_melody_a.mp3', at: 0, volume: 0.4, duration: L('slowmo'), fade: 30 }],
  freeze: [{ file: 'sniff_a.mp3', at: FREEZE.sniffAt, volume: 0.9 }],
  sotnya: [
    { file: 'card_pop_b.mp3', at: SOTNYA.takeAt, volume: 0.7 },
    { file: 'whoosh_a.mp3', at: SOTNYA.sweepFrom, volume: 0.6 },
  ],
  alive: [
    kitchen('alive', 0.22),
    { file: 'plate_rattle_a.mp3', at: 0, volume: 0.7, duration: 60, fade: 15 },
    { file: 'running_steps_a.mp3', at: 0, volume: 0.5, duration: L('alive'), fade: 15 },
  ],
  guest: [
    { file: 'notify_ding_a.mp3', at: GUEST.dingAt, volume: 0.9 },
    { file: 'plate_rattle_a.mp3', at: 14, volume: 0.5, duration: 40, fade: 12 },
  ],
  office: [],
  heels: [{ file: 'heels_knock_a.mp3', at: 0, volume: 0.85 }],
  closeup: [],
  fork: [
    ...FORK.options.map((o) => ({ file: 'card_pop_b.mp3', at: o.at, volume: 0.7 })),
    { file: 'card_pop_b.mp3', at: FORK.voteAt, volume: 0.9 },
  ],
};
