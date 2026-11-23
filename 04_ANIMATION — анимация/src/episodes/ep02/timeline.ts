// Серия 2 «Ноль голосов» — тайминг по сценарию 01_SCRIPTS/ep02_nol_golosov.md
// и по озвучке 05_VOICE/ep02 (30 FPS). Все кадры — от начала своей сцены.

export const EP02 = { episode: 2, title: 'Ноль голосов', ladderStep: 0 } as const;
export const FPS = 30;

// Озвучка играет чуть быстрее оригинала (высота голоса сохраняется) — как в серии 1
export const VOICE_RATE = 1.1;

// Секунды внутри файла озвучки → кадры с учётом ускорения
export function voiceFrames(sec: number): number {
  return Math.round((sec * FPS) / VOICE_RATE);
}

export type SceneId =
  | 'hook'
  | 'freeze'
  | 'poll'
  | 'review'
  | 'run'
  | 'split'
  | 'receipt'
  | 'flashback'
  | 'pause'
  | 'checklist'
  | 'hang'
  | 'reply'
  | 'zero'
  | 'news'
  | 'fork';

// Длина каждого плана в кадрах — под реплики (жёсткие склейки)
const SCENE_LENGTHS: ReadonlyArray<readonly [SceneId, number]> = [
  ['hook', 120],
  ['freeze', 215],
  ['poll', 160],
  ['review', 125],
  ['run', 80],
  ['split', 125],
  ['receipt', 185],
  ['flashback', 150],
  ['pause', 115],
  ['checklist', 400],
  ['hang', 165],
  ['reply', 240],
  ['zero', 125],
  ['news', 215],
  ['fork', 525],
];

// Границы сцен в кадрах: [from, to)
export const SCENES: ReadonlyArray<{ id: SceneId; from: number; to: number }> = SCENE_LENGTHS.reduce<{ id: SceneId; from: number; to: number }[]>(
  (acc, [id, length]) => {
    const from = acc.length ? acc[acc.length - 1].to : 0;
    return [...acc, { id, from, to: from + length }];
  },
  [],
);

export const EP02_DURATION = SCENES[SCENES.length - 1].to;

export function sceneStart(id: SceneId): number {
  const scene = SCENES.find((s) => s.id === id);
  if (!scene) throw new Error(`Нет сцены ${id}`);
  return scene.from;
}

export type Speaker = 'kostya' | 'eduard' | 'dima' | 'gena' | 'voice';

// --- Озвучка -------------------------------------------------------------------
// speech — отрезки речи в файле (секунды, по паузам ffmpeg silencedetect);
// mat — где в файле звучит мат: в версии для TikTok голос там глушится и звучит писк.
// onScreen=false — голос за кадром или «про себя»: рот не двигается.
export type VoiceClip = {
  file: string;
  at: number;
  speaker: Exclude<Speaker, 'voice'> | 'narrator';
  onScreen: boolean;
  speech: ReadonlyArray<readonly [number, number]>;
  mat?: readonly [number, number];
};

// Рассказчик читает экранный текст, который не произносят персонажи (правило пользователя из серии 1)
const narrator = (file: string, at: number, end: number): VoiceClip => ({ file, at, speaker: 'narrator', onScreen: false, speech: [[0, end]] });

export const VOICE: Record<SceneId, VoiceClip[]> = {
  hook: [{ file: 's01_01_gena.mp3', at: 10, speaker: 'gena', onScreen: true, speech: [[0.26, 1.14], [1.22, 3.77]], mat: [1.22, 1.56] }],
  freeze: [
    narrator('n02a_narrator.mp3', 4, 1.5),
    narrator('n02b_narrator.mp3', 48, 2.38),
    { file: 's02_01_kostya.mp3', at: 118, speaker: 'kostya', onScreen: false, speech: [[0, 1.21], [1.7, 2.11], [2.55, 3.27]] },
  ],
  poll: [{ file: 's03_01_kostya.mp3', at: 4, speaker: 'kostya', onScreen: true, speech: [[0, 1.1], [1.4, 3.07], [3.51, 5.33]], mat: [4.25, 4.65] }],
  review: [{ file: 's04_01_eduard.mp3', at: 26, speaker: 'eduard', onScreen: true, speech: [[0.17, 1.07], [1.2, 1.47], [1.63, 2.02], [2.46, 3.23]], mat: [1.63, 2.02] }],
  run: [{ file: 's05_01_narrator.mp3', at: 6, speaker: 'narrator', onScreen: false, speech: [[0, 0.98], [1.4, 2.27]] }],
  split: [
    { file: 's06_01_gena.mp3', at: 6, speaker: 'gena', onScreen: true, speech: [[0.24, 1.82]] },
    { file: 's06_02_dima.mp3', at: 12, speaker: 'dima', onScreen: true, speech: [[0, 1.35]] },
    { file: 's06_03_kostya.mp3', at: 64, speaker: 'kostya', onScreen: true, speech: [[0, 1.38], [1.74, 2.14]] },
  ],
  receipt: [narrator('n07a_narrator.mp3', 4, 2.07), narrator('n07b_narrator.mp3', 64, 2.43), narrator('n07c_narrator.mp3', 136, 1.35)],
  flashback: [{ file: 's08_01_kostya.mp3', at: 10, speaker: 'kostya', onScreen: false, speech: [[0, 0.64], [1.0, 1.7], [1.88, 2.6], [3.06, 4.54]] }],
  pause: [{ file: 's09_01_kostya.mp3', at: 12, speaker: 'kostya', onScreen: false, speech: [[0, 1.59], [1.9, 3.42]] }],
  checklist: [
    { file: 's10_01_kostya.mp3', at: 6, speaker: 'kostya', onScreen: false, speech: [[0, 0.81], [1.06, 2.39]] },
    narrator('n10a_narrator.mp3', 74, 2.37),
    narrator('n10b_narrator.mp3', 142, 2.87),
    narrator('n10c_narrator.mp3', 224, 2.15),
    { file: 's10_02_eduard.mp3', at: 288, speaker: 'eduard', onScreen: true, speech: [[0, 0.68], [0.99, 2.45], [2.77, 3.84]] },
  ],
  hang: [{ file: 's11_01_gena.mp3', at: 74, speaker: 'gena', onScreen: true, speech: [[0.1, 0.61], [1.21, 1.75], [2.28, 2.96]], mat: [1.21, 1.75] }],
  reply: [narrator('n12_narrator.mp3', 8, 5.6), { file: 's12_01_kostya.mp3', at: 166, speaker: 'kostya', onScreen: false, speech: [[0, 1.23], [1.38, 2.47]] }],
  zero: [narrator('n13_narrator.mp3', 34, 2.88)],
  news: [{ file: 's14_01_eduard.mp3', at: 12, speaker: 'eduard', onScreen: true, speech: [[0, 2.17], [2.57, 4.21], [4.62, 6.35]], mat: [5.02, 5.47] }],
  fork: [
    narrator('n15a_narrator.mp3', 2, 1.41),
    narrator('n15b_narrator.mp3', 44, 4.21),
    narrator('n15c_narrator.mp3', 164, 4.05),
    narrator('n15d_narrator.mp3', 280, 2.65),
    narrator('n15e_narrator.mp3', 358, 5.4),
  ],
};

// Отрезки речи персонажа в кадрах сцены — по ним двигается рот
export function speechSpans(scene: SceneId, who: Exclude<Speaker, 'voice'>): { from: number; to: number }[] {
  return VOICE[scene]
    .filter((v) => v.speaker === who && v.onScreen)
    .flatMap((v) => v.speech.map(([a, b]) => ({ from: v.at + voiceFrames(a), to: v.at + voiceFrames(b) })));
}

// --- Звуки (выбранные дубли _a из 06_MUSIC_SFX; дубли пользователь пока не выбирал) ---
export type SfxClip = { file: string; at: number; volume: number; duration?: number; fade?: number };

export const SFX: Record<SceneId, SfxClip[]> = {
  hook: [
    { file: 'kitchen_ambience_a.mp3', at: 0, volume: 0.25, duration: 120, fade: 15 },
    { file: 'ladle_hit_a.mp3', at: 8, volume: 0.9, duration: 30, fade: 10 },
  ],
  freeze: [{ file: 'record_scratch_a.mp3', at: 0, volume: 0.8 }],
  poll: [{ file: 'fly_buzz_a.mp3', at: 0, volume: 0.35, duration: 90, fade: 20 }],
  review: [{ file: 'whoosh_a.mp3', at: 6, volume: 0.7 }],
  run: [
    { file: 'door_slam_a.mp3', at: 0, volume: 0.7, duration: 30, fade: 10 },
    { file: 'running_steps_a.mp3', at: 2, volume: 0.5, duration: 78, fade: 10 },
    { file: 'whoosh_a.mp3', at: 26, volume: 0.6 },
    { file: 'whoosh_a.mp3', at: 60, volume: 0.6 },
  ],
  split: [],
  receipt: [{ file: 'door_slam_a.mp3', at: 138, volume: 0.6, duration: 24, fade: 8 }],
  flashback: [
    { file: 'clock_click_a.mp3', at: 10, volume: 0.9 },
    { file: 'clock_click_a.mp3', at: 37, volume: 0.9 },
    { file: 'clock_click_a.mp3', at: 61, volume: 0.9 },
  ],
  pause: [{ file: 'sad_note_a.mp3', at: 2, volume: 0.6 }],
  checklist: [
    { file: 'paper_slide_a.mp3', at: 0, volume: 0.6, duration: 20, fade: 8 },
    { file: 'checklist_tick_a.mp3', at: 74, volume: 0.8 },
    { file: 'checklist_tick_a.mp3', at: 142, volume: 0.8 },
    { file: 'checklist_tick_a.mp3', at: 224, volume: 0.8 },
  ],
  hang: [{ file: 'kitchen_ambience_a.mp3', at: 0, volume: 0.2, duration: 165, fade: 15 }],
  reply: [
    { file: 'keyboard_typing_a.mp3', at: 8, volume: 0.45, duration: 80, fade: 6 },
    { file: 'keyboard_typing_a.mp3', at: 88, volume: 0.45, duration: 70, fade: 10 },
  ],
  zero: [
    { file: 'notify_ding_a.mp3', at: 6, volume: 0.8 },
    { file: 'phone_notify_b.mp3', at: 30, volume: 0.6 },
  ],
  news: [{ file: 'door_slam_a.mp3', at: 0, volume: 0.5, duration: 24, fade: 8 }],
  fork: [
    { file: 'card_pop_b.mp3', at: 42, volume: 0.7 },
    { file: 'card_pop_b.mp3', at: 162, volume: 0.7 },
    { file: 'card_pop_b.mp3', at: 278, volume: 0.7 },
    { file: 'card_pop_b.mp3', at: 356, volume: 0.9 },
  ],
};

// --- Фоновая музыка (06_MUSIC_SFX/music, дубли _a) — абсолютные кадры серии ---------
// Джаз ресторана тихо под всей серией; на паузе с борщом и на развилке — свои треки
export type MusicClip = { file: string; from: number; to: number; volume: number; startFrom?: number; fade: number; loop?: boolean };

const MUSIC_VOLUME = 0.1;

export function musicClips(): MusicClip[] {
  const pause = sceneStart('pause');
  const afterPause = sceneStart('checklist');
  const fork = sceneStart('fork');
  return [
    { file: 'restaurant_jazz_a.mp3', from: 0, to: pause + 10, volume: MUSIC_VOLUME, fade: 15 },
    { file: 'restaurant_jazz_a.mp3', from: afterPause, to: EP02_DURATION, volume: MUSIC_VOLUME, startFrom: pause, fade: 20, loop: true },
    { file: 'fork_sting_a.mp3', from: fork, to: fork + 240, volume: 0.22, fade: 20 },
  ];
}

// Мат закрывается кошачьим «мяу» (решение пользователя 21.11.2026), варианты чередуются
export const CENSOR_MEOWS = ['meow_a.mp3', 'meow_b.mp3', 'meow_c.mp3'] as const;
export const CENSOR_VOLUME = 0.9;
// «мяу» ниже по тону (просьба пользователя): 1 — как есть, меньше — ниже
export const CENSOR_TONE = 0.6;

// --- Субтитры ------------------------------------------------------------------
// Мат в тексте — в двойных скобках: [[слово]]. В версии для TikTok он заменяется на 🤬.
export type Ep02Cue = { from: number; to: number; text: string; highlight?: string };

export const SUBTITLES: Record<SceneId, Ep02Cue[]> = {
  hook: [{ from: 10, to: 120, text: 'Какого [[хуя]] борщ двенадцать минут на раздаче стоит?!' }],
  freeze: [{ from: 116, to: 215, text: 'Да, это я. И да — всё плохо.', highlight: 'всё плохо.' }],
  poll: [
    { from: 2, to: 96, text: 'Ноль голосов. Холоднее, чем этот борщ.', highlight: 'Холоднее, чем этот борщ.' },
    { from: 98, to: 160, text: 'Спасибо, [[бля]], за поддержку.' },
  ],
  review: [{ from: 24, to: 125, text: 'Кто виноват — мне [[похуй]]. К утру реши.', highlight: 'К утру реши.' }],
  run: [],
  // крики Гены и Димы — в пузырях сплит-скрина (SPLIT), здесь только Костя
  split: [{ from: 62, to: 125, text: 'Так. Стоп. Чек.', highlight: 'Чек.' }],
  receipt: [],
  flashback: [
    { from: 8, to: 88, text: 'Хлеб. Приборы. Сметана.' },
    { from: 90, to: 150, text: 'А борщ всё это время…' },
  ],
  pause: [{ from: 10, to: 115, text: 'Борщ ждать не умеет. Он умеет только остывать.', highlight: 'только остывать.' }],
  checklist: [
    { from: 4, to: 74, text: 'Раздача — не место для раздумий.', highlight: 'не место для раздумий.' },
    { from: 286, to: 400, text: 'Повесь. Гене скажи сам, я жить хочу.' },
  ],
  hang: [{ from: 72, to: 165, text: '…Ну [[блять]]. Логично.', highlight: 'Логично.' }],
  reply: [{ from: 164, to: 240, text: 'Главное — не «зато свежий».', highlight: '«зато свежий».' }],
  zero: [],
  news: [
    { from: 10, to: 78, text: 'Хозяйка видела!' },
    { from: 80, to: 192, text: 'Но… корпоратив на сорок человек, а двое, [[сука]], заболели.', highlight: 'заболели.' },
  ],
  fork: [],
};

export const REMARKS: Record<SceneId, { text: string; from: number; to: number }[]> = {
  hook: [],
  freeze: [],
  poll: [],
  review: [],
  run: [{ text: 'Расследование. Время пошло.', from: 4, to: 80 }],
  split: [],
  receipt: [],
  flashback: [],
  pause: [],
  checklist: [],
  hang: [],
  reply: [{ text: 'Костя (про себя)', from: 164, to: 240 }],
  zero: [],
  news: [],
  fork: [{ text: 'Что делать Косте?', from: 0, to: 525 }],
};

// --- Мат: плашка 🤬 на рот в версии для TikTok ----------------------------------
// Рот говорящего в координатах сцены (1080×720) и размер плашки; время — из VOICE[scene].mat
const MAT_MOUTHS: Partial<Record<SceneId, { x: number; y: number; size: number }>> = {
  hook: { x: 432, y: 300, size: 150 },
  poll: { x: 860, y: 432, size: 150 },
  review: { x: 760, y: 396, size: 90 },
  hang: { x: 540, y: 294, size: 100 },
  news: { x: 330, y: 362, size: 90 },
};

export type MatSpot = { scene: SceneId; from: number; to: number; x: number; y: number; size: number };

export const MAT_SPOTS: MatSpot[] = SCENES.flatMap(({ id }) => {
  const mouth = MAT_MOUTHS[id];
  if (!mouth) return [];
  return VOICE[id]
    .filter((v) => v.mat)
    .map((v) => {
      const [a, b] = v.mat ?? [0, 0];
      return { scene: id, from: v.at + voiceFrames(a) - 2, to: v.at + voiceFrames(b) + 4, ...mouth };
    });
});

// --- Сценические события ---------------------------------------------------------
// Таймер «ДО УТРА»: появляется в сцене 4, тикает (ночь проходит быстро), обнуляется в сцене 13
export const TIMER = {
  from: sceneStart('review') + 40,
  zeroAt: sceneStart('zero') + 6,
  hideAt: sceneStart('news'),
  startSeconds: 11 * 3600 + 59 * 60 + 59,
} as const;

export const HOOK = { hitAt: 9 } as const;

export const FREEZE_LABELS = [
  { text: 'Гена — повар', x: 540, y: 96, at: 4 },
  { text: 'Дима — стажёр, 2-й день', x: 880, y: 160, at: 48 },
  { text: 'Костя — это я', x: 190, y: 160, at: 118 },
] as const;

export const POLL = { smirkAt: 98 } as const;

// Эдуард суёт телефон Косте в лицо
export const REVIEW = { phoneFrom: 8, phoneTo: 26 } as const;

export const SPLIT = {
  gena: { text: 'С кухни ушёл горячим!', from: 6, to: 60 },
  dima: { text: 'Я сразу понёс!', from: 12, to: 60 },
  kostyaStopAt: 64,
} as const;

export const RECEIPT = { secondLineAt: 64, stampAt: 132 } as const;

// Флешбэк ×4: Дима носит хлеб, приборы, сметану — по щелчку часов
export const FLASHBACK = { steps: [10, 37, 61], zoomAt: 90 } as const;

export const CHECKLIST = {
  title: 'РАЗДАЧА',
  items: ['хлеб и сметана — до заказа', 'горячее на раздаче ≤ 2 мин', 'стажёр неделю в паре'],
  itemsAt: [74, 142, 224],
  eduardAt: 288,
} as const;

export const HANG = { hangTo: 26, turnFrom: 30, turnTo: 72, backOffFrom: 60 } as const;

export const REPLY = {
  typeFrom: 8,
  typeTo: 158,
  lines: ['Простите, борщ ждал', 'на раздаче — исправили.', 'Первая тарелка —', 'за наш счёт.'],
} as const;

export const ZERO = { notifAt: 30, starsAt: 50 } as const;

// stareAt — резкий наезд на Костю, который молча смотрит в камеру
export const NEWS = { enterTo: 14, faceFallAt: 80, stareAt: 192 } as const;

export const FORK = {
  options: [
    { badge: 'А', lines: ['Взять банкет', 'и свои столы —', 'работать', 'за двоих'], at: 44 },
    { badge: 'Б', lines: ['Закрыть посадку', 'с улицы — не', 'провалить', 'банкет'], at: 164 },
    { badge: 'custom', lines: ['Свой вариант —', 'пишите', 'в комментариях'], at: 280 },
  ],
  voteText: 'Голосуй в Telegram',
  voteAt: 358,
  footnote: 'Проголосовать — одно нажатие. Даже Дима справился.',
  footnoteAt: 401,
} as const;
