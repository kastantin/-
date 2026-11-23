import { CHAR } from '../../characters/palette';

// Общие детали декораций серии 2: горячий борщ с паром, пузырь реплики, камера

export const INK = CHAR.ink;
export const S = 4;
export const HAND_FONT = 'Segoe Print, Comic Sans MS, sans-serif';
export const TEXT_FONT = 'Segoe UI, Arial, sans-serif';
export const TITLE_FONT = 'Segoe UI Black, Arial Black, sans-serif';

// Струйки пара: steam 0…1 — сколько пара осталось, phase — кадр (пар поднимается и колышется)
export function Steam({ steam, phase, wisps = 3, spread = 26 }: { steam: number; phase: number; wisps?: number; spread?: number }) {
  if (steam <= 0.01) return null;
  return (
    <g opacity={Math.min(1, steam * 1.2)} strokeLinecap="round" fill="none">
      {Array.from({ length: wisps }, (_, i) => {
        const x = (i - (wisps - 1) / 2) * spread;
        const rise = ((phase * 1.4 + i * 17) % 40) - 20;
        const sway = Math.sin(phase * 0.15 + i) * 6;
        const h = 40 + steam * 50;
        const d = `M ${x} ${-10 - rise * 0.3} q ${8 + sway} ${-h * 0.3} 0 ${-h * 0.55} q ${-8 + sway} ${-h * 0.25} 0 ${-h * 0.5}`;
        return (
          <g key={i}>
            <path d={d} stroke="#a8a196" strokeWidth={9} opacity={0.55} />
            <path d={d} stroke="#ffffff" strokeWidth={5} />
          </g>
        );
      })}
    </g>
  );
}

// Тарелка борща со сметаной: (x, y) — центр края тарелки
export function HotBorscht({ x, y, scale = 1, steam = 1, phase = 0 }: { x: number; y: number; scale?: number; steam?: number; phase?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g transform="translate(0 -18)">
        <Steam steam={steam} phase={phase} />
      </g>
      <ellipse cx={0} cy={0} rx={56} ry={14} fill="#f6f3ec" stroke={INK} strokeWidth={3} />
      <path d="M -42 -6 Q 0 34 42 -6 Z" fill="#f6f3ec" stroke={INK} strokeWidth={3} />
      <ellipse cx={0} cy={-6} rx={42} ry={9} fill="#b8322a" stroke={INK} strokeWidth={3} />
      <ellipse cx={6} cy={-7} rx={11} ry={4} fill="#fbf9f4" />
      <path d="M -20 -8 l 6 -2 M 18 -5 l 5 2" stroke="#3f7a5a" strokeWidth={3} strokeLinecap="round" />
    </g>
  );
}

// Пузырь реплики с хвостиком вниз; (x, y) — центр пузыря
export function SpeechBubble({ x, y, text, progress = 1, tailX = 0, width = 380, fontSize = 30 }: {
  x: number;
  y: number;
  text: string;
  progress?: number;
  tailX?: number;
  width?: number;
  fontSize?: number;
}) {
  if (progress <= 0) return null;
  const h = fontSize * 2.1;
  return (
    <g transform={`translate(${x} ${y}) scale(${0.5 + 0.5 * progress})`} opacity={progress}>
      <rect x={-width / 2} y={-h / 2} width={width} height={h} rx={h / 2} fill="#ffffff" stroke={INK} strokeWidth={S} />
      <path d={`M ${tailX - 18} ${h / 2 - 3} L ${tailX + 4} ${h / 2 + 34} L ${tailX + 22} ${h / 2 - 3} Z`} fill="#ffffff" stroke={INK} strokeWidth={S} strokeLinejoin="round" />
      <rect x={tailX - 16} y={h / 2 - 8} width={36} height={8} fill="#ffffff" />
      <text x={0} y={fontSize * 0.36} textAnchor="middle" fontFamily={TEXT_FONT} fontWeight={800} fontSize={fontSize} fill={INK}>
        {text}
      </text>
    </g>
  );
}

// Камера: точка (cx, cy) сцены оказывается в центре кадра (540, 360) с увеличением scale
export type Camera = { cx: number; cy: number; scale: number; shakeX?: number; shakeY?: number };

export function cameraTransform({ cx, cy, scale, shakeX = 0, shakeY = 0 }: Camera): string {
  return `translate(${540 + shakeX} ${360 + shakeY}) scale(${scale}) translate(${-cx} ${-cy})`;
}

export const NO_CAMERA: Camera = { cx: 540, cy: 360, scale: 1 };
