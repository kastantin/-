import type { Brow, EyeType, Expression, MouthType } from './expressions';
import { CHAR, STROKE } from './palette';

// Лицо рисуется в координатах головы: центр (0,0), радиус 60
const EYE_X = 20;
const EYE_Y = -4;
const BROW_Y = -24;

const line = { stroke: CHAR.ink, strokeWidth: STROKE, strokeLinecap: 'round' as const, fill: 'none' };

function Eye({ type, x }: { type: EyeType; x: number }) {
  switch (type) {
    case 'wide':
      return (
        <g>
          <circle cx={x} cy={EYE_Y} r={10} fill={CHAR.skin} stroke={CHAR.ink} strokeWidth={2.5} />
          <circle cx={x} cy={EYE_Y} r={4} fill={CHAR.ink} />
        </g>
      );
    case 'happy':
      return <path d={`M ${x - 8} ${EYE_Y + 2} Q ${x} ${EYE_Y - 9} ${x + 8} ${EYE_Y + 2}`} {...line} />;
    case 'tired':
      return (
        <g>
          <circle cx={x} cy={EYE_Y + 2} r={5} fill={CHAR.ink} />
          <path d={`M ${x - 9} ${EYE_Y - 2} L ${x + 9} ${EYE_Y - 2}`} {...line} />
        </g>
      );
    case 'closed':
      return <path d={`M ${x - 8} ${EYE_Y} L ${x + 8} ${EYE_Y}`} {...line} />;
    case 'dot':
    default:
      return <circle cx={x} cy={EYE_Y} r={5.5} fill={CHAR.ink} />;
  }
}

function BrowLine({ brow, side }: { brow: Brow; side: -1 | 1 }) {
  const cx = side * 21;
  const cy = BROW_Y + brow.dy;
  // Для левой брови внутренний конец справа, для правой — слева, поэтому угол зеркалим
  const angle = side === -1 ? brow.angle : -brow.angle;
  return (
    <path
      d={`M ${cx - 10} ${cy} L ${cx + 10} ${cy}`}
      transform={`rotate(${angle} ${cx} ${cy})`}
      {...line}
      strokeWidth={STROKE + 0.5}
    />
  );
}

function Mouth({ type, y }: { type: MouthType; y: number }) {
  switch (type) {
    case 'smile':
      return <path d={`M -16 ${y - 3} Q 0 ${y + 10} 16 ${y - 3}`} {...line} />;
    case 'grin':
      return (
        <path
          d={`M -18 ${y - 4} L 18 ${y - 4} Q 0 ${y + 22} -18 ${y - 4} Z`}
          fill={CHAR.mouthInside}
          stroke={CHAR.ink}
          strokeWidth={STROKE}
          strokeLinejoin="round"
        />
      );
    case 'frown':
      return <path d={`M -14 ${y + 5} Q 0 ${y - 6} 14 ${y + 5}`} {...line} />;
    case 'open':
      return <ellipse cx={0} cy={y + 2} rx={8} ry={11} fill={CHAR.mouthInside} stroke={CHAR.ink} strokeWidth={STROKE} />;
    case 'wavy':
      return <path d={`M -16 ${y} L -8 ${y - 4} L 0 ${y} L 8 ${y - 4} L 16 ${y}`} {...line} strokeLinejoin="round" />;
    case 'smirk':
      return <path d={`M -12 ${y + 2} Q 4 ${y + 5} 16 ${y - 6}`} {...line} />;
    case 'shout':
      // крик: широкий рот с верхними зубами
      return (
        <g>
          <path
            d={`M -20 ${y - 6} Q 0 ${y - 10} 20 ${y - 6} Q 18 ${y + 20} 0 ${y + 20} Q -18 ${y + 20} -20 ${y - 6} Z`}
            fill={CHAR.mouthInside}
            stroke={CHAR.ink}
            strokeWidth={STROKE}
            strokeLinejoin="round"
          />
          <path d={`M -16 ${y - 5} Q 0 ${y - 8} 16 ${y - 5} L 15 ${y + 1} Q 0 ${y - 2} -15 ${y + 1} Z`} fill={CHAR.teeth} />
        </g>
      );
    case 'neutral':
    default:
      return <path d={`M -12 ${y} L 12 ${y}`} {...line} />;
  }
}

interface FaceProps {
  expression: Expression;
  mouthY?: number;
}

export function Face({ expression, mouthY = 26 }: FaceProps) {
  return (
    <g>
      {expression.blush && (
        <g opacity={0.55}>
          <ellipse cx={-34} cy={14} rx={9} ry={5} fill={CHAR.blush} />
          <ellipse cx={34} cy={14} rx={9} ry={5} fill={CHAR.blush} />
        </g>
      )}
      <Eye type={expression.eyes} x={-EYE_X} />
      <Eye type={expression.eyes} x={EYE_X} />
      <BrowLine brow={expression.browL} side={-1} />
      <BrowLine brow={expression.browR} side={1} />
      <Mouth type={expression.mouth} y={mouthY} />
      {expression.sweat && (
        <path
          d="M 50 -34 Q 44 -22 50 -18 Q 56 -22 50 -34 Z"
          fill={CHAR.sweat}
          stroke={CHAR.ink}
          strokeWidth={2}
        />
      )}
    </g>
  );
}
