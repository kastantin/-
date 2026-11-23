import { SCENE_VIEWBOX, VIDEO } from '../../config';
import { SceneCharacter, type CharacterId } from '../../characters/Character';
import { HandDrawn } from '../../characters/HandDrawn';
import { CHAR } from '../../characters/palette';
import { cameraTransform, INK, NO_CAMERA, S, type Camera } from './kit';
import type { Actor } from './KitchenScene';

// Зал «Скатерти» для серии 2: стена, панели, лампы. scroll — сдвиг фона (бег через зал)
const LAMP_STEP = 340;

function Lamp({ x }: { x: number }) {
  return (
    <g>
      <path d={`M ${x} 0 L ${x} 90`} stroke={INK} strokeWidth={3} />
      <circle cx={x} cy={128} r={70} fill="#f2c14e" opacity={0.18} />
      <path d={`M ${x - 34} 120 L ${x - 14} 88 L ${x + 14} 88 L ${x + 34} 120 Z`} fill="#f2c14e" stroke={INK} strokeWidth={S} />
    </g>
  );
}

function Frame({ x }: { x: number }) {
  return (
    <g>
      <rect x={x} y={200} width={120} height={150} fill="#8a6a4c" stroke={INK} strokeWidth={S} />
      <rect x={x + 14} y={214} width={92} height={122} fill="#d9cfbb" />
      <circle cx={x + 60} cy={262} r={20} fill="#c2412f" opacity={0.6} />
    </g>
  );
}

export function HallBackdrop({ scroll = 0 }: { scroll?: number }) {
  const offset = -(scroll % LAMP_STEP);
  const lamps = Array.from({ length: 6 }, (_, i) => -160 + i * LAMP_STEP + offset);
  return (
    <g>
      <rect x={-200} y={0} width={1480} height={720} fill="#a65d45" />
      <rect x={-200} y={430} width={1480} height={180} fill="#7c4a38" />
      <path d="M -200 430 L 1280 430" stroke={INK} strokeWidth={S} />
      <rect x={-200} y={610} width={1480} height={110} fill="#4e3226" />
      <path d="M -200 610 L 1280 610" stroke={INK} strokeWidth={S} />
      {lamps.map((x) => (
        <g key={`p${Math.round(x - offset)}`}>
          <Frame x={x + 110} />
          <Lamp x={x} />
        </g>
      ))}
    </g>
  );
}

type HallStageProps = {
  actors: ReadonlyArray<Actor & { id: CharacterId }>;
  scroll?: number;
  camera?: Camera;
  boilSeed?: number;
  children?: React.ReactNode;
};

export function HallStage({ actors, scroll = 0, camera = NO_CAMERA, boilSeed = 1, children }: HallStageProps) {
  return (
    <svg width={VIDEO.width} height={VIDEO.height} viewBox={SCENE_VIEWBOX}>
      <g transform={cameraTransform(camera)}>
        <HandDrawn seed={boilSeed}>
          <HallBackdrop scroll={scroll} />
        </HandDrawn>
        {actors.map(({ id, footY = 760, height = 560, live, ...actor }) => (
          <SceneCharacter key={id} id={id} footY={footY} height={height} boilSeed={boilSeed} {...actor} {...live} />
        ))}
        {children}
      </g>
    </svg>
  );
}

// Линии скорости поверх бегущего кадра
export function SpeedLines({ frame }: { frame: number }) {
  const lines = Array.from({ length: 9 }, (_, i) => ({ y: 90 + i * 68, len: 120 + ((i * 53) % 140) }));
  return (
    <g stroke="#f6f3ec" strokeWidth={6} strokeLinecap="round" opacity={0.75}>
      {lines.map(({ y, len }, i) => {
        const x = 1180 - (((frame * 60 + i * 210) % 1500) - 100);
        return <path key={y} d={`M ${x} ${y} L ${x + len} ${y}`} />;
      })}
    </g>
  );
}

// Поднос с тарелками, пролетающий мимо (Костя уворачивается)
export function FlyingTray({ x, y, angle = 0 }: { x: number; y: number; angle?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <ellipse cx={0} cy={0} rx={80} ry={16} fill={CHAR.steel} stroke={INK} strokeWidth={S} />
      <ellipse cx={-30} cy={-10} rx={26} ry={8} fill="#f6f3ec" stroke={INK} strokeWidth={3} />
      <ellipse cx={26} cy={-12} rx={22} ry={7} fill="#f6f3ec" stroke={INK} strokeWidth={3} />
      <rect x={18} y={-44} width={14} height={30} rx={4} fill="#cfeaf6" stroke={INK} strokeWidth={3} />
    </g>
  );
}
