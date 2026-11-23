import { SCENE_VIEWBOX, VIDEO } from '../../config';
import { Character, type LiveState } from '../../characters/Character';
import type { EmotionName } from '../../characters/expressions';
import { HandDrawn } from '../../characters/HandDrawn';
import { CHAR } from '../../characters/palette';
import { HAND_FONT, INK, S, TITLE_FONT } from './kit';

// «Вы выбрали»: табло опроса с тремя нулями, мимо летит муха, Костя крупно смотрит в камеру

const ROWS = [
  { badge: 'А', color: '#e5533d' },
  { badge: 'Б', color: '#3f7a5a' },
  { badge: '…', color: '#2aabee' },
] as const;

// Голова Кости: центр (860, 360), высота 380 — по ней считается плашка 🤬 в timeline
export const POLL_KOSTYA = { x: 860, y: 360, height: 380 } as const;

export function Board({ zeroPop }: { zeroPop: number }) {
  return (
    <g transform="rotate(-2 330 360)">
      <rect x={70} y={150} width={520} height={440} rx={28} fill="#f6f3ec" stroke={INK} strokeWidth={S + 1} />
      <text x={330} y={225} textAnchor="middle" fontFamily={TITLE_FONT} fontSize={44} fill={INK}>
        ВЫ ВЫБРАЛИ:
      </text>
      {ROWS.map((row, i) => {
        const y = 290 + i * 100;
        return (
          <g key={row.badge}>
            <circle cx={140} cy={y} r={32} fill={row.color} stroke={INK} strokeWidth={S} />
            <text x={140} y={y + 13} textAnchor="middle" fontFamily={TITLE_FONT} fontSize={34} fill="#ffffff">
              {row.badge}
            </text>
            <rect x={190} y={y - 18} width={260} height={36} rx={18} fill="#e2dccf" stroke={INK} strokeWidth={3} />
            <text
              x={515}
              y={y + 22}
              textAnchor="middle"
              fontFamily={TITLE_FONT}
              fontSize={64}
              fill="#c2412f"
              transform={`translate(515 ${y}) scale(${zeroPop}) translate(-515 ${-y})`}
            >
              0
            </text>
          </g>
        );
      })}
    </g>
  );
}

// Муха: t 0…1 — путь через кадр петлёй; крылышки мелькают
export function Fly({ t, frame }: { t: number; frame: number }) {
  if (t <= 0 || t >= 1) return null;
  const x = -60 + t * 1200;
  const y = 120 + Math.sin(t * Math.PI * 3) * 60 + t * 40;
  const wing = frame % 4 < 2 ? 1 : 0.4;
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={-6} cy={-10} rx={10} ry={6 * wing} fill="#cfeaf6" stroke={INK} strokeWidth={2} opacity={0.9} />
      <ellipse cx={6} cy={-10} rx={10} ry={6 * wing} fill="#cfeaf6" stroke={INK} strokeWidth={2} opacity={0.9} />
      <ellipse cx={0} cy={0} rx={12} ry={8} fill={INK} />
      <path d={`M -40 ${4} q -20 -10 -40 0`} stroke={INK} strokeWidth={2} strokeDasharray="4 6" fill="none" opacity={0.6} />
    </g>
  );
}

type PollSceneProps = {
  kostya: EmotionName;
  kostyaLive?: LiveState;
  zeroPop: number;
  flyT: number;
  frame: number;
  boilSeed?: number;
};

export function PollScene({ kostya, kostyaLive, zeroPop, flyT, frame, boilSeed = 1 }: PollSceneProps) {
  const { x, y, height } = POLL_KOSTYA;
  return (
    <svg width={VIDEO.width} height={VIDEO.height} viewBox={SCENE_VIEWBOX}>
      <rect x={-200} y={0} width={1480} height={720} fill="#2b2a2e" />
      <circle cx={860} cy={380} r={330} fill="#34323a" />
      <HandDrawn seed={boilSeed}>
        <Board zeroPop={zeroPop} />
        <text x={330} y={128} textAnchor="middle" fontFamily={HAND_FONT} fontSize={30} fill={CHAR.shirt} transform="rotate(-2 330 128)">
          итоги серии 1
        </text>
      </HandDrawn>
      <g transform={`translate(${x - height / 2} ${y - height / 2})`}>
        <Character id="kostya" emotion={kostya} mode="head" height={height} boilSeed={boilSeed} {...kostyaLive} />
      </g>
      <Fly t={flyT} frame={frame} />
    </svg>
  );
}
