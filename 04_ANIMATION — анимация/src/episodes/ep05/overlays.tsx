import { interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS } from '../../config';
import { Remark, Subtitle } from '../../layout/EpisodeFrame';
import { censorText, MatPlate, PopIn } from '../ep02/overlays';
import { MAT_SPOTS, REMARKS, SUBTITLES, TIMER_LABEL, type SceneId } from './timeline';

// Поверх сцен серии 5: субтитры (мат → 🤬), плашки 🤬 на рот, таймер «ДО ПЯТНИЦЫ» в углу

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

// Таймер «ДО ПЯТНИЦЫ: 3 ДНЯ» с кабинета; в сцене 11 меняется на «2 ДНЯ» и «подпрыгивает»
export function FridayTimer({ scene }: { scene: SceneId }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const label = TIMER_LABEL[scene];
  if (!label) return null;
  const isFirst = scene === 'office1';
  const isChange = scene === 'office2';
  const pop = isFirst || isChange ? spring({ frame, fps, config: { damping: 7, stiffness: 220 } }) : 1;
  const fade = interpolate(frame, [0, 6], [isFirst ? 0 : 1, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div
      style={{
        position: 'absolute',
        top: 128,
        left: 32,
        opacity: fade,
        transform: `scale(${isFirst || isChange ? 0.7 + 0.3 * pop : 1}) rotate(-1.5deg)`,
        transformOrigin: 'top left',
        background: isChange ? '#d6332a' : 'rgba(30, 29, 33, 0.9)',
        border: `3px solid ${COLORS.ink}`,
        borderRadius: 14,
        padding: '6px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}
    >
      <span style={{ fontFamily: 'Segoe UI, Arial, sans-serif', fontWeight: 800, fontSize: 18, letterSpacing: 1, color: COLORS.paper }}>ДО ПЯТНИЦЫ</span>
      <span style={{ fontFamily: 'Segoe UI Black, Arial Black, sans-serif', fontSize: 40, color: isChange ? COLORS.paper : '#ff5a4a' }}>{label}</span>
    </div>
  );
}
