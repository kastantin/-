import { SCENE_VIEWBOX, VIDEO } from '../config';
import { HandDrawn } from '../characters/HandDrawn';
import { CHAR } from '../characters/palette';

// Сцена 7: развилка — три карточки выбора и призыв голосовать в Telegram
const INK = CHAR.ink;
const ACCENT = '#e5533d';
const TELEGRAM = '#2aabee';
const TEXT_FONT = 'Segoe UI, Arial, sans-serif';

const CARD_W = 330;
const CARD_H = 330;
const CARD_GAP = 40;
const CARD_TOP = 190;
const LINE_STEP = 42;

export type ForkOption = {
  // 'A' | 'B' — буква на значке, 'custom' — значок «облачко с точками» (свой вариант)
  badge: 'А' | 'Б' | 'custom';
  lines: string[];
  color: string;
  // 0 — ещё нет, 1 — на месте
  progress: number;
};

function CustomBadgeIcon() {
  return (
    <g>
      <path d="M -26 -18 Q -26 -28 -16 -28 L 16 -28 Q 26 -28 26 -18 L 26 6 Q 26 16 16 16 L -6 16 L -18 28 L -16 16 Q -26 16 -26 6 Z" fill={CHAR.shirt} stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
      {[-12, 0, 12].map((x) => (
        <circle key={x} cx={x} cy={-6} r={3.5} fill={INK} />
      ))}
    </g>
  );
}

function OptionCard({ option, index, wobble }: { option: ForkOption; index: number; wobble: number }) {
  if (option.progress <= 0) return null;
  const totalW = CARD_W * 3 + CARD_GAP * 2;
  const cx = 540 - totalW / 2 + CARD_W / 2 + index * (CARD_W + CARD_GAP);
  const cy = CARD_TOP + CARD_H / 2;
  const angle = (index - 1) * 2.5 + wobble;
  const lift = (1 - option.progress) * 80;
  // текст центрируется в свободной части карточки — под значком
  const textCenter = 45;
  const textTop = textCenter - ((option.lines.length - 1) * LINE_STEP) / 2 + 11;
  return (
    <g opacity={Math.min(1, option.progress * 1.4)} transform={`translate(${cx} ${cy + lift}) rotate(${angle}) scale(${0.7 + 0.3 * option.progress})`}>
      <rect x={-CARD_W / 2 + 8} y={-CARD_H / 2 + 10} width={CARD_W} height={CARD_H} rx={22} fill={INK} opacity={0.4} />
      <rect x={-CARD_W / 2} y={-CARD_H / 2} width={CARD_W} height={CARD_H} rx={22} fill={CHAR.shirt} stroke={INK} strokeWidth={5} />
      <g transform={`translate(0 ${-CARD_H / 2 + 70})`}>
        <circle cx={0} cy={0} r={46} fill={option.color} stroke={INK} strokeWidth={4} />
        {option.badge === 'custom' ? (
          <CustomBadgeIcon />
        ) : (
          <text x={0} y={18} textAnchor="middle" fontFamily="Segoe UI Black, Arial Black, sans-serif" fontSize={52} fill={CHAR.shirt}>
            {option.badge}
          </text>
        )}
      </g>
      {option.lines.map((line, i) => (
        <text key={line} x={0} y={textTop + i * LINE_STEP} textAnchor="middle" fontFamily={TEXT_FONT} fontWeight={800} fontSize={32} fill={INK}>
          {line}
        </text>
      ))}
    </g>
  );
}

function PaperPlane() {
  return <path d="M -24 0 L 22 -18 L 12 20 L 0 8 Z M 0 8 L 22 -18" fill={CHAR.shirt} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />;
}

// Плашка «Голосуй в Telegram»; pulse — текущий масштаб «дыхания»
function VoteBanner({ text, progress, pulse }: { text: string; progress: number; pulse: number }) {
  if (progress <= 0) return null;
  const w = 520;
  const h = 76;
  return (
    <g opacity={progress} transform={`translate(540 ${600 + (1 - progress) * 60}) scale(${pulse})`}>
      <rect x={-w / 2 + 6} y={-h / 2 + 8} width={w} height={h} rx={h / 2} fill={INK} opacity={0.4} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={TELEGRAM} stroke={INK} strokeWidth={4} />
      <g transform={`translate(${-w / 2 + 52} 0)`}>
        <PaperPlane />
      </g>
      <text x={30} y={13} textAnchor="middle" fontFamily="Segoe UI Black, Arial Black, sans-serif" fontSize={36} fill={CHAR.shirt}>
        {text}
      </text>
    </g>
  );
}

interface ForkSceneProps {
  options: ForkOption[];
  voteText: string;
  voteProgress: number;
  votePulse: number;
  wobble: number;
  boilSeed?: number;
  // мелкая подпись под плашкой голосования (серия 2)
  footnote?: { text: string; progress: number };
}

export function ForkScene({ options, voteText, voteProgress, votePulse, wobble, boilSeed = 1, footnote }: ForkSceneProps) {
  return (
    <svg width={VIDEO.width} height={VIDEO.height} viewBox={SCENE_VIEWBOX}>
      <rect x={-200} y={0} width={1480} height={720} fill="#2b2a2e" />
      <circle cx={540} cy={360} r={420} fill="#34323a" />
      <HandDrawn seed={boilSeed}>
        {options.map((option, i) => (
          <OptionCard key={option.lines.join(' ')} option={option} index={i} wobble={wobble * (i % 2 === 0 ? 1 : -1)} />
        ))}
        <VoteBanner text={voteText} progress={voteProgress} pulse={votePulse} />
      </HandDrawn>
      {footnote && footnote.progress > 0 && (
        <text x={540} y={686} textAnchor="middle" opacity={footnote.progress} fontFamily="Segoe Print, Comic Sans MS, sans-serif" fontSize={24} fill={CHAR.shirt}>
          {footnote.text}
        </text>
      )}
    </svg>
  );
}

export const FORK_COLORS = { a: ACCENT, b: '#3f7a5a', custom: TELEGRAM } as const;
