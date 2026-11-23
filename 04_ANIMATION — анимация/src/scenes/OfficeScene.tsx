import { SCENE_VIEWBOX, VIDEO } from '../config';
import { SceneCharacter, type LiveState } from '../characters/Character';
import type { EmotionName } from '../characters/expressions';
import { HandDrawn } from '../characters/HandDrawn';
import { CHAR } from '../characters/palette';

// Кабинет управляющего: окно с ночным городом, грамота, часы, стол
const INK = CHAR.ink;
const S = 4;

function NightWindow() {
  const lit = [
    [640, 250], [660, 300], [705, 220], [730, 280], [800, 320], [820, 240], [880, 290], [905, 330],
  ];
  return (
    <g>
      <rect x={600} y={80} width={380} height={330} fill="#2c3550" stroke={INK} strokeWidth={S} />
      <circle cx={900} cy={140} r={24} fill="#f3ead2" />
      <path d="M 604 410 L 604 230 L 690 230 L 690 190 L 760 190 L 760 260 L 840 260 L 840 210 L 930 210 L 930 280 L 976 280 L 976 410 Z" fill="#1d2238" />
      {lit.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={14} height={18} fill="#f2c14e" />
      ))}
      <path d="M 790 80 L 790 410 M 600 245 L 980 245" stroke={INK} strokeWidth={S} />
      <rect x={590} y={404} width={400} height={16} fill="#a58a63" stroke={INK} strokeWidth={3} />
    </g>
  );
}

function Certificate() {
  return (
    <g transform="translate(250 30) rotate(-2 230 190)">
      <rect x={130} y={110} width={200} height={150} fill="#8a6a4c" stroke={INK} strokeWidth={S} />
      <rect x={146} y={126} width={168} height={118} fill="#f6f3ec" />
      <text x={230} y={160} textAnchor="middle" fontFamily="Georgia, serif" fontSize={18} fontWeight={700} fill={INK}>
        ЛУЧШИЙ
      </text>
      <text x={230} y={184} textAnchor="middle" fontFamily="Georgia, serif" fontSize={18} fontWeight={700} fill={INK}>
        РЕСТОРАН
      </text>
      <text x={230} y={208} textAnchor="middle" fontFamily="Georgia, serif" fontSize={16} fill={INK}>
        2025
      </text>
      <circle cx={292} cy={226} r={12} fill="#e0b84a" stroke={INK} strokeWidth={2} />
    </g>
  );
}

// minuteAngle — угол минутной стрелки в градусах (0 — вверх)
function Clock({ minuteAngle = 0 }: { minuteAngle?: number }) {
  return (
    <g>
      <circle cx={110} cy={170} r={46} fill="#f6f3ec" stroke={INK} strokeWidth={S} />
      <path d="M 110 170 L 110 136" stroke={INK} strokeWidth={4} strokeLinecap="round" transform={`rotate(${minuteAngle} 110 170)`} />
      <path d="M 110 170 L 92 156" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      <circle cx={110} cy={170} r={4} fill={INK} />
    </g>
  );
}

function Desk({ children }: { children?: React.ReactNode }) {
  return (
    <g>
      <rect x={470} y={505} width={760} height={230} fill="#7a5236" stroke={INK} strokeWidth={S} />
      <rect x={455} y={488} width={790} height={26} rx={4} fill="#93653f" stroke={INK} strokeWidth={S} />
      {/* лампа */}
      <path d="M 1000 488 L 1000 430" stroke={INK} strokeWidth={5} />
      <path d="M 960 440 Q 1000 395 1040 440 Z" fill="#3f7a5a" stroke={INK} strokeWidth={S} />
      <ellipse cx={1000} cy={490} rx={26} ry={6} fill="#3f7a5a" stroke={INK} strokeWidth={3} />
      {/* кружка «БОСС» */}
      <rect x={880} y={448} width={46} height={42} rx={6} fill="#f6f3ec" stroke={INK} strokeWidth={3} />
      <path d="M 926 458 Q 944 468 926 480" stroke={INK} strokeWidth={3} fill="none" />
      <text x={903} y={475} textAnchor="middle" fontSize={12} fontWeight={800} fontFamily="Arial" fill={INK}>
        БОСС
      </text>
      {children}
    </g>
  );
}

// Листок жалобы: progress 0 — в руках у Эдуарда, 1 — лежит на столе перед Костей
const SHEET_FROM = { x: 170, y: -70, angle: 6 };

export function ComplaintSheet({ progress = 1 }: { progress?: number }) {
  if (progress <= 0) return null;
  const dx = SHEET_FROM.x * (1 - progress);
  const dy = SHEET_FROM.y * (1 - progress);
  const angle = -8 + SHEET_FROM.angle * (1 - progress);
  return (
    <g transform={`translate(${dx} ${dy}) rotate(${angle} 600 486)`}>
      <rect x={560} y={474} width={90} height={22} fill="#f6f3ec" stroke={INK} strokeWidth={2.5} />
      <path d="M 568 482 L 630 482 M 568 489 L 618 489" stroke="#c2412f" strokeWidth={2} />
    </g>
  );
}

interface OfficeSceneProps {
  kostya?: EmotionName;
  eduard?: EmotionName;
  kostyaLive?: LiveState;
  eduardLive?: LiveState;
  // наклон Эдуарда к Косте, в градусах
  eduardTilt?: number;
  // дрожь Кости от паники, в единицах сцены
  kostyaShake?: number;
  sheetProgress?: number;
  clockMinuteAngle?: number;
  boilSeed?: number;
  // серия 3: где стоит Костя, и слои для дополнительных героев (за стеной/дверью и перед столом)
  kostyaX?: number;
  backChildren?: React.ReactNode;
  frontChildren?: React.ReactNode;
}

export function OfficeScene({
  kostya = 'panic',
  eduard = 'tired',
  kostyaLive,
  eduardLive,
  eduardTilt = 0,
  kostyaShake = 0,
  sheetProgress = 1,
  clockMinuteAngle = 0,
  boilSeed = 1,
  kostyaX = 270,
  backChildren,
  frontChildren,
}: OfficeSceneProps) {
  return (
    <svg width={VIDEO.width} height={VIDEO.height} viewBox={SCENE_VIEWBOX}>
      <rect x={-200} y={0} width={1480} height={720} fill="#d9cfbb" />
      <rect x={-200} y={560} width={1480} height={160} fill="#9c8467" />
      <path d="M -200 560 L 1280 560" stroke={INK} strokeWidth={S} />
      {backChildren}
      <HandDrawn seed={boilSeed}>
        <NightWindow />
        <Certificate />
        <Clock minuteAngle={clockMinuteAngle} />
      </HandDrawn>
      <SceneCharacter id="eduard" emotion={eduard} x={760} footY={800} height={560} tilt={eduardTilt} boilSeed={boilSeed} {...eduardLive} />
      <HandDrawn seed={boilSeed}>
        <Desk>
          <ComplaintSheet progress={sheetProgress} />
        </Desk>
      </HandDrawn>
      <SceneCharacter id="kostya" emotion={kostya} x={kostyaX + kostyaShake} footY={700} height={560} boilSeed={boilSeed} {...kostyaLive} />
      {frontChildren}
    </svg>
  );
}
