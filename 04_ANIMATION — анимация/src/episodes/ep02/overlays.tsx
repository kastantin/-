import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS } from '../../config';
import { ACCENT, Remark, Subtitle } from '../../layout/EpisodeFrame';
import { MAT_SPOTS, REMARKS, SUBTITLES, TIMER, type SceneId } from './timeline';

// Поверх сцен серии 2: субтитры (с цензурой мата для TikTok), плашки 🤬 на рот, таймер «ДО УТРА»

const CUE_POP_FRAMES = 4;
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
// сцена 1080×720 растянута на 1920×1080 с полями по 100 единиц слева и справа
const SCENE_TO_SCREEN = 1.5;
const SCENE_MARGIN = 100;
const MAT_EMOJI = '🤬';

// [[слово]] → слово (Telegram) или 🤬 (TikTok)
export function censorText(text: string, censored: boolean): string {
  return text.replace(/\[\[(.+?)\]\]/g, (_, word: string) => (censored ? MAT_EMOJI : word));
}

export function PopIn({ children }: { children: React.ReactNode }) {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, CUE_POP_FRAMES], [0, 1], CLAMP);
  return <AbsoluteFill style={{ opacity: p, transform: `translateY(${(1 - p) * 12}px)` }}>{children}</AbsoluteFill>;
}

export function SceneText({ scene, censored }: { scene: SceneId; censored: boolean }) {
  return (
    <>
      {REMARKS[scene].map((r) => (
        <Sequence key={r.text} from={r.from} durationInFrames={r.to - r.from} name={`ремарка: ${r.text}`}>
          <PopIn>
            <Remark text={r.text} />
          </PopIn>
        </Sequence>
      ))}
      {SUBTITLES[scene].map((cue) => {
        const text = censorText(cue.text, censored);
        return (
          <Sequence key={cue.text} from={cue.from} durationInFrames={cue.to - cue.from} name={`реплика: ${text}`}>
            <PopIn>
              <Subtitle text={text} highlight={cue.highlight} />
            </PopIn>
          </Sequence>
        );
      })}
    </>
  );
}

export function MatPlate({ x, y, size }: { x: number; y: number; size: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 9, stiffness: 220 } });
  const px = (x + SCENE_MARGIN) * SCENE_TO_SCREEN;
  const py = y * SCENE_TO_SCREEN;
  const s = size * SCENE_TO_SCREEN;
  return (
    <div
      style={{
        position: 'absolute',
        left: px - s / 2,
        top: py - s / 2,
        width: s,
        height: s,
        fontSize: s * 0.82,
        lineHeight: `${s}px`,
        textAlign: 'center',
        transform: `scale(${pop}) rotate(${Math.sin(frame * 0.9) * 6}deg)`,
        fontFamily: 'Segoe UI Emoji, Apple Color Emoji, sans-serif',
      }}
    >
      {MAT_EMOJI}
    </div>
  );
}

// Плашка 🤬 закрывает рот, пока звучит мат (только в версии для TikTok)
export function MatPlates({ scene }: { scene: SceneId }) {
  return (
    <>
      {MAT_SPOTS.filter((m) => m.scene === scene).map((m) => (
        <Sequence key={`${m.scene}-${m.from}`} from={m.from} durationInFrames={m.to - m.from} name="🤬">
          <MatPlate x={m.x} y={m.y} size={m.size} />
        </Sequence>
      ))}
    </>
  );
}

function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return [hh, mm, ss].map((v) => String(v).padStart(2, '0')).join(':');
}

// Таймер «ДО УТРА» в углу: ночь пролетает за серию, в сцене 13 — 00:00:00 и «дзынь»
export function MorningTimer() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < TIMER.from || frame >= TIMER.hideAt) return null;
  const appear = spring({ frame: frame - TIMER.from, fps, config: { damping: 12 } });
  const remaining = interpolate(frame, [TIMER.from, TIMER.zeroAt], [TIMER.startSeconds, 0], CLAMP);
  const isZero = frame >= TIMER.zeroAt;
  // «дзынь»: таймер подпрыгивает и остаётся чуть крупнее
  const ding = isZero ? interpolate(frame - TIMER.zeroAt, [0, 4, 14], [1.4, 1.22, 1.1], CLAMP) : 1;
  const scale = appear * ding;
  return (
    <div
      style={{
        position: 'absolute',
        top: 34,
        left: '50%',
        transform: `translateX(-50%) scale(${scale})`,
        transformOrigin: 'top center',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: isZero ? ACCENT : 'rgba(30, 29, 33, 0.9)',
        border: `3px solid ${COLORS.ink}`,
        borderRadius: 16,
        padding: '6px 20px',
      }}
    >
      <span style={{ fontFamily: 'Segoe UI, Arial, sans-serif', fontWeight: 800, fontSize: 22, color: COLORS.paper, letterSpacing: 2 }}>
        ДО УТРА
      </span>
      <span style={{ fontFamily: 'Consolas, Courier New, monospace', fontWeight: 700, fontSize: 44, color: isZero ? COLORS.paper : '#ff5a4a' }}>
        {formatClock(remaining)}
      </span>
    </div>
  );
}
