// Серия 1 «Поговорим» — тайминг по сценарию 01_SCRIPTS/ep01_pogovorim.md
// и по реальной озвучке 05_VOICE/ep01 (30 FPS). Все кадры реплик — от начала своей сцены.
import type { SubtitleProps } from '../../layout/EpisodeFrame';

export const EP01 = { episode: 1, title: 'Поговорим', ladderStep: 0 } as const;
export const FPS = 30;

export type SceneId = 'phone' | 'thoughts' | 'office' | 'complaint' | 'flashback' | 'lean' | 'fork';

// Границы сцен в кадрах: [from, to)
export const SCENES: ReadonlyArray<{ id: SceneId; from: number; to: number }> = [
  { id: 'phone', from: 0, to: 243 },
  { id: 'thoughts', from: 243, to: 471 },
  { id: 'office', from: 471, to: 651 },
  { id: 'complaint', from: 651, to: 903 },
  { id: 'flashback', from: 903, to: 1078 },
  { id: 'lean', from: 1078, to: 1370 },
  { id: 'fork', from: 1370, to: 1797 },
];

export const EP01_DURATION = SCENES[SCENES.length - 1].to;

// Озвучка играет чуть быстрее оригинала (высота голоса сохраняется) — темп серии бодрее
export const VOICE_RATE = 1.1;

// Секунды внутри файла озвучки → кадры с учётом ускорения
export function voiceFrames(sec: number): number {
  return Math.round((sec * FPS) / VOICE_RATE);
}

export type Speaker = 'kostya' | 'eduard' | 'dima' | 'guest' | 'voice';

// --- Озвучка -------------------------------------------------------------
// speech — отрезки речи внутри файла в секундах (найдены по паузам ffmpeg silencedetect).
// onScreen=false — голос за кадром или «про себя»: рот у персонажа не двигается.
export type VoiceClip = {
  file: string;
  at: number;
  speaker: Exclude<Speaker, 'voice'> | 'narrator';
  onScreen: boolean;
  speech: ReadonlyArray<readonly [number, number]>;
};

// Рассказчик читает весь текст на экране, который не произносят персонажи (решение пользователя 19.11.2026)
const narrator = (file: string, at: number, speech: VoiceClip['speech']): VoiceClip => ({
  file,
  at,
  speaker: 'narrator',
  onScreen: false,
  speech,
});

// Жалоба: «Жалоба.» + 4 строки карточки — каждая строка дописывается, пока её читают
const COMPLAINT_NARRATION = narrator('n04_narrator.mp3', 8, [[0, 0.64], [1.02, 1.81], [2.28, 3.42], [3.8, 4.78], [5.17, 6.1]]);

// Костя — голос ElevenLabs «Скатерть — Костя» (19.11.2026; клон голоса пользователя больше не используется)
export const VOICE: Record<SceneId, VoiceClip[]> = {
  phone: [
    narrator('n01_narrator.mp3', 4, [[0, 1.62], [2.05, 3.19]]),
    { file: 's01_01_kostya.mp3', at: 96, speaker: 'kostya', onScreen: false, speech: [[0, 1.33], [1.72, 2.9], [3.14, 3.66], [4.13, 4.85]] },
  ],
  thoughts: [
    narrator('n02a_narrator.mp3', 9, [[0, 0.68]]),
    narrator('n02b_narrator.mp3', 35, [[0, 0.81]]),
    narrator('n02c_narrator.mp3', 63, [[0, 1.19]]),
    { file: 's02_01_kostya.mp3', at: 100, speaker: 'kostya', onScreen: true, speech: [[0, 2.71], [3.0, 4.13]] },
  ],
  office: [narrator('s03_01_narrator.mp3', 32, [[0, 1.75], [2.28, 3.63]])],
  complaint: [
    COMPLAINT_NARRATION,
    { file: 's04_01_eduard.mp3', at: 180, speaker: 'eduard', onScreen: true, speech: [[0, 0.93], [1.35, 2.15]] },
  ],
  flashback: [
    narrator('n05_narrator.mp3', 4, [[0, 0.6], [0.93, 1.82]]),
    { file: 's05_01_dima.mp3', at: 58, speaker: 'dima', onScreen: true, speech: [[0, 1.03], [1.37, 2.68]] },
  ],
  lean: [
    { file: 's06_01_eduard.mp3', at: 8, speaker: 'eduard', onScreen: true, speech: [[0, 3.16], [3.48, 5.76]] },
    { file: 's06_02_kostya.mp3', at: 176, speaker: 'kostya', onScreen: false, speech: [[0, 2.15], [2.5, 3.74]] },
  ],
  fork: [
    narrator('n07a_narrator.mp3', 4, [[0, 1.3]]),
    narrator('n07b_narrator.mp3', 44, [[0, 0.88], [1.36, 2.56], [2.97, 3.93]]),
    narrator('n07c_narrator.mp3', 158, [[0, 0.87], [1.37, 2.28], [2.72, 3.71]]),
    narrator('n07d_narrator.mp3', 266, [[0, 1.17], [1.51, 2.66]]),
    narrator('n07e_narrator.mp3', 346, [[0, 1.33]]),
  ],
};

// Строки жалобы проявляются вслед за голосом: [кадр начала, кадр конца] → 0…4 строки
export function complaintRevealKeys(): { input: number[]; output: number[] } {
  const lineSegments = COMPLAINT_NARRATION.speech.slice(1);
  const toFrame = (sec: number) => COMPLAINT_NARRATION.at + voiceFrames(sec);
  const input = lineSegments.flatMap(([a, b]) => [toFrame(a), toFrame(b)]);
  const output = lineSegments.flatMap((_, i) => [i, i + 1]);
  return { input, output };
}

// Отрезки речи персонажа в кадрах сцены — по ним двигается рот
export function speechSpans(scene: SceneId, who: Exclude<Speaker, 'voice'>): { from: number; to: number }[] {
  return VOICE[scene]
    .filter((v) => v.speaker === who && v.onScreen)
    .flatMap((v) => v.speech.map(([a, b]) => ({ from: v.at + voiceFrames(a), to: v.at + voiceFrames(b) })));
}

// --- Звуковые эффекты (выбранные дубли из 06_MUSIC_SFX/LICENSES.md) -------
// duration — обрезка длинного звука (в кадрах), fade — плавное затухание в конце
export type SfxClip = { file: string; at: number; volume: number; duration?: number; fade?: number };

export const SFX: Record<SceneId, SfxClip[]> = {
  phone: [
    { file: 'phone_notify_b.mp3', at: 0, volume: 0.8 },
    { file: 'restaurant_ambience_b.mp3', at: 0, volume: 0.08, duration: 243, fade: 20 },
  ],
  thoughts: [
    { file: 'clock_tick_a.mp3', at: 0, volume: 0.35, duration: 228, fade: 25 },
    { file: 'card_pop_b.mp3', at: 7, volume: 0.7 },
    { file: 'card_pop_b.mp3', at: 33, volume: 0.7 },
    { file: 'card_pop_b.mp3', at: 61, volume: 0.7 },
  ],
  office: [
    { file: 'steps_door_a.mp3', at: 0, volume: 0.6, duration: 45, fade: 15 },
    { file: 'paper_slide_a.mp3', at: 136, volume: 0.8, duration: 40, fade: 12 },
  ],
  complaint: [{ file: 'paper_slide_a.mp3', at: 0, volume: 0.6, duration: 45, fade: 12 }],
  flashback: [
    { file: 'restaurant_ambience_b.mp3', at: 0, volume: 0.3, duration: 175, fade: 20 },
    { file: 'plate_clink_b.mp3', at: 46, volume: 0.8 },
  ],
  // «ба-дум-тсс» (comic_hit) убран по просьбе пользователя 19.11.2026
  lean: [],
  fork: [
    { file: 'card_pop_b.mp3', at: 42, volume: 0.7 },
    { file: 'card_pop_b.mp3', at: 156, volume: 0.7 },
    { file: 'card_pop_b.mp3', at: 264, volume: 0.7 },
    { file: 'card_pop_b.mp3', at: 344, volume: 0.9 },
  ],
};

// --- Субтитры и ремарки ---------------------------------------------------
export type Cue = SubtitleProps & { from: number; to: number };
export type RemarkCue = { text: string; from: number; to: number };

export const SUBTITLES: Record<SceneId, Cue[]> = {
  phone: [
    { from: 96, to: 207, text: 'Управляющий написал: «Зайди после смены. Поговорим».' },
    { from: 207, to: 243, text: 'Без смайлика.', highlight: 'Без смайлика.' },
  ],
  thoughts: [
    { from: 100, to: 180, text: 'Без смайлика — это как борщ без сметаны.', highlight: 'борщ без сметаны.' },
    { from: 180, to: 228, text: 'Ничего хорошего.' },
  ],
  office: [],
  complaint: [{ from: 178, to: 252, text: 'Стол семь — твоя зона.', highlight: 'твоя зона.' }],
  flashback: [{ from: 56, to: 140, text: 'Зато свежий! Только что из холодильника!', highlight: 'из холодильника!' }],
  lean: [
    { from: 6, to: 101, text: 'В пятницу хозяйка выбирает старшего официанта.' },
    { from: 103, to: 170, text: 'С жалобой — это точно не ты.', highlight: 'точно не ты.' },
    { from: 174, to: 292, text: 'Кажется, кашу заварил не я, а расхлёбывать мне.', highlight: 'расхлёбывать мне.' },
  ],
  fork: [],
};

export const REMARKS: Record<SceneId, RemarkCue[]> = {
  phone: [{ text: '23:47. Смена закончилась.', from: 0, to: 243 }],
  thoughts: [],
  office: [{ text: 'Эдуард Борисович молчит. Это хуже, чем крик.', from: 30, to: 180 }],
  complaint: [],
  flashback: [{ text: 'Вчера. Стол 7.', from: 0, to: 175 }],
  lean: [{ text: 'Костя (про себя)', from: 174, to: 292 }],
  fork: [{ text: 'Что делать Косте?', from: 0, to: 427 }],
};

// --- Сценические события ------------------------------------------------------
export const THOUGHTS = [
  { text: 'штраф?', x: 150, y: 210, angle: -6, at: 8 },
  { text: 'увольнение?', x: 930, y: 200, angle: 5, at: 34 },
  { text: 'тот разбитый бокал?', x: 900, y: 440, angle: -3, at: 62 },
] as const;

// Кабинет: Эдуард кладёт листок после слов рассказчика
export const OFFICE = { sheetFrom: 140, sheetTo: 160 } as const;

export const COMPLAINT = {
  title: 'ЖАЛОБА',
  lines: ['Стол 7.', 'Борщ холодный.', 'Официант сказал:', '«Зато свежий».'],
} as const;

export const FORK = {
  options: [
    { badge: 'А', lines: ['Взять вину', 'на себя —', 'прикрыть', 'новичка'], at: 44 },
    { badge: 'Б', lines: ['Сказать правду:', 'это был Дима'], at: 158 },
    { badge: 'custom', lines: ['Свой вариант —', 'пишите', 'в комментариях'], at: 266 },
  ],
  voteText: 'Голосуй в Telegram',
  voteAt: 346,
} as const;
