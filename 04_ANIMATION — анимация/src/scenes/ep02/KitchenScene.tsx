import { SCENE_VIEWBOX, VIDEO } from '../../config';
import { SceneCharacter, type CharacterId, type LiveState } from '../../characters/Character';
import type { EmotionName } from '../../characters/expressions';
import { HandDrawn } from '../../characters/HandDrawn';
import { Ladle } from '../../characters/parts';
import { CHAR } from '../../characters/palette';
import { cameraTransform, HotBorscht, INK, NO_CAMERA, S, TITLE_FONT, type Camera } from './kit';

// Кухня: кафельная стена, вытяжка, планка с чеками, раздача с лампами подогрева.
// Гена стоит за раздачей (видно по пояс), официанты — перед ней.

export const GENA_POS = { x: 540, footY: 730, height: 600 } as const;
const GENA_SCALE = GENA_POS.height / 400;
export const GENA_HEAD = { x: GENA_POS.x, y: GENA_POS.footY - GENA_POS.height + 80 * GENA_SCALE };
const PASS_Y = 452;

export type Actor = {
  emotion: EmotionName;
  x: number;
  footY?: number;
  height?: number;
  live?: LiveState;
  flip?: boolean;
  tilt?: number;
};

function Tiles() {
  const rows = Array.from({ length: 8 }, (_, i) => 20 + i * 56);
  const cols = Array.from({ length: 24 }, (_, i) => -100 + i * 56);
  return (
    <g>
      <rect x={-200} y={0} width={1480} height={720} fill="#e9e5db" />
      <g stroke="#cfc8b8" strokeWidth={3}>
        {rows.map((y) => (
          <path key={`r${y}`} d={`M -200 ${y} L 1280 ${y}`} />
        ))}
        {cols.map((x) => (
          <path key={`c${x}`} d={`M ${x} 0 L ${x} 452`} />
        ))}
      </g>
    </g>
  );
}

function TicketRail() {
  const tickets = [250, 330, 760, 850];
  return (
    <g>
      <rect x={180} y={120} width={720} height={14} rx={4} fill={CHAR.steel} stroke={INK} strokeWidth={3} />
      {tickets.map((x, i) => (
        <g key={x} transform={`rotate(${i % 2 === 0 ? -4 : 3} ${x + 25} 130)`}>
          <rect x={x} y={128} width={50} height={70} fill="#ffffff" stroke={INK} strokeWidth={2.5} />
          <path d={`M ${x + 8} ${148} l 34 0 M ${x + 8} ${160} l 26 0 M ${x + 8} ${172} l 30 0`} stroke="#9a9a9a" strokeWidth={3} />
        </g>
      ))}
    </g>
  );
}

function Hood() {
  return (
    <g>
      <path d="M 360 0 L 720 0 L 780 70 L 300 70 Z" fill={CHAR.steel} stroke={INK} strokeWidth={S} strokeLinejoin="round" />
      <path d="M 330 60 L 750 60" stroke={INK} strokeWidth={2.5} opacity={0.5} />
    </g>
  );
}

function HeatLamp({ x }: { x: number }) {
  return (
    <g>
      <path d={`M ${x} 70 L ${x} 300`} stroke={INK} strokeWidth={3} />
      <ellipse cx={x} cy={400} rx={70} ry={60} fill="#ff6a3d" opacity={0.18} />
      <path d={`M ${x - 36} 330 L ${x - 18} 300 L ${x + 18} 300 L ${x + 36} 330 Z`} fill="#c2412f" stroke={INK} strokeWidth={S} />
      <ellipse cx={x} cy={331} rx={20} ry={5} fill="#ffb27a" />
    </g>
  );
}

// Листок с правилами раздачи на стене; progress — появление (Костя его вешает)
function WallSheet({ progress }: { progress: number }) {
  if (progress <= 0) return null;
  return (
    <g transform={`translate(380 210) rotate(-4) scale(${0.6 + 0.4 * progress})`} opacity={progress}>
      <rect x={-62} y={-80} width={124} height={160} fill="#fffdf7" stroke={INK} strokeWidth={3} />
      <text x={0} y={-50} textAnchor="middle" fontFamily={TITLE_FONT} fontSize={18} fill="#c2412f">
        РАЗДАЧА
      </text>
      {[-20, 14, 48].map((y) => (
        <g key={y}>
          <path d={`M -44 ${y} l 8 8 l 14 -16`} stroke="#3f7a5a" strokeWidth={4} fill="none" strokeLinecap="round" />
          <path d={`M -14 ${y + 2} l 54 0`} stroke="#7a7a7a" strokeWidth={4} />
        </g>
      ))}
      <circle cx={0} cy={-74} r={6} fill="#e0523e" stroke={INK} strokeWidth={2} />
    </g>
  );
}

function Pass() {
  return (
    <g>
      <rect x={-200} y={PASS_Y - 4} width={1480} height={26} fill={CHAR.steel} stroke={INK} strokeWidth={S} />
      <rect x={-200} y={PASS_Y + 22} width={1480} height={260} fill="#9aa0a8" stroke={INK} strokeWidth={S} />
      <g stroke="#7d838c" strokeWidth={3}>
        {[-40, 220, 480, 740, 1000].map((x) => (
          <path key={x} d={`M ${x} ${PASS_Y + 30} L ${x} 720`} />
        ))}
      </g>
    </g>
  );
}

// Спина головы Гены: закрывает лицо (видно затылок под колпаком)
function GenaBackOfHead() {
  return (
    <g transform={`translate(${GENA_HEAD.x} ${GENA_HEAD.y}) scale(${GENA_SCALE})`}>
      <path d="M -49 -36 A 61 61 0 1 0 49 -36 Z" fill={CHAR.skin} stroke={INK} strokeWidth={3} />
      <path d="M -50 -34 Q 0 -6 50 -34 L 48 -16 Q 0 4 -48 -16 Z" fill={CHAR.hairDark} />
      <path d="M -10 50 Q 0 56 10 50" stroke={INK} strokeWidth={2.5} fill="none" />
    </g>
  );
}

type KitchenSceneProps = {
  gena?: EmotionName;
  genaLive?: LiveState;
  // поворот Гены: 0 — спиной, 1 — лицом (по пути «сплющивается», как при развороте)
  genaTurn?: number;
  // угол половника в руке Гены (null — половника нет); 0 — черпак вниз, на раздаче
  ladleAngle?: number | null;
  bowlJump?: number;
  steam?: number;
  phase?: number;
  front?: ReadonlyArray<Actor & { id: CharacterId }>;
  sheetOnWall?: number;
  // тарелка борща на раздаче (в серии 3 её нет)
  borscht?: boolean;
  camera?: Camera;
  boilSeed?: number;
  children?: React.ReactNode;
};

export function KitchenScene({
  gena = 'yell',
  genaLive,
  genaTurn = 1,
  ladleAngle = null,
  bowlJump = 0,
  steam = 1,
  phase = 0,
  front = [],
  sheetOnWall = 0,
  borscht = true,
  camera = NO_CAMERA,
  boilSeed = 1,
  children,
}: KitchenSceneProps) {
  const turnScale = Math.max(0.06, Math.abs(Math.cos(Math.PI * genaTurn)));
  const facesBack = genaTurn < 0.5;
  return (
    <svg width={VIDEO.width} height={VIDEO.height} viewBox={SCENE_VIEWBOX}>
      <g transform={cameraTransform(camera)}>
        <Tiles />
        <HandDrawn seed={boilSeed}>
          <Hood />
          <TicketRail />
          <WallSheet progress={sheetOnWall} />
        </HandDrawn>
        <g transform={`translate(${GENA_POS.x} 0) scale(${turnScale} 1) translate(${-GENA_POS.x} 0)`}>
          <SceneCharacter id="gena" emotion={gena} {...GENA_POS} boilSeed={boilSeed} {...genaLive} />
          {facesBack && <GenaBackOfHead />}
        </g>
        <HandDrawn seed={boilSeed}>
          <HeatLamp x={700} />
          <HeatLamp x={880} />
          <Pass />
          {borscht && <HotBorscht x={760} y={PASS_Y - 8 - bowlJump} scale={1.3} steam={steam} phase={phase} />}
          {ladleAngle !== null && (
            <g transform={`translate(650 ${PASS_Y - 70})`}>
              <Ladle angle={ladleAngle} />
              <circle cx={0} cy={0} r={18} fill={CHAR.skin} stroke={INK} strokeWidth={S} />
            </g>
          )}
        </HandDrawn>
        {front.map(({ id, footY = 780, height = 600, live, ...actor }) => (
          <SceneCharacter key={id} id={id} footY={footY} height={height} boilSeed={boilSeed} {...actor} {...live} />
        ))}
        {children}
      </g>
    </svg>
  );
}
