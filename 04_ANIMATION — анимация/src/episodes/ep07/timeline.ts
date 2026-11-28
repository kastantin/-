// Серия 7 «Для Кости» — тайминг по сценарию 01_SCRIPTS/ep07_dlya_kosti.md (30 FPS).
// Шесть сцен, одна версия для 16:9 и 9:16. Сцена 2 зависит от итога голосования серии 6: variant 'money' | 'review'.
// Озвучки пока нет (05_VOICE/ep07/dlya_kosti): длина реплики оценивается по тексту. Когда файлы появятся —
// вписать их в VOICE_FILES (id → имя файла в public/audio/ep07) и длины в VOICE_SECONDS.

export const EP07 = { episode: 7, title: 'Для Кости', ladderStep: 0 } as const;
export const FPS = 30;

export type RuleVariant = 'money' | 'review';
export const DEFAULT_RULE_VARIANT: RuleVariant = 'money';

export const VOICE_RATE = 1.2;
export const NARRATOR_RATE = 1.5;
const CHARS_PER_SEC = 16.5; // речь героя при VOICE_RATE
const NARRATOR_CHARS_PER_SEC = 21; // диктор при NARRATOR_RATE

export type SceneId = 'cold' | 'rule' | 'count' | 'envelope' | 'caught' | 'last';
export type Speaker = 'kostya' | 'eduard' | 'beks' | 'gena' | 'owner' | 'narrator';

// id реплики → файл озвучки и его длина в секундах (пока пусто: звука в рендере нет, длина — по тексту)
// Сцена 2: окончательно вариант А («деньгами», решение пользователя 28.11.2026), диктор записан. Вариант Б ('review') без озвучки.
export const VOICE_FILES: Record<string, string> = {
  narr_rule_money: 'narr_sc02_A.mp3',
  kostya_cold: 's01_01_kostya.mp3',
  owner_close: 's02_05_margarita.mp3',
  owner_count: 's03_01_margarita.mp3',
  kostya_sovet: 's03_02_kostya.mp3',
  eduard_envelope: 's04_01_eduard.mp3',
  narr_envelope: 'narr_sc04_konvert.mp3',
  beks_caught: 's05_01_beks.mp3',
  gena_caught: 's05_02_gena.mp3',
  kostya_caught: 's05_03_kostya.mp3',
  narr_choice: 'narr_sc06_vyigryvaet.mp3',
  narr_A: 'narr_karta_A.mp3',
  narr_B: 'narr_karta_B.mp3',
  narr_svoy: 'narr_karta_svoy.mp3',
  narr_final: 'narr_karta_final.mp3',
};
export const VOICE_SECONDS: Record<string, number> = {
  narr_rule_money: 5.8,
  kostya_cold: 2.69,
  owner_close: 2.93,
  owner_count: 5.8,
  kostya_sovet: 2.27,
  eduard_envelope: 3.24,
  narr_envelope: 6.03,
  beks_caught: 3.0,
  gena_caught: 3.08,
  kostya_caught: 3.32,
  narr_choice: 4.05,
  narr_A: 3.47,
  narr_B: 3.16,
  narr_svoy: 2.12,
  narr_final: 6.27,
};

// spoken — что произносится (для оценки длины), text — субтитр (карточки финала не субтитруются);
// mat — доля реплики, на которую приходится мат (голос глушится, 🤬 на рот)
type Item = { id: string; speaker: Speaker; spoken: string; text?: string; highlight?: string; gap?: number; mat?: readonly [number, number] };
type PlanScene = { id: SceneId; lead: number; tail: number; min: number; clips: ReadonlyArray<Item> };

const narr = (id: string, spoken: string, text?: string, gap?: number): Item => ({ id, speaker: 'narrator', spoken, text, gap });

function rulePlan(variant: RuleVariant): ReadonlyArray<Item> {
  const owner: Item = { id: 'owner_close', speaker: 'owner', spoken: 'Закрытие. Считаем банки при всех.', text: 'Закрытие. Считаем банки при всех.', gap: 8 };
  const intro =
    variant === 'money'
      ? 'Вы выбрали деньги. Последний гость оставил Косте двести рублей. Не густо.'
      : 'Вы выбрали отзыв. Пять звёзд и подпись: «Официант приятный. Рыбу не ел». Банка пуста, зато рейтинг растёт.';
  return [narr(`narr_rule_${variant}`, intro, intro, 0), owner];
}

function plan(variant: RuleVariant): ReadonlyArray<PlanScene> {
  return [
    {
      id: 'cold',
      lead: 18,
      tail: 8,
      min: 120,
      clips: [{ id: 'kostya_cold', speaker: 'kostya', spoken: 'Это не банка. Это банк.', text: 'Это не банка. Это банк.', highlight: 'Это банк.', gap: 0 }],
    },
    { id: 'rule', lead: 8, tail: 8, min: 180, clips: rulePlan(variant) },
    {
      id: 'count',
      lead: 8,
      tail: 8,
      min: 240,
      clips: [
        { id: 'owner_count', speaker: 'owner', spoken: 'Бекс — четыре тысячи сто. Костя — пуговица, жвачка и совет.', text: 'Бекс — четыре тысячи сто. Костя — пуговица, жвачка и совет.', gap: 0 },
        { id: 'kostya_sovet', speaker: 'kostya', spoken: 'Совет — на вес золота.', text: 'Совет — на вес золота.', gap: 8 },
      ],
    },
    {
      id: 'envelope',
      lead: 8,
      tail: 8,
      min: 240,
      clips: [
        { id: 'eduard_envelope', speaker: 'eduard', spoken: 'Я ничего не видел. Но тут конверт.', text: 'Я ничего не видел. Но тут конверт.', gap: 0 },
        narr('narr_envelope', 'На конверте: «Для Кости. За честность про рыбу». Внутри три тысячи.', 'На конверте: «Для Кости. За честность про рыбу». Внутри три тысячи.', 8),
      ],
    },
    {
      id: 'caught',
      lead: 8,
      tail: 8,
      min: 240,
      clips: [
        { id: 'beks_caught', speaker: 'beks', spoken: 'Гость спутал банки. Я не знал.', text: 'Гость спутал банки. Я не знал.', gap: 0 },
        { id: 'gena_caught', speaker: 'gena', spoken: 'Я же говорил: рыба — дрянь!', text: 'Я же говорил: рыба — [[дрянь]]!', mat: [0.71, 0.93], gap: 8 },
        { id: 'kostya_caught', speaker: 'kostya', spoken: 'Честность окупается. Просто не сразу.', text: 'Честность окупается. Просто не сразу.', highlight: 'Просто не сразу.', gap: 10 },
      ],
    },
    {
      id: 'last',
      lead: 8,
      tail: 36,
      min: 0,
      clips: [
        narr('narr_choice', 'Без конверта выигрывает Бекс. С конвертом — Костя.', 'Без конверта выигрывает Бекс. С конвертом — Костя.', 0),
        narr('narr_A', 'А — забрать конверт: честная победа', undefined, 60),
        narr('narr_B', 'Б — отдать Бексу: пусть выиграет', undefined, 6),
        narr('narr_svoy', 'Свой вариант — в комментариях', undefined, 6),
        narr('narr_final', 'Что выберет Костя? Пиши А или Б и подпишись — узнаешь, что он решил', undefined, 8),
      ],
    },
  ];
}

export type PlacedClip = Item & { at: number; end: number; rate: number; onScreen: boolean; file?: string; matFrames?: readonly [number, number] };
export type Cue = { from: number; to: number; text: string; speaker: Speaker; highlight?: string };
export type Sfx = { file: string; at: number; volume: number; duration?: number; fade?: number };

function clipFrames(item: Item, rate: number): number {
  const seconds = VOICE_SECONDS[item.id];
  if (seconds) return Math.round((seconds * FPS) / rate);
  const cps = item.speaker === 'narrator' ? NARRATOR_CHARS_PER_SEC : CHARS_PER_SEC;
  return Math.max(24, Math.round((item.spoken.length / cps) * FPS));
}

const SUBTITLE_PAD = 6;

export function createTimeline(variant: RuleVariant) {
  const scenes: { id: SceneId; from: number; to: number }[] = [];
  const voice = {} as Record<SceneId, PlacedClip[]>;
  let start = 0;
  for (const scene of plan(variant)) {
    let cursor = scene.lead;
    const placed: PlacedClip[] = [];
    scene.clips.forEach((item, i) => {
      const rate = item.speaker === 'narrator' ? NARRATOR_RATE : VOICE_RATE;
      const at = i === 0 ? scene.lead + (item.gap ?? 0) : cursor + (item.gap ?? 8);
      const len = clipFrames(item, rate);
      const matFrames = item.mat ? ([at + Math.round(len * item.mat[0]) - 2, at + Math.round(len * item.mat[1]) + 4] as const) : undefined;
      placed.push({ ...item, at, end: at + len, rate, onScreen: item.speaker !== 'narrator', file: VOICE_FILES[item.id], matFrames });
      cursor = at + len;
    });
    voice[scene.id] = placed;
    const length = Math.max(scene.min, cursor + scene.tail);
    scenes.push({ id: scene.id, from: start, to: start + length });
    start += length;
  }

  const find = (scene: SceneId, id: string): PlacedClip => {
    const clip = voice[scene].find((c) => c.id === id);
    if (!clip) throw new Error(`Нет реплики ${id} в сцене ${scene}`);
    return clip;
  };
  const clipAt = (scene: SceneId, id: string) => find(scene, id).at;
  const clipEnd = (scene: SceneId, id: string) => find(scene, id).end;

  const subtitles = Object.fromEntries(
    scenes.map((s) => [
      s.id,
      voice[s.id]
        .filter((c) => c.text)
        .map((c): Cue => ({ from: c.at, to: Math.min(c.end + SUBTITLE_PAD, s.to - s.from), text: c.text ?? '', speaker: c.speaker, highlight: c.highlight })),
    ]),
  ) as Record<SceneId, Cue[]>;

  // Окна мата (кадры сцены) — для плашки 🤬
  const matSpans = (Object.keys(voice) as SceneId[]).flatMap((scene) =>
    voice[scene].filter((c) => c.matFrames).map((c) => ({ scene, from: c.matFrames?.[0] ?? 0, to: c.matFrames?.[1] ?? 0 })),
  );

  // События сцен
  const countCut = clipAt('count', 'owner_count') + Math.round((clipEnd('count', 'owner_count') - clipAt('count', 'owner_count')) * 0.45);
  const envelopeFound = clipAt('envelope', 'eduard_envelope') + Math.round((clipEnd('envelope', 'eduard_envelope') - clipAt('envelope', 'eduard_envelope')) * 0.7);
  const envelopeCard = clipAt('envelope', 'narr_envelope');
  const kostyaCaught = clipAt('caught', 'kostya_caught') - 6;
  const choiceEnd = clipEnd('last', 'narr_choice');
  const last = {
    stopAt: choiceEnd + 4,
    closeUpAt: choiceEnd + 30,
    forkAt: clipAt('last', 'narr_A') - 6,
    options: [
      { badge: 'А' as const, lines: ['Забрать конверт:', 'честная', 'победа'], at: clipAt('last', 'narr_A') },
      { badge: 'Б' as const, lines: ['Отдать Бексу:', 'пусть', 'выиграет'], at: clipAt('last', 'narr_B') },
      { badge: 'custom' as const, lines: ['Свой вариант —', 'в комментариях'], at: clipAt('last', 'narr_svoy') },
    ],
    finalText: 'Что выберет Костя? Пиши А или Б и подпишись — узнаешь, что он решил',
    finalAt: clipAt('last', 'narr_final'),
  };

  const sfx: Record<SceneId, Sfx[]> = {
    // Звон банки — короткий акцент до реплики Кости (измерено: полный файл на 0,9 был почти вровень с голосом)
    cold: [{ file: 'chaevye_can_clang_a.mp3', at: 2, volume: 0.45, duration: 24, fade: 12 }],
    rule: [{ file: 'card_pop_b.mp3', at: 24, volume: 0.5 }],
    count: [
      { file: 'chaevye_coins_a.mp3', at: 10, volume: 0.7, duration: 60, fade: 12 },
      { file: 'chaevye_coins_a.mp3', at: countCut + 4, volume: 0.5, duration: 40, fade: 10 },
      { file: 'whoosh_a.mp3', at: countCut - 4, volume: 0.4 },
    ],
    envelope: [
      { file: 'chaevye_coins_a.mp3', at: 6, volume: 0.5, duration: 40, fade: 10 },
      { file: 'card_pop_b.mp3', at: envelopeFound, volume: 0.7 },
      { file: 'notify_ding_a.mp3', at: envelopeCard, volume: 0.5 },
    ],
    caught: [{ file: 'whoosh_a.mp3', at: kostyaCaught - 4, volume: 0.4 }],
    last: [
      { file: 'chaevye_scratch_a.mp3', at: last.stopAt, volume: 0.9 },
      ...last.options.map((o) => ({ file: 'card_pop_b.mp3', at: o.at, volume: 0.7 })),
      { file: 'notify_ding_a.mp3', at: last.finalAt, volume: 0.7 },
    ],
  };

  // Отрезки речи персонажа (кадры сцены) — по ним двигается рот
  const speechSpans = (scene: SceneId, who: Speaker) => voice[scene].filter((c) => c.speaker === who && c.onScreen).map((c) => ({ from: c.at, to: c.end }));

  return {
    variant,
    scenes,
    voice,
    subtitles,
    matSpans,
    sfx,
    total: scenes[scenes.length - 1].to,
    events: { countCut, envelopeFound, envelopeCard, kostyaCaught, last },
    clipAt,
    speechSpans,
  };
}

export type Timeline = ReturnType<typeof createTimeline>;
export const DEFAULT_TIMELINE = createTimeline(DEFAULT_RULE_VARIANT);

// Мат: «мяу» пониженного тона вместо слова (общее правило серий 2–6)
export const CENSOR_MEOW = 'meow_a.mp3';
export const CENSOR_VOLUME = 0.9;
export const CENSOR_TONE = 0.6;
export const MEOW_FRAMES = 15;
