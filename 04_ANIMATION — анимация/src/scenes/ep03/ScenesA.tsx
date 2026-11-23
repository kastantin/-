import { SCENE_VIEWBOX, VIDEO } from '../../config';
import { Character, SceneCharacter, type CharacterId, type LiveState } from '../../characters/Character';
import type { EmotionName } from '../../characters/expressions';
import { HandDrawn } from '../../characters/HandDrawn';
import { CHAR } from '../../characters/palette';
import { Board, Fly, POLL_KOSTYA } from '../ep02/PollScene';
import { HAND_FONT, INK, S, TEXT_FONT, TITLE_FONT } from '../ep02/kit';
import { CatGif } from './props3';

// Сцены 2–7 и 9 серии 3: опрос с котом, идея зрителя, видеозвонок, «сбор команды», тайминг банкета

const BG = '#2b2a2e';

// --- 2. «Вы выбрали»: опять нули, но есть один комментарий и кот ------------------------------

type PollScene3Props = {
  kostya: EmotionName;
  kostyaLive?: LiveState;
  zeroPop: number;
  flyT: number;
  frame: number;
  commentIn: number;
  catIn: number;
  boilSeed?: number;
};

export function PollScene3({ kostya, kostyaLive, zeroPop, flyT, frame, commentIn, catIn, boilSeed = 1 }: PollScene3Props) {
  const { x, y, height } = POLL_KOSTYA;
  return (
    <svg width={VIDEO.width} height={VIDEO.height} viewBox={SCENE_VIEWBOX}>
      <rect x={-200} y={0} width={1480} height={720} fill={BG} />
      <circle cx={860} cy={380} r={330} fill="#34323a" />
      <HandDrawn seed={boilSeed}>
        <g transform="translate(30 10) scale(0.8)">
          <Board zeroPop={zeroPop} />
        </g>
        {commentIn > 0 && (
          <g transform={`translate(300 ${520 + (1 - commentIn) * 90}) scale(${0.6 + 0.4 * commentIn})`} opacity={commentIn}>
            <rect x={-170} y={-30} width={340} height={60} rx={30} fill="#ffffff" stroke={INK} strokeWidth={S} />
            <path d="M -150 -12 h 30 a 8 8 0 0 1 8 8 v 8 a 8 8 0 0 1 -8 8 h -16 l -8 9 v -9 h -6 a 8 8 0 0 1 -8 -8 v -8 a 8 8 0 0 1 8 -8 Z" fill="#2aabee" stroke={INK} strokeWidth={2.4} />
            <text x={20} y={10} textAnchor="middle" fontFamily={TEXT_FONT} fontWeight={800} fontSize={30} fill={INK}>
              Комментарии: 1
            </text>
          </g>
        )}
      </HandDrawn>
      <g transform={`translate(${x - height / 2} ${y - height / 2})`}>
        <Character id="kostya" emotion={kostya} mode="head" height={height} boilSeed={boilSeed} {...kostyaLive} />
      </g>
      <Fly t={flyT} frame={frame} />
      {catIn > 0 && (
        <g transform={`translate(${985} ${565 + (1 - catIn) * 160})`} opacity={catIn}>
          <CatGif x={0} y={0} size={140} frame={frame} />
        </g>
      )}
    </svg>
  );
}

// --- 3. Идея зрителя: комментарий крупно, Костя достаёт телефон ---------------------------------

type IdeaSceneProps = {
  kostya: EmotionName;
  kostyaLive?: LiveState;
  cardIn: number;
  stampIn: number;
  phone: React.ReactNode;
  boilSeed?: number;
};

export function IdeaScene({ kostya, kostyaLive, cardIn, stampIn, phone, boilSeed = 1 }: IdeaSceneProps) {
  return (
    <svg width={VIDEO.width} height={VIDEO.height} viewBox={SCENE_VIEWBOX}>
      <rect x={-200} y={0} width={1480} height={720} fill="#3a3640" />
      <circle cx={760} cy={400} r={300} fill="#4a4552" />
      <HandDrawn seed={boilSeed}>
        <g transform={`translate(340 ${330 + (1 - cardIn) * 120}) scale(${0.7 + 0.3 * cardIn}) rotate(-3)`} opacity={cardIn}>
          <rect x={-300} y={-140} width={600} height={280} rx={32} fill="#ffffff" stroke={INK} strokeWidth={S + 1} />
          <circle cx={-236} cy={-80} r={34} fill="#7b5ea7" stroke={INK} strokeWidth={S} />
          <text x={-236} y={-68} textAnchor="middle" fontFamily={TITLE_FONT} fontSize={38} fill="#ffffff">
            m
          </text>
          <text x={-186} y={-72} fontFamily={TEXT_FONT} fontWeight={800} fontSize={34} fill="#3a6fd8">
            me
          </text>
          <text x={-264} y={-8} fontFamily={TEXT_FONT} fontWeight={800} fontSize={48} fill={INK}>
            позвать друзей
          </text>
          <text x={-264} y={58} fontFamily={TEXT_FONT} fontWeight={800} fontSize={48} fill={INK}>
            и работать
          </text>
          <text x={270} y={118} textAnchor="end" fontFamily={TEXT_FONT} fontSize={24} fill="#8a90a0">
            комментарий
          </text>
        </g>
        {stampIn > 0 && (
          <g transform={`translate(560 190) rotate(8) scale(${stampIn})`}>
            <rect x={-130} y={-34} width={260} height={68} rx={12} fill={CHAR.gold} stroke={INK} strokeWidth={S + 1} />
            <text x={0} y={14} textAnchor="middle" fontFamily={TITLE_FONT} fontSize={42} fill={INK}>
              идея: me
            </text>
          </g>
        )}
      </HandDrawn>
      <SceneCharacter id="kostya" emotion={kostya} x={880} footY={745} height={600} boilSeed={boilSeed} held={phone} {...kostyaLive} />
    </svg>
  );
}

// --- 4. Видеозвонок: три гудка, три окошка ---------------------------------------------------

const TILES: ReadonlyArray<{ id: CharacterId; name: string; emotion: EmotionName; answerAt: number }> = [
  { id: 'beks', name: 'Бекс', emotion: 'happy', answerAt: 30 },
  { id: 'akhma', name: 'Ахма', emotion: 'neutral', answerAt: 42 },
  { id: 'nadir', name: 'Надир', emotion: 'neutral', answerAt: 54 },
];
const TILE_W = 310;
const TILE_GAP = 30;
const TILE_Y = 150;
const TILE_H = 340;

function CallTile({ index, frame, boilSeed }: { index: number; frame: number; boilSeed: number }) {
  const t = TILES[index];
  const x = 45 + index * (TILE_W + TILE_GAP);
  const answered = frame >= t.answerAt;
  const headSize = 230;
  return (
    <g>
      <rect x={x} y={TILE_Y} width={TILE_W} height={TILE_H} rx={22} fill={answered ? '#e9e5db' : '#34323a'} stroke={INK} strokeWidth={S + 1} />
      {!answered && (
        <g transform={`translate(${x + TILE_W / 2} ${TILE_Y + TILE_H / 2 - 20})`}>
          {[0, 1, 2].map((i) => {
            const k = ((frame * 2 + i * 20) % 60) / 60;
            return <circle key={i} cx={0} cy={0} r={34 + k * 70} fill="none" stroke="#9fd3f0" strokeWidth={5} opacity={1 - k} />;
          })}
          <circle cx={0} cy={0} r={36} fill="#3f7a5a" stroke={INK} strokeWidth={S} />
          <path d="M -14 -12 Q -18 -2 -8 10 Q 4 22 14 18 L 18 10 L 8 4 L 4 8 Q -4 4 -8 -4 L -4 -8 L -10 -18 Z" fill="#ffffff" />
        </g>
      )}
      {answered && (
        <g transform={`translate(${x + (TILE_W - headSize) / 2} ${TILE_Y + 24})`}>
          <Character id={t.id} emotion={t.emotion} mode="head" height={headSize} boilSeed={boilSeed} blink={frame % 70 < 4} />
        </g>
      )}
      <rect x={x + 16} y={TILE_Y + TILE_H - 56} width={140} height={38} rx={19} fill={INK} opacity={0.8} />
      <text x={x + 86} y={TILE_Y + TILE_H - 28} textAnchor="middle" fontFamily={TEXT_FONT} fontWeight={800} fontSize={26} fill="#ffffff">
        {t.name}
      </text>
      <circle cx={x + TILE_W - 30} cy={TILE_Y + 30} r={9} fill={answered ? '#3fbf6a' : '#c9a227'} stroke={INK} strokeWidth={2} />
    </g>
  );
}

export function CallScene({ frame, boilSeed = 1 }: { frame: number; boilSeed?: number }) {
  return (
    <svg width={VIDEO.width} height={VIDEO.height} viewBox={SCENE_VIEWBOX}>
      <rect x={-200} y={0} width={1480} height={720} fill="#25232a" />
      <HandDrawn seed={boilSeed}>
        {TILES.map((_, i) => (
          <CallTile key={TILES[i].id} index={i} frame={frame} boilSeed={boilSeed} />
        ))}
        <g transform="translate(540 545)">
          {[-90, 0, 90].map((dx, i) => (
            <circle key={dx} cx={dx} cy={0} r={28} fill={i === 1 ? '#c2412f' : '#4a4552'} stroke={INK} strokeWidth={S} />
          ))}
        </g>
      </HandDrawn>
      <text x={540} y={125} textAnchor="middle" fontFamily={HAND_FONT} fontSize={30} fill={CHAR.shirt}>
        видеозвонок
      </text>
    </svg>
  );
}

// --- 5–7. «Сбор команды»: стоп-кадр на друге и плашка-титул, как в кино про ограбление -------------

export type CrewPlate = { name: string; role: string; small?: string; extra?: string; extraIn?: number };

type CrewSceneProps = {
  id: CharacterId;
  emotion: EmotionName;
  held?: React.ReactNode;
  plate: CrewPlate;
  plateIn: number;
  push: number;
  flash: number;
  frame: number;
  // искры у улыбки Бекса
  sparkle?: boolean;
  boilSeed?: number;
};

export function CrewScene({ id, emotion, held, plate, plateIn, push, flash, frame, sparkle = false, boilSeed = 1 }: CrewSceneProps) {
  const star = 1 + Math.sin(frame * 0.35) * 0.25;
  return (
    <svg width={VIDEO.width} height={VIDEO.height} viewBox={SCENE_VIEWBOX}>
      <g transform={`translate(540 360) scale(${push}) translate(-540 -360)`}>
        <rect x={-200} y={0} width={1480} height={720} fill="#1d1b22" />
        <path d="M 760 -10 L 520 720 L 1000 720 Z" fill="#3a3643" opacity={0.75} />
        <ellipse cx={760} cy={716} rx={250} ry={30} fill="#2a2730" />
        <SceneCharacter id={id} emotion={emotion} x={760} footY={716} height={640} boilSeed={boilSeed} held={held} blink={false} talking={false} />
        {sparkle && (
          <g transform={`translate(835 250) scale(${star})`}>
            <path d="M 0 -26 Q 3 -3 26 0 Q 3 3 0 26 Q -3 3 -26 0 Q -3 -3 0 -26 Z" fill={CHAR.gold} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
          </g>
        )}
      </g>
      {/* плашка-титул: выезжает слева */}
      <g transform={`translate(${-420 + plateIn * 460} 0)`}>
        <g transform="rotate(-4 220 300)">
          <rect x={60} y={190} width={470} height={plate.small ? 250 : 220} rx={14} fill="#f2c14e" stroke={INK} strokeWidth={S + 2} />
          <text x={90} y={282} fontFamily={TITLE_FONT} fontSize={88} fill={INK} letterSpacing={3}>
            {plate.name}
          </text>
          <path d="M 90 304 L 500 304" stroke={INK} strokeWidth={4} />
          <text x={92} y={354} fontFamily={TEXT_FONT} fontWeight={800} fontSize={40} fill={INK}>
            {plate.role}
          </text>
          {plate.small && (
            <text x={92} y={410} fontFamily={HAND_FONT} fontSize={30} fill="#7a1f12">
              {plate.small}
            </text>
          )}
        </g>
        {plate.extra && (plate.extraIn ?? 0) > 0 && (
          <g transform={`translate(${60} ${470 + (1 - (plate.extraIn ?? 0)) * 40}) rotate(-4)`} opacity={plate.extraIn}>
            <rect x={0} y={0} width={470} height={64} rx={12} fill="#ffffff" stroke={INK} strokeWidth={S + 1} />
            <text x={24} y={44} fontFamily={TEXT_FONT} fontWeight={800} fontSize={34} fill={INK}>
              {plate.extra}
            </text>
          </g>
        )}
      </g>
      {/* чёрные полосы, как в кино */}
      <rect x={-200} y={0} width={1480} height={34} fill="#000000" opacity={0.75} />
      <rect x={-200} y={686} width={1480} height={34} fill="#000000" opacity={0.75} />
      <rect x={-200} y={0} width={1480} height={720} fill="#ffffff" opacity={flash} />
    </svg>
  );
}

// --- 9. Инфографика: тайминг банкета, Дима записывает -----------------------------------------

export type TimingRow = { time: string; label: string; note?: string };

type TimingSceneProps = {
  rows: ReadonlyArray<TimingRow>;
  rowsIn: ReadonlyArray<number>;
  highlight: number;
  kostya: EmotionName;
  dima: EmotionName;
  kostyaLive?: LiveState;
  dimaTilt: number;
  dimaHeld: React.ReactNode;
  boilSeed?: number;
};

export function TimingScene({ rows, rowsIn, highlight, kostya, dima, kostyaLive, dimaTilt, dimaHeld, boilSeed = 1 }: TimingSceneProps) {
  return (
    <svg width={VIDEO.width} height={VIDEO.height} viewBox={SCENE_VIEWBOX}>
      <rect x={-200} y={0} width={1480} height={720} fill="#3a3640" />
      <circle cx={330} cy={380} r={300} fill="#4a4552" />
      <HandDrawn seed={boilSeed}>
        <g transform="rotate(-1.5 330 380)">
          <rect x={40} y={140} width={580} height={440} rx={26} fill="#f6f3ec" stroke={INK} strokeWidth={S + 1} />
          <text x={330} y={204} textAnchor="middle" fontFamily={TITLE_FONT} fontSize={38} fill={INK} letterSpacing={2}>
            ТАЙМИНГ БАНКЕТА
          </text>
          <path d="M 70 224 L 590 224" stroke={INK} strokeWidth={3} />
          {rows.map((row, i) => {
            const y = 262 + i * 104;
            const p = rowsIn[i] ?? 0;
            const hot = i === highlight;
            return (
              <g key={row.time} opacity={p} transform={`translate(${(1 - p) * -60} 0)`}>
                <rect x={64} y={y} width={532} height={88} rx={16} fill={hot ? '#ffe9e4' : '#ebe5d8'} stroke={hot ? '#d6332a' : INK} strokeWidth={hot ? 6 : 3} />
                <rect x={78} y={y + 14} width={130} height={60} rx={12} fill={INK} />
                <text x={143} y={y + 58} textAnchor="middle" fontFamily="Consolas, Courier New, monospace" fontWeight={700} fontSize={40} fill="#ffffff">
                  {row.time}
                </text>
                <text x={226} y={y + (row.note ? 44 : 58)} fontFamily={TEXT_FONT} fontWeight={800} fontSize={38} fill={INK}>
                  {row.label}
                </text>
                {row.note && (
                  <text x={226} y={y + 76} fontFamily={TEXT_FONT} fontWeight={800} fontSize={26} fill="#c2412f">
                    {row.note}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </HandDrawn>
      <SceneCharacter id="kostya" emotion={kostya} x={770} footY={745} height={540} boilSeed={boilSeed} {...kostyaLive} />
      <SceneCharacter id="dima" emotion={dima} x={985} footY={745} height={470} tilt={dimaTilt} boilSeed={boilSeed} held={dimaHeld} blink={false} />
    </svg>
  );
}
