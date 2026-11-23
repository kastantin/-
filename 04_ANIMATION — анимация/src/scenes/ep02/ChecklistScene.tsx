import { SCENE_VIEWBOX, VIDEO } from '../../config';
import { Character, type LiveState } from '../../characters/Character';
import type { EmotionName } from '../../characters/expressions';
import { HandDrawn } from '../../characters/HandDrawn';
import { INK, S, TEXT_FONT, TITLE_FONT } from './kit';

// Стол Эдуарда сверху: Костя шлёпает листок, пункты влетают по одному с галочкой

type ChecklistSceneProps = {
  title: string;
  items: ReadonlyArray<string>;
  // шлепок листка: 0 — над столом, 1 — лежит
  slap: number;
  // влёт пунктов: 0 — справа за кадром, 1 — на месте
  itemsIn: ReadonlyArray<number>;
  eduard: EmotionName;
  eduardLive?: LiveState;
  boilSeed?: number;
};

function WoodDesk() {
  return (
    <g>
      <rect x={-200} y={0} width={1480} height={720} fill="#7a5236" />
      <g stroke="#6a4630" strokeWidth={5} fill="none">
        {[80, 210, 340, 470, 600].map((y) => (
          <path key={y} d={`M -200 ${y} Q 300 ${y + 18} 640 ${y - 6} T 1280 ${y + 8}`} />
        ))}
      </g>
    </g>
  );
}

function CheckItem({ text, y, progress }: { text: string; y: number; progress: number }) {
  if (progress <= 0) return null;
  const dx = (1 - progress) * 700;
  return (
    <g transform={`translate(${dx} 0)`} opacity={Math.min(1, progress * 2)}>
      <rect x={300} y={y - 30} width={40} height={40} rx={6} fill="#ffffff" stroke={INK} strokeWidth={3} />
      {progress > 0.9 && <path d={`M 306 ${y - 12} l 12 14 l 22 -30`} stroke="#3f7a5a" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
      <text x={360} y={y} fontFamily={TEXT_FONT} fontWeight={700} fontSize={27} fill={INK}>
        {text}
      </text>
    </g>
  );
}

export function ChecklistScene({ title, items, slap, itemsIn, eduard, eduardLive, boilSeed = 1 }: ChecklistSceneProps) {
  const sheetScale = 1 + (1 - slap) * 0.35;
  const sheetLift = (1 - slap) * -160;
  // в момент удара лист чуть сплющивается
  const squash = slap > 0.85 && slap < 1 ? 0.96 : 1;
  return (
    <svg width={VIDEO.width} height={VIDEO.height} viewBox={SCENE_VIEWBOX}>
      <WoodDesk />
      <HandDrawn seed={boilSeed}>
        <g transform={`translate(0 ${sheetLift}) translate(500 360) scale(${sheetScale} ${sheetScale * squash}) translate(-500 -360) rotate(-2 500 360)`}>
          <rect x={268} y={70} width={480} height={560} fill={INK} opacity={0.25} transform="translate(10 12)" />
          <rect x={268} y={70} width={480} height={560} fill="#fffdf7" stroke={INK} strokeWidth={S} />
          <text x={508} y={150} textAnchor="middle" fontFamily={TITLE_FONT} fontSize={50} fill="#c2412f">
            {title}
          </text>
          <path d="M 300 178 L 716 178" stroke={INK} strokeWidth={3} />
        </g>
        {items.map((item, i) => (
          <CheckItem key={item} text={item} y={262 + i * 92} progress={itemsIn[i] ?? 0} />
        ))}
        {/* рамка с головой Эдуарда */}
        <circle cx={980} cy={500} r={128} fill="#f6f3ec" stroke={INK} strokeWidth={S + 1} />
      </HandDrawn>
      <g transform="translate(880 404)">
        <Character id="eduard" emotion={eduard} mode="head" height={200} boilSeed={boilSeed} {...eduardLive} />
      </g>
    </svg>
  );
}
