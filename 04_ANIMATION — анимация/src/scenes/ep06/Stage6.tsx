import { SceneCharacter, type LiveState } from '../../characters/Character';
import type { CharacterId } from '../../characters/Character';
import type { EmotionName } from '../../characters/expressions';
import { HandDrawn } from '../../characters/HandDrawn';
import { CHAR } from '../../characters/palette';
import { SCENE_VIEWBOX, VIDEO } from '../../config';

// Сцена серии 6: фон + актёры в координатах 1080×720 (окно -100…1180).
// Одна и та же сцена показывается в 16:9 и в вертикали 9:16: в вертикали окно сужается до 405×720 вокруг `focus`,
// а актёры сдвигаются к центру кадра (`spread`).

const INK = CHAR.ink;
const S = 4;
export const STAGE_H = 720;
export const VERTICAL_W = 405;
// в вертикали герои опущены, чтобы над головами осталось место под субтитры (низ кадра обрезается — он под интерфейсом TikTok)
const VERTICAL_DROP = 90;

export type Backdrop = 'hall' | 'pass' | 'cashier' | 'back' | 'kitchen' | 'board';

export type Actor = {
  id: CharacterId;
  emotion?: EmotionName;
  x: number;
  footY?: number;
  height?: number;
  flip?: boolean;
  tilt?: number;
  held?: React.ReactNode;
  live?: LiveState;
  bob?: number;
};

// Где у актёра рот в координатах сцены (для плашки 🤬)
export function mouthOf(a: Actor): { x: number; y: number } {
  const footY = a.footY ?? 700;
  const height = a.height ?? 520;
  return { x: a.x, y: footY - height + height * 0.2 + (26 * height) / 400 };
}

function Floor({ wall, floor, line }: { wall: string; floor: string; line: number }) {
  return (
    <>
      <rect x={-200} y={0} width={1580} height={STAGE_H} fill={wall} />
      <rect x={-200} y={line} width={1580} height={STAGE_H - line} fill={floor} />
      <path d={`M -200 ${line} L 1380 ${line}`} stroke={INK} strokeWidth={S} />
    </>
  );
}

function Lamp({ x }: { x: number }) {
  return (
    <g>
      <path d={`M ${x} 0 L ${x} 90`} stroke={INK} strokeWidth={3} />
      <circle cx={x} cy={128} r={70} fill="#f2c14e" opacity={0.18} />
      <path d={`M ${x - 34} 120 L ${x - 14} 88 L ${x + 14} 88 L ${x + 34} 120 Z`} fill="#f2c14e" stroke={INK} strokeWidth={S} />
    </g>
  );
}

function Table({ x, y = 560, label }: { x: number; y?: number; label?: string }) {
  return (
    <g>
      <rect x={x + 40} y={y} width={12} height={110} fill="#5b3a2c" stroke={INK} strokeWidth={3} />
      <rect x={x + 208} y={y} width={12} height={110} fill="#5b3a2c" stroke={INK} strokeWidth={3} />
      <path d={`M ${x} ${y - 60} L ${x + 260} ${y - 60} L ${x + 266} ${y + 20} Q ${x + 240} ${y + 36} ${x + 215} ${y + 20} Q ${x + 190} ${y + 36} ${x + 165} ${y + 20} Q ${x + 140} ${y + 36} ${x + 115} ${y + 20} Q ${x + 90} ${y + 36} ${x + 65} ${y + 20} Q ${x + 40} ${y + 36} ${x + 15} ${y + 20} L ${x - 6} ${y + 20} Z`} fill="#f6f3ec" stroke={INK} strokeWidth={S} strokeLinejoin="round" />
      {label && (
        <g>
          <path d={`M ${x + 190} ${y - 60} L ${x + 200} ${y - 98} L ${x + 228} ${y - 98} L ${x + 238} ${y - 60} Z`} fill="#2b2a2e" stroke={INK} strokeWidth={3} />
          <text x={x + 214} y={y - 70} textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize={22} fill="#f6f3ec">
            {label}
          </text>
        </g>
      )}
    </g>
  );
}

function Backdrop6({ kind }: { kind: Backdrop }) {
  if (kind === 'hall') {
    return (
      <>
        <Floor wall="#a65d45" floor="#7c4a38" line={430} />
        <rect x={-200} y={610} width={1580} height={110} fill="#4e3226" />
        <path d="M -200 610 L 1380 610" stroke={INK} strokeWidth={S} />
        <Lamp x={300} />
        <Lamp x={800} />
        <Table x={760} label="7" />
      </>
    );
  }
  if (kind === 'pass') {
    return (
      <>
        <Floor wall="#c9b99a" floor="#6f6a62" line={470} />
        <rect x={-200} y={330} width={1580} height={26} fill="#8c8a96" stroke={INK} strokeWidth={S} />
        <rect x={-200} y={356} width={1580} height={130} fill="#5d5a66" stroke={INK} strokeWidth={S} />
        {[40, 300, 560, 820].map((x) => (
          <g key={x}>
            <rect x={x} y={120} width={150} height={160} rx={8} fill="#b9bcc4" stroke={INK} strokeWidth={S} />
            <circle cx={x + 75} cy={200} r={42} fill="#d6332a" opacity={0.7} />
          </g>
        ))}
      </>
    );
  }
  if (kind === 'cashier') {
    return (
      <>
        <Floor wall="#8f6d5a" floor="#5d4336" line={520} />
        <rect x={470} y={470} width={420} height={180} fill="#4e3226" stroke={INK} strokeWidth={S} />
        <rect x={560} y={400} width={110} height={70} rx={8} fill="#2b2a2e" stroke={INK} strokeWidth={S} />
        <rect x={576} y={414} width={78} height={30} fill="#8fd0e8" />
        <circle cx={150} cy={160} r={64} fill="#f6f3ec" stroke={INK} strokeWidth={S} />
        <path d="M 150 160 L 150 112 M 150 160 L 186 176" stroke={INK} strokeWidth={5} strokeLinecap="round" />
      </>
    );
  }
  if (kind === 'back') {
    return (
      <>
        <Floor wall="#7d7a86" floor="#4a4752" line={500} />
        <rect x={110} y={90} width={250} height={420} rx={14} fill="#cfe7f0" stroke={INK} strokeWidth={S} />
        <path d="M 150 130 L 210 420 M 240 120 L 300 360" stroke="#ffffff" strokeWidth={10} opacity={0.5} />
        <rect x={900} y={300} width={170} height={210} fill="#6b5a46" stroke={INK} strokeWidth={S} />
        <rect x={920} y={320} width={130} height={60} fill="#8c7a62" stroke={INK} strokeWidth={3} />
      </>
    );
  }
  if (kind === 'kitchen') {
    return (
      <>
        <Floor wall="#d9cdb4" floor="#8c8a86" line={500} />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={-120 + i * 280} y={60} width={250} height={220} fill="none" stroke="#b7a98c" strokeWidth={3} />
        ))}
        <rect x={-200} y={420} width={1580} height={34} fill="#9fa3ab" stroke={INK} strokeWidth={S} />
        <rect x={-200} y={454} width={1580} height={60} fill="#7a7d86" stroke={INK} strokeWidth={S} />
      </>
    );
  }
  return (
    <>
      <Floor wall="#8a7a66" floor="#5a4a3c" line={520} />
      <rect x={-60} y={130} width={1200} height={340} fill="#2f4a3e" stroke="#8b6b4a" strokeWidth={14} />
    </>
  );
}

interface StageProps {
  bg: Backdrop;
  actors: Actor[];
  boilSeed?: number;
  // вертикаль: focus — центр кадра; spread — на сколько сжать расстояние между актёрами
  vertical?: boolean;
  focus?: number;
  spread?: number;
  front?: React.ReactNode;
  mat?: { actor: number; size: number } | null;
  gray?: boolean;
}

export function Stage6({ bg, actors, boilSeed = 1, vertical = false, focus = 540, spread = 0.55, front, mat, gray }: StageProps) {
  // вертикаль: герои меньше и ближе друг к другу, чтобы все помещались в 405 единиц ширины
  const crowd = actors.length >= 3;
  const heightScale = vertical ? (crowd ? 0.62 : 0.8) : 1;
  const targetGap = crowd ? 135 : 205;
  const xs = actors.map((a) => a.x).sort((p, q) => p - q);
  const minGap = xs.length > 1 ? Math.min(...xs.slice(1).map((x, i) => x - xs[i])) : 1;
  const squeeze = vertical && xs.length > 1 ? Math.min(1, targetGap / Math.max(minGap, 1)) : 1;
  const mid = xs.length > 0 ? (xs[0] + xs[xs.length - 1]) / 2 : focus;
  const place = (x: number) => (vertical ? focus + (x - mid) * squeeze : x);
  const placed = actors.map((a) => ({ ...a, x: place(a.x), height: (a.height ?? 520) * heightScale }));
  const viewBox = vertical ? `${focus - VERTICAL_W / 2} 0 ${VERTICAL_W} ${STAGE_H}` : SCENE_VIEWBOX;
  const width = vertical ? 1080 : VIDEO.width;
  const height = vertical ? 1920 : VIDEO.height;
  const matActor = mat ? placed[mat.actor] : null;
  const matPos = matActor ? mouthOf(matActor) : null;
  return (
    <svg width={width} height={height} viewBox={viewBox} style={{ filter: gray ? 'grayscale(0.85) contrast(1.1)' : undefined }}>
      <HandDrawn seed={boilSeed}>
        <Backdrop6 kind={bg} />
      </HandDrawn>
      {placed.map((a, i) => (
        <SceneCharacter
          key={`${a.id}-${i}`}
          id={a.id}
          emotion={a.emotion}
          x={a.x}
          footY={(a.footY ?? 700) + (a.bob ?? 0) + (vertical ? VERTICAL_DROP : 0)}
          height={a.height ?? 520}
          flip={a.flip}
          tilt={a.tilt}
          held={a.held}
          boilSeed={boilSeed}
          {...a.live}
        />
      ))}
      {front && <HandDrawn seed={boilSeed}>{front}</HandDrawn>}
      {mat && matPos && (
        <text x={matPos.x} y={matPos.y + mat.size * 0.35} textAnchor="middle" fontSize={mat.size}>
          🤬
        </text>
      )}
    </svg>
  );
}
