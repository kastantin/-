import { CHAR } from './palette';
import { Arms, outline, TORSO } from './parts';

// Маргарита Львовна — хозяйка «Скатерти» (серия 5: впервые видно лицо).
// Спокойная, считает вслух: зачёсанные волосы с пучком, жемчуг, бирюзовый жакет, юбка-карандаш, красные каблуки.
// Координаты те же: голова — центр (0,0), радиус 60; плечи y≈70, пояс y≈200, каблуки y≈304.

const HAIR = '#5d4a45';
const BLAZER = '#2f5f63';
const SKIRT = '#262a30';
const HEEL = '#c2412f';

export function OwnerHair() {
  return (
    <g>
      <circle cx={0} cy={-72} r={20} fill={HAIR} {...outline} />
      <path d="M -62 -2 Q -66 -64 0 -62 Q 66 -64 62 -2 Q 54 -42 22 -46 Q -14 -52 -62 -2 Z" fill={HAIR} {...outline} />
      <path d="M -32 -50 Q -10 -62 16 -55" stroke="#d9d6dc" strokeWidth={5} strokeLinecap="round" fill="none" />
      <path d="M -8 -88 Q 0 -94 9 -88" stroke="#d9d6dc" strokeWidth={3.4} strokeLinecap="round" fill="none" />
    </g>
  );
}

// Серьги-жемчужины
export function OwnerEarrings() {
  return (
    <g fill="#ffffff" stroke={CHAR.ink} strokeWidth={2}>
      <circle cx={-60} cy={20} r={5.5} />
      <circle cx={60} cy={20} r={5.5} />
    </g>
  );
}

const PEARLS = [-18, -12, -6, 0, 6, 12, 18].map((x) => ({ x, y: 66 + 18 * (1 - (x / 18) ** 2) * 0.9 + 4 }));

export function OwnerBody() {
  return (
    <g>
      {/* ноги в тёмных колготках и красные каблуки */}
      <rect x={-17} y={240} width={13} height={58} rx={5} fill="#2f3138" {...outline} strokeWidth={2.6} />
      <rect x={4} y={240} width={13} height={58} rx={5} fill="#2f3138" {...outline} strokeWidth={2.6} />
      {[-11, 11].map((cx) => (
        <g key={cx}>
          <ellipse cx={cx + 3} cy={300} rx={15} ry={6.5} fill={HEEL} {...outline} strokeWidth={2.4} />
          <path d={`M ${cx - 9} 304 L ${cx - 12} 316 L ${cx - 7} 316 L ${cx - 3} 305 Z`} fill={HEEL} {...outline} strokeWidth={2} />
        </g>
      ))}
      <path d="M -46 194 L 46 194 L 56 252 L -56 252 Z" fill={SKIRT} {...outline} />
      <path d={TORSO} fill={BLAZER} {...outline} />
      <path d="M -20 66 L 0 126 L 20 66 Q 0 60 -20 66 Z" fill={CHAR.shirt} {...outline} strokeWidth={2.4} />
      <path d="M -20 66 L -6 132 M 20 66 L 6 132" stroke={CHAR.ink} strokeWidth={2.4} fill="none" />
      <circle cx={0} cy={164} r={3.5} fill={CHAR.gold} {...outline} strokeWidth={1.6} />
      {PEARLS.map((p) => (
        <circle key={p.x} cx={p.x} cy={p.y} r={3.6} fill="#ffffff" stroke={CHAR.ink} strokeWidth={1.4} />
      ))}
      <Arms color={BLAZER} />
    </g>
  );
}

// Красная ручка в правой руке (координаты тела: кисть ≈ (66,186)): ею обводят фамилии
export function RedPenHeld() {
  return (
    <g transform="translate(72 176) rotate(28)">
      <rect x={-3.5} y={-46} width={7} height={52} rx={3.5} fill="#d6332a" {...outline} strokeWidth={2.2} />
      <path d="M -3.5 6 L 0 16 L 3.5 6 Z" fill={CHAR.ink} />
      <rect x={-3.5} y={-46} width={7} height={8} rx={3} fill={CHAR.ink} />
    </g>
  );
}
