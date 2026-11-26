import { Character, SceneCharacter, type CharacterId } from '../characters/Character';
import { GenaLadleInHand } from '../characters/parts';
import { AkhmaHeld } from '../characters/parts-ep03';
import type { EmotionName } from '../characters/expressions';
import { HandDrawn } from '../characters/HandDrawn';
import { CHAR } from '../characters/palette';
import { ACCENT } from '../layout/EpisodeFrame';

// Вертикальная обложка серии для TikTok, 1080×1920.
// В сетке профиля TikTok показывает центр 3:4 (y ≈ 240…1680) — всё важное внутри
export const COVER = { width: 1080, height: 1920 } as const;

const INK = CHAR.ink;
const TITLE_FONT = 'Segoe UI Black, Arial Black, sans-serif';
const TEXT_FONT = 'Segoe UI, Arial, sans-serif';
const HAND_FONT = 'Segoe Print, Comic Sans MS, sans-serif';

// Костя крупно: голова r≈230, центр (540, 1060)
const KOSTYA = { x: 540, height: 1530 };
const SCALE = KOSTYA.height / 400;
const HEAD = { x: 540, y: 1060, r: 60 * SCALE };
const FOOT_Y = HEAD.y - 80 * SCALE + KOSTYA.height;
// подобран так, чтобы «БЕЗ СМАЙЛИКА.» помещалось в 1080 с полями
const HEADLINE_FONT_SIZE = 96;

export type TikTokCoverProps = {
  episode: number;
  series: string;
  sender: string;
  message: string[];
  time: string;
  headline: string;
  caption: string;
  emotion: EmotionName;
  // герой обложки и аватар в пузыре (по умолчанию — Костя и Эдуард, как в серии 1)
  hero?: CharacterId;
  avatar?: CharacterId;
  avatarEmotion?: EmotionName;
  // несколько героев в ряд вместо одного (серия 3: команда друзей); тогда hero и emotion не используются
  crew?: ReadonlyArray<CrewMember>;
  // размер шрифта заголовка, если он длиннее обычного («ХОЛОДНАЯ ВОЙНА.»)
  headlineSize?: number;
};

export type CrewMember = { id: CharacterId; x: number; height: number; footY: number; emotion: EmotionName };

function PanicRays() {
  const rays = Array.from({ length: 20 }, (_, i) => (i / 20) * Math.PI * 2);
  return (
    <g>
      {rays.map((a) => {
        const p1 = `${HEAD.x + Math.cos(a) * 1600} ${HEAD.y + Math.sin(a) * 1600}`;
        const p2 = `${HEAD.x + Math.cos(a + 0.15) * 1600} ${HEAD.y + Math.sin(a + 0.15) * 1600}`;
        return <path key={a} d={`M ${HEAD.x} ${HEAD.y} L ${p1} L ${p2} Z`} fill="#45404d" />;
      })}
      <circle cx={HEAD.x} cy={HEAD.y} r={HEAD.r + 120} fill="#524b5c" />
    </g>
  );
}

function Halftone() {
  const dots: { x: number; y: number; r: number }[] = [];
  for (let y = 20; y < COVER.height; y += 40) {
    for (let x = 20; x < COVER.width; x += 40) {
      const r = Math.max(0, (Math.hypot(x - HEAD.x, y - HEAD.y) - 520) / 90);
      if (r > 0.6) dots.push({ x: x + ((y / 40) % 2) * 20, y, r: Math.min(r, 8) });
    }
  }
  return (
    <g fill="#2b2a2e" opacity={0.6}>
      {dots.map((d) => (
        <circle key={`${d.x}-${d.y}`} cx={d.x} cy={d.y} r={d.r} />
      ))}
    </g>
  );
}

function SeriesPlate({ series, episode }: { series: string; episode: number }) {
  return (
    <g transform="rotate(-2 540 300)">
      <rect x={250} y={250} width={580} height={96} rx={48} fill={INK} stroke={CHAR.shirt} strokeWidth={5} />
      <text x={540} y={316} textAnchor="middle" fontFamily={TITLE_FONT} fontSize={50} letterSpacing={4} fill={CHAR.shirt}>
        {series} · <tspan fill={ACCENT}>серия {episode}</tspan>
      </text>
    </g>
  );
}

// Сообщение начальника — пузырь чата с аватаром
function ChatBubble({ sender, message, time, avatar, avatarEmotion }: { sender: string; message: string[]; time: string; avatar: CharacterId; avatarEmotion: EmotionName }) {
  const x = 150;
  const y = 400;
  const w = 780;
  const h = 120 + message.length * 66;
  return (
    <g transform={`rotate(3 540 ${y + h / 2})`}>
      <rect x={x + 10} y={y + 14} width={w} height={h} rx={34} fill={INK} opacity={0.45} />
      <rect x={x} y={y} width={w} height={h} rx={34} fill="#ffffff" stroke={INK} strokeWidth={6} />
      <path d={`M ${x + 60} ${y + h - 4} L ${x + 30} ${y + h + 50} L ${x + 120} ${y + h - 4} Z`} fill="#ffffff" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <rect x={x + 56} y={y + h - 10} width={70} height={12} fill="#ffffff" />
      <g transform={`translate(${x + 28} ${y + 18})`}>
        <Character id={avatar} emotion={avatarEmotion} mode="head" height={86} boilSeed={2} />
      </g>
      <text x={x + 128} y={y + 72} fontFamily={TEXT_FONT} fontWeight={700} fontSize={38} fill={INK}>
        {sender}
      </text>
      {message.map((line, i) => (
        <text key={line} x={x + 40} y={y + 160 + i * 66} fontFamily={TEXT_FONT} fontSize={54} fill={INK}>
          {line}
        </text>
      ))}
      <text x={x + w - 34} y={y + h - 26} textAnchor="end" fontFamily={TEXT_FONT} fontSize={30} fill="#8a90a0">
        {time}
      </text>
    </g>
  );
}

// Капли пота и штрихи паники вокруг головы
function PanicMarks({ drops: showDrops = true }: { drops?: boolean }) {
  const marks = [-2.6, -2.3, -0.8, -0.5];
  const drops = [
    { a: -0.25, d: 70 },
    { a: -2.95, d: 60 },
  ];
  return (
    <g>
      <g stroke={CHAR.shirt} strokeWidth={12} strokeLinecap="round">
        {marks.map((a, i) => {
          const r0 = HEAD.r + 40;
          const len = i % 2 === 0 ? 70 : 50;
          return (
            <path key={a} d={`M ${HEAD.x + Math.cos(a) * r0} ${HEAD.y + Math.sin(a) * r0} L ${HEAD.x + Math.cos(a) * (r0 + len)} ${HEAD.y + Math.sin(a) * (r0 + len)}`} />
          );
        })}
      </g>
      {showDrops && drops.map((d) => {
        const cx = HEAD.x + Math.cos(d.a) * (HEAD.r + d.d);
        const cy = HEAD.y + Math.sin(d.a) * (HEAD.r + d.d);
        return (
          <path key={d.a} d={`M ${cx} ${cy - 40} Q ${cx - 26} ${cy} ${cx} ${cy + 14} Q ${cx + 26} ${cy} ${cx} ${cy - 40} Z`} fill={CHAR.sweat} stroke={INK} strokeWidth={5} />
        );
      })}
    </g>
  );
}

// Главная фраза серии крупно, с толстой тёмной обводкой
function Headline({ text, size = HEADLINE_FONT_SIZE }: { text: string; size?: number }) {
  return (
    <g transform="rotate(-3 540 1500)">
      <text
        x={540}
        y={1530}
        textAnchor="middle"
        fontFamily={TITLE_FONT}
        fontSize={size}
        letterSpacing={7}
        wordSpacing={28}
        fill={ACCENT}
        stroke={INK}
        strokeWidth={15}
        strokeLinejoin="round"
        paintOrder="stroke"
      >
        {text}
      </text>
    </g>
  );
}

export function TikTokCover({
  episode,
  series,
  sender,
  message,
  time,
  headline,
  caption,
  emotion,
  hero = 'kostya',
  avatar = 'eduard',
  avatarEmotion = 'tired',
  crew,
  headlineSize,
}: TikTokCoverProps) {
  // у Гены высокий колпак — опускаем героя, чтобы колпак не упирался в пузырь
  const heroShift = hero === 'gena' ? 110 : 0;
  return (
    <svg width={COVER.width} height={COVER.height} viewBox={`0 0 ${COVER.width} ${COVER.height}`}>
      <rect width={COVER.width} height={COVER.height} fill="#3a3640" />
      <PanicRays />
      <Halftone />
      {crew &&
        crew.map((member) => (
          <SceneCharacter
            key={member.id}
            id={member.id}
            emotion={member.emotion}
            x={member.x}
            footY={member.footY}
            height={member.height}
            boilSeed={4}
            held={member.id === 'akhma' ? <AkhmaHeld /> : undefined}
          />
        ))}
      {!crew && (
      <g transform={`translate(0 ${heroShift})`}>
      <SceneCharacter
        id={hero}
        emotion={emotion}
        x={KOSTYA.x}
        footY={FOOT_Y}
        height={KOSTYA.height}
        boilSeed={4}
        held={hero === 'gena' ? <GenaLadleInHand angle={-30} /> : undefined}
      />
      </g>
      )}
      <HandDrawn seed={4} strength={3}>
        {!crew && (
          <g transform={`translate(0 ${heroShift})`}>
            <PanicMarks drops={emotion === 'panic'} />
          </g>
        )}
        <SeriesPlate series={series} episode={episode} />
        <ChatBubble sender={sender} message={message} time={time} avatar={avatar} avatarEmotion={avatarEmotion} />
      </HandDrawn>
      <Headline text={headline} size={headlineSize} />
      <text
        x={540}
        y={1645}
        textAnchor="middle"
        fontFamily={HAND_FONT}
        fontSize={50}
        fill={CHAR.shirt}
        stroke={INK}
        strokeWidth={10}
        paintOrder="stroke"
        transform="rotate(-3 540 1630)"
      >
        {caption}
      </text>
    </svg>
  );
}
