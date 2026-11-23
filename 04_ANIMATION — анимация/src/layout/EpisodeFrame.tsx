import { AbsoluteFill } from 'remotion';
import { COLORS } from '../config';

// Оформление кадра 16:9: сцена на весь экран, поверх — плашка серии, лестница карьеры, ремарка, субтитры

export const ACCENT = '#e5533d';
const HAND_FONT = 'Segoe Print, Comic Sans MS, sans-serif';
const TITLE_FONT = 'Segoe UI Black, Arial Black, sans-serif';
const PLATE_BG = 'rgba(30, 29, 33, 0.88)';

export const LADDER = ['Официант', 'Ст. официант', 'Администратор', 'Управляющий'] as const;

function SeriesPlate({ episode, title }: { episode: number; title: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 28,
        left: 32,
        background: PLATE_BG,
        border: `3px solid ${COLORS.ink}`,
        borderRadius: 18,
        padding: '8px 22px 10px',
      }}
    >
      <div style={{ fontFamily: TITLE_FONT, fontSize: 40, color: COLORS.paper, letterSpacing: 3, lineHeight: 1.1 }}>
        СКАТЕРТЬ
      </div>
      <div style={{ fontFamily: HAND_FONT, fontSize: 22, color: ACCENT }}>
        серия {episode} · {title}
      </div>
    </div>
  );
}

function Ladder({ step }: { step: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 34,
        right: 32,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: PLATE_BG,
        border: `3px solid ${COLORS.ink}`,
        borderRadius: 999,
        padding: '8px 10px',
      }}
    >
      {LADDER.map((label, i) => {
        const isCurrent = i === step;
        const isDone = i < step;
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                padding: '4px 12px',
                borderRadius: 999,
                background: isCurrent ? ACCENT : 'transparent',
                color: isCurrent || isDone ? COLORS.paper : '#8c8a90',
                fontFamily: 'Segoe UI, Arial, sans-serif',
                fontWeight: 700,
                fontSize: 19,
              }}
            >
              {label}
            </div>
            {i < LADDER.length - 1 && <div style={{ color: '#6b6970', fontSize: 19 }}>›</div>}
          </div>
        );
      })}
    </div>
  );
}

export function Remark({ text }: { text: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 130,
        left: '50%',
        transform: 'translateX(-50%) rotate(-0.6deg)',
        background: COLORS.paper,
        border: `3px solid ${COLORS.ink}`,
        borderRadius: 999,
        padding: '8px 30px',
        fontFamily: HAND_FONT,
        fontSize: 32,
        color: COLORS.ink,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
}

export interface SubtitleProps {
  text: string;
  highlight?: string;
}

// Тёмная обводка из теней по кругу — не «съедает» буквы, в отличие от text-stroke
const OUTLINE_SHADOW = Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2;
  return `${(Math.cos(a) * 4).toFixed(1)}px ${(Math.sin(a) * 4).toFixed(1)}px 0 ${COLORS.ink}`;
})
  .concat(`0 6px 0 ${COLORS.ink}`)
  .join(', ');

// Субтитры поверх сцены: тёмная обводка, чтобы читались на любом фоне
export function Subtitle({ text, highlight }: SubtitleProps) {
  const idx = highlight ? text.indexOf(highlight) : -1;
  const parts =
    idx >= 0 && highlight
      ? [text.slice(0, idx), highlight, text.slice(idx + highlight.length)]
      : [text, '', ''];
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 70,
        width: '100%',
        fontFamily: 'Segoe UI, Arial, sans-serif',
        fontWeight: 800,
        fontSize: 64,
        lineHeight: 1.15,
        letterSpacing: 1,
        wordSpacing: 10,
        color: COLORS.paper,
        textAlign: 'center',
        padding: '0 160px',
        boxSizing: 'border-box',
        textShadow: OUTLINE_SHADOW,
      }}
    >
      {parts[0]}
      <span style={{ color: ACCENT }}>{parts[1]}</span>
      {parts[2]}
    </div>
  );
}

interface EpisodeFrameProps {
  episode: number;
  title: string;
  ladderStep: number;
  remark?: string;
  subtitle?: SubtitleProps;
  children: React.ReactNode;
}

export function EpisodeFrame({ episode, title, ladderStep, remark, subtitle, children }: EpisodeFrameProps) {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <AbsoluteFill>{children}</AbsoluteFill>
      <SeriesPlate episode={episode} title={title} />
      <Ladder step={ladderStep} />
      {remark && <Remark text={remark} />}
      {subtitle && <Subtitle {...subtitle} />}
    </AbsoluteFill>
  );
}
