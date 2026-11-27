// Серия 6 «На чай»: FILES — файл для каждой реплики (по идентификатору из timeline.ts),
// VOICE_DATA — длительность и отрезки речи (секунды) по паузам ffmpeg silencedetect. Не править руками.
export const FILES: Record<string, string> = {
  kostya_s01: 's01_01_kostya.mp3',
  margarita_s02: 's02_01_margarita.mp3',
  beks_s02: 's02_02_beks.mp3',
  gena_s04: 's04_01_gena.mp3',
  kostya_s04: 's04_02_kostya.mp3',
  eduard_s05: 's05_01_eduard.mp3',
  beks_s05: 's05_02_beks.mp3',
  narr_sovet: 'narr_sc03_sovet.mp3',
  narr_gost: 'narr_sc06_gost.mp3',
  narr_A: 'narr_karta_A.mp3',
  narr_B: 'narr_karta_B.mp3',
  narr_svoy: 'narr_karta_svoy.mp3',
  narr_final: 'narr_karta_final.mp3',
};

export const VOICE_DATA: Record<string, { dur: number; speech: ReadonlyArray<readonly [number, number]> }> = {
  's01_01_kostya.mp3': { dur: 3.71, speech: [[0,1.61],[1.89,2.44],[2.89,3.71]] },
  's02_01_margarita.mp3': { dur: 7.81, speech: [[0,1.08],[1.56,5.12],[5.69,7.81]] },
  's02_02_beks.mp3': { dur: 1.07, speech: [[0,1.07]] },
  's04_01_gena.mp3': { dur: 2.93, speech: [[0,1.18],[1.5,2.93]] },
  's04_02_kostya.mp3': { dur: 3.97, speech: [[0,1.76],[2.11,3.97]] },
  's05_01_eduard.mp3': { dur: 5.64, speech: [[0,1.4],[1.69,5.64]] },
  's05_02_beks.mp3': { dur: 1.80, speech: [[0,1.44]] },
  'narr_sc03_sovet.mp3': { dur: 5.72, speech: [[0,1.85],[2.37,3.74],[4.21,5.72]] },
  'narr_sc06_gost.mp3': { dur: 4.36, speech: [[0,2.85],[3.24,4.36]] },
  'narr_karta_A.mp3': { dur: 3.55, speech: [[0,0.29],[0.61,1.31],[1.81,3.55]] },
  'narr_karta_B.mp3': { dur: 4.05, speech: [[0,0.43],[0.85,1.41],[1.89,4.05]] },
  'narr_karta_svoy.mp3': { dur: 2.19, speech: [[0,0.88],[1.18,2.19]] },
  'narr_karta_final.mp3': { dur: 3.40, speech: [[0,1.3],[1.73,3.4]] },
};
