import { SCENE_VIEWBOX, VIDEO } from '../../config';
import { Character } from '../../characters/Character';
import { HandDrawn } from '../../characters/HandDrawn';
import { INK, TEXT_FONT } from './kit';

// Телефон с отзывом гостьи на картах: звёзды, текст, ответ ресторана, уведомление.
// Нарисован вокруг (0,0): корпус 400×700

const GOLD = '#f2b632';
const EMPTY = '#d4d0c8';

function starPath(cx: number, cy: number, r: number): string {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 === 0 ? r : r * 0.45;
    return `${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`;
  });
  return `M ${pts.join(' L ')} Z`;
}

export function Stars({ x, y, rating, size = 16, pop = 1 }: { x: number; y: number; rating: number; size?: number; pop?: number }) {
  return (
    <g>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < rating;
        const cx = x + i * size * 2.3;
        const s = filled ? pop : 1;
        return (
          <path
            key={i}
            d={starPath(0, 0, size)}
            transform={`translate(${cx} ${y}) scale(${s})`}
            fill={filled ? GOLD : EMPTY}
            stroke={INK}
            strokeWidth={2}
            strokeLinejoin="round"
          />
        );
      })}
    </g>
  );
}

export type ReplyState = { lines: ReadonlyArray<string>; chars: number; caret: boolean };
export type NotificationState = { progress: number; rating: number; text: string };

type ReviewPhoneProps = {
  rating: number;
  starPop?: number;
  reviewLines: ReadonlyArray<string>;
  reply?: ReplyState;
  notification?: NotificationState;
  boilSeed?: number;
};

// Сколько символов каждой строки уже «напечатано»
function typedLines(lines: ReadonlyArray<string>, chars: number): string[] {
  let left = chars;
  return lines.map((line) => {
    const shown = line.slice(0, Math.max(0, left));
    left -= line.length;
    return shown;
  });
}

function Reply({ reply }: { reply: ReplyState }) {
  const shown = typedLines(reply.lines, reply.chars);
  // каретка стоит в первой недопечатанной строке, а когда всё напечатано — в последней
  const typing = shown.findIndex((l, i) => l.length < reply.lines[i].length);
  const lastIdx = typing === -1 ? reply.lines.length - 1 : typing;
  return (
    <g>
      <rect x={-160} y={40} width={320} height={210} rx={18} fill="#e7f1ff" stroke="#9cb8e0" strokeWidth={2} />
      <text x={-140} y={74} fontFamily={TEXT_FONT} fontWeight={700} fontSize={19} fill="#3a6fd8">
        Ответ ресторана
      </text>
      {shown.map((line, i) => (
        <text key={reply.lines[i]} x={-140} y={112 + i * 34} fontFamily={TEXT_FONT} fontSize={23} fill={INK}>
          {line}
          {reply.caret && i === lastIdx ? '|' : ''}
        </text>
      ))}
    </g>
  );
}

function Notification({ n }: { n: NotificationState }) {
  if (n.progress <= 0) return null;
  const y = -420 + n.progress * 130;
  return (
    <g transform={`translate(0 ${y})`}>
      <rect x={-176} y={0} width={352} height={112} rx={20} fill="#ffffff" stroke={INK} strokeWidth={3} />
      <text x={-156} y={32} fontFamily={TEXT_FONT} fontWeight={700} fontSize={18} fill="#7a8090">
        Карты · новая оценка
      </text>
      <Stars x={-146} y={58} rating={n.rating} size={12} />
      <text x={-156} y={96} fontFamily={TEXT_FONT} fontSize={16} fill={INK}>
        {n.text}
      </text>
    </g>
  );
}

export function ReviewPhone({ rating, starPop = 1, reviewLines, reply, notification, boilSeed = 1 }: ReviewPhoneProps) {
  return (
    <g>
      <HandDrawn seed={boilSeed}>
        <rect x={-200} y={-350} width={400} height={700} rx={48} fill="#1f1f22" stroke={INK} strokeWidth={5} />
        <rect x={-180} y={-328} width={360} height={656} rx={32} fill="#f3f1ec" />
        <text x={0} y={-276} textAnchor="middle" fontFamily={TEXT_FONT} fontWeight={700} fontSize={22} fill={INK}>
          Отзывы · «Скатерть»
        </text>
        <path d="M -180 -256 L 180 -256" stroke="#d4d0c8" strokeWidth={2} />
        <rect x={-160} y={-236} width={320} height={250} rx={18} fill="#ffffff" stroke="#d4d0c8" strokeWidth={2} />
        <text x={-70} y={-196} fontFamily={TEXT_FONT} fontWeight={700} fontSize={22} fill={INK}>
          Гостья, стол 7
        </text>
        <Stars x={-60} y={-160} rating={rating} size={14} pop={starPop} />
        {reviewLines.map((line, i) => (
          <text key={line} x={-140} y={-100 + i * 34} fontFamily={TEXT_FONT} fontSize={24} fill={INK}>
            {line}
          </text>
        ))}
        {reply && <Reply reply={reply} />}
      </HandDrawn>
      <g transform="translate(-150 -226)">
        <Character id="guest" emotion={rating >= 4 ? 'happy' : 'angry'} mode="head" height={60} boilSeed={boilSeed} />
      </g>
      {notification && <Notification n={notification} />}
    </g>
  );
}

type PhoneReplySceneProps = Omit<ReviewPhoneProps, 'boilSeed'> & { boilSeed?: number; tilt?: number };

// Крупный план: телефон по центру
export function PhoneReplyScene({ tilt = -3, boilSeed = 1, ...phone }: PhoneReplySceneProps) {
  return (
    <svg width={VIDEO.width} height={VIDEO.height} viewBox={SCENE_VIEWBOX}>
      <rect x={-200} y={0} width={1480} height={720} fill="#3a3640" />
      <circle cx={540} cy={380} r={300} fill="#4a4552" />
      <g transform={`translate(540 372) scale(0.86) rotate(${tilt})`}>
        <ReviewPhone {...phone} boilSeed={boilSeed} />
      </g>
    </svg>
  );
}
