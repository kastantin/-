// Набор эмоций: из этих пресетов собирается мимика любого персонажа

export type EyeType = 'dot' | 'wide' | 'happy' | 'tired' | 'closed';
export type MouthType = 'neutral' | 'smile' | 'grin' | 'frown' | 'open' | 'wavy' | 'smirk' | 'shout';

// dy — сдвиг брови по вертикали (минус = выше), angle — наклон (плюс = сердито, минус = жалобно)
export interface Brow {
  dy: number;
  angle: number;
}

export interface Expression {
  eyes: EyeType;
  mouth: MouthType;
  browL: Brow;
  browR: Brow;
  sweat?: boolean;
  blush?: boolean;
}

export type EmotionName =
  | 'neutral'
  | 'happy'
  | 'panic'
  | 'angry'
  | 'smirk'
  | 'sad'
  | 'surprised'
  | 'tired'
  | 'skeptical'
  | 'yell';

const flat: Brow = { dy: 0, angle: 0 };

export const EMOTIONS: Record<EmotionName, Expression> = {
  neutral: { eyes: 'dot', mouth: 'neutral', browL: flat, browR: flat },
  happy: { eyes: 'happy', mouth: 'grin', browL: { dy: -6, angle: 0 }, browR: { dy: -6, angle: 0 }, blush: true },
  panic: { eyes: 'wide', mouth: 'wavy', browL: { dy: -8, angle: -18 }, browR: { dy: -8, angle: -18 }, sweat: true },
  angry: { eyes: 'dot', mouth: 'frown', browL: { dy: 2, angle: 22 }, browR: { dy: 2, angle: 22 } },
  smirk: { eyes: 'dot', mouth: 'smirk', browL: flat, browR: { dy: -8, angle: -6 } },
  sad: { eyes: 'dot', mouth: 'frown', browL: { dy: -4, angle: -16 }, browR: { dy: -4, angle: -16 } },
  surprised: { eyes: 'wide', mouth: 'open', browL: { dy: -12, angle: 0 }, browR: { dy: -12, angle: 0 } },
  tired: { eyes: 'tired', mouth: 'neutral', browL: { dy: 3, angle: -4 }, browR: { dy: 3, angle: -4 } },
  skeptical: { eyes: 'dot', mouth: 'neutral', browL: { dy: 2, angle: 10 }, browR: { dy: -10, angle: -4 } },
  yell: { eyes: 'wide', mouth: 'shout', browL: { dy: 4, angle: 28 }, browR: { dy: 4, angle: 28 } },
};

export const EMOTION_LABELS: Record<EmotionName, string> = {
  neutral: 'спокоен',
  happy: 'рад',
  panic: 'паника',
  angry: 'злится',
  smirk: 'хитрит',
  sad: 'грустит',
  surprised: 'удивлён',
  tired: 'устал',
  skeptical: 'сомневается',
  yell: 'орёт',
};
