import { CHAR } from './palette';
import { Arms, Legs, outline, TORSO } from './parts';

// Серия 6 «Тайный гость»: бабушка-«ревизор», мужчина-поэт с блокнотом, девушка с телефоном.
// Координаты те же: голова — центр (0,0), радиус 60; плечи y≈70, пояс y≈200, ступни y≈305.

const GRANNY_HAIR = '#cfcdd3';
const CARDIGAN = '#9a7bb5';
const GRANNY_SKIRT = '#5a4a63';
const POET_HAIR = '#3a2a22';
const POET_TOP = '#44584f';
const BLOGGER_HAIR = '#d89a4a';
const BLOGGER_TOP = '#e87ba1';
const JEANS = '#4a6fa5';

// --- Бабушка ---------------------------------------------------------------
export function GrannyHair() {
  return (
    <g>
      <circle cx={0} cy={-72} r={22} fill={GRANNY_HAIR} {...outline} />
      <path d="M -62 -2 Q -66 -62 0 -60 Q 66 -62 62 -2 Q 52 -38 20 -42 Q -16 -48 -62 -2 Z" fill={GRANNY_HAIR} {...outline} />
      <path d="M -12 -86 Q 0 -94 12 -86" stroke="#ffffff" strokeWidth={3.4} strokeLinecap="round" fill="none" />
    </g>
  );
}

// Очки
export function GrannyExtra() {
  return (
    <g>
      <circle cx={-26} cy={-4} r={15} fill="#ffffff" fillOpacity={0.25} {...outline} strokeWidth={2.6} />
      <circle cx={26} cy={-4} r={15} fill="#ffffff" fillOpacity={0.25} {...outline} strokeWidth={2.6} />
      <path d="M -11 -4 L 11 -4" stroke={CHAR.ink} strokeWidth={2.6} />
    </g>
  );
}

export function GrannyBody() {
  return (
    <g>
      <rect x={-22} y={240} width={14} height={58} rx={5} fill="#e9dccf" {...outline} strokeWidth={2.6} />
      <rect x={8} y={240} width={14} height={58} rx={5} fill="#e9dccf" {...outline} strokeWidth={2.6} />
      {[-15, 15].map((cx) => (
        <ellipse key={cx} cx={cx} cy={302} rx={19} ry={8} fill="#6b4a3a" {...outline} strokeWidth={2.4} />
      ))}
      <path d="M -50 190 L 50 190 L 62 258 L -62 258 Z" fill={GRANNY_SKIRT} {...outline} />
      <path d={TORSO} fill={CARDIGAN} {...outline} />
      <path d="M 0 70 L 0 214" stroke={CHAR.ink} strokeWidth={2.4} />
      {[110, 140, 170].map((y) => (
        <circle key={y} cx={6} cy={y} r={3.4} fill="#f2e9d8" {...outline} strokeWidth={1.6} />
      ))}
      <Arms color={CARDIGAN} />
    </g>
  );
}

// Большая сумка в правой руке (кисть ≈ (66,186))
export function BagHeld() {
  return (
    <g transform="translate(70 186)">
      <path d="M -22 4 Q 0 -34 22 4" stroke={CHAR.ink} strokeWidth={5} fill="none" />
      <rect x={-34} y={2} width={68} height={56} rx={10} fill="#b5483a" {...outline} />
      <rect x={-8} y={18} width={16} height={10} rx={3} fill={CHAR.gold} {...outline} strokeWidth={2} />
    </g>
  );
}

// --- Мужчина-поэт ----------------------------------------------------------
export function PoetHair() {
  return (
    <g>
      <path d="M -60 -6 Q -76 -60 -20 -66 Q 10 -86 40 -64 Q 74 -50 60 -6 Q 52 -40 24 -44 Q -10 -52 -60 -6 Z" fill={POET_HAIR} {...outline} />
      <path d="M -50 -52 Q -62 -78 -34 -72" stroke={POET_HAIR} strokeWidth={5} strokeLinecap="round" fill="none" />
    </g>
  );
}

export function PoetBody() {
  return (
    <g>
      <Legs color={CHAR.trousers} />
      <path d={TORSO} fill={POET_TOP} {...outline} />
      <path d="M -30 70 Q 0 96 30 70 L 30 60 Q 0 78 -30 60 Z" fill="#c2412f" {...outline} strokeWidth={2.6} />
      <path d="M 18 82 L 30 130 L 18 126 Z" fill="#c2412f" {...outline} strokeWidth={2.4} />
      <Arms color={POET_TOP} />
    </g>
  );
}

// Блокнот в правой руке
export function NotebookHeld() {
  return (
    <g transform="translate(70 170) rotate(-10)">
      <rect x={-22} y={-34} width={44} height={56} rx={4} fill="#f2e6b8" {...outline} strokeWidth={2.6} />
      <path d="M -14 -22 L 14 -22 M -14 -12 L 14 -12 M -14 -2 L 14 -2 M -14 8 L 8 8" stroke="#8c8a96" strokeWidth={2} />
      <rect x={-22} y={-34} width={7} height={56} fill="#c2412f" {...outline} strokeWidth={2} />
    </g>
  );
}

// --- Девушка с телефоном ---------------------------------------------------
export function BloggerHair() {
  return (
    <g>
      <path d="M 40 -62 Q 94 -60 84 -4 Q 80 20 70 14 Q 76 -30 44 -44 Z" fill={BLOGGER_HAIR} {...outline} />
      <path d="M -60 -4 Q -64 -66 0 -64 Q 64 -66 60 -4 Q 52 -40 20 -44 Q -16 -50 -60 -4 Z" fill={BLOGGER_HAIR} {...outline} />
      <circle cx={46} cy={-52} r={7} fill="#e5533d" {...outline} strokeWidth={2.2} />
    </g>
  );
}

export function BloggerBody() {
  return (
    <g>
      <Legs color={JEANS} sneakers />
      <path d={TORSO} fill={BLOGGER_TOP} {...outline} />
      <path d="M -20 66 Q 0 84 20 66" stroke={CHAR.ink} strokeWidth={2.4} fill="none" />
      <Arms color={BLOGGER_TOP} />
    </g>
  );
}

// Телефон в правой руке (снимает блюдо)
export function PhoneHeld() {
  return (
    <g transform="translate(70 160) rotate(8)">
      <rect x={-15} y={-34} width={30} height={54} rx={6} fill={CHAR.ink} {...outline} strokeWidth={2.4} />
      <rect x={-11} y={-28} width={22} height={40} rx={3} fill="#8fd0e8" />
      <circle cx={0} cy={-8} r={7} fill="none" stroke="#ffffff" strokeWidth={2.4} />
    </g>
  );
}
