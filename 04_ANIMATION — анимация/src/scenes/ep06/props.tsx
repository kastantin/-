import { CHAR } from '../../characters/palette';

// Серия 6 «На чай»: реквизит чаевых. Всё в координатах сцены (1080×720), якорь — центр низа предмета.
const INK = CHAR.ink;
const HAND = 'Segoe Print, Comic Sans MS, sans-serif';

// Стеклянная банка с именем; fill — сколько в ней (0…1), coins — звенит (монеты/купюры), paper — шуршит (бумажки)
export function TipJar({ x, y, name, fill, kind }: { x: number; y: number; name: string; fill: number; kind: 'coins' | 'paper' }) {
  const level = Math.max(0, Math.min(1, fill));
  const filledH = 120 * level;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-52} y={-150} width={104} height={150} rx={18} fill="#cfe7f0" fillOpacity={0.55} stroke={INK} strokeWidth={4} />
      <rect x={-58} y={-168} width={116} height={22} rx={8} fill="#8c8a96" stroke={INK} strokeWidth={4} />
      {filledH > 0 && kind === 'coins' && (
        <g>
          <rect x={-46} y={-6 - filledH} width={92} height={filledH} rx={10} fill="#f2c14e" stroke={INK} strokeWidth={2.5} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <circle key={i} cx={-30 + (i % 3) * 30} cy={-24 - Math.floor(i / 3) * 34} r={12} fill="#ffd966" stroke={INK} strokeWidth={2.5} />
          ))}
        </g>
      )}
      {filledH > 0 && kind === 'paper' && (
        <g>
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M ${-34 + i * 24} -20 L ${-26 + i * 24} ${-20 - filledH * 0.6} L ${-14 + i * 24} -26 Z`} fill="#f2e6b8" stroke={INK} strokeWidth={2.5} />
          ))}
        </g>
      )}
      <rect x={-44} y={-110} width={88} height={34} rx={4} fill="#f6f3ec" stroke={INK} strokeWidth={3} />
      <text x={0} y={-86} textAnchor="middle" fontFamily={HAND} fontSize={24} fill={INK}>
        {name}
      </text>
    </g>
  );
}

export function Button({ x, y, r = 20 }: { x: number; y: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill="#6f8fb5" stroke={INK} strokeWidth={4} />
      <circle r={r * 0.62} fill="none" stroke={INK} strokeWidth={2.5} />
      {[-6, 6].map((dx) => [-6, 6].map((dy) => <circle key={`${dx}${dy}`} cx={dx} cy={dy} r={2.2} fill={INK} />))}
    </g>
  );
}

export function Gum({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(-8)`}>
      <path d="M -26 0 Q -28 -16 -8 -18 Q 14 -26 26 -8 Q 34 8 14 14 Q -8 22 -26 0 Z" fill="#f08fb0" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d="M -12 -2 Q 0 -10 10 -2" stroke="#ffffff" strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.7} />
    </g>
  );
}

// Записка; lines — строки рукописным шрифтом
export function Note({ x, y, lines, angle = -4, width = 190 }: { x: number; y: number; lines: string[]; angle?: number; width?: number }) {
  const h = 34 + lines.length * 32;
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <rect x={-width / 2} y={-h} width={width} height={h} rx={3} fill="#f6efc8" stroke={INK} strokeWidth={4} />
      {lines.map((line, i) => (
        <text key={line} x={0} y={-h + 36 + i * 32} textAnchor="middle" fontFamily={HAND} fontSize={24} fill={INK}>
          {line}
        </text>
      ))}
    </g>
  );
}

export function Banknote({ x, y, label, angle = 6 }: { x: number; y: number; label: string; angle?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <rect x={-56} y={-56} width={112} height={56} rx={5} fill="#9fcf9a" stroke={INK} strokeWidth={4} />
      <rect x={-46} y={-48} width={92} height={40} rx={3} fill="none" stroke={INK} strokeWidth={2} />
      <text x={0} y={-20} textAnchor="middle" fontFamily="Segoe UI Black, Arial Black, sans-serif" fontSize={26} fill={INK}>
        {label}
      </text>
    </g>
  );
}

export function Sticker({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(10)`}>
      <circle r={30} fill="#ffd23f" stroke={INK} strokeWidth={4} />
      <circle cx={-10} cy={-6} r={3.4} fill={INK} />
      <circle cx={10} cy={-6} r={3.4} fill={INK} />
      <path d="M -14 8 Q 0 24 14 8" stroke={INK} strokeWidth={3.4} fill="none" strokeLinecap="round" />
    </g>
  );
}
