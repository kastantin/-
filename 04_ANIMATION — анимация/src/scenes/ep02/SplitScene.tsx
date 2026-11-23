import { SCENE_VIEWBOX, VIDEO } from '../../config';
import { Character, type CharacterId, type LiveState } from '../../characters/Character';
import type { EmotionName } from '../../characters/expressions';
import { HandDrawn } from '../../characters/HandDrawn';
import { INK, S, SpeechBubble } from './kit';

// Сплит-скрин: слева Гена на кухне, справа Дима в зале, кричат одновременно;
// Костя внизу посередине вертит головой

const DIVIDER = 'M 520 -10 L 560 140 L 510 260 L 570 400 L 515 540 L 560 730';

function Head({ id, emotion, x, y, height, flip = false, live, boilSeed }: {
  id: CharacterId;
  emotion: EmotionName;
  x: number;
  y: number;
  height: number;
  flip?: boolean;
  live?: LiveState;
  boilSeed: number;
}) {
  const mirror = flip ? `translate(${height} 0) scale(-1 1)` : '';
  return (
    <g transform={`translate(${x - height / 2} ${y - height / 2}) ${mirror}`}>
      <Character id={id} emotion={emotion} mode="head" height={height} boilSeed={boilSeed} {...live} />
    </g>
  );
}

type Shout = { text: string; progress: number };

type SplitSceneProps = {
  genaLive?: LiveState;
  dimaLive?: LiveState;
  kostyaLive?: LiveState;
  kostya: EmotionName;
  // куда смотрит Костя: -1 — на Гену, 1 — на Диму, 0 — в камеру
  kostyaLook: number;
  genaShout: Shout;
  dimaShout: Shout;
  shake: number;
  boilSeed?: number;
};

export function SplitScene({ genaLive, dimaLive, kostyaLive, kostya, kostyaLook, genaShout, dimaShout, shake, boilSeed = 1 }: SplitSceneProps) {
  return (
    <svg width={VIDEO.width} height={VIDEO.height} viewBox={SCENE_VIEWBOX}>
      {/* слева кухонный кафель, справа стена зала */}
      <rect x={-200} y={0} width={1480} height={720} fill="#a65d45" />
      <path d={`${DIVIDER} L -200 730 L -200 -10 Z`} fill="#e9e5db" />
      <g stroke="#cfc8b8" strokeWidth={3} clipPath="none">
        {[60, 160, 260, 360, 460, 560, 660].map((y) => (
          <path key={y} d={`M -200 ${y} L 500 ${y}`} />
        ))}
      </g>
      <HandDrawn seed={boilSeed}>
        <path d={DIVIDER} stroke={INK} strokeWidth={S + 4} fill="none" strokeLinejoin="round" />
      </HandDrawn>
      <g transform={`translate(${shake} 0)`}>
        <Head id="gena" emotion="yell" x={200} y={380} height={330} live={genaLive} boilSeed={boilSeed} />
      </g>
      <g transform={`translate(${-shake} 0)`}>
        <Head id="dima" emotion="panic" x={890} y={380} height={300} flip live={dimaLive} boilSeed={boilSeed} />
      </g>
      <HandDrawn seed={boilSeed}>
        <SpeechBubble x={210} y={120} text={genaShout.text} progress={genaShout.progress} tailX={-10} width={420} />
        <SpeechBubble x={880} y={120} text={dimaShout.text} progress={dimaShout.progress} tailX={10} width={300} />
      </HandDrawn>
      {/* лицо симметричное, поэтому «поворот головы» — наклон и сдвиг в сторону собеседника */}
      <g transform={`translate(${kostyaLook * 26} 0) rotate(${kostyaLook * 14} 545 700)`}>
        <Head id="kostya" emotion={kostya} x={545} y={590} height={230} flip={kostyaLook < 0} live={kostyaLive} boilSeed={boilSeed} />
      </g>
    </svg>
  );
}
