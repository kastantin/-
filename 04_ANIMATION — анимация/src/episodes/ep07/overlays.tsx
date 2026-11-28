import { interpolate, Sequence, useCurrentFrame } from 'remotion';
import { COLORS } from '../../config';
import { Subtitle } from '../../layout/EpisodeFrame';
import { censorText, PopIn } from '../ep02/overlays';
import { VerticalSubtitle } from '../ep06c/overlays';
import { useTimeline } from './context';
import type { SceneId } from './timeline';

// Поверх сцен серии 7: субтитры (в вертикали — в центральной трети; нижние ~20% и правый край свободны) и плашка сцены 2.
const VERTICAL_SUBTITLE_TOP = 640;

export function SceneText({ scene, v }: { scene: SceneId; v?: boolean }) {
  const tl = useTimeline();
  return (
    <>
      {tl.subtitles[scene].map((cue) => {
        const text = censorText(cue.text, true);
        return (
          <Sequence key={cue.text} from={cue.from} durationInFrames={Math.max(1, cue.to - cue.from)} name={`реплика: ${text}`}>
            <PopIn>{v ? <VerticalSubtitle text={text} highlight={cue.highlight} top={VERTICAL_SUBTITLE_TOP} /> : <Subtitle text={text} highlight={cue.highlight} />}</PopIn>
          </Sequence>
        );
      })}
    </>
  );
}

// Мелкая плашка итога прошлой серии: сцена 2
export function ChoicePlate({ scene, v }: { scene: SceneId; v?: boolean }) {
  const frame = useCurrentFrame();
  const tl = useTimeline();
  if (scene !== 'rule') return null;
  const p = interpolate(frame, [4, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const label = tl.variant === 'money' ? 'Вы выбрали: деньгами' : 'Вы выбрали: отзывом';
  return (
    <div style={{ position: 'absolute', top: v ? 90 : 128, left: 0, width: v ? 1080 : 1920, display: 'flex', justifyContent: 'center', opacity: p }}>
      <div style={{ background: 'rgba(30, 29, 33, 0.92)', border: `3px solid ${COLORS.ink}`, borderRadius: 12, padding: '4px 20px', fontFamily: 'Segoe UI, Arial, sans-serif', fontWeight: 700, fontSize: v ? 30 : 24, color: COLORS.paper }}>
        {label}
      </div>
    </div>
  );
}
