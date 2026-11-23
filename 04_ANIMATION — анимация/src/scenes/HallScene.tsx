import { SCENE_VIEWBOX, VIDEO } from '../config';
import { handPosition, SceneCharacter, type LiveState } from '../characters/Character';
import type { EmotionName } from '../characters/expressions';
import { HandDrawn } from '../characters/HandDrawn';
import { CHAR } from '../characters/palette';

// Зал ресторана «Скатерть»: подвесные лампы, вывеска, стол 7 с белой скатертью
const INK = CHAR.ink;
const S = 4;

function PendantLamp({ x }: { x: number }) {
  return (
    <g>
      <path d={`M ${x} 0 L ${x} 90`} stroke={INK} strokeWidth={3} />
      <circle cx={x} cy={128} r={70} fill="#f2c14e" opacity={0.18} />
      <path d={`M ${x - 34} 120 L ${x - 14} 88 L ${x + 14} 88 L ${x + 34} 120 Z`} fill="#f2c14e" stroke={INK} strokeWidth={S} />
    </g>
  );
}

function Sign() {
  return (
    <g transform="rotate(-1.5 180 210)">
      <rect x={30} y={170} width={300} height={84} rx={10} fill="#2b2a2e" stroke={INK} strokeWidth={S} />
      <text x={180} y={226} textAnchor="middle" fontFamily="Segoe Print, Comic Sans MS, sans-serif" fontSize={40} fill="#f6f3ec">
        Скатерть
      </text>
    </g>
  );
}

function Table7() {
  return (
    <g>
      <rect x={705} y={560} width={14} height={130} fill="#5b3a2c" stroke={INK} strokeWidth={3} />
      <rect x={905} y={560} width={14} height={130} fill="#5b3a2c" stroke={INK} strokeWidth={3} />
      {/* скатерть с волнистым краем */}
      <path
        d="M 660 500 L 960 500 L 966 590 Q 948 604 930 590 Q 912 604 894 590 Q 876 604 858 590 Q 840 604 822 590 Q 804 604 786 590 Q 768 604 750 590 Q 732 604 714 590 Q 696 604 678 590 Q 664 600 654 590 Z"
        fill="#f6f3ec"
        stroke={INK}
        strokeWidth={S}
        strokeLinejoin="round"
      />
      {/* табличка с номером */}
      <path d="M 900 500 L 912 462 L 938 462 L 950 500 Z" fill="#2b2a2e" stroke={INK} strokeWidth={3} />
      <text x={925} y={490} textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize={22} fill="#f6f3ec">
        7
      </text>
    </g>
  );
}

// Тарелка «холодного» борща с кубиком льда и снежинкой
export function ColdBorscht({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={0} rx={56} ry={14} fill="#f6f3ec" stroke={INK} strokeWidth={3} />
      <path d="M -42 -6 Q 0 34 42 -6 Z" fill="#f6f3ec" stroke={INK} strokeWidth={3} />
      <ellipse cx={0} cy={-6} rx={42} ry={9} fill="#b8322a" stroke={INK} strokeWidth={3} />
      <rect x={-6} y={-18} width={18} height={16} rx={3} fill="#cfeaf6" stroke={INK} strokeWidth={2} transform="rotate(12 3 -10)" />
      <g transform="translate(-30 -52)" stroke="#9fd3f0" strokeWidth={4} strokeLinecap="round">
        <path d="M 0 -14 L 0 14 M -12 -7 L 12 7 M -12 7 L 12 -7" />
      </g>
    </g>
  );
}

interface HallSceneProps {
  dima?: EmotionName;
  guest?: EmotionName;
  dimaLive?: LiveState;
  guestLive?: LiveState;
  // сдвиг Димы от его места у стола (для выхода из-за края кадра)
  dimaOffsetX?: number;
  // подпрыгивание при ходьбе, вверх — минус
  dimaBob?: number;
  boilSeed?: number;
}

export function HallScene({
  dima = 'happy',
  guest = 'angry',
  dimaLive,
  guestLive,
  dimaOffsetX = 0,
  dimaBob = 0,
  boilSeed = 1,
}: HallSceneProps) {
  const dimaPos = { x: 470 + dimaOffsetX, footY: 700 + dimaBob, height: 540 };
  const hand = handPosition(dimaPos.x, dimaPos.footY, dimaPos.height, 1);
  return (
    <svg width={VIDEO.width} height={VIDEO.height} viewBox={SCENE_VIEWBOX}>
      <rect x={-200} y={0} width={1480} height={720} fill="#a65d45" />
      <rect x={-200} y={430} width={1480} height={180} fill="#7c4a38" />
      <path d="M -200 430 L 1280 430" stroke={INK} strokeWidth={S} />
      <rect x={-200} y={610} width={1480} height={110} fill="#4e3226" />
      <path d="M -200 610 L 1280 610" stroke={INK} strokeWidth={S} />
      <HandDrawn seed={boilSeed}>
        <Sign />
        <PendantLamp x={470} />
        <PendantLamp x={810} />
      </HandDrawn>
      <SceneCharacter id="guest" emotion={guest} x={810} footY={690} height={500} flip boilSeed={boilSeed} {...guestLive} />
      <HandDrawn seed={boilSeed}>
        <Table7 />
      </HandDrawn>
      <SceneCharacter id="dima" emotion={dima} x={dimaPos.x} footY={dimaPos.footY} height={dimaPos.height} boilSeed={boilSeed} {...dimaLive} />
      <HandDrawn seed={boilSeed}>
        <ColdBorscht x={hand.x + 10} y={hand.y - 14} />
      </HandDrawn>
    </svg>
  );
}
