// Серия 6 «На чай» — тайминг по сценарию 01_SCRIPTS/ep06_chaevye.md и по озвучке 05_VOICE/ep06/na_chaj (30 FPS).
// Шесть сцен, одна версия для 16:9 и 9:16. Реплики ставятся по порядку, длина сцены считается из длины файлов.
// Гостей читает диктор: его реплики субтитруются как реплики диктора.
import { FILES, VOICE_DATA } from './voice-data';

export const EP06 = { episode: 6, title: 'На чай', ladderStep: 0 } as const;
export const FPS = 30;

export const VOICE_RATE = 1.2;
export const NARRATOR_RATE = 1.5;

export type SceneId = 'jar' | 'rule' | 'tips' | 'notes' | 'jars' | 'last';
export type Speaker = 'kostya' | 'eduard' | 'beks' | 'gena' | 'owner' | 'narrator';

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

// text — субтитр (карточки финала не субтитруются: они уже на экране); gap — пауза перед репликой в кадрах
// mat — окно мата в файле (секунды): голос глушится, звучит «мяу», на рот ставится плашка 🤬
type Item = { id: string; speaker: Speaker; gap?: number; text?: string; highlight?: string; mat?: readonly [number, number] };

const n = (id: string, text?: string, gap?: number): Item => ({ id, speaker: 'narrator', gap, text });

const PLAN: ReadonlyArray<{ id: SceneId; lead: number; tail: number; clips: ReadonlyArray<Item> }> = [
  {
    id: 'jar',
    lead: 14,
    tail: 8,
    clips: [{ id: 'kostya_s01', speaker: 'kostya', gap: 0, text: 'Четыре часа сервиса. Итого: пуговица.', highlight: 'Итого: пуговица.' }],
  },
  {
    id: 'rule',
    lead: 8,
    tail: 8,
    clips: [
      { id: 'margarita_s02', speaker: 'owner', gap: 0, text: 'Правило простое: у кого к закрытию больше чаевых — тот старший официант. Отзывы на картах я тоже читаю.', highlight: 'тот старший официант.' },
      { id: 'beks_s02', speaker: 'beks', gap: 8, text: 'Договорились.' },
    ],
  },
  {
    id: 'tips',
    lead: 6,
    tail: 8,
    clips: [n('narr_sovet', 'Бексу оставили пятьсот рублей. Косте оставили совет: «Улыбайтесь чаще».', 0)],
  },
  {
    id: 'notes',
    lead: 54,
    tail: 8,
    clips: [
      { id: 'gena_s04', speaker: 'gena', gap: 0, text: 'Это записка! [[Это не чаевые!]]', mat: [1.5, 2.9] },
      { id: 'kostya_s04', speaker: 'kostya', gap: 8, text: 'Мне оставили не на чай. Мне оставили на подумать.', highlight: 'Мне оставили на подумать.' },
    ],
  },
  {
    id: 'jars',
    lead: 24,
    tail: 8,
    clips: [
      { id: 'eduard_s05', speaker: 'eduard', gap: 0, text: 'Я ничего не видел. Но у Бекса банка звенит, а у Кости — шуршит.', highlight: 'банка звенит, а у Кости — шуршит.' },
      { id: 'beks_s05', speaker: 'beks', gap: 8, text: 'Ничего личного, брат.' },
    ],
  },
  {
    id: 'last',
    lead: 8,
    tail: 36,
    clips: [
      n('narr_gost', '— Чаевые оставить деньгами или отзывом? — спросил гость.', 0),
      n('narr_A', undefined, 60),
      n('narr_B', undefined, 6),
      n('narr_svoy', undefined, 6),
      n('narr_final', undefined, 8),
    ],
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
export const EP06C_DURATION = SCENES[SCENES.length - 1].to;

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

// Отрезки речи персонажа в кадрах сцены — по ним двигается рот
export function speechSpans(scene: SceneId, who: Speaker): { from: number; to: number }[] {
  return VOICE[scene]
    .filter((c) => c.speaker === who && c.onScreen)
    .flatMap((c) => speechOf(c.id).map(([a, b]) => ({ from: c.at + voiceFrames(a, c.rate), to: c.at + voiceFrames(b, c.rate) })));
}

// --- Субтитры -------------------------------------------------------------------------
export type Ep06cCue = { from: number; to: number; text: string; speaker: Speaker; highlight?: string };

const SUBTITLE_PAD = 6;

export const SUBTITLES = Object.fromEntries(
  SCENES.map((s) => [
    s.id,
    VOICE[s.id]
      .filter((c) => c.text)
      .map((c) => ({ from: c.at, to: Math.min(c.end + SUBTITLE_PAD, s.to - s.from), text: c.text ?? '', speaker: c.speaker, highlight: c.highlight })),
  ]),
) as Record<SceneId, Ep06cCue[]>;

// --- «Мяу» вместо мата (так же, как в сериях 2–5) --------------------------------------
export const CENSOR_MEOWS = ['meow_a.mp3', 'meow_b.mp3', 'meow_c.mp3'] as const;
export const CENSOR_VOLUME = 0.9;
export const CENSOR_TONE = 0.6;
export const MEOW_FRAMES = 15;

// Окна мата в кадрах сцены (с запасом) — для плашки 🤬
export const MAT_SPANS: { scene: SceneId; from: number; to: number }[] = (Object.keys(VOICE) as SceneId[]).flatMap((scene) =>
  VOICE[scene]
    .filter((c) => c.mat)
    .map((c) => {
      const [a, b] = c.mat ?? [0, 0];
      return { scene, from: c.at + voiceFrames(a, c.rate) - 2, to: c.at + voiceFrames(b, c.rate) + 4 };
    }),
);

// --- События сцен ---------------------------------------------------------------------
// Сцена 3: две «склейки» внутри одной сцены (Бекс — деньги, Костя — совет)
export const TIPS = { cutAt: clipAt('tips', 'narr_sovet') + voiceFrames(2.6, NARRATOR_RATE) } as const;

// Сцена 4: до реплик — две быстрые склейки (Бекс получает тысячу, Косте — наклейка и записка)
export const NOTES = { secondCutAt: 27 } as const;

// Сцена 6: стоп-кадр после реплики гостя, затем крупное лицо Кости, затем развилка
const GOST_END = clipEnd('last', 'narr_gost');
export const LAST = {
  stopAt: GOST_END + 4,
  closeUpAt: GOST_END + 30,
  forkAt: clipAt('last', 'narr_A') - 6,
  options: [
    { badge: 'А' as const, lines: ['Деньгами:', 'обогнать Бекса', 'по банке'], at: clipAt('last', 'narr_A') },
    { badge: 'Б' as const, lines: ['Отзывом:', 'пять звёзд,', 'хозяйка читает'], at: clipAt('last', 'narr_B') },
    { badge: 'custom' as const, lines: ['Свой вариант —', 'в комментариях'], at: clipAt('last', 'narr_svoy') },
  ],
  finalText: 'Что выбрать Косте? Пиши А или Б',
  finalAt: clipAt('last', 'narr_final'),
} as const;

// --- Звуки (шелест мелочи, жвачка, звон банки, скрип пластинки — 06_MUSIC_SFX/chaevye_*) --------
export type SfxClip = { file: string; at: number; volume: number; duration?: number; fade?: number };

export const SFX: Record<SceneId, SfxClip[]> = {
  jar: [
    { file: 'chaevye_coins_a.mp3', at: 0, volume: 0.7, duration: 60, fade: 12 },
    { file: 'chaevye_gum_a.mp3', at: 26, volume: 0.6, duration: 60, fade: 12 },
  ],
  rule: [{ file: 'card_pop_b.mp3', at: 24, volume: 0.5 }],
  tips: [
    { file: 'cash_register_a.mp3', at: 10, volume: 0.6 },
    { file: 'whoosh_a.mp3', at: TIPS.cutAt - 4, volume: 0.4 },
  ],
  notes: [
    { file: 'cash_register_a.mp3', at: 4, volume: 0.6 },
    { file: 'whoosh_a.mp3', at: NOTES.secondCutAt - 4, volume: 0.4 },
    { file: 'plate_rattle_a.mp3', at: 56, volume: 0.35, duration: 36, fade: 8 },
  ],
  jars: [{ file: 'chaevye_can_clang_a.mp3', at: 10, volume: 0.85 }],
  last: [
    { file: 'chaevye_scratch_a.mp3', at: LAST.stopAt, volume: 0.9 },
    ...LAST.options.map((o) => ({ file: 'card_pop_b.mp3', at: o.at, volume: 0.7 })),
    { file: 'notify_ding_a.mp3', at: LAST.finalAt, volume: 0.7 },
  ],
};
