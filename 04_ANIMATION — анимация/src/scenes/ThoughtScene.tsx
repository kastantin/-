import { SCENE_VIEWBOX, VIDEO } from '../config';
import { SceneCharacter, type LiveState } from '../characters/Character';
import type { EmotionName } from '../characters/expressions';
import { HandDrawn } from '../characters/HandDrawn';
import { CHAR } from '../characters/palette';

// Сцена 2: Костя в панике, вокруг головы всплывают карточки-мысли
const INK = CHAR.ink;
const HAND_FONT = 'Segoe Print, Comic Sans MS, sans-serif';
const CARD_FONT_SIZE = 40;
const CARD_HEIGHT = 84;
const CHAR_WIDTH = 23;

// Костя и его голова в этой сцене (голова — исток «пузырьков» мысли)
const KOSTYA = { x: 540, footY: 770, height: 640 };
const HEAD = { x: 540, y: 258 };

export type ThoughtCard = {
  text: string;
  x: number;
  y: number;
  angle: number;
  // 0 — ещё нет, 1 — полностью появилась
  progress: number;
};

function Card({ card }: { card: ThoughtCard }) {
  if (card.progress <= 0) return null;
  const width = 60 + card.text.length * CHAR_WIDTH;
  const scale = card.progress;
  const bubbles = [0.38, 0.52, 0.66].map((t, i) => ({
    cx: HEAD.x + (card.x - HEAD.x) * t,
    cy: HEAD.y + (card.y - HEAD.y) * t,
    r: 7 + i * 4,
  }));
  return (
    <g opacity={Math.min(1, card.progress * 1.5)}>
      {bubbles.map((b) => (
        <circle key={`${b.cx}-${b.cy}`} cx={b.cx} cy={b.cy} r={b.r * scale} fill={CHAR.shirt} stroke={INK} strokeWidth={3} />
      ))}
      <g transform={`translate(${card.x} ${card.y}) rotate(${card.angle}) scale(${scale})`}>
        <rect x={-width / 2 + 6} y={-CARD_HEIGHT / 2 + 8} width={width} height={CARD_HEIGHT} rx={14} fill={INK} opacity={0.35} />
        <rect x={-width / 2} y={-CARD_HEIGHT / 2} width={width} height={CARD_HEIGHT} rx={14} fill={CHAR.shirt} stroke={INK} strokeWidth={4} />
        <text x={0} y={14} textAnchor="middle" fontFamily={HAND_FONT} fontSize={CARD_FONT_SIZE} fill={INK}>
          {card.text}
        </text>
      </g>
    </g>
  );
}

function PanicRays() {
  const rays = Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2);
  return (
    <g opacity={0.5}>
      {rays.map((a) => {
        const p1 = `${HEAD.x + Math.cos(a) * 900} ${HEAD.y + Math.sin(a) * 900}`;
        const p2 = `${HEAD.x + Math.cos(a + 0.18) * 900} ${HEAD.y + Math.sin(a + 0.18) * 900}`;
        return <path key={a} d={`M ${HEAD.x} ${HEAD.y} L ${p1} L ${p2} Z`} fill="#4a4552" />;
      })}
    </g>
  );
}

interface ThoughtSceneProps {
  emotion: EmotionName;
  live?: LiveState;
  shake?: number;
  cards: ThoughtCard[];
  boilSeed?: number;
}

export function ThoughtScene({ emotion, live, shake = 0, cards, boilSeed = 1 }: ThoughtSceneProps) {
  return (
    <svg width={VIDEO.width} height={VIDEO.height} viewBox={SCENE_VIEWBOX}>
      <rect x={-200} y={0} width={1480} height={720} fill="#3a3640" />
      <PanicRays />
      <circle cx={HEAD.x} cy={HEAD.y + 60} r={250} fill="#4f4957" />
      <SceneCharacter
        id="kostya"
        emotion={emotion}
        x={KOSTYA.x + shake}
        footY={KOSTYA.footY}
        height={KOSTYA.height}
        boilSeed={boilSeed}
        {...live}
      />
      <HandDrawn seed={boilSeed}>
        {cards.map((card) => (
          <Card key={card.text} card={card} />
        ))}
      </HandDrawn>
    </svg>
  );
}
