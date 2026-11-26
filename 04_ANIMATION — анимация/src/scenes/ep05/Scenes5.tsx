import { SCENE_VIEWBOX, VIDEO } from '../../config';
import { Character, SceneCharacter, type LiveState } from '../../characters/Character';
import type { EmotionName } from '../../characters/expressions';
import { HandDrawn } from '../../characters/HandDrawn';
import { CHAR } from '../../characters/palette';
import { HAND_FONT, INK, S, Steam, TEXT_FONT, TITLE_FONT } from '../ep02/kit';
import { CrowdHead } from '../ep03/props3';

// Сцены серии 5: чат хозяйки, табло голосов, график смен, звонок из подсобки, «оформление», зеркало, стена, дверь

const BG = '#2b2a2e';

function Frame({ children, fill = BG }: { children: React.ReactNode; fill?: string }) {
  return (
    <svg width={VIDEO.width} height={VIDEO.height} viewBox={SCENE_VIEWBOX}>
      <rect x={-200} y={0} width={1480} height={720} fill={fill} />
      {children}
    </svg>
  );
}

// --- 1. Чат «Рестораторы района» на телефоне хозяйки и красная цифра штрафа --------------------

type ChatSceneProps = { chatIn: number; bigIn: number; owner: EmotionName; ownerLive?: LiveState; boilSeed?: number };

export function ChatPhoneScene({ chatIn, bigIn, owner, ownerLive, boilSeed = 1 }: ChatSceneProps) {
  return (
    <Frame fill="#3a3640">
      <circle cx={420} cy={380} r={300} fill="#4a4552" />
      <HandDrawn seed={boilSeed}>
        <g transform="translate(420 380) rotate(-5) scale(0.82) translate(-540 -380)">
          <rect x={340} y={70} width={400} height={700} rx={48} fill="#1f1f22" stroke={INK} strokeWidth={5} />
          <rect x={360} y={92} width={360} height={660} rx={32} fill="#eef0f4" />
          <rect x={360} y={92} width={360} height={90} rx={32} fill="#dfe3ea" />
          <rect x={360} y={140} width={360} height={42} fill="#dfe3ea" />
          <text x={540} y={150} textAnchor="middle" fontFamily={TEXT_FONT} fontWeight={800} fontSize={24} fill={INK}>
            Рестораторы района
          </text>
          <g opacity={chatIn} transform={`translate(384 220) scale(${0.6 + 0.4 * chatIn}) translate(-384 -220)`}>
            <rect x={384} y={220} width={312} height={130} rx={20} fill="#ffffff" stroke="#c5cad3" strokeWidth={2} />
            <text x={404} y={262} fontFamily={TEXT_FONT} fontSize={28} fill={INK}>
              «Пельменную»
            </text>
            <text x={404} y={302} fontFamily={TEXT_FONT} fontSize={28} fill={INK}>
              вчера проверили.
            </text>
            <text x={676} y={336} textAnchor="end" fontSize={15} fill="#8a90a0" fontFamily={TEXT_FONT}>
              08:12
            </text>
          </g>
        </g>
        {bigIn > 0 && (
          <g transform={`translate(420 560) rotate(-7) scale(${0.3 + 0.7 * bigIn})`} opacity={Math.min(1, bigIn * 2)}>
            <rect x={-250} y={-62} width={500} height={124} rx={18} fill="#ffffff" stroke="#d6332a" strokeWidth={9} />
            <text x={0} y={30} textAnchor="middle" fontFamily={TITLE_FONT} fontSize={82} fill="#d6332a">
              100 000 ₽
            </text>
          </g>
        )}
      </HandDrawn>
      <g transform="translate(730 190)">
        <Character id="owner" emotion={owner} mode="head" height={400} boilSeed={boilSeed} {...ownerLive} />
      </g>
    </Frame>
  );
}

// --- 3. Табло «Вы выбрали»: А 67% · Б 33% · 💬 0, плашка «рекорд канала» ---------------------------

const BARS = [
  { badge: 'А', color: '#e5533d', pct: 67, votes: '2 голоса' },
  { badge: 'Б', color: '#3f7a5a', pct: 33, votes: '1 голос' },
  { badge: '…', color: '#2aabee', pct: 0, votes: '0' },
] as const;

type PollSceneProps = { kostya: EmotionName; kostyaLive?: LiveState; bars: ReadonlyArray<number>; plateIn: number; boilSeed?: number };

export function PollScene5({ kostya, kostyaLive, bars, plateIn, boilSeed = 1 }: PollSceneProps) {
  return (
    <Frame>
      <circle cx={860} cy={380} r={330} fill="#34323a" />
      <HandDrawn seed={boilSeed}>
        <g transform="rotate(-2 330 330)">
          <rect x={50} y={110} width={560} height={420} rx={28} fill="#f6f3ec" stroke={INK} strokeWidth={S + 1} />
          <text x={330} y={172} textAnchor="middle" fontFamily={TITLE_FONT} fontSize={42} fill={INK}>
            ВЫ ВЫБРАЛИ:
          </text>
          {BARS.map((bar, i) => {
            const y = 232 + i * 94;
            const p = bars[i] ?? 0;
            return (
              <g key={bar.badge}>
                <circle cx={110} cy={y} r={30} fill={bar.color} stroke={INK} strokeWidth={S} />
                <text x={110} y={y + 12} textAnchor="middle" fontFamily={TITLE_FONT} fontSize={32} fill="#ffffff">
                  {bar.badge}
                </text>
                <rect x={158} y={y - 20} width={300} height={40} rx={20} fill="#e2dccf" stroke={INK} strokeWidth={3} />
                <rect x={158} y={y - 20} width={Math.max(0, (300 * bar.pct * p) / 100)} height={40} rx={20} fill={bar.color} stroke={INK} strokeWidth={3} />
                <text x={540} y={y + 12} textAnchor="middle" fontFamily={TITLE_FONT} fontSize={40} fill={INK}>
                  {Math.round(bar.pct * p)}%
                </text>
                <text x={158} y={y + 38} fontFamily={TEXT_FONT} fontSize={18} fill="#7a7a7a">
                  {bar.votes}
                </text>
              </g>
            );
          })}
        </g>
        {plateIn > 0 && (
          <g transform={`translate(330 80) rotate(-3) scale(${plateIn})`}>
            <rect x={-240} y={-34} width={480} height={68} rx={14} fill={CHAR.gold} stroke={INK} strokeWidth={S + 1} />
            <text x={0} y={13} textAnchor="middle" fontFamily={TEXT_FONT} fontWeight={800} fontSize={34} fill={INK}>
              3 голоса — рекорд канала
            </text>
          </g>
        )}
      </HandDrawn>
      <g transform="translate(670 190)">
        <Character id="kostya" emotion={kostya} mode="head" height={380} boilSeed={boilSeed} {...kostyaLive} />
      </g>
    </Frame>
  );
}

// --- 5. График смен на столе: хозяйка обводит три фамилии красной ручкой ---------------------------

const SHIFT_NAMES = ['Бекс', 'Ахма', 'Надир'] as const;

export function ScheduleSheet({ circles }: { circles: ReadonlyArray<number> }) {
  return (
    <g transform="translate(640 478) rotate(-3)">
      <rect x={-88} y={-34} width={176} height={62} fill="#fffdf7" stroke={INK} strokeWidth={2.6} />
      <path d="M -88 -18 L 88 -18 M -88 -2 L 88 -2 M -88 14 L 88 14" stroke="#c9ccd2" strokeWidth={1.6} />
      {SHIFT_NAMES.map((name, i) => (
        <g key={name}>
          <text x={-76 + i * 58} y={-8 + (i % 2) * 16} fontFamily={HAND_FONT} fontSize={15} fill={INK}>
            {name}
          </text>
          {(circles[i] ?? 0) > 0 && (
            <ellipse
              cx={-60 + i * 58}
              cy={-12 + (i % 2) * 16}
              rx={26 * (circles[i] ?? 0)}
              ry={11 * (circles[i] ?? 0)}
              fill="none"
              stroke="#d6332a"
              strokeWidth={3}
            />
          )}
        </g>
      ))}
    </g>
  );
}

// --- 7. Подсобка: Бекс шёпотом по видеосвязи --------------------------------------------------------

type CallProps = { frame: number; kostya: EmotionName; kostyaLive?: LiveState; beks: EmotionName; beksLive?: LiveState; boilSeed?: number };

export function StoreroomCallScene({ frame, kostya, kostyaLive, beks, beksLive, boilSeed = 1 }: CallProps) {
  const tileY = 150;
  const tileH = 390;
  const sway = Math.sin(frame * 0.12) * 3;
  return (
    <Frame fill="#25232a">
      <HandDrawn seed={boilSeed}>
        <rect x={45} y={tileY} width={470} height={tileH} rx={22} fill="#e9e5db" stroke={INK} strokeWidth={S + 1} />
        <rect x={565} y={tileY} width={470} height={tileH} rx={22} fill="#2a2630" stroke={INK} strokeWidth={S + 1} />
        {[0, 1].map((row) => (
          <g key={row}>
            <rect x={585} y={tileY + 130 + row * 120} width={430} height={10} fill="#6a4a38" stroke={INK} strokeWidth={2.4} />
            {[0, 1, 2, 3].map((b) => (
              <rect key={b} x={600 + b * 104} y={tileY + 78 + row * 120} width={86} height={52} fill={['#b8864f', '#a06a3c', '#c9a06a', '#9a7a52'][b]} stroke={INK} strokeWidth={2.4} />
            ))}
          </g>
        ))}
        <g transform={`translate(${sway} 0)`}>
          <path d={`M 800 ${tileY} L 800 ${tileY + 40}`} stroke={INK} strokeWidth={3} />
          <circle cx={800} cy={tileY + 52} r={13} fill="#f2c14e" stroke={INK} strokeWidth={3} />
        </g>
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
          Бекс · подсобка
        </text>
      </g>
      <text x={540} y={125} textAnchor="middle" fontFamily={HAND_FONT} fontSize={30} fill={CHAR.shirt}>
        видеозвонок
      </text>
    </Frame>
  );
}

// --- 8. Монтаж «оформление»: Ахма с анкетой, Надир в очереди, Дима со штампом ---------------------------

// Огромная ручка в руке Ахмы; breakT 0…1 — как она ломается пополам (кисть правой руки ≈ (76,168) у Ахмы)
export function BigPenHeld({ breakT }: { breakT: number }) {
  const apart = breakT * 34;
  return (
    <g transform="translate(78 170) rotate(24)">
      <g transform={`translate(${-apart * 0.3} ${apart * 0.6}) rotate(${-breakT * 28})`}>
        <rect x={-6} y={-12} width={12} height={60} rx={5} fill="#3a6fd8" stroke={INK} strokeWidth={2.6} />
        <path d="M -6 48 L 0 62 L 6 48 Z" fill={INK} />
      </g>
      <g transform={`translate(${apart * 0.3} ${-apart * 0.5}) rotate(${breakT * 24} 0 -12)`}>
        <rect x={-6} y={-70} width={12} height={58} rx={5} fill="#3a6fd8" stroke={INK} strokeWidth={2.6} />
        <rect x={-6} y={-70} width={12} height={10} rx={4} fill={INK} />
      </g>
    </g>
  );
}

function PaperForm({ x, y, written }: { x: number; y: number; written: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(-3)`}>
      <rect x={-150} y={-190} width={300} height={380} fill="#fffdf7" stroke={INK} strokeWidth={S} />
      <text x={0} y={-146} textAnchor="middle" fontFamily={TITLE_FONT} fontSize={30} fill={INK}>
        АНКЕТА
      </text>
      {[-96, -50, -4, 42, 88, 134].map((ly, i) => (
        <g key={ly}>
          <path d={`M -120 ${ly} L 120 ${ly}`} stroke="#c9ccd2" strokeWidth={2} />
          <path d={`M -116 ${ly - 6} l ${i * 8 + 40} 0`} stroke="#3a6fd8" strokeWidth={4} strokeLinecap="round" opacity={Math.min(1, Math.max(0, written * 6 - i))} />
        </g>
      ))}
      <rect x={-120} y={150} width={240} height={26} fill="#ffe9e4" stroke="#d6332a" strokeWidth={2.4} />
      <text x={0} y={169} textAnchor="middle" fontFamily={TEXT_FONT} fontWeight={800} fontSize={17} fill="#d6332a">
        вредные привычки
      </text>
    </g>
  );
}

type FormSceneProps = { written: number; akhma: EmotionName; akhmaLive?: LiveState; breakT: number; boilSeed?: number };

export function FormScene({ written, akhma, akhmaLive, breakT, boilSeed = 1 }: FormSceneProps) {
  return (
    <Frame fill="#d9cfbb">
      <rect x={-200} y={560} width={1480} height={160} fill="#9c8467" />
      <HandDrawn seed={boilSeed}>
        <PaperForm x={250} y={350} written={written} />
        <rect x={-100} y={600} width={820} height={30} fill="#7a5236" stroke={INK} strokeWidth={S} />
      </HandDrawn>
      <SceneCharacter id="akhma" emotion={akhma} x={760} footY={760} height={640} boilSeed={boilSeed} held={<BigPenHeld breakT={breakT} />} {...akhmaLive} />
    </Frame>
  );
}

export function QueueScene({ frame, nadir, nadirLive, boilSeed = 1 }: { frame: number; nadir: EmotionName; nadirLive?: LiveState; boilSeed?: number }) {
  const hair = ['#2a2522', '#8a6440', '#7a3b2e', '#b9b7bd', '#1c1b1f'];
  return (
    <Frame fill="#e6e2d6">
      <rect x={-200} y={560} width={1480} height={160} fill="#b9b1a0" />
      <HandDrawn seed={boilSeed}>
        <rect x={720} y={150} width={300} height={260} fill="#f6f3ec" stroke={INK} strokeWidth={S} />
        <text x={870} y={206} textAnchor="middle" fontFamily={TITLE_FONT} fontSize={34} fill="#3a6fd8">
          МЕДКНИЖКА
        </text>
        <rect x={750} y={236} width={240} height={120} fill="#cfeaf6" stroke={INK} strokeWidth={S} />
        <path d="M 750 296 L 990 296 M 870 236 L 870 356" stroke={INK} strokeWidth={2.4} />
        {[0, 1, 2, 3].map((i) => (
          <CrowdHead key={i} x={120 + i * 130} y={430} r={38} hair={hair[i % hair.length]} phase={frame + i * 7} />
        ))}
      </HandDrawn>
      <SceneCharacter id="nadir" emotion={nadir} x={560} footY={760} height={640} boilSeed={boilSeed} {...nadirLive} />
    </Frame>
  );
}

// Штамп в руке Димы: lift 0…1 — поднят/опущен
function StampHeld({ lift }: { lift: number }) {
  return (
    <g transform={`translate(72 ${176 - lift * 40}) rotate(-6)`}>
      <rect x={-8} y={-44} width={16} height={34} rx={6} fill="#5a3a2a" stroke={INK} strokeWidth={2.4} />
      <rect x={-22} y={-12} width={44} height={14} rx={3} fill="#c2412f" stroke={INK} strokeWidth={2.4} />
    </g>
  );
}

export function StampScene({ frame, dima, boilSeed = 1 }: { frame: number; dima: EmotionName; boilSeed?: number }) {
  const phase = (frame % 24) / 24;
  const lift = Math.abs(Math.sin(phase * Math.PI));
  return (
    <Frame fill="#d9cfbb">
      <rect x={-200} y={570} width={1480} height={150} fill="#9c8467" />
      <HandDrawn seed={boilSeed}>
        <rect x={80} y={600} width={880} height={26} fill="#7a5236" stroke={INK} strokeWidth={S} />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${200 + i * 210} ${570 - i * 4}) rotate(${-4 + i * 4})`}>
            <rect x={-74} y={-36} width={148} height={64} fill="#fffdf7" stroke={INK} strokeWidth={2.6} />
            <path d="M -58 -18 L 58 -18 M -58 -4 L 40 -4" stroke="#c9ccd2" strokeWidth={2} />
            <path d="M 14 -2 l 12 12 l 26 -30" stroke="#3f7a5a" strokeWidth={6} fill="none" strokeLinecap="round" opacity={Math.min(1, Math.max(0, frame / 24 - i * 0.6))} />
          </g>
        ))}
      </HandDrawn>
      <SceneCharacter id="dima" emotion={dima} x={640} footY={770} height={600} boilSeed={boilSeed} held={<StampHeld lift={lift} />} />
    </Frame>
  );
}

// --- 10. Зеркало: Костя репетирует улыбку, получается оскал ---------------------------------------------

export function MirrorScene({ frame, emotion, boilSeed = 1 }: { frame: number; emotion: EmotionName; boilSeed?: number }) {
  const shake = Math.sin(frame * 0.7) * 1.4;
  return (
    <Frame fill="#35323b">
      <HandDrawn seed={boilSeed}>
        <ellipse cx={540} cy={380} rx={300} ry={330} fill="#8a6a4c" stroke={INK} strokeWidth={S + 2} />
        <ellipse cx={540} cy={380} rx={268} ry={300} fill="#cfe3ea" stroke={INK} strokeWidth={S} />
        <path d="M 330 230 L 420 130 M 360 300 L 520 130" stroke="#ffffff" strokeWidth={14} strokeLinecap="round" opacity={0.5} />
      </HandDrawn>
      <g transform={`translate(${540 - 190 + shake} ${380 - 190})`}>
        <Character id="kostya" emotion={emotion} mode="head" height={380} boilSeed={boilSeed} />
      </g>
    </Frame>
  );
}

// --- 12. Эдуард в камеру, рядом Костя -----------------------------------------------------------------------

type EduardCamProps = { eduard: EmotionName; eduardLive?: LiveState; kostya: EmotionName; kostyaLive?: LiveState; boilSeed?: number };

export function EduardCamScene({ eduard, eduardLive, kostya, kostyaLive, boilSeed = 1 }: EduardCamProps) {
  return (
    <Frame fill="#3a3640">
      <circle cx={420} cy={390} r={320} fill="#4a4552" />
      <g transform="translate(160 130)">
        <Character id="eduard" emotion={eduard} mode="head" height={520} boilSeed={boilSeed} {...eduardLive} />
      </g>
      <g transform="translate(720 330)">
        <Character id="kostya" emotion={kostya} mode="head" height={250} boilSeed={boilSeed} {...kostyaLive} />
      </g>
    </Frame>
  );
}

// --- 13. За стеной: Ахма и Надир подслушивают с чашками чая ------------------------------------------------------

type WallProps = { frame: number; akhma: EmotionName; akhmaLive?: LiveState; nadir: EmotionName; nadirLive?: LiveState; boilSeed?: number };

function Cup({ x, y, frame }: { x: number; y: number; frame: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M -16 0 L 16 0 L 12 26 L -12 26 Z" fill="#ffffff" stroke={INK} strokeWidth={3} />
      <path d="M 16 6 Q 28 8 16 20" stroke={INK} strokeWidth={3} fill="none" />
      <g transform="translate(0 -4) scale(0.5)">
        <Steam steam={1} phase={frame} wisps={2} spread={22} />
      </g>
    </g>
  );
}

export function WallScene({ frame, akhma, akhmaLive, nadir, nadirLive, boilSeed = 1 }: WallProps) {
  return (
    <Frame fill="#c9b99a">
      <rect x={-200} y={560} width={1480} height={160} fill="#8a7a62" />
      <HandDrawn seed={boilSeed}>
        <rect x={640} y={0} width={560} height={720} fill="#a65d45" stroke={INK} strokeWidth={S + 2} />
        <rect x={720} y={120} width={150} height={190} fill="#8a6a4c" stroke={INK} strokeWidth={S} />
        <rect x={738} y={138} width={114} height={154} fill="#d9cfbb" />
        <text x={880} y={470} fontFamily={HAND_FONT} fontSize={30} fill={CHAR.shirt} transform="rotate(-4 880 470)">
          за стеной: голоса…
        </text>
      </HandDrawn>
      <SceneCharacter id="akhma" emotion={akhma} x={340} footY={770} height={700} tilt={9} boilSeed={boilSeed} {...akhmaLive} />
      <SceneCharacter id="nadir" emotion={nadir} x={490} footY={770} height={600} tilt={8} boilSeed={boilSeed} {...nadirLive} />
      <Cup x={628} y={170} frame={frame} />
      <Cup x={628} y={330} frame={frame + 9} />
    </Frame>
  );
}

// --- 14. Закрытая дверь кабинета, Костя в камеру ---------------------------------------------------------------------

export function DoorScene({ kostya, kostyaLive, boilSeed = 1 }: { kostya: EmotionName; kostyaLive?: LiveState; boilSeed?: number }) {
  return (
    <Frame fill="#d9cfbb">
      <rect x={-200} y={600} width={1480} height={120} fill="#9c8467" />
      <HandDrawn seed={boilSeed}>
        <rect x={250} y={20} width={580} height={600} fill="#8a6a4c" stroke={INK} strokeWidth={S + 2} />
        <rect x={290} y={60} width={500} height={520} fill="#a47a52" stroke={INK} strokeWidth={S} />
        <rect x={420} y={76} width={240} height={52} rx={6} fill="#2b2a2e" stroke={INK} strokeWidth={S} />
        <text x={540} y={112} textAnchor="middle" fontFamily={TEXT_FONT} fontWeight={800} fontSize={26} fill={CHAR.shirt}>
          УПРАВЛЯЮЩИЙ
        </text>
        <circle cx={740} cy={360} r={12} fill={CHAR.gold} stroke={INK} strokeWidth={3} />
      </HandDrawn>
      <SceneCharacter id="kostya" emotion={kostya} x={540} footY={790} height={640} boilSeed={boilSeed} {...kostyaLive} />
    </Frame>
  );
}
