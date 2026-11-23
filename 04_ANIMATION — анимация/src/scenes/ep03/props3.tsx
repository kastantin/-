import { CHAR } from '../../characters/palette';
import { INK, S, Steam } from '../ep02/kit';

// Реквизит серии 3. Предметы «в руке» нарисованы в координатах тела персонажа (кисть правой руки ≈ (66, 186)).

// Телефон в руке с светящимся экраном
export function PhoneProp({ glow = true }: { glow?: boolean }) {
  return (
    <g transform="translate(72 172) rotate(-14)">
      <rect x={-17} y={-64} width={34} height={64} rx={6} fill="#1f1f22" stroke={INK} strokeWidth={2.4} />
      <rect x={-13} y={-60} width={26} height={52} rx={3} fill={glow ? '#9fd3f0' : '#34323a'} />
    </g>
  );
}

// Блокнот с ручкой: pen — смещение ручки по кадрам (писание)
export function NotebookProp({ pen = 0 }: { pen?: number }) {
  return (
    <g transform="translate(70 176) rotate(-8)">
      <rect x={-22} y={-52} width={44} height={56} rx={3} fill="#fffdf7" stroke={INK} strokeWidth={2.4} />
      <path d="M -14 -38 L 14 -38 M -14 -28 L 14 -28 M -14 -18 L 8 -18" stroke="#9a9a9a" strokeWidth={2} />
      <path d={`M ${6 + pen} -22 L ${16 + pen} -42`} stroke={CHAR.pen} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
}

// Башня из тарелок на ладони (координаты тела Ахмы: ладонь (76,168)); salad — зелёный салат, hot — борщ и пар
export function PlateTower({ count, salad = false, hot = false, phase = 0 }: { count: number; salad?: boolean; hot?: boolean; phase?: number }) {
  const step = count > 20 ? 6 : 7;
  return (
    <g transform="translate(76 168)">
      {Array.from({ length: count }, (_, i) => (
        <g key={i} transform={`translate(0 ${-i * step})`}>
          <ellipse cx={0} cy={0} rx={36} ry={7.5} fill="#f6f3ec" stroke={INK} strokeWidth={2} />
          {salad && <ellipse cx={0} cy={-2} rx={20} ry={4} fill="#4f9a56" />}
          {hot && i % 5 === 0 && <ellipse cx={0} cy={-2} rx={22} ry={4} fill="#b8322a" />}
        </g>
      ))}
      {hot && (
        <g transform={`translate(0 ${-count * step - 10})`}>
          <Steam steam={1} phase={phase} wisps={3} spread={22} />
        </g>
      )}
    </g>
  );
}

// Рыжий кот из гифки: машет лапой; (x, y) — центр рамки
export function CatGif({ x, y, size, frame }: { x: number; y: number; size: number; frame: number }) {
  const k = size / 150;
  const wave = Math.sin(frame * 0.55) * 24;
  return (
    <g transform={`translate(${x} ${y}) scale(${k}) rotate(${Math.sin(frame * 0.1) * 2})`}>
      <rect x={-75} y={-72} width={150} height={144} rx={14} fill="#f3e6b8" stroke={INK} strokeWidth={S} />
      <g transform="translate(0 10)">
        <ellipse cx={0} cy={34} rx={34} ry={30} fill="#e0903f" stroke={INK} strokeWidth={3} />
        <path d="M -26 -34 L -20 -58 L -2 -42 Z M 26 -34 L 20 -58 L 2 -42 Z" fill="#e0903f" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
        <circle cx={0} cy={-14} r={30} fill="#e0903f" stroke={INK} strokeWidth={3} />
        <circle cx={-11} cy={-18} r={4.5} fill={INK} />
        <circle cx={11} cy={-18} r={4.5} fill={INK} />
        <path d="M -4 -8 L 4 -8 L 0 -3 Z" fill="#f2a3a0" stroke={INK} strokeWidth={1.6} />
        <path d="M 0 -3 Q -5 4 -10 1 M 0 -3 Q 5 4 10 1" stroke={INK} strokeWidth={2} fill="none" />
        <path d="M -16 -6 L -38 -10 M -16 -2 L -38 2 M 16 -6 L 38 -10 M 16 -2 L 38 2" stroke={INK} strokeWidth={1.6} />
        <g transform={`rotate(${wave} 30 30)`}>
          <rect x={24} y={-26} width={14} height={56} rx={7} fill="#e0903f" stroke={INK} strokeWidth={3} />
          <circle cx={31} cy={-24} r={9} fill="#f1b574" stroke={INK} strokeWidth={2.4} />
        </g>
      </g>
      <rect x={34} y={-66} width={36} height={18} rx={4} fill={INK} />
      <text x={52} y={-53} textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize={13} fill="#ffffff">
        GIF
      </text>
    </g>
  );
}

// Гость в зале за столом: плечи, голова, лицо; clap — хлопает в ладоши
export function CrowdHead({ x, y, r = 34, hair, phase, clap = false }: { x: number; y: number; r?: number; hair: string; phase: number; clap?: boolean }) {
  const bob = Math.sin(phase * 0.35 + x) * (clap ? 5 : 1.5);
  const hands = clap ? Math.abs(Math.sin(phase * 0.8 + x)) * 16 : 18;
  return (
    <g transform={`translate(${x} ${y + bob})`}>
      <rect x={-r * 1.1} y={r * 0.9} width={r * 2.2} height={r * 1.6} rx={r * 0.6} fill="#4a4d63" stroke={INK} strokeWidth={3} />
      <circle cx={0} cy={0} r={r} fill={CHAR.skin} stroke={INK} strokeWidth={3} />
      <path d={`M ${-r} ${-r * 0.2} Q ${-r} ${-r * 1.1} 0 ${-r * 1.05} Q ${r} ${-r * 1.1} ${r} ${-r * 0.2} Q 0 ${-r * 0.7} ${-r} ${-r * 0.2} Z`} fill={hair} stroke={INK} strokeWidth={2.4} />
      <path d={`M ${-r * 0.45} ${-r * 0.1} q ${r * 0.15} ${-r * 0.2} ${r * 0.3} 0 M ${r * 0.15} ${-r * 0.1} q ${r * 0.15} ${-r * 0.2} ${r * 0.3} 0`} stroke={INK} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <path d={`M ${-r * 0.4} ${r * 0.35} Q 0 ${r * 0.8} ${r * 0.4} ${r * 0.35} Z`} fill={CHAR.mouthInside} stroke={INK} strokeWidth={2} />
      {clap && (
        <g fill={CHAR.skin} stroke={INK} strokeWidth={2.4}>
          <circle cx={-hands / 2} cy={r * 1.5} r={8} />
          <circle cx={hands / 2} cy={r * 1.5} r={8} />
        </g>
      )}
    </g>
  );
}

// Дверной проём (кухня): тёмный вход с рамой
export function DoorFrame({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#2a2230" stroke={INK} strokeWidth={S} />
      <rect x={x - 12} y={y - 12} width={w + 24} height={h + 12} fill="none" stroke="#8a6a4c" strokeWidth={12} />
      <circle cx={x + w - 18} cy={y + h * 0.55} r={6} fill={CHAR.gold} stroke={INK} strokeWidth={2} />
    </g>
  );
}

// Конверт с чаевыми
export function Envelope({ x, y, scale = 1, angle = 0 }: { x: number; y: number; scale?: number; angle?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
      <rect x={-44} y={-28} width={88} height={56} rx={4} fill="#f6efd8" stroke={INK} strokeWidth={3} />
      <path d="M -44 -28 L 0 6 L 44 -28" stroke={INK} strokeWidth={3} fill="none" strokeLinejoin="round" />
      <rect x={-12} y={-34} width={24} height={14} rx={3} fill="#5fa86a" stroke={INK} strokeWidth={2} />
    </g>
  );
}

// Торт из трёх ярусов: tiers 0…3 — сколько ярусов собрано, berries 0…5, topBerry 0…1 — последняя ягода падает на место
export function Cake({ x, y, scale = 1, tiers, berries, topBerry }: { x: number; y: number; scale?: number; tiers: number; berries: number; topBerry: number }) {
  const sizes = [
    { w: 150, h: 40, fill: '#f2c9d4' },
    { w: 110, h: 36, fill: '#fbe4ea' },
    { w: 72, h: 32, fill: '#f2c9d4' },
  ];
  let top = 0;
  const parts = sizes.slice(0, tiers).map((t, i) => {
    top -= t.h;
    return (
      <g key={i}>
        <rect x={-t.w / 2} y={top} width={t.w} height={t.h} rx={8} fill={t.fill} stroke={INK} strokeWidth={3} />
        <path d={`M ${-t.w / 2 + 8} ${top + 12} q 10 10 20 0 q 10 10 20 0 q 10 10 20 0`} stroke="#ffffff" strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
    );
  });
  const berryPos = [-24, -8, 10, 26, -34].slice(0, berries);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {parts}
      {tiers >= 3 && (
        <g>
          {berryPos.map((bx) => (
            <circle key={bx} cx={bx} cy={top - 4} r={7} fill="#c2412f" stroke={INK} strokeWidth={2.4} />
          ))}
          {topBerry > 0 && <circle cx={0} cy={top - 14 - (1 - topBerry) * 60} r={9} fill="#b8322a" stroke={INK} strokeWidth={2.4} />}
        </g>
      )}
    </g>
  );
}
