// Серия 5 «Дружба дружбой» — тайминг по сценарию 01_SCRIPTS/ep05_druzhba_druzhboj.md и по озвучке 05_VOICE/ep05 (30 FPS).
// Реплики ставятся в сцену по порядку, длина сцены считается из длины файлов; все кадры — от начала своей сцены.
import { FILES, VOICE_DATA } from './voice-data';

export const EP05 = { episode: 5, title: 'Дружба дружбой', ladderStep: 0 } as const;
export const FPS = 30;

// Озвучка героев играет чуть быстрее оригинала (высота голоса сохраняется), рассказчик — бодрее
export const VOICE_RATE = 1.15;
export const NARRATOR_RATE = 1.4;

export type SceneId =
  | 'chat'
  | 'freeze'
  | 'poll'
  | 'office1'
  | 'ledger'
  | 'checklist'
  | 'call'
  | 'montage'
  | 'smile'
  | 'mirror'
  | 'office2'
  | 'eduard'
  | 'wall'
  | 'door'
  | 'fork';

export type Speaker = 'kostya' | 'eduard' | 'beks' | 'akhma' | 'nadir' | 'guest' | 'owner' | 'narrator';

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
    id: 'chat',
    lead: 14,
    tail: 14,
    clips: [
      n('narr_chat'),
      { id: 'margarita_chat', speaker: 'owner', gap: 8, text: 'Соседей вчера проверили. Трое без трудовых. Сто тысяч штрафа.', highlight: 'Сто тысяч штрафа.' },
      n('narr_tsifra', 6),
    ],
  },
  {
    id: 'freeze',
    lead: 8,
    tail: 12,
    clips: [
      n('narr_plashka_kostya'),
      n('narr_plashka_eduard', 6),
      n('narr_plashka_margarita', 6),
      { id: 'kostya_priznalsya', speaker: 'kostya', gap: 10, text: 'Да, это я признался. И да — это был ваш выбор.', highlight: 'ваш выбор.' },
    ],
  },
  {
    id: 'poll',
    lead: 8,
    tail: 12,
    clips: [
      n('narr_tablo'),
      { id: 'kostya_tri', speaker: 'kostya', gap: 8, text: 'Три голоса! Это уже не ноль, это тренд. Спасибо, трое. Вы меня, [[блять]], погубили.', mat: [5.2, 5.82] },
    ],
  },
  {
    id: 'office1',
    lead: 14,
    tail: 12,
    clips: [
      { id: 'eduard_ne_videl', speaker: 'eduard', gap: 0, text: 'Я «ничего не видел»? Ты сказал хозяйке, что я ничего не видел!' },
      { id: 'kostya_pravda', speaker: 'kostya', gap: 6, text: 'Я сказал правду.' },
      { id: 'eduard_sovral', speaker: 'eduard', gap: 6, text: 'Лучше бы ты соврал.', highlight: 'соврал.' },
    ],
  },
  {
    id: 'ledger',
    lead: 14,
    tail: 14,
    clips: [
      { id: 'kostya_vse_tak', speaker: 'kostya', gap: 0, text: 'Так ведь все так работают…' },
      { id: 'margarita_proverka', speaker: 'owner', gap: 8, text: 'Все — до первой проверки. Мне не жалко, что вы работаете. Мне жалко сто тысяч.', highlight: 'Мне жалко сто тысяч.' },
    ],
  },
  {
    id: 'checklist',
    lead: 8,
    tail: 12,
    clips: [
      { id: 'kostya_oformim', speaker: 'kostya', gap: 0, text: 'Двое заболели, трое спасли банкет. Давайте оформим.' },
      n('narr_chek', 8),
      { id: 'margarita_oformim', speaker: 'owner', gap: 8, text: 'Оформим. Трудовой, медкнижка, три дня. И Эдуард Борисович остаётся без премии.', highlight: 'остаётся без премии.' },
      { id: 'eduard_konechno', speaker: 'eduard', gap: 8, text: 'Ну конечно.' },
    ],
  },
  {
    id: 'call',
    lead: 24,
    tail: 12,
    clips: [
      { id: 'beks_uslovie', speaker: 'beks', gap: 0, text: 'Меня — оформить? Нормально. Но у меня условие: я не ниже тебя по должности.', highlight: 'я не ниже тебя по должности.' },
      { id: 'kostya_raznica', speaker: 'kostya', gap: 6, text: 'Какая разница?' },
      { id: 'beks_uvidish', speaker: 'beks', gap: 6, text: 'Увидишь.' },
    ],
  },
  {
    id: 'montage',
    lead: 6,
    tail: 70,
    clips: [
      { id: 'akhma_grafa', speaker: 'akhma', text: 'Графа «вредные привычки». «Не зашиваюсь» вписывать?' },
      { id: 'nadir_pishi', speaker: 'nadir', gap: 14, text: 'Пиши «работать».', highlight: 'работать».' },
    ],
  },
  {
    id: 'smile',
    lead: 24,
    tail: 22,
    clips: [
      { id: 'gost_ulybaetsya', speaker: 'guest', gap: 0, text: 'А можно, чтоб нас обслуживал тот, который улыбается?' },
      { id: 'kostya_ulybayus', speaker: 'kostya', gap: 10, text: 'Я улыбаюсь. Просто не во весь рот.', highlight: 'Просто не во весь рот.' },
    ],
  },
  {
    id: 'mirror',
    lead: 14,
    tail: 26,
    clips: [{ id: 'kostya_servis', speaker: 'kostya', gap: 0, text: 'Сервис — это улыбка. А у меня — ухмылка с высшим образованием.', highlight: 'ухмылка с высшим образованием.' }],
  },
  {
    id: 'office2',
    lead: 14,
    tail: 14,
    clips: [
      { id: 'margarita_pyatnica', speaker: 'owner', gap: 0, text: 'В пятницу я выбираю старшего официанта. Теперь вас двое.', highlight: 'Теперь вас двое.' },
      { id: 'beks_nichego', speaker: 'beks', gap: 8, text: 'Ничего личного, брат.' },
      { id: 'kostya_polotence', speaker: 'kostya', gap: 8, text: 'Ничего личного. Только полотенце на руке — моё.', highlight: 'полотенце на руке — моё.' },
    ],
  },
  {
    id: 'eduard',
    lead: 12,
    tail: 14,
    clips: [
      { id: 'eduard_dvadcat', speaker: 'eduard', gap: 0, text: 'Двадцать лет в общепите. Видел драки за чаевые, за смены. Но чтобы за должность — два друга…' },
      { id: 'kostya_podderzhite', speaker: 'kostya', gap: 8, text: 'Эдуард Борисович, поддержите?' },
      { id: 'eduard_ne_videl2', speaker: 'eduard', gap: 10, text: 'Я ничего не видел.', highlight: 'ничего не видел.' },
    ],
  },
  {
    id: 'wall',
    lead: 14,
    tail: 16,
    clips: [
      { id: 'nadir_storona', speaker: 'nadir', gap: 0, text: 'Мы вообще на чьей стороне?' },
      { id: 'akhma_goryachee', speaker: 'akhma', gap: 8, text: 'Мы — на стороне горячего.', highlight: 'на стороне горячего.' },
    ],
  },
  {
    id: 'door',
    lead: 12,
    tail: 30,
    clips: [{ id: 'kostya_druzhba', speaker: 'kostya', gap: 0, text: 'Дружба дружбой, а должность врозь.', highlight: 'а должность врозь.' }],
  },
  {
    id: 'fork',
    lead: 2,
    tail: 30,
    clips: [n('narr_chto'), n('narr_A', 6), n('narr_B', 6), n('narr_svoy', 6), n('narr_golos', 6)],
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
      placed.push({ ...item, at, end, rate, onScreen: item.speaker !== 'narrator', file: FILES[item.id] ?? '' });
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
export const EP05_DURATION = SCENES[SCENES.length - 1].to;

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

function find(scene: SceneId, id: string): PlacedClip {
  const clip = VOICE[scene].find((c) => c.id === id);
  if (!clip) throw new Error(`Нет реплики ${id} в сцене ${scene}`);
  return clip;
}

// Кадр начала и конца реплики внутри сцены
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

// --- Субтитры: из реплик персонажей ----------------------------------------------
// Мат в тексте — в двойных скобках: [[слово]]; он заменяется на 🤬 (единственная версия для всех площадок).
export type Ep05Cue = { from: number; to: number; text: string; speaker: Speaker; highlight?: string };

const SUBTITLE_PAD = 6;

export const SUBTITLES = Object.fromEntries(
  SCENES.map((s) => [
    s.id,
    VOICE[s.id]
      .filter((c) => c.text)
      .map((c) => ({ from: c.at, to: Math.min(c.end + SUBTITLE_PAD, s.to - s.from), text: c.text ?? '', speaker: c.speaker, highlight: c.highlight })),
  ]),
) as Record<SceneId, Ep05Cue[]>;

export const REMARKS: Record<SceneId, { text: string; from: number; to: number }[]> = Object.fromEntries(
  SCENES.map((s) => [s.id, s.id === 'fork' ? [{ text: 'Что делать Косте?', from: 0, to: s.to - s.from }] : []]),
) as Record<SceneId, { text: string; from: number; to: number }[]>;

// --- «Мяу» вместо мата (так же, как в сериях 2–4) --------------------------------------
export const CENSOR_MEOWS = ['meow_a.mp3', 'meow_b.mp3', 'meow_c.mp3'] as const;
export const CENSOR_VOLUME = 0.9;
export const CENSOR_TONE = 0.6;
export const MEOW_FRAMES = 15;

// Рот говорящего в координатах сцены (1080×720) после камеры; size — плашка 🤬
const MAT_MOUTHS: Partial<Record<SceneId, { x: number; y: number; size: number }>> = {
  poll: { x: 860, y: 442, size: 150 },
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

// --- Таймер «ДО ПЯТНИЦЫ» в углу: с сцены 4 «3 ДНЯ», с сцены 11 «2 ДНЯ» ---------------------------
export const TIMER_LABEL: Partial<Record<SceneId, string>> = {
  office1: '3 ДНЯ',
  ledger: '3 ДНЯ',
  checklist: '3 ДНЯ',
  call: '3 ДНЯ',
  montage: '3 ДНЯ',
  smile: '3 ДНЯ',
  mirror: '3 ДНЯ',
  office2: '2 ДНЯ',
  eduard: '2 ДНЯ',
  wall: '2 ДНЯ',
  door: '2 ДНЯ',
};

// --- Сценические события (привязаны к репликам) -------------------------------------
export const CHAT = { bigAt: clipAt('chat', 'narr_tsifra') } as const;

export const FREEZE = {
  plateAt: [clipAt('freeze', 'narr_plashka_kostya'), clipAt('freeze', 'narr_plashka_eduard'), clipAt('freeze', 'narr_plashka_margarita')],
} as const;

export const POLL = { barsAt: clipAt('poll', 'narr_tablo'), plateAt: clipAt('poll', 'narr_tablo') + 14 } as const;

const proverka = clipAt('ledger', 'margarita_proverka');
export const LEDGER = { circlesAt: [proverka + 24, proverka + 62, proverka + 100] } as const;

const chek = find('checklist', 'narr_chek');
export const CHECKLIST_EV = {
  itemsAt: [0, 1, 2, 3].map((i) => chek.at + Math.round(((chek.end - chek.at) / 4) * i)),
} as const;

const akhmaClip = find('montage', 'akhma_grafa');
const nadirClip = find('montage', 'nadir_pishi');
export const MONTAGE = {
  breakFrom: akhmaClip.end - 14,
  breakTo: akhmaClip.end + 4,
  cutQueue: nadirClip.at - 4,
  cutStamp: nadirClip.end + 8,
} as const;

export const SMILE = { snapAt: clipAt('smile', 'gost_ulybaetsya') + 4, beksAt: clipAt('smile', 'gost_ulybaetsya') } as const;

export const FORK = {
  options: [
    { badge: 'А', lines: ['Честно', 'соревноваться', 'с Бексом до', 'пятницы'], at: clipAt('fork', 'narr_A') },
    { badge: 'Б', lines: ['Подсунуть', 'Бексу самый', 'злой стол'], at: clipAt('fork', 'narr_B') },
    { badge: 'custom', lines: ['Свой вариант —', 'пишите', 'в комментариях'], at: clipAt('fork', 'narr_svoy') },
  ],
  voteText: 'Голосуй в Telegram',
  voteAt: clipAt('fork', 'narr_golos'),
  footnote: 'Голоса растут: 0 → 0 → 2 → 3. Следующий — 4?',
  footnoteAt: clipSecond('fork', 'narr_golos', 1.8),
} as const;

// --- Звуки (дубли _a из 06_MUSIC_SFX; дубли пользователь пока не выбирал) ---------------
// duration — обрезка длинного звука (в кадрах), fade — плавное затухание в конце
export type SfxClip = { file: string; at: number; volume: number; duration?: number; fade?: number };

const L = (id: SceneId) => sceneLength(id);

export const SFX: Record<SceneId, SfxClip[]> = {
  chat: [
    { file: 'notify_ding_a.mp3', at: 0, volume: 0.7 },
    { file: 'cash_register_a.mp3', at: CHAT.bigAt, volume: 0.85 },
  ],
  freeze: [
    { file: 'record_scratch_a.mp3', at: 0, volume: 0.8 },
    ...FREEZE.plateAt.map((at) => ({ file: 'card_pop_b.mp3', at, volume: 0.7 })),
  ],
  poll: [
    { file: 'card_pop_b.mp3', at: POLL.barsAt, volume: 0.7 },
    { file: 'notify_ding_a.mp3', at: POLL.plateAt, volume: 0.8 },
  ],
  office1: [{ file: 'whoosh_a.mp3', at: 8, volume: 0.5 }],
  ledger: [
    { file: 'paper_flip_a.mp3', at: 0, volume: 0.6, duration: 45, fade: 10 },
    ...LEDGER.circlesAt.map((at) => ({ file: 'red_pen_circle_a.mp3', at, volume: 0.8 })),
  ],
  checklist: [
    { file: 'paper_flip_a.mp3', at: 0, volume: 0.5, duration: 30, fade: 8 },
    ...CHECKLIST_EV.itemsAt.map((at) => ({ file: 'checklist_tick_a.mp3', at, volume: 0.8 })),
  ],
  call: [
    { file: 'phone_ring_a.mp3', at: 0, volume: 0.55, duration: 28, fade: 6 },
    { file: 'whisper_ambience_a.mp3', at: 20, volume: 0.25, duration: L('call') - 20, fade: 15 },
  ],
  montage: [
    { file: 'pen_break_a.mp3', at: MONTAGE.breakFrom + 4, volume: 0.9 },
    { file: 'crowd_murmur_a.mp3', at: MONTAGE.cutQueue, volume: 0.25, duration: MONTAGE.cutStamp - MONTAGE.cutQueue, fade: 8 },
    { file: 'stamp_thud_a.mp3', at: MONTAGE.cutStamp + 6, volume: 0.9 },
    { file: 'stamp_thud_a.mp3', at: MONTAGE.cutStamp + 30, volume: 0.9 },
    { file: 'stamp_thud_a.mp3', at: MONTAGE.cutStamp + 54, volume: 0.9 },
  ],
  smile: [
    { file: 'checklist_tick_a.mp3', at: SMILE.snapAt, volume: 0.9 },
    { file: 'notify_ding_a.mp3', at: SMILE.beksAt + 20, volume: 0.6 },
  ],
  mirror: [],
  office2: [{ file: 'whoosh_a.mp3', at: 6, volume: 0.5 }],
  eduard: [],
  wall: [
    { file: 'tea_clink_a.mp3', at: 0, volume: 0.6 },
    { file: 'tea_clink_a.mp3', at: 70, volume: 0.5 },
  ],
  door: [],
  fork: [
    ...FORK.options.map((o) => ({ file: 'card_pop_b.mp3', at: o.at, volume: 0.7 })),
    { file: 'card_pop_b.mp3', at: FORK.voteAt, volume: 0.9 },
  ],
};
