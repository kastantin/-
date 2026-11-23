import { useId } from 'react';
import { SCENE_VIEWBOX, VIDEO } from '../config';
import { Character, type LiveState } from '../characters/Character';
import { HandDrawn } from '../characters/HandDrawn';
import { CHAR } from '../characters/palette';

// Сцена 4 мультфильма: вставка-карточка с репликой гостя крупно на столе
const INK = CHAR.ink;
const RED = '#c2412f';
const HAND_FONT = 'Segoe Print, Comic Sans MS, sans-serif';

const CARD = { x: 250, y: 150, w: 520, h: 430 };
const LINE_X = CARD.x + 44;
const LINE_Y0 = CARD.y + 150;
const LINE_STEP = 66;
const LINE_MAX_W = CARD.w - 80;

// Строка «дописывается» слева направо: reveal — сколько строк уже написано (дробное)
function WrittenLine({ text, index, reveal }: { text: string; index: number; reveal: number }) {
  const id = `line-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const p = Math.max(0, Math.min(1, reveal - index));
  if (p <= 0) return null;
  const y = LINE_Y0 + index * LINE_STEP;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={LINE_X - 10} y={y - 50} width={LINE_MAX_W * p + 10} height={70} />
        </clipPath>
      </defs>
      <text x={LINE_X} y={y} fontFamily={HAND_FONT} fontSize={36} fill={INK} clipPath={`url(#${id})`}>
        {text}
      </text>
    </g>
  );
}

function WoodTable() {
  const grain = [120, 260, 420, 600];
  return (
    <g>
      <rect x={-200} y={0} width={1480} height={720} fill="#7a5236" />
      {grain.map((y) => (
        <path key={y} d={`M -200 ${y} Q 300 ${y - 30} 700 ${y + 10} T 1280 ${y - 6}`} stroke="#6a4630" strokeWidth={6} fill="none" />
      ))}
    </g>
  );
}

interface ComplaintSceneProps {
  title: string;
  lines: string[];
  // въезд карточки снизу: 0 — за кадром, 1 — на месте
  cardIn: number;
  reveal: number;
  eduardLive?: LiveState;
  boilSeed?: number;
}

export function ComplaintScene({ title, lines, cardIn, reveal, eduardLive, boilSeed = 1 }: ComplaintSceneProps) {
  const slide = (1 - cardIn) * 620;
  return (
    <svg width={VIDEO.width} height={VIDEO.height} viewBox={SCENE_VIEWBOX}>
      <WoodTable />
      <g transform={`translate(0 ${slide}) rotate(-2 ${CARD.x + CARD.w / 2} ${CARD.y + CARD.h / 2})`}>
        <HandDrawn seed={boilSeed}>
          <rect x={CARD.x + 10} y={CARD.y + 12} width={CARD.w} height={CARD.h} rx={10} fill={INK} opacity={0.35} />
          <rect x={CARD.x} y={CARD.y} width={CARD.w} height={CARD.h} rx={10} fill={CHAR.shirt} stroke={INK} strokeWidth={4} />
          <text x={CARD.x + CARD.w / 2} y={CARD.y + 74} textAnchor="middle" fontFamily="Segoe UI Black, Arial Black, sans-serif" fontSize={44} letterSpacing={6} fill={RED}>
            {title}
          </text>
          <path d={`M ${CARD.x + 120} ${CARD.y + 92} L ${CARD.x + CARD.w - 120} ${CARD.y + 92}`} stroke={RED} strokeWidth={4} />
          {lines.map((text, i) => (
            <WrittenLine key={text} text={text} index={i} reveal={reveal} />
          ))}
        </HandDrawn>
      </g>
      {/* Эдуард в круглой рамке — говорит за кадром */}
      <g transform="translate(940 470)">
        <circle cx={0} cy={0} r={120} fill="#d9cfbb" stroke={INK} strokeWidth={5} />
        <g transform="translate(-100 -96)">
          <Character id="eduard" emotion="tired" mode="head" height={200} boilSeed={boilSeed} {...eduardLive} />
        </g>
      </g>
    </svg>
  );
}
