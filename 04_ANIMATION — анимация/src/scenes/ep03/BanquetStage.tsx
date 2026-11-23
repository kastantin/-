import { SCENE_VIEWBOX, VIDEO } from '../../config';
import { SceneCharacter, type CharacterId } from '../../characters/Character';
import { HandDrawn } from '../../characters/HandDrawn';
import { CHAR } from '../../characters/palette';
import { cameraTransform, INK, NO_CAMERA, S, TITLE_FONT, type Camera } from '../ep02/kit';
import type { Actor } from '../ep02/KitchenScene';
import { CrowdHead } from './props3';

// Банкетный зал: гирлянда, шарики, баннер «Корпоратив», длинный стол с белой скатертью и гости за ним

const HAIR = ['#2a2522', '#8a6440', '#7a3b2e', '#b9b7bd', '#1c1b1f', '#c9a24a'];
const GUEST_XS = [-20, 90, 200, 310, 420, 530, 640, 750, 860, 970, 1080];
const FLAG_COLORS = ['#e5533d', '#f2c14e', '#3f7a5a', '#2aabee', '#d97bb6'];

function Garland() {
  const flags = Array.from({ length: 22 }, (_, i) => -150 + i * 62);
  return (
    <g>
      <path d="M -200 20 Q 340 110 540 40 Q 740 110 1280 20" stroke={INK} strokeWidth={3} fill="none" />
      {flags.map((x, i) => {
        const y = 34 + Math.sin((x + 200) / 140) * 24 + (x > 300 && x < 800 ? 20 : 0);
        return <path key={x} d={`M ${x} ${y} L ${x + 26} ${y + 4} L ${x + 12} ${y + 40} Z`} fill={FLAG_COLORS[i % FLAG_COLORS.length]} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />;
      })}
    </g>
  );
}

function Balloons({ x, hues }: { x: number; hues: ReadonlyArray<string> }) {
  return (
    <g>
      {hues.map((fill, i) => {
        const bx = x + (i - 1) * 44;
        const by = 250 + (i % 2) * 40;
        return (
          <g key={fill + i}>
            <path d={`M ${bx} ${by + 34} Q ${x} ${by + 120} ${x} 470`} stroke={INK} strokeWidth={2} fill="none" />
            <ellipse cx={bx} cy={by} rx={34} ry={42} fill={fill} stroke={INK} strokeWidth={3} />
            <ellipse cx={bx - 11} cy={by - 14} rx={7} ry={11} fill="#ffffff" opacity={0.5} />
          </g>
        );
      })}
    </g>
  );
}

function Table() {
  const plates = Array.from({ length: 14 }, (_, i) => -80 + i * 100);
  return (
    <g>
      <rect x={-200} y={548} width={1480} height={150} fill="#f6f3ec" stroke={INK} strokeWidth={S} />
      <path d="M -200 698 q 25 18 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0" fill="#f6f3ec" stroke={INK} strokeWidth={S} />
      {plates.map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={578} rx={34} ry={9} fill="#ffffff" stroke={INK} strokeWidth={2.4} />
          <path d={`M ${x + 46} 566 l 0 -26 l 12 0 l 0 26`} fill="#cfeaf6" stroke={INK} strokeWidth={2} />
        </g>
      ))}
    </g>
  );
}

export function BanquetBackdrop({ phase, clap = false, crowd = true }: { phase: number; clap?: boolean; crowd?: boolean }) {
  return (
    <g>
      <rect x={-200} y={0} width={1480} height={720} fill="#6b3f5e" />
      <rect x={-200} y={470} width={1480} height={250} fill="#3d2a38" />
      <path d="M -200 470 L 1280 470" stroke={INK} strokeWidth={S} />
      <Garland />
      <g transform="translate(300 150)">
        <rect x={0} y={0} width={480} height={58} rx={10} fill="#f2c14e" stroke={INK} strokeWidth={S} />
        <text x={240} y={43} textAnchor="middle" fontFamily={TITLE_FONT} fontSize={38} fill={INK} letterSpacing={4}>
          КОРПОРАТИВ
        </text>
      </g>
      <Balloons x={70} hues={['#e5533d', '#2aabee', '#f2c14e']} />
      <Balloons x={1010} hues={['#3f7a5a', '#d97bb6', '#e5533d']} />
      {crowd && GUEST_XS.map((x, i) => <CrowdHead key={x} x={x} y={452 + (i % 2) * 8} hair={HAIR[i % HAIR.length]} phase={phase} clap={clap} />)}
      <Table />
    </g>
  );
}

type BanquetStageProps = {
  actors: ReadonlyArray<Actor & { id: CharacterId; held?: React.ReactNode }>;
  phase?: number;
  clap?: boolean;
  crowd?: boolean;
  camera?: Camera;
  boilSeed?: number;
  children?: React.ReactNode;
};

export function BanquetStage({ actors, phase = 0, clap = false, crowd = true, camera = NO_CAMERA, boilSeed = 1, children }: BanquetStageProps) {
  return (
    <svg width={VIDEO.width} height={VIDEO.height} viewBox={SCENE_VIEWBOX}>
      <g transform={cameraTransform(camera)}>
        <HandDrawn seed={boilSeed}>
          <BanquetBackdrop phase={phase} clap={clap} crowd={crowd} />
        </HandDrawn>
        {actors.map(({ id, footY = 770, height = 560, live, ...actor }) => (
          <SceneCharacter key={id} id={id} footY={footY} height={height} boilSeed={boilSeed} {...actor} {...live} />
        ))}
        {children}
      </g>
    </svg>
  );
}

// Облачко пара/выдоха «фух» изо рта: grow 0…1
export function Puff({ x, y, grow }: { x: number; y: number; grow: number }) {
  if (grow <= 0 || grow >= 1) return null;
  const s = 0.4 + grow * 1.6;
  return (
    <g transform={`translate(${x + grow * 40} ${y - grow * 20}) scale(${s})`} opacity={1 - grow * grow}>
      <circle cx={0} cy={0} r={18} fill="#ffffff" stroke={INK} strokeWidth={3} />
      <circle cx={-18} cy={8} r={13} fill="#ffffff" stroke={INK} strokeWidth={3} />
      <circle cx={16} cy={12} r={12} fill="#ffffff" stroke={INK} strokeWidth={3} />
      <circle cx={0} cy={6} r={16} fill="#ffffff" />
      <text x={0} y={8} textAnchor="middle" fontFamily="Segoe Print, sans-serif" fontSize={16} fill={CHAR.ink}>
        фух
      </text>
    </g>
  );
}
