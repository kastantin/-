import { SCENE_VIEWBOX, VIDEO } from '../../config';
import { Character, type LiveState } from '../../characters/Character';
import type { EmotionName } from '../../characters/expressions';
import { HandDrawn } from '../../characters/HandDrawn';
import { CHAR } from '../../characters/palette';
import { POLL_KOSTYA } from '../ep02/PollScene';
import { HAND_FONT, HotBorscht, INK, S, Steam, TEXT_FONT, TITLE_FONT } from '../ep02/kit';
import { HallStage } from '../ep02/HallStage';
import { CarWindow } from './props4';

// Сцены серии 4: комментарии, сплит-скрин зал/кухня, звонок в машину, инфографика, крупный план, горячий борщ гостю

const BG = '#2b2a2e';

// --- 2. Комментарии к серии 3 --------------------------------------------------------

const COMMENTS = [
  { user: 'qqebo', letter: 'q', color: '#3a6fd8', text: 'отдать друзьям' },
  { user: 'Питер Гриффин', letter: 'П', color: '#e0903f', text: 'отдать друзьям' },
  { user: 'Temirlann', letter: 'T', color: '#3f7a5a', text: '', meme: true },
  { user: 'автор канала', letter: 'А', color: '#7b5ea7', text: 'пост автора' },
] as const;

type CommentsSceneProps = { kostya: EmotionName; kostyaLive?: LiveState; rowsIn: ReadonlyArray<number>; boilSeed?: number };

export function CommentsScene({ kostya, kostyaLive, rowsIn, boilSeed = 1 }: CommentsSceneProps) {
  const { x, y, height } = POLL_KOSTYA;
  return (
    <svg width={VIDEO.width} height={VIDEO.height} viewBox={SCENE_VIEWBOX}>
      <rect x={-200} y={0} width={1480} height={720} fill={BG} />
      <circle cx={860} cy={380} r={330} fill="#34323a" />
      <HandDrawn seed={boilSeed}>
        <g transform="rotate(-1.5 330 350)">
          <rect x={30} y={112} width={620} height={410} rx={28} fill="#f6f3ec" stroke={INK} strokeWidth={S + 1} />
          <text x={340} y={162} textAnchor="middle" fontFamily={TITLE_FONT} fontSize={34} fill={INK} letterSpacing={2}>
            КОММЕНТАРИИ · СЕРИЯ 3
          </text>
          {COMMENTS.map((c, i) => {
            const p = rowsIn[i] ?? 0;
            const ry = 180 + i * 80;
            return (
              <g key={c.user} opacity={p} transform={`translate(${(1 - p) * -50} 0)`}>
                <rect x={50} y={ry} width={580} height={70} rx={16} fill="#ebe5d8" stroke={INK} strokeWidth={3} />
                <circle cx={92} cy={ry + 35} r={25} fill={c.color} stroke={INK} strokeWidth={S} />
                <text x={92} y={ry + 46} textAnchor="middle" fontFamily={TITLE_FONT} fontSize={28} fill="#ffffff">
                  {c.letter}
                </text>
                <text x={132} y={ry + 27} fontFamily={TEXT_FONT} fontWeight={800} fontSize={21} fill="#3a6fd8">
                  {c.user}
                </text>
                {'meme' in c ? (
                  <g transform={`translate(${132} ${ry + 34})`}>
                    <rect x={0} y={0} width={74} height={30} rx={5} fill="#f2c14e" stroke={INK} strokeWidth={2.4} />
                    <circle cx={22} cy={15} r={9} fill="#ffffff" stroke={INK} strokeWidth={2} />
                    <path d="M 38 8 L 66 8 M 38 16 L 62 16 M 38 24 L 58 24" stroke={INK} strokeWidth={2.4} />
                    <text x={90} y={22} fontFamily={HAND_FONT} fontSize={22} fill={INK}>
                      мем
                    </text>
                  </g>
                ) : (
                  <text x={132} y={ry + 58} fontFamily={TEXT_FONT} fontWeight={800} fontSize={28} fill={INK}>
                    {c.text}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </HandDrawn>
      <g transform={`translate(${x - height / 2} ${y - height / 2})`}>
        <Character id="kostya" emotion={kostya} mode="head" height={height} boilSeed={boilSeed} {...kostyaLive} />
      </g>
    </svg>
  );
}

// --- 5. Сплит-скрин: слева зал (гость машет), справа кухня (Гена мешает кастрюлю) ----------------

const DIVIDER = 'M 520 -10 L 560 140 L 510 260 L 570 400 L 515 540 L 560 730';

function Head({ id, emotion, x, y, height, flip = false, live, boilSeed }: { id: 'guest' | 'gena' | 'kostya'; emotion: EmotionName; x: number; y: number; height: number; flip?: boolean; live?: LiveState; boilSeed: number }) {
  const mirror = flip ? `translate(${height} 0) scale(-1 1)` : '';
  return (
    <g transform={`translate(${x - height / 2} ${y - height / 2}) ${mirror}`}>
      <Character id={id} emotion={emotion} mode="head" height={height} boilSeed={boilSeed} {...live} />
    </g>
  );
}

type SplitSceneProps = {
  frame: number;
  guestLive?: LiveState;
  kostyaLive?: LiveState;
  kostya: EmotionName;
  boilSeed?: number;
};

export function SplitHallKitchen({ frame, guestLive, kostyaLive, kostya, boilSeed = 1 }: SplitSceneProps) {
  const wave = Math.sin(frame * 0.5) * 22;
  const stir = frame * 0.18;
  return (
    <svg width={VIDEO.width} height={VIDEO.height} viewBox={SCENE_VIEWBOX}>
      <rect x={-200} y={0} width={1480} height={720} fill="#e9e5db" />
      <path d={`${DIVIDER} L -200 730 L -200 -10 Z`} fill="#a65d45" />
      <g stroke="#cfc8b8" strokeWidth={3}>
        {[60, 160, 260, 360, 460, 560, 660].map((ry) => (
          <path key={ry} d={`M 560 ${ry} L 1280 ${ry}`} />
        ))}
      </g>
      <HandDrawn seed={boilSeed}>
        <path d={DIVIDER} stroke={INK} strokeWidth={S + 4} fill="none" strokeLinejoin="round" />
        {/* зал: лампа и рама */}
        <path d="M 250 0 L 250 70" stroke={INK} strokeWidth={3} />
        <path d="M 216 100 L 236 68 L 264 68 L 284 100 Z" fill="#f2c14e" stroke={INK} strokeWidth={S} />
        {/* кухня: кастрюля с половником и паром */}
        <g transform="translate(850 560)">
          <rect x={-90} y={-70} width={180} height={110} rx={14} fill={CHAR.steel} stroke={INK} strokeWidth={S} />
          <ellipse cx={0} cy={-70} rx={90} ry={16} fill="#b8322a" stroke={INK} strokeWidth={S} />
          <g transform={`translate(${Math.cos(stir) * 22} ${Math.sin(stir) * 6 - 70})`}>
            <path d="M 0 0 L 30 -90" stroke={INK} strokeWidth={10} strokeLinecap="round" />
            <path d="M 0 0 L 30 -90" stroke={CHAR.steel} strokeWidth={5} strokeLinecap="round" />
          </g>
          <g transform="translate(0 -92)">
            <Steam steam={1} phase={frame} wisps={3} spread={36} />
          </g>
        </g>
      </HandDrawn>
      <Head id="guest" emotion="angry" x={230} y={340} height={320} live={guestLive} boilSeed={boilSeed} />
      {/* рука гостя машет над головой */}
      <g transform={`translate(330 170) rotate(${wave} 0 80)`}>
        <rect x={-9} y={0} width={18} height={86} rx={9} fill={CHAR.sweater} stroke={INK} strokeWidth={3} />
        <circle cx={0} cy={-6} r={15} fill={CHAR.skin} stroke={INK} strokeWidth={3} />
      </g>
      <Head id="gena" emotion="smirk" x={850} y={330} height={330} flip boilSeed={boilSeed} />
      <g transform={`translate(0 ${Math.abs(Math.sin(frame * 0.6)) * -14})`}>
        <Head id="kostya" emotion={kostya} x={545} y={595} height={230} live={kostyaLive} boilSeed={boilSeed} />
      </g>
    </svg>
  );
}

// --- 6. Звонок Бексу: слева Костя, справа Бекс в машине с дворниками -----------------------------

type CarCallProps = { frame: number; kostya: EmotionName; kostyaLive?: LiveState; beks: EmotionName; beksLive?: LiveState; boilSeed?: number };

export function CarCallScene({ frame, kostya, kostyaLive, beks, beksLive, boilSeed = 1 }: CarCallProps) {
  const tileY = 150;
  const tileH = 390;
  return (
    <svg width={VIDEO.width} height={VIDEO.height} viewBox={SCENE_VIEWBOX}>
      <rect x={-200} y={0} width={1480} height={720} fill="#25232a" />
      <HandDrawn seed={boilSeed}>
        <rect x={45} y={tileY} width={470} height={tileH} rx={22} fill="#e9e5db" stroke={INK} strokeWidth={S + 1} />
        <rect x={565} y={tileY} width={470} height={tileH} rx={22} fill="#1b1d24" stroke={INK} strokeWidth={S + 1} />
        <CarWindow x={585} y={tileY + 20} w={430} h={190} frame={frame} />
        {/* руль внизу плитки Бекса */}
        <ellipse cx={800} cy={tileY + tileH + 10} rx={170} ry={70} fill="none" stroke="#4a4d63" strokeWidth={18} />
      </HandDrawn>
      <g transform={`translate(${45 + (470 - 270) / 2} ${tileY + 40})`}>
        <Character id="kostya" emotion={kostya} mode="head" height={270} boilSeed={boilSeed} {...kostyaLive} />
      </g>
      <g transform={`translate(${565 + (470 - 270) / 2} ${tileY + 90})`}>
        <Character id="beks" emotion={beks} mode="head" height={270} boilSeed={boilSeed} {...beksLive} />
      </g>
      <g fontFamily={TEXT_FONT} fontWeight={800} fontSize={26} fill="#ffffff">
        <rect x={61} y={tileY + tileH - 56} width={150} height={38} rx={19} fill={INK} opacity={0.8} />
        <text x={136} y={tileY + tileH - 28} textAnchor="middle">
          Костя
        </text>
        <rect x={581} y={tileY + tileH - 56} width={236} height={38} rx={19} fill={INK} opacity={0.8} />
        <text x={699} y={tileY + tileH - 28} textAnchor="middle">
          Бекс · в машине
        </text>
      </g>
      <text x={540} y={125} textAnchor="middle" fontFamily={HAND_FONT} fontSize={30} fill={CHAR.shirt}>
        видеозвонок
      </text>
    </svg>
  );
}

// --- 7. Инфографика: правило зала и счётчик чеков ----------------------------------------------

type InfoSceneProps = { cardIn: number; chipsIn: ReadonlyArray<number>; boilSeed?: number };

const COUNT_CHIPS = ['14', '19', '23'] as const;

export function InfoScene({ cardIn, chipsIn, boilSeed = 1 }: InfoSceneProps) {
  return (
    <svg width={VIDEO.width} height={VIDEO.height} viewBox={SCENE_VIEWBOX}>
      <rect x={-200} y={0} width={1480} height={720} fill="#3a3640" />
      <circle cx={540} cy={390} r={320} fill="#4a4552" />
      <HandDrawn seed={boilSeed}>
        <g transform={`translate(540 ${330 + (1 - cardIn) * 100}) scale(${0.75 + 0.25 * cardIn}) rotate(-1.5)`} opacity={cardIn}>
          <rect x={-420} y={-170} width={840} height={340} rx={30} fill="#f6f3ec" stroke={INK} strokeWidth={S + 1} />
          <text x={0} y={-104} textAnchor="middle" fontFamily={TITLE_FONT} fontSize={44} fill="#c2412f" letterSpacing={3}>
            ПРАВИЛО ЗАЛА
          </text>
          <path d="M -350 -80 L 350 -80" stroke={INK} strokeWidth={3} />
          <text x={0} y={-16} textAnchor="middle" fontFamily={TEXT_FONT} fontWeight={800} fontSize={54} fill={INK}>
            кухня — союзник
          </text>
          <text x={0} y={70} textAnchor="middle" fontFamily={TEXT_FONT} fontWeight={800} fontSize={44} fill={INK}>
            враг — только <tspan fill="#c2412f">пустая тарелка</tspan>
          </text>
          <ellipse cx={0} cy={128} rx={60} ry={14} fill="#ffffff" stroke={INK} strokeWidth={3} />
        </g>
        {/* счётчик чеков: 14 → 19 → 23 */}
        <g transform="translate(540 590)">
          {COUNT_CHIPS.map((value, i) => {
            const p = chipsIn[i] ?? 0;
            const cx = (i - 1) * 190;
            return (
              <g key={value} opacity={p} transform={`translate(${cx} ${(1 - p) * 30}) scale(${0.6 + 0.4 * p})`}>
                <rect x={-62} y={-34} width={124} height={68} rx={16} fill={i === 2 ? '#d6332a' : '#f2c14e'} stroke={INK} strokeWidth={S} />
                <text x={0} y={16} textAnchor="middle" fontFamily="Consolas, Courier New, monospace" fontWeight={700} fontSize={46} fill={i === 2 ? '#ffffff' : INK}>
                  {value}
                </text>
                {i < 2 && (
                  <path d="M 78 0 L 112 0 M 100 -12 L 112 0 L 100 12" stroke={CHAR.shirt} strokeWidth={6} strokeLinecap="round" fill="none" transform="translate(0 0)" />
                )}
              </g>
            );
          })}
        </g>
      </HandDrawn>
    </svg>
  );
}

// --- 15. Крупный план Кости: брови вверх, взгляд в камеру ------------------------------------------

export function CloseUpScene({ kostya, kostyaLive, push, boilSeed = 1 }: { kostya: EmotionName; kostyaLive?: LiveState; push: number; boilSeed?: number }) {
  const height = 760 * push;
  return (
    <svg width={VIDEO.width} height={VIDEO.height} viewBox={SCENE_VIEWBOX}>
      <rect x={-200} y={0} width={1480} height={720} fill="#3a3640" />
      <circle cx={540} cy={380} r={330} fill="#4a4552" />
      <g transform={`translate(${540 - height / 2} ${400 - height / 2})`}>
        <Character id="kostya" emotion={kostya} mode="head" height={height} boilSeed={boilSeed} {...kostyaLive} />
      </g>
    </svg>
  );
}

// --- 12. Гость получает горячий борщ -----------------------------------------------------------------

type HotHallProps = { frame: number; guest: EmotionName; guestLive?: LiveState; kostya: EmotionName; boilSeed?: number };

export function HotHallScene({ frame, guest, guestLive, kostya, boilSeed = 1 }: HotHallProps) {
  return (
    <HallStage
      boilSeed={boilSeed}
      actors={[
        { id: 'guest', emotion: guest, x: 810, footY: 700, height: 520, live: guestLive },
        { id: 'kostya', emotion: kostya, x: 280, footY: 770, height: 560 },
      ]}
    >
      <HandDrawn seed={boilSeed}>
        <rect x={640} y={548} width={340} height={170} fill="#f6f3ec" stroke={INK} strokeWidth={S} />
        <HotBorscht x={810} y={548} scale={1.6} steam={1} phase={frame} />
      </HandDrawn>
    </HallStage>
  );
}
