import { SceneCharacter } from '../characters/Character';
import type { EmotionName } from '../characters/expressions';
import { HandDrawn } from '../characters/HandDrawn';
import { CHAR } from '../characters/palette';
import { ACCENT } from '../layout/EpisodeFrame';
import { ColdBorscht } from '../scenes/HallScene';

// Аватарка Telegram-канала «Общепитная яма»: Костя за столом с белой скатертью,
// лента с названием канала и слоган. Квадрат 1024×1024; всё важное — в центральном
// круге, потому что соцсети обрезают аватарку по кругу
export const AVATAR_SIZE = 1024;

const INK = CHAR.ink;
const TITLE_FONT = 'Segoe UI Black, Arial Black, sans-serif';
const HAND_FONT = 'Segoe Print, Comic Sans MS, sans-serif';

// Костя: рост 1100 → масштаб 2.75 от координат персонажа (голова r=60, центр в 0,0)
const KOSTYA = { x: 512, footY: 1240, height: 1100 };
const SCALE = KOSTYA.height / 400;
const HEAD = { x: KOSTYA.x, y: KOSTYA.footY - KOSTYA.height + 80 * SCALE, r: 60 * SCALE };
const CLOTH_TOP = 700;

export type AvatarTexts = {
  channel: string;
  tagline: string;
};

function Rays() {
  const rays = Array.from({ length: 18 }, (_, i) => (i / 18) * Math.PI * 2);
  return (
    <g>
      {rays.map((a) => {
        const p1 = `${HEAD.x + Math.cos(a) * 900} ${HEAD.y + Math.sin(a) * 900}`;
        const p2 = `${HEAD.x + Math.cos(a + 0.17) * 900} ${HEAD.y + Math.sin(a + 0.17) * 900}`;
        return <path key={a} d={`M ${HEAD.x} ${HEAD.y} L ${p1} L ${p2} Z`} fill="#ec6a55" />;
      })}
    </g>
  );
}

// Полутоновые точки по углам — «печатная» фактура как в комиксе
function Halftone() {
  const dots: { x: number; y: number; r: number }[] = [];
  for (let y = 20; y < CLOTH_TOP; y += 34) {
    for (let x = 20; x < AVATAR_SIZE; x += 34) {
      const dist = Math.hypot(x - HEAD.x, y - HEAD.y);
      const r = Math.max(0, (dist - 300) / 70);
      if (r > 0.6) dots.push({ x: x + ((y / 34) % 2) * 17, y, r: Math.min(r, 7) });
    }
  }
  return (
    <g fill="#c8432f" opacity={0.55}>
      {dots.map((d) => (
        <circle key={`${d.x}-${d.y}`} cx={d.x} cy={d.y} r={d.r} />
      ))}
    </g>
  );
}

// Мягкая тень на голове (снизу справа) — объём без смены стиля
function HeadShade({ clipId }: { clipId: string }) {
  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <circle cx={HEAD.x} cy={HEAD.y} r={HEAD.r - 4} />
        </clipPath>
      </defs>
      <path
        clipPath={`url(#${clipId})`}
        fillRule="evenodd"
        d={`M ${HEAD.x - 300} ${HEAD.y - 300} h 600 v 600 h -600 Z M ${HEAD.x - 22} ${HEAD.y - 22} m ${-HEAD.r} 0 a ${HEAD.r} ${HEAD.r} 0 1 0 ${HEAD.r * 2} 0 a ${HEAD.r} ${HEAD.r} 0 1 0 ${-HEAD.r * 2} 0`}
        fill="#8c8a90"
        opacity={0.18}
      />
    </g>
  );
}

// Штрихи «паники» у головы — выживание в общепите дело нервное
function StressMarks() {
  const marks = [
    { a: -2.5, len: 46 },
    { a: -2.2, len: 34 },
    { a: -0.6, len: 46 },
    { a: -0.9, len: 34 },
  ];
  return (
    <g stroke={INK} strokeWidth={9} strokeLinecap="round">
      {marks.map((m) => {
        const r0 = HEAD.r + 34;
        const x1 = HEAD.x + Math.cos(m.a) * r0;
        const y1 = HEAD.y + Math.sin(m.a) * r0;
        const x2 = HEAD.x + Math.cos(m.a) * (r0 + m.len);
        const y2 = HEAD.y + Math.sin(m.a) * (r0 + m.len);
        return <path key={m.a} d={`M ${x1} ${y1} L ${x2} ${y2}`} />;
      })}
    </g>
  );
}

function WineGlass({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke={INK} strokeWidth={6} strokeLinejoin="round">
      <path d="M -34 -150 Q -38 -90 0 -76 Q 38 -90 34 -150 Z" fill="#f3f6f8" />
      <path d="M -30 -112 Q 0 -100 30 -112 Q 30 -88 0 -80 Q -30 -88 -30 -112 Z" fill="#9b2335" strokeWidth={4} />
      {/* трещина на бокале — тот самый разбитый бокал */}
      <path d="M 18 -146 L 8 -128 L 20 -118 L 10 -104" fill="none" strokeWidth={4} />
      <path d="M 0 -76 L 0 -12" fill="none" />
      <ellipse cx={0} cy={-8} rx={30} ry={9} fill="#f3f6f8" />
    </g>
  );
}

function Cutlery({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke={INK} strokeWidth={5} strokeLinecap="round" fill="#d9dde3">
      <g transform="rotate(-24)">
        <rect x={-7} y={-120} width={14} height={120} rx={6} />
        <path d="M -12 -150 L -12 -116 M 0 -152 L 0 -116 M 12 -150 L 12 -116" fill="none" />
      </g>
      <g transform="rotate(24)">
        <rect x={-7} y={-80} width={14} height={80} rx={6} />
        <path d="M -9 -84 Q 10 -120 9 -154 Q -9 -130 -9 -84 Z" />
      </g>
    </g>
  );
}

function Tablecloth() {
  const folds = [200, 512, 824];
  return (
    <g>
      <rect x={-20} y={CLOTH_TOP} width={AVATAR_SIZE + 40} height={AVATAR_SIZE - CLOTH_TOP + 20} fill={CHAR.shirt} />
      {/* клетчатая кайма скатерти */}
      <g fill={ACCENT} opacity={0.22}>
        {Array.from({ length: 32 }, (_, i) => (
          <rect key={i} x={i * 32 + (i % 2) * 0} y={CLOTH_TOP + 10 + (i % 2) * 16} width={16} height={16} />
        ))}
      </g>
      {folds.map((x) => (
        <path key={x} d={`M ${x} ${CLOTH_TOP + 60} Q ${x - 16} ${CLOTH_TOP + 170} ${x + 6} ${AVATAR_SIZE + 10}`} stroke="#ddd8cd" strokeWidth={12} fill="none" strokeLinecap="round" />
      ))}
      <path d={`M -20 ${CLOTH_TOP} L ${AVATAR_SIZE + 20} ${CLOTH_TOP}`} stroke={INK} strokeWidth={9} />
    </g>
  );
}

// Лента с названием канала: тёмная полоса с загнутыми концами
function Ribbon({ text }: { text: string }) {
  const y = 728;
  const w = 730;
  const h = 104;
  const left = 512 - w / 2;
  const right = 512 + w / 2;
  return (
    <g>
      {/* загнутые хвосты */}
      <path d={`M ${left + 30} ${y + 20} L ${left - 40} ${y + 20} L ${left - 14} ${y + h / 2 + 20} L ${left - 40} ${y + h + 20} L ${left + 30} ${y + h + 20} Z`} fill="#a8321f" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <path d={`M ${right - 30} ${y + 20} L ${right + 40} ${y + 20} L ${right + 14} ${y + h / 2 + 20} L ${right + 40} ${y + h + 20} L ${right - 30} ${y + h + 20} Z`} fill="#a8321f" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <rect x={left + 8} y={y + 10} width={w} height={h} rx={10} fill={INK} opacity={0.35} />
      <rect x={left} y={y} width={w} height={h} rx={10} fill={ACCENT} stroke={INK} strokeWidth={8} />
      <text x={512} y={y + 74} textAnchor="middle" fontFamily={TITLE_FONT} fontSize={63} letterSpacing={2} fill={CHAR.shirt} stroke={INK} strokeWidth={3} paintOrder="stroke">
        {text}
      </text>
    </g>
  );
}

function Tagline({ text }: { text: string }) {
  return (
    <text x={512} y={896} textAnchor="middle" fontFamily={HAND_FONT} fontSize={52} fontWeight={700} fill={INK} transform="rotate(-2 512 880)">
      {text}
    </text>
  );
}

export type AvatarProps = {
  emotion: EmotionName;
  texts: AvatarTexts;
};

export function Avatar({ emotion, texts }: AvatarProps) {
  return (
    <svg width={AVATAR_SIZE} height={AVATAR_SIZE} viewBox={`0 0 ${AVATAR_SIZE} ${AVATAR_SIZE}`}>
      <rect width={AVATAR_SIZE} height={AVATAR_SIZE} fill={ACCENT} />
      <Rays />
      <Halftone />
      <SceneCharacter id="kostya" emotion={emotion} x={KOSTYA.x} footY={KOSTYA.footY} height={KOSTYA.height} boilSeed={3} />
      <HeadShade clipId="avatar-head-shade" />
      <HandDrawn seed={3} strength={3}>
        <StressMarks />
        <Tablecloth />
        <g transform={`translate(225 ${CLOTH_TOP - 14}) scale(1.9)`}>
          <ColdBorscht x={0} y={0} />
        </g>
        <WineGlass x={790} y={CLOTH_TOP + 4} />
        <Cutlery x={900} y={CLOTH_TOP + 2} />
        <Ribbon text={texts.channel} />
        <Tagline text={texts.tagline} />
      </HandDrawn>
    </svg>
  );
}
