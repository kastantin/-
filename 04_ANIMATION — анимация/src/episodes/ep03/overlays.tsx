import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS } from '../../config';
import { ACCENT, Remark, Subtitle } from '../../layout/EpisodeFrame';
import { censorText, MatPlate, PopIn } from '../ep02/overlays';
import { BANQUET_CLOCK, BANQUET_ITEMS, FORK, MAT_SPOTS, REMARKS, SUBTITLES, type SceneId } from './timeline';

// Поверх сцен серии 3: субтитры (мат → 🤬), плашки 🤬 на рот, тайминг банкета в углу, титры «идея серии: me»

export function SceneText({ scene }: { scene: SceneId }) {
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
        const text = censorText(cue.text, true);
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

// Плашка 🤬 закрывает рот, пока звучит мат
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

// Тайминг банкета в углу: время и текущий пункт; когда горячее вынесли раньше срока — красная плашка «РАНО!»
export function BanquetClock({ scene }: { scene: SceneId }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const state = BANQUET_CLOCK[scene];
  if (!state) return null;
  const appear = spring({ frame, fps, config: { damping: 12 } });
  const blink = state.alarm && Math.floor(frame / 6) % 2 === 0;
  return (
    <div
      style={{
        position: 'absolute',
        top: 34,
        left: '50%',
        transform: `translateX(-50%) scale(${appear})`,
        transformOrigin: 'top center',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: state.alarm && blink ? ACCENT : 'rgba(30, 29, 33, 0.9)',
        border: `3px solid ${COLORS.ink}`,
        borderRadius: 16,
        padding: '6px 20px',
      }}
    >
      <span style={{ fontFamily: 'Consolas, Courier New, monospace', fontWeight: 700, fontSize: 44, color: COLORS.paper }}>{state.time}</span>
      <span style={{ fontFamily: 'Segoe UI, Arial, sans-serif', fontWeight: 800, fontSize: 24, letterSpacing: 1, color: '#f2c14e' }}>
        {state.alarm ? 'РАНО! ' : ''}
        {BANQUET_ITEMS[state.active].toUpperCase()}
      </span>
    </div>
  );
}

// Титры: идея серии принадлежит зрителю (в конце, на развилке)
export function Credit() {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [FORK.creditAt, FORK.creditAt + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (p <= 0) return null;
  return (
    <AbsoluteFill style={{ opacity: p, transform: `translateY(${(1 - p) * 12}px)` }}>
      <div
        style={{
          position: 'absolute',
          top: 128,
          left: 32,
          background: '#f2c14e',
          border: `3px solid ${COLORS.ink}`,
          borderRadius: 999,
          padding: '6px 22px',
          fontFamily: 'Segoe Print, Comic Sans MS, sans-serif',
          fontSize: 28,
          color: COLORS.ink,
          transform: 'rotate(-2deg)',
        }}
      >
        {FORK.credit}
      </div>
    </AbsoluteFill>
  );
}
