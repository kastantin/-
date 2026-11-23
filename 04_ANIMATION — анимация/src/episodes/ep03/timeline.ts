// Серия 3 «Друзья» — тайминг по сценарию 01_SCRIPTS/ep03_druzya.md и по озвучке 05_VOICE/ep03 (30 FPS).
// Реплики ставятся в сцену по порядку, длина сцены считается из длины файлов; все кадры — от начала своей сцены.
import { VOICE_DATA } from './voice-data';

export const EP03 = { episode: 3, title: 'Друзья', ladderStep: 0 } as const;
export const FPS = 30;

// Озвучка героев играет чуть быстрее оригинала (высота голоса сохраняется), рассказчик — ещё бодрее
export const VOICE_RATE = 1.15;
export const NARRATOR_RATE = 1.4;

export type SceneId =
  | 'hook'
  | 'poll'
  | 'idea'
  | 'call'
  | 'beks'
  | 'akhma'
  | 'nadir'
  | 'office'
  | 'timing'
  | 'montage'
  | 'hotrush'
  | 'cake'
  | 'relief'
  | 'envelope'
  | 'whisper'
  | 'fork';

export type Speaker = 'kostya' | 'eduard' | 'dima' | 'gena' | 'beks' | 'akhma' | 'nadir' | 'tamada' | 'narrator';

// Секунды внутри файла → кадры с учётом ускорения
export function voiceFrames(sec: number, rate = VOICE_RATE): number {
  return Math.round((sec * FPS) / rate);
}

// --- Реплики ---------------------------------------------------------------------
// text — субтитр (рассказчик не субтитруется: он читает то, что уже написано на экране);
// mat — где в файле звучит мат (секунды): голос там глушится, звучит «мяу»;
// gap — пауза перед репликой в кадрах (по умолчанию 8)
type Item = {
  file: string;
  speaker: Speaker;
  gap?: number;
  text?: string;
  highlight?: string;
  mat?: readonly [number, number];
};

const n = (file: string, gap?: number): Item => ({ file, speaker: 'narrator', gap });

const PLAN: ReadonlyArray<{ id: SceneId; lead: number; tail: number; clips: ReadonlyArray<Item> }> = [
  {
    id: 'hook',
    lead: 4,
    tail: 10,
    clips: [
      n('narr_sc01_banket.mp3'),
      { file: 's01_01_gena.mp3', speaker: 'gena', gap: 12, text: 'Сорок горячих разом? На двоих? Вы там [[охуели]]?!', mat: [3.8, 4.45] },
    ],
  },
  {
    id: 'poll',
    lead: 4,
    tail: 8,
    clips: [
      { file: 's02_01_kostya.mp3', speaker: 'kostya', text: 'Ноль голосов. Опять. Но один комментарий! Нас смотрит целый человек. Привет, me.', highlight: 'Привет, me.' },
      n('narr_sc02_kommentarii.mp3', 4),
    ],
  },
  {
    id: 'idea',
    lead: 4,
    tail: 8,
    clips: [
      n('narr_sc03_pozvat.mp3'),
      n('narr_sc03_idea.mp3', 2),
      { file: 's03_01_kostya.mp3', speaker: 'kostya', gap: 6, text: 'Народ сказал — звать друзей. Народ мудрый. Народ — это один человек, но мудрый.', highlight: 'но мудрый.' },
    ],
  },
  {
    id: 'call',
    lead: 58,
    tail: 8,
    clips: [{ file: 's04_01_kostya.mp3', speaker: 'kostya', gap: 0, text: 'Пацаны. Банкет. Сорок человек. Сегодня.', highlight: 'Сегодня.' }],
  },
  {
    id: 'beks',
    lead: 18,
    tail: 8,
    clips: [
      n('narr_sc05_beks.mp3', 0),
      { file: 's05_01_beks.mp3', speaker: 'beks', gap: 6, text: 'Гость щёлкнул пальцами — я улыбнулся. Гость плакал. От счастья.', highlight: 'От счастья.' },
    ],
  },
  {
    id: 'akhma',
    lead: 18,
    tail: 8,
    clips: [
      n('narr_sc06_akhma.mp3', 0),
      { file: 's06_01_akhma.mp3', speaker: 'akhma', gap: 6, text: 'Восемь — это разминка.', highlight: 'разминка.' },
    ],
  },
  {
    id: 'nadir',
    lead: 18,
    tail: 8,
    clips: [
      n('narr_sc07_nadir.mp3', 0),
      n('narr_sc07_svoboden.mp3', 20),
      { file: 's07_01_nadir.mp3', speaker: 'nadir', gap: 8, text: 'Ну я пришёл.' },
    ],
  },
  {
    id: 'office',
    lead: 6,
    tail: 10,
    clips: [
      { file: 's08_01_eduard.mp3', speaker: 'eduard', text: 'Это кто? Они у нас не оформлены. Кто им платить будет, [[нахуй]]?', mat: [3.5, 4.05] },
      { file: 's08_01_kostya.mp3', speaker: 'kostya', gap: 6, text: 'Из моих чаевых.', highlight: 'чаевых.' },
      { file: 's08_02_eduard.mp3', speaker: 'eduard', gap: 10, text: 'Я ничего не видел.' },
    ],
  },
  {
    id: 'timing',
    lead: 4,
    tail: 10,
    clips: [
      n('narr_sc09_timing.mp3'),
      { file: 's09_01_kostya.mp3', speaker: 'kostya', gap: 8, text: 'Главное правило банкета: горячее — по команде тамады. Не раньше.', highlight: 'Не раньше.' },
    ],
  },
  {
    id: 'montage',
    lead: 6,
    tail: 14,
    clips: [{ file: 's10_01_beks.mp3', speaker: 'beks', text: 'Для вас — лучший стол. Он, правда, такой же, как все, но для вас — лучший.', highlight: 'для вас — лучший.' }],
  },
  {
    id: 'hotrush',
    lead: 4,
    tail: 10,
    clips: [
      { file: 's11_03_tamada.mp3', speaker: 'tamada', text: 'А сейчас — тост за…' },
      { file: 's11_04_tamada.mp3', speaker: 'tamada', gap: 10, text: '…за горячее, видимо.', highlight: 'видимо.' },
      { file: 's11_01_kostya.mp3', speaker: 'kostya', gap: 6, text: 'Ахма! Рано!' },
      { file: 's11_02_akhma.mp3', speaker: 'akhma', gap: 6, text: 'Я не зашиваюсь. Я опережаю.', highlight: 'Я опережаю.' },
    ],
  },
  {
    id: 'cake',
    lead: 16,
    tail: 14,
    clips: [
      { file: 's12_01_gena.mp3', speaker: 'gena', text: 'Ты кто, [[блять]], такой?', mat: [0.62, 1.12] },
      { file: 's12_02_nadir.mp3', speaker: 'nadir', gap: 56, text: 'Обычный официант.', highlight: 'Обычный' },
    ],
  },
  {
    id: 'relief',
    lead: 6,
    tail: 14,
    clips: [{ file: 's13_01_kostya.mp3', speaker: 'kostya', text: 'Друзья познаются в беде. А официанты — на банкете.', highlight: 'А официанты — на банкете.' }],
  },
  {
    id: 'envelope',
    lead: 52,
    tail: 10,
    clips: [
      n('narr_sc14_tips.mp3', 0),
      { file: 's14_01_gena.mp3', speaker: 'gena', gap: 26, text: 'Кухне, вообще-то, тоже положено.' },
      { file: 's14_01_dima.mp3', speaker: 'dima', gap: 6, text: 'Я тоже… хлеб резал. Заранее.', highlight: 'Заранее.' },
    ],
  },
  {
    id: 'whisper',
    lead: 8,
    tail: 26,
    clips: [{ file: 's15_01_eduard.mp3', speaker: 'eduard', text: 'И, кстати. Хозяйка спрашивает, кто эти трое.', highlight: 'кто эти трое.' }],
  },
  {
    id: 'fork',
    lead: 2,
    tail: 30,
    clips: [
      n('narr_sc16a_chto.mp3'),
      n('narr_sc16b_A.mp3', 6),
      n('narr_sc16c_B.mp3', 6),
      n('narr_sc16d_svoy.mp3', 6),
      n('narr_sc16e_golosuy.mp3', 6),
      n('narr_sc16f_titry.mp3', 8),
    ],
  },
];

export type PlacedClip = Item & { at: number; end: number; rate: number; onScreen: boolean };

function place(): { scenes: { id: SceneId; from: number; to: number }[]; clips: Record<SceneId, PlacedClip[]> } {
  const clips = {} as Record<SceneId, PlacedClip[]>;
  const scenes: { id: SceneId; from: number; to: number }[] = [];
  let start = 0;
  for (const scene of PLAN) {
    let cursor = scene.lead;
    const placed: PlacedClip[] = [];
    scene.clips.forEach((item, i) => {
      const data = VOICE_DATA[item.file];
      if (!data) throw new Error(`Нет данных озвучки для ${item.file}`);
      const rate = item.speaker === 'narrator' ? NARRATOR_RATE : VOICE_RATE;
      const at = i === 0 ? scene.lead + (item.gap ?? 0) : cursor + (item.gap ?? 8);
      const end = at + voiceFrames(data.dur, rate);
      cursor = end;
      placed.push({ ...item, at, end, rate, onScreen: item.speaker !== 'narrator' });
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
export const EP03_DURATION = SCENES[SCENES.length - 1].to;

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
export function clipAt(scene: SceneId, file: string): number {
  const clip = VOICE[scene].find((c) => c.file === file);
  if (!clip) throw new Error(`Нет реплики ${file} в сцене ${scene}`);
  return clip.at;
}

// Кадр внутри сцены, на котором в файле звучит секунда `sec`
export function clipSecond(scene: SceneId, file: string, sec: number): number {
  const clip = VOICE[scene].find((c) => c.file === file);
  if (!clip) throw new Error(`Нет реплики ${file} в сцене ${scene}`);
  return clip.at + voiceFrames(sec, clip.rate);
}

// Отрезки речи персонажа в кадрах сцены — по ним двигается рот
export function speechSpans(scene: SceneId, who: Speaker): { from: number; to: number }[] {
  return VOICE[scene]
    .filter((c) => c.speaker === who && c.onScreen)
    .flatMap((c) => VOICE_DATA[c.file].speech.map(([a, b]) => ({ from: c.at + voiceFrames(a, c.rate), to: c.at + voiceFrames(b, c.rate) })));
}

// --- Субтитры: из реплик персонажей ----------------------------------------------
// Мат в тексте — в двойных скобках: [[слово]]; он заменяется на 🤬 (единственная версия для всех площадок).
export type Ep03Cue = { from: number; to: number; text: string; speaker: Speaker; highlight?: string };

const SUBTITLE_PAD = 6;

export const SUBTITLES = Object.fromEntries(
  SCENES.map((s) => [
    s.id,
    VOICE[s.id]
      .filter((c) => c.text)
      .map((c) => ({ from: c.at, to: Math.min(c.end + SUBTITLE_PAD, s.to - s.from), text: c.text ?? '', speaker: c.speaker, highlight: c.highlight })),
  ]),
) as Record<SceneId, Ep03Cue[]>;

export const REMARKS: Record<SceneId, { text: string; from: number; to: number }[]> = Object.fromEntries(
  SCENES.map((s) => [s.id, s.id === 'fork' ? [{ text: 'Что делать Косте?', from: 0, to: s.to - s.from }] : []]),
) as Record<SceneId, { text: string; from: number; to: number }[]>;

// --- «Мяу» вместо мата ---------------------------------------------------------------
// Окно мата — из реплики; рот говорящего в координатах сцены (1080×720) уже после камеры, size — размер плашки 🤬
export const CENSOR_MEOWS = ['meow_a.mp3', 'meow_b.mp3', 'meow_c.mp3'] as const;
export const CENSOR_VOLUME = 0.9;
// «мяу» ниже по тону (просьба пользователя для серии 2, так же и здесь)
export const CENSOR_TONE = 0.6;
export const MEOW_FRAMES = 15;

const MAT_MOUTHS: Partial<Record<SceneId, { x: number; y: number; size: number }>> = {
  hook: { x: 508, y: 299, size: 150 },
  office: { x: 760, y: 396, size: 90 },
  cake: { x: 540, y: 292, size: 100 },
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

// --- Тайминг банкета в углу (сцены 10–13): время и текущий пункт -------------------------
export const BANQUET_ITEMS = ['закуски', 'горячее', 'торт'] as const;

export const BANQUET_CLOCK: Partial<Record<SceneId, { time: string; active: number; alarm?: boolean }>> = {
  montage: { time: '18:20', active: 0 },
  hotrush: { time: '18:40', active: 1, alarm: true },
  cake: { time: '18:55', active: 2 },
  relief: { time: '19:30', active: 2 },
};

// --- Сценические события (привязаны к репликам) -------------------------------------
const narrAt = (file: string, sec: number, scene: SceneId) => clipSecond(scene, file, sec);

export const HOOK = {
  dropAt: clipAt('hook', 's01_01_gena.mp3') - 8,
  surpriseAt: clipAt('hook', 'narr_sc01_banket.mp3') + 70,
  shoutAt: clipAt('hook', 's01_01_gena.mp3'),
} as const;

export const POLL = {
  commentAt: clipSecond('poll', 's02_01_kostya.mp3', 2.35),
  catAt: clipSecond('poll', 's02_01_kostya.mp3', 6.25),
  smirkAt: clipSecond('poll', 's02_01_kostya.mp3', 2.35),
} as const;

export const IDEA = {
  stampAt: clipAt('idea', 'narr_sc03_idea.mp3'),
  phoneAt: clipAt('idea', 's03_01_kostya.mp3'),
} as const;

export const CREW_PLATES = {
  beks: { name: 'БЕКС', role: 'официант года' },
  akhma: { name: 'АХМА', role: 'силач года', small: 'ни разу не зашивался' },
  nadir: { name: 'НАДИР', role: 'обычный официант', extra: '…свободен в пятницу', extraAt: clipAt('nadir', 'narr_sc07_svoboden.mp3') - 2 },
} as const;

export const OFFICE = {
  tiredAt: clipAt('office', 's08_02_eduard.mp3') - 4,
  kostyaHappyAt: clipAt('office', 's08_01_kostya.mp3') + 4,
} as const;

export const TIMING_ROWS = [
  { time: '18:00', label: 'закуски' },
  { time: '19:00', label: 'горячее', note: 'по команде тамады!' },
  { time: '20:30', label: 'торт' },
] as const;

export const TIMING = {
  rowsAt: [1.56, 4.07, 8.03].map((sec) => narrAt('narr_sc09_timing.mp3', sec, 'timing')),
  highlightAt: narrAt('narr_sc09_timing.mp3', 6.42, 'timing'),
} as const;

export const MONTAGE = { cutAt: Math.round(sceneLength('montage') * 0.5) } as const;

export const HOTRUSH = {
  akhmaFrom: clipAt('hotrush', 's11_03_tamada.mp3') + 8,
  akhmaTo: clipAt('hotrush', 's11_03_tamada.mp3') + 68,
  freezeAt: clipAt('hotrush', 's11_03_tamada.mp3') + voiceFrames(VOICE_DATA['s11_03_tamada.mp3'].dur),
  kostyaShoutAt: clipAt('hotrush', 's11_01_kostya.mp3'),
  kostyaPanicAt: clipAt('hotrush', 's11_02_akhma.mp3'),
} as const;

const cakeNadir = clipAt('cake', 's12_02_nadir.mp3');
export const CAKE = {
  tiersAt: [22, 50, 78],
  berriesFrom: 90,
  topBerryAt: cakeNadir + 8,
  genaCalmAt: cakeNadir - 12,
} as const;

export const RELIEF = { puffFrom: 14, puffTo: 52, happyAt: 40 } as const;

const envNarr = clipAt('envelope', 'narr_sc14_tips.mp3');
export const ENVELOPE = {
  passFrom: 12,
  passTo: 38,
  zoomIn: envNarr - 8,
  zoomOut: envNarr + voiceFrames(VOICE_DATA['narr_sc14_tips.mp3'].dur, NARRATOR_RATE) + 4,
  plateAt: envNarr,
} as const;

export const WHISPER = { enterTo: 14, zoomAt: clipAt('whisper', 's15_01_eduard.mp3') + voiceFrames(VOICE_DATA['s15_01_eduard.mp3'].dur) - 6 } as const;

export const FORK = {
  options: [
    { badge: 'А', lines: ['Поделить чаевые', 'на всех: друзья,', 'кухня, Дима'], at: clipAt('fork', 'narr_sc16b_A.mp3') },
    { badge: 'Б', lines: ['Отдать всё', 'друзьям —', 'как обещал'], at: clipAt('fork', 'narr_sc16c_B.mp3') },
    { badge: 'custom', lines: ['Свой вариант —', 'пишите', 'в комментариях'], at: clipAt('fork', 'narr_sc16d_svoy.mp3') },
  ],
  voteText: 'Голосуй в Telegram',
  voteAt: clipAt('fork', 'narr_sc16e_golosuy.mp3'),
  footnote: 'В прошлый раз 1 комментарий решил всю серию. Ваш может быть следующим.',
  footnoteAt: narrAt('narr_sc16e_golosuy.mp3', 1.55, 'fork'),
  creditAt: clipAt('fork', 'narr_sc16f_titry.mp3'),
  credit: 'идея серии: me',
} as const;

// --- Звуки (дубли _a из 06_MUSIC_SFX; дубли пользователь пока не выбирал) ---------------
// duration — обрезка длинного звука (в кадрах), fade — плавное затухание в конце
export type SfxClip = { file: string; at: number; volume: number; duration?: number; fade?: number };

const L = (id: SceneId) => sceneLength(id);

export const SFX: Record<SceneId, SfxClip[]> = {
  hook: [
    { file: 'kitchen_ambience_a.mp3', at: 0, volume: 0.22, duration: L('hook'), fade: 15 },
    { file: 'ladle_hit_a.mp3', at: HOOK.dropAt, volume: 0.9, duration: 30, fade: 10 },
  ],
  poll: [{ file: 'card_pop_b.mp3', at: POLL.commentAt, volume: 0.7 }],
  idea: [
    { file: 'card_pop_b.mp3', at: 0, volume: 0.7 },
    { file: 'card_pop_b.mp3', at: IDEA.stampAt, volume: 0.8 },
    { file: 'notify_ding_a.mp3', at: IDEA.phoneAt, volume: 0.6 },
  ],
  call: [{ file: 'phone_ring_a.mp3', at: 0, volume: 0.6, duration: 62, fade: 8 }],
  beks: [
    { file: 'camera_shutter_a.mp3', at: 0, volume: 0.8 },
    { file: 'whoosh_a.mp3', at: 6, volume: 0.6 },
  ],
  akhma: [
    { file: 'camera_shutter_a.mp3', at: 0, volume: 0.8 },
    { file: 'whoosh_a.mp3', at: 6, volume: 0.6 },
  ],
  nadir: [
    { file: 'camera_shutter_a.mp3', at: 0, volume: 0.8 },
    { file: 'whoosh_a.mp3', at: 6, volume: 0.6 },
  ],
  office: [{ file: 'door_slam_a.mp3', at: 0, volume: 0.35, duration: 20, fade: 8 }],
  timing: TIMING.rowsAt.map((at) => ({ file: 'checklist_tick_a.mp3', at, volume: 0.8 })),
  montage: [
    { file: 'crowd_murmur_a.mp3', at: 0, volume: 0.25, duration: L('montage'), fade: 15 },
    { file: 'glass_clink_a.mp3', at: 30, volume: 0.6 },
    { file: 'applause_crowd_a.mp3', at: MONTAGE.cutAt, volume: 0.5, duration: 70, fade: 20 },
    { file: 'cheer_short_a.mp3', at: MONTAGE.cutAt + 4, volume: 0.5 },
  ],
  hotrush: [
    { file: 'crowd_murmur_a.mp3', at: 0, volume: 0.2, duration: HOTRUSH.freezeAt, fade: 8 },
    { file: 'plate_rattle_a.mp3', at: HOTRUSH.akhmaFrom, volume: 0.7, duration: 50, fade: 12 },
    { file: 'record_scratch_a.mp3', at: HOTRUSH.freezeAt, volume: 0.7 },
    { file: 'whoosh_a.mp3', at: HOTRUSH.kostyaShoutAt, volume: 0.5 },
  ],
  cake: [
    { file: 'kitchen_ambience_a.mp3', at: 0, volume: 0.2, duration: L('cake'), fade: 15 },
    ...CAKE.tiersAt.map((at) => ({ file: 'checklist_tick_a.mp3', at, volume: 0.7 })),
    { file: 'card_pop_b.mp3', at: CAKE.topBerryAt + 12, volume: 0.8 },
  ],
  relief: [
    { file: 'applause_crowd_a.mp3', at: 0, volume: 0.45, duration: 80, fade: 25 },
    { file: 'cheer_short_a.mp3', at: 24, volume: 0.45 },
  ],
  envelope: [
    { file: 'whoosh_a.mp3', at: ENVELOPE.passFrom, volume: 0.5 },
    { file: 'notify_ding_a.mp3', at: ENVELOPE.plateAt, volume: 0.8 },
    { file: 'kitchen_ambience_a.mp3', at: ENVELOPE.zoomOut, volume: 0.18, duration: L('envelope') - ENVELOPE.zoomOut, fade: 15 },
  ],
  whisper: [{ file: 'whoosh_a.mp3', at: 0, volume: 0.5 }],
  fork: [
    ...FORK.options.map((o) => ({ file: 'card_pop_b.mp3', at: o.at, volume: 0.7 })),
    { file: 'card_pop_b.mp3', at: FORK.voteAt, volume: 0.9 },
  ],
};
