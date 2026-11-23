import { SCENE_VIEWBOX, VIDEO } from '../../config';
import { SceneCharacter, type LiveState } from '../../characters/Character';
import type { EmotionName } from '../../characters/expressions';
import { HandDrawn } from '../../characters/HandDrawn';
import { CHAR } from '../../characters/palette';
import { cameraTransform, HAND_FONT, HotBorscht, INK, S, Steam, TITLE_FONT, type Camera } from './kit';

// Флешбэк ×4 (борщ стынет на раздаче, Дима носит хлеб, приборы, сметану) и пауза с последней струйкой пара

export const FLASHBACK_ITEMS = ['хлеб', 'приборы', 'сметана'] as const;

function Bread() {
  return (
    <g>
      <path d="M -40 0 L 40 0 L 30 26 L -30 26 Z" fill="#a0703f" stroke={INK} strokeWidth={3} />
      <ellipse cx={-14} cy={-6} rx={20} ry={11} fill="#e2b46a" stroke={INK} strokeWidth={3} />
      <ellipse cx={14} cy={-8} rx={20} ry={11} fill="#d9a55a" stroke={INK} strokeWidth={3} />
    </g>
  );
}

function Cutlery() {
  return (
    <g stroke={INK} strokeWidth={3}>
      <rect x={-18} y={-50} width={8} height={70} rx={3} fill={CHAR.steel} />
      <path d="M -24 -50 L -24 -70 M -14 -50 L -14 -72 M -4 -50 L -4 -70" strokeLinecap="round" />
      <path d="M 8 20 L 8 -40 Q 24 -60 22 -20 L 16 -12 L 16 20 Z" fill={CHAR.steel} strokeLinejoin="round" />
    </g>
  );
}

function SourCream() {
  return (
    <g>
      <path d="M -24 -30 L 24 -30 L 20 20 L -20 20 Z" fill="#f6f3ec" stroke={INK} strokeWidth={3} />
      <ellipse cx={0} cy={-30} rx={24} ry={7} fill="#fbf9f4" stroke={INK} strokeWidth={3} />
      <rect x={-16} y={-14} width={32} height={16} fill="#3a6fd8" />
    </g>
  );
}

const ITEM_SHAPES = [<Bread key="b" />, <Cutlery key="c" />, <SourCream key="s" />];

function WallClock({ minuteAngle }: { minuteAngle: number }) {
  return (
    <g>
      <circle cx={260} cy={150} r={62} fill="#f6f3ec" stroke={INK} strokeWidth={S} />
      <path d={`M 260 150 L 260 104`} stroke="#c2412f" strokeWidth={6} strokeLinecap="round" transform={`rotate(${minuteAngle} 260 150)`} />
      <path d="M 260 150 L 236 132" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      <circle cx={260} cy={150} r={6} fill={INK} />
    </g>
  );
}

function SpeedBadge() {
  return (
    <g transform="rotate(-6 40 150)">
      <rect x={-60} y={118} width={170} height={64} rx={14} fill="#c2412f" stroke={INK} strokeWidth={S} />
      <text x={25} y={163} textAnchor="middle" fontFamily={TITLE_FONT} fontSize={36} fill="#ffffff">
        ▶▶ ×4
      </text>
    </g>
  );
}

type FlashbackSceneProps = {
  steam: number;
  phase: number;
  minuteAngle: number;
  // сколько действий Дима уже сделал (0…3); текущий предмет в руке
  done: number;
  dima: EmotionName;
  dimaLive?: LiveState;
  dimaBob: number;
  camera: Camera;
  boilSeed?: number;
};

export function FlashbackScene({ steam, phase, minuteAngle, done, dima, dimaLive, dimaBob, camera, boilSeed = 1 }: FlashbackSceneProps) {
  const holding = done > 0 ? ITEM_SHAPES[Math.min(done, 3) - 1] : null;
  return (
    <svg width={VIDEO.width} height={VIDEO.height} viewBox={SCENE_VIEWBOX}>
      <g style={{ filter: 'sepia(0.55) saturate(0.9)' }} transform={cameraTransform(camera)}>
        <rect x={-200} y={0} width={1480} height={720} fill="#e9e5db" />
        <rect x={540} y={0} width={740} height={720} fill="#a65d45" />
        <HandDrawn seed={boilSeed}>
          <WallClock minuteAngle={minuteAngle} />
          <rect x={-200} y={430} width={740} height={22} fill={CHAR.steel} stroke={INK} strokeWidth={S} />
          <rect x={-200} y={452} width={740} height={280} fill="#9aa0a8" stroke={INK} strokeWidth={S} />
          <path d="M 540 0 L 540 720" stroke={INK} strokeWidth={S + 2} />
        </HandDrawn>
        <HotBorscht x={260} y={424} scale={1.8} steam={steam} phase={phase} />
        <SceneCharacter
          id="dima"
          emotion={dima}
          x={830}
          footY={760 + dimaBob}
          height={560}
          boilSeed={boilSeed}
          held={holding ? <g transform="translate(76 168)">{holding}</g> : undefined}
          {...dimaLive}
        />
        <HandDrawn seed={boilSeed}>
          {FLASHBACK_ITEMS.map((item, i) => (
            <text key={item} x={1075} y={260 + i * 56} textAnchor="middle" fontFamily={HAND_FONT} fontSize={36} fill="#f6f3ec" opacity={i < done ? 1 : 0}>
              {item} ✓
            </text>
          ))}
        </HandDrawn>
      </g>
      <SpeedBadge />
    </svg>
  );
}

// Пауза: борщ крупно, последняя струйка пара тает
export function PauseScene({ steam, phase, boilSeed = 1 }: { steam: number; phase: number; boilSeed?: number }) {
  return (
    <svg width={VIDEO.width} height={VIDEO.height} viewBox={SCENE_VIEWBOX}>
      <rect x={-200} y={0} width={1480} height={720} fill="#2f3446" />
      <circle cx={540} cy={420} r={330} fill="#3a4157" />
      <HandDrawn seed={boilSeed}>
        <HotBorscht x={540} y={470} scale={4.2} steam={0} />
      </HandDrawn>
      <g transform="translate(540 428) scale(3)">
        <Steam steam={steam} phase={phase} wisps={1} />
      </g>
    </svg>
  );
}
