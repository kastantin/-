import { CHAR } from '../../characters/palette';

// Серия 7 «Для Кости»: реквизит. Банки, пуговица и записки — из scenes/ep06/props.tsx; здесь только новое.
// Координаты сцены 1080×720, якорь — центр низа предмета.
const INK = CHAR.ink;
const HAND = 'Segoe Print, Comic Sans MS, sans-serif';

// Конверт с надписью; cash — из него выглядывает купюра
export function Envelope({ x, y, scale = 1, angle = -4, cash = false, lines = ['Для Кости'] }: { x: number; y: number; scale?: number; angle?: number; cash?: boolean; lines?: string[] }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
      {cash && (
        <g>
          <rect x={-50} y={-128} width={100} height={52} rx={4} fill="#9fcf9a" stroke={INK} strokeWidth={4} />
          <text x={0} y={-92} textAnchor="middle" fontFamily="Segoe UI Black, Arial Black, sans-serif" fontSize={24} fill={INK}>
            3000
          </text>
        </g>
      )}
      <rect x={-110} y={-110} width={220} height={110} rx={5} fill="#f6efc8" stroke={INK} strokeWidth={4} />
      <path d="M -110 -110 L 0 -50 L 110 -110" fill="#efe2a8" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      {lines.map((line, i) => (
        <text key={line} x={0} y={-30 + i * 26} textAnchor="middle" fontFamily={HAND} fontSize={i === 0 ? 30 : 17} fill={INK}>
          {line}
        </text>
      ))}
    </g>
  );
}

// Пачка купюр с бумажной лентой
export function CashStack({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 1, 2].map((i) => (
        <rect key={i} x={-58 + i * 3} y={-40 - i * 14} width={116} height={40} rx={4} fill="#9fcf9a" stroke={INK} strokeWidth={4} />
      ))}
      <rect x={-20} y={-84} width={40} height={84} fill="#f6f3ec" stroke={INK} strokeWidth={3} />
      <text x={0} y={-36} textAnchor="middle" fontFamily="Segoe UI Black, Arial Black, sans-serif" fontSize={18} fill={INK}>
        {label}
      </text>
    </g>
  );
}

// Планшет хозяйки со списком и занесённой ручкой
export function Clipboard({ x, y, angle = 8 }: { x: number; y: number; angle?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <rect x={-46} y={-120} width={92} height={120} rx={6} fill="#c79a62" stroke={INK} strokeWidth={4} />
      <rect x={-36} y={-106} width={72} height={98} rx={3} fill="#f6f3ec" stroke={INK} strokeWidth={3} />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={-26} y1={-88 + i * 22} x2={26} y2={-88 + i * 22} stroke={INK} strokeWidth={3} strokeLinecap="round" />
      ))}
      <rect x={-14} y={-128} width={28} height={14} rx={3} fill="#8c8a96" stroke={INK} strokeWidth={3} />
      <line x1={30} y1={-150} x2={52} y2={-196} stroke="#2c9ad6" strokeWidth={8} strokeLinecap="round" />
    </g>
  );
}
