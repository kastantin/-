import { SCENE_VIEWBOX, VIDEO } from '../../config';
import { HandDrawn } from '../../characters/HandDrawn';
import { cameraTransform, INK, S, type Camera } from './kit';

// Кухонный чек крупно: «отдан 19:42» → «вынесен 19:54», сверху падает красный штамп «12 МИН»
const MONO = 'Consolas, Courier New, monospace';

type ReceiptSceneProps = {
  camera: Camera;
  // появление второй строки (0…1, печатается)
  secondLine: number;
  // штамп: 0 — ещё нет, 1 — лёг на чек
  stamp: number;
  boilSeed?: number;
};

function Line({ y, label, time, reveal = 1 }: { y: number; label: string; time: string; reveal?: number }) {
  const text = `${label} ${time}`;
  const shown = text.slice(0, Math.round(text.length * reveal));
  return (
    <text x={400} y={y} fontFamily={MONO} fontSize={40} fontWeight={700} fill={INK}>
      {shown}
    </text>
  );
}

export function ReceiptScene({ camera, secondLine, stamp, boilSeed = 1 }: ReceiptSceneProps) {
  const stampScale = 1 + (1 - stamp) * 2.2;
  return (
    <svg width={VIDEO.width} height={VIDEO.height} viewBox={SCENE_VIEWBOX}>
      <rect x={-200} y={0} width={1480} height={720} fill="#3a3640" />
      <g transform={cameraTransform(camera)}>
        <HandDrawn seed={boilSeed}>
          <g transform="rotate(-3 540 360)">
            <path
              d="M 370 40 L 710 40 L 710 660 L 690 676 L 670 660 L 650 676 L 630 660 L 610 676 L 590 660 L 570 676 L 550 660 L 530 676 L 510 660 L 490 676 L 470 660 L 450 676 L 430 660 L 410 676 L 390 660 L 370 676 Z"
              fill="#fffdf4"
              stroke={INK}
              strokeWidth={S}
              strokeLinejoin="round"
            />
            <text x={540} y={110} textAnchor="middle" fontFamily={MONO} fontSize={34} fontWeight={700} fill={INK}>
              ЧЕК КУХНИ
            </text>
            <path d="M 400 140 L 680 140" stroke={INK} strokeWidth={3} strokeDasharray="10 8" />
            <text x={400} y={200} fontFamily={MONO} fontSize={36} fill={INK}>
              Стол 7
            </text>
            <text x={400} y={250} fontFamily={MONO} fontSize={36} fill={INK}>
              Борщ ......... 1
            </text>
            <path d="M 400 290 L 680 290" stroke={INK} strokeWidth={3} strokeDasharray="10 8" />
            <Line y={360} label="отдан  " time="19:42" />
            {secondLine > 0 && <Line y={430} label="вынесен" time="19:54" reveal={secondLine} />}
          </g>
        </HandDrawn>
        {stamp > 0 && (
          <g opacity={Math.min(1, stamp * 1.5)} transform={`translate(560 520) rotate(-14) scale(${stampScale})`}>
            <rect x={-150} y={-56} width={300} height={112} rx={14} fill="none" stroke="#d6332a" strokeWidth={10} />
            <text x={0} y={26} textAnchor="middle" fontFamily="Segoe UI Black, Arial Black, sans-serif" fontSize={76} fill="#d6332a">
              12 МИН
            </text>
          </g>
        )}
      </g>
    </svg>
  );
}
