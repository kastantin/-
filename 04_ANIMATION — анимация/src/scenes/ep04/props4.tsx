import { CHAR } from '../../characters/palette';
import { INK, S, TEXT_FONT } from '../ep02/kit';

// Реквизит серии 4: чеки и принтер, лук, купюры, поднос Димы, машина Бекса, тень хозяйки.

// Кухонный чек; hot — красная пометка «Костя»
export function ReceiptSlip({ x, y, angle = 0, scale = 1, hot = false }: { x: number; y: number; angle?: number; scale?: number; hot?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
      <path d="M -20 -32 L 20 -32 L 20 30 L 15 34 L 10 30 L 5 34 L 0 30 L -5 34 L -10 30 L -15 34 L -20 30 Z" fill="#fffdf4" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M -13 -20 L 13 -20 M -13 -10 L 9 -10 M -13 0 L 12 0 M -13 10 L 6 10" stroke="#9a9a9a" strokeWidth={2.2} />
      {hot && <rect x={-14} y={-27} width={28} height={4} fill="#d6332a" />}
    </g>
  );
}

// Принтер чеков: короб с щелью; frame — дрожание, пока строчит
export function ReceiptPrinter({ x, y, scale = 1, frame, printing = true }: { x: number; y: number; scale?: number; frame: number; printing?: boolean }) {
  const jitter = printing ? Math.sin(frame * 2.9) * 2.2 : 0;
  const strip = printing ? 30 + ((frame * 9) % 40) : 30;
  return (
    <g transform={`translate(${x + jitter} ${y}) scale(${scale})`}>
      <rect x={-52} y={-56} width={104} height={56} rx={8} fill="#3d4250" stroke={INK} strokeWidth={S} />
      <rect x={-40} y={-44} width={80} height={10} rx={4} fill="#1f1f22" />
      <circle cx={34} cy={-20} r={5} fill={printing ? '#e5533d' : '#4a4d63'} stroke={INK} strokeWidth={2} />
      <rect x={-22} y={-4} width={44} height={strip} fill="#fffdf4" stroke={INK} strokeWidth={2.4} />
      <path d="M -14 8 L 14 8 M -14 18 L 10 18 M -14 28 L 12 28" stroke="#9a9a9a" strokeWidth={2} />
    </g>
  );
}

// Дождь из чеков: i-й чек падает с кадра from + i*every, укладывается в кучу на полу
export function ReceiptRain({ frame, from, count, every = 3, floorY = 690, x0 = -60, x1 = 1140 }: { frame: number; from: number; count: number; every?: number; floorY?: number; x0?: number; x1?: number }) {
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const t = frame - (from + i * every);
        if (t < 0) return null;
        const rest = floorY - (i % 5) * 7;
        const y = Math.min(rest, -40 + t * 17);
        const falling = y < rest;
        const x = x0 + ((i * 197) % (x1 - x0));
        const angle = falling ? ((i * 37) % 70) - 35 + Math.sin(t * 0.4) * 18 : ((i * 53) % 50) - 25;
        return <ReceiptSlip key={i} x={x} y={y} angle={angle} scale={1.05} hot={i % 2 === 0} />;
      })}
    </g>
  );
}

// Разделочная доска с луком; knife — 0…1, фаза ударов ножом
export function ChopBoard({ x, y, scale = 1, knife }: { x: number; y: number; scale?: number; knife: number }) {
  const lift = Math.abs(Math.sin(knife * Math.PI * 6)) * 34;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x={-70} y={-12} width={140} height={20} rx={5} fill="#b8864f" stroke={INK} strokeWidth={3} />
      {[-40, -18, 6, 28].map((px, i) => (
        <path key={px} d={`M ${px} -14 q 8 -14 16 0 z`} fill="#f1e3c1" stroke={INK} strokeWidth={2} transform={`translate(${i * 2} 0)`} />
      ))}
      <ellipse cx={-52} cy={-26} rx={16} ry={14} fill="#f1e3c1" stroke={INK} strokeWidth={2.6} />
      <path d="M -52 -40 L -52 -46" stroke="#7a9a4a" strokeWidth={4} strokeLinecap="round" />
      <g transform={`translate(${10 + (1 - lift / 34) * 6} ${-lift - 32})`}>
        <path d="M -8 0 L 52 0 L 56 24 L -8 24 Z" fill={CHAR.steel} stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />
        <rect x={-34} y={4} width={28} height={14} rx={5} fill="#5a3a2a" stroke={INK} strokeWidth={2.4} />
      </g>
    </g>
  );
}

// Купюра в сто рублей
export function Bill100({ x, y, angle = 0, scale = 1 }: { x: number; y: number; angle?: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
      <rect x={-38} y={-17} width={76} height={34} rx={4} fill="#9cc79a" stroke={INK} strokeWidth={2.6} />
      <rect x={-31} y={-11} width={62} height={22} rx={3} fill="none" stroke="#4f7d4e" strokeWidth={1.8} />
      <text x={0} y={7} textAnchor="middle" fontFamily={TEXT_FONT} fontWeight={800} fontSize={20} fill="#2f5a2e">
        100 ₽
      </text>
    </g>
  );
}

// Поднос в руке Димы (координаты тела: кисть ≈ (66,186)) с сотнями и ломтем хлеба
export function TrayWithBills({ shown = 3 }: { shown?: number }) {
  return (
    <g transform="translate(70 176)">
      <ellipse cx={0} cy={4} rx={48} ry={9} fill="#c9ccd2" stroke={INK} strokeWidth={2.6} />
      {Array.from({ length: shown }, (_, i) => (
        <Bill100 key={i} x={-14 + i * 6} y={-6 - i * 9} angle={-6 + i * 8} scale={0.62} />
      ))}
      <ellipse cx={30} cy={-4} rx={14} ry={8} fill="#d9a55a" stroke={INK} strokeWidth={2.2} />
    </g>
  );
}

// Лобовое стекло машины: дождь и дворники; frame — для движения
export function CarWindow({ x, y, w, h, frame }: { x: number; y: number; w: number; h: number; frame: number }) {
  const sweep = Math.sin(frame * 0.32) * 55 - 5;
  const drops = Array.from({ length: 16 }, (_, i) => ({
    dx: ((i * 83) % (w - 30)) + 15,
    dy: ((i * 47 + frame * 6) % (h - 30)) + 15,
  }));
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={26} fill="#27344a" stroke={INK} strokeWidth={S + 1} />
      {drops.map((d, i) => (
        <path key={i} d={`M ${x + d.dx} ${y + d.dy} q 3 8 0 14`} stroke="#9fd3f0" strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.8} />
      ))}
      <g transform={`translate(${x + w * 0.5} ${y + h - 6}) rotate(${sweep})`}>
        <path d={`M 0 0 L 0 ${-(h - 30)}`} stroke={INK} strokeWidth={9} strokeLinecap="round" />
        <path d={`M 0 0 L 0 ${-(h - 30)}`} stroke="#5a5d66" strokeWidth={4} strokeLinecap="round" />
      </g>
      <rect x={x} y={y + h - 34} width={w} height={34} rx={14} fill="#1b1d24" stroke={INK} strokeWidth={S} />
    </g>
  );
}

// Тень хозяйки на матовом стекле двери: силуэт с пучком; alpha — насколько тень «подошла» (0…1)
export function OwnerSilhouette({ x, y, scale = 1, alpha = 1 }: { x: number; y: number; scale?: number; alpha?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={alpha} fill="#1d1b22">
      <circle cx={0} cy={-62} r={22} />
      <circle cx={0} cy={-90} r={11} />
      <path d="M -30 -34 Q 0 -44 30 -34 L 38 70 L 18 70 L 14 150 L -14 150 L -18 70 L -38 70 Z" />
    </g>
  );
}
