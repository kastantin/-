import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS } from '../../config';
import { Remark, Subtitle } from '../../layout/EpisodeFrame';
import { censorText, MatPlate, PopIn } from '../ep02/overlays';
import { COUNTER, FORK, MAT_SPOTS, REMARKS, sceneLength, SUBTITLES, type SceneId } from './timeline';

// Поверх сцен серии 4: субтитры (мат → 🤬), плашки 🤬 на рот, счётчик чеков в углу, титры «спасибо за идею»

export function SceneText({ scene }: { scene: SceneId }) {
  return (
    <>
      {REMARKS[scene].map((r) => (
        <Sequence key={r.text} from={r.from} durationInFrames={Math.max(1, r.to - r.from)} name={`ремарка: ${r.text}`}>
          <PopIn>
            <Remark text={r.text} />
          </PopIn>
        </Sequence>
      ))}
      {SUBTITLES[scene].map((cue) => {
        const text = censorText(cue.text, true);
        return (
          <Sequence key={cue.text} from={cue.from} durationInFrames={Math.max(1, cue.to - cue.from)} name={`реплика: ${text}`}>
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

// Счётчик «ЧЕКОВ НА СТОЛАХ КОСТИ»: растёт в первой половине серии, на нуле — зелёный «дзынь»
export function ChecksCounter({ scene }: { scene: SceneId }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const range = COUNTER[scene];
  if (!range) return null;
  const value = Math.round(interpolate(frame, [0, sceneLength(scene)], [range[0], range[1]], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const zero = value === 0;
  const pop = zero && scene === 'guest' ? spring({ frame, fps, config: { damping: 6, stiffness: 240 } }) : 0;
  const hot = value >= 20;
  return (
    <div
      style={{
        position: 'absolute',
        top: 128,
        left: 32,
        transform: `scale(${1 + pop * 0.25}) rotate(-1.5deg)`,
        transformOrigin: 'top left',
        background: zero ? '#3f9a5a' : hot ? '#d6332a' : 'rgba(30, 29, 33, 0.9)',
        border: `3px solid ${COLORS.ink}`,
        borderRadius: 14,
        padding: '6px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}
    >
      <span style={{ fontFamily: 'Segoe UI, Arial, sans-serif', fontWeight: 800, fontSize: 17, lineHeight: 1.1, letterSpacing: 1, color: COLORS.paper, maxWidth: 150 }}>
        ЧЕКОВ НА СТОЛАХ КОСТИ
      </span>
      <span style={{ fontFamily: 'Consolas, Courier New, monospace', fontWeight: 700, fontSize: 52, color: COLORS.paper }}>{value}</span>
    </div>
  );
}

// Титры: спасибо авторам идеи (в конце, на развилке)
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
          fontSize: 26,
          color: COLORS.ink,
          transform: 'rotate(-2deg)',
        }}
      >
        {FORK.credit}
      </div>
    </AbsoluteFill>
  );
}
