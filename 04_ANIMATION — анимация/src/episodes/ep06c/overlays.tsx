import { interpolate, Sequence, useCurrentFrame } from 'remotion';
import { COLORS } from '../../config';
import { ACCENT, Subtitle } from '../../layout/EpisodeFrame';
import { censorText, PopIn } from '../ep02/overlays';
import { SUBTITLES, type SceneId } from './timeline';

// Поверх сцен серии 6 «На чай»: субтитры (в вертикали — над лицами, нижние ~20% и правый край свободны) и плашка сц. 2.

const OUTLINE = Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2;
  return `${(Math.cos(a) * 4).toFixed(1)}px ${(Math.sin(a) * 4).toFixed(1)}px 0 ${COLORS.ink}`;
})
  .concat(`0 6px 0 ${COLORS.ink}`)
  .join(', ');

export function VerticalSubtitle({ text, highlight, top = 260 }: { text: string; highlight?: string; top?: number }) {
  const idx = highlight ? text.indexOf(highlight) : -1;
  const parts = idx >= 0 && highlight ? [text.slice(0, idx), highlight, text.slice(idx + highlight.length)] : [text, '', ''];
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: 90,
        width: 900,
        fontFamily: 'Segoe UI, Arial, sans-serif',
        fontWeight: 800,
        fontSize: text.length > 60 ? 54 : 70,
        lineHeight: 1.12,
        wordSpacing: 8,
        color: COLORS.paper,
        textAlign: 'center',
        padding: '0 70px',
        boxSizing: 'border-box',
        textShadow: OUTLINE,
      }}
    >
      {parts[0]}
      <span style={{ color: ACCENT }}>{parts[1]}</span>
      {parts[2]}
    </div>
  );
}

export function SceneText({ scene, v }: { scene: SceneId; v?: boolean }) {
  return (
    <>
      {SUBTITLES[scene].map((cue) => {
        const text = censorText(cue.text, true);
        return (
          <Sequence key={cue.text} from={cue.from} durationInFrames={Math.max(1, cue.to - cue.from)} name={`реплика: ${text}`}>
            <PopIn>{v ? <VerticalSubtitle text={text} highlight={cue.highlight} /> : <Subtitle text={text} highlight={cue.highlight} />}</PopIn>
          </Sequence>
        );
      })}
    </>
  );
}

// Мелкая плашка итога прошлой серии: сц. 2
export function ChoicePlate({ scene, v }: { scene: SceneId; v?: boolean }) {
  const frame = useCurrentFrame();
  if (scene !== 'rule') return null;
  const p = interpolate(frame, [4, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', top: v ? 90 : 128, left: 0, width: v ? 1080 : 1920, display: 'flex', justifyContent: 'center', opacity: p }}>
      <div style={{ background: 'rgba(30, 29, 33, 0.92)', border: `3px solid ${COLORS.ink}`, borderRadius: 12, padding: '4px 20px', fontFamily: 'Segoe UI, Arial, sans-serif', fontWeight: 700, fontSize: v ? 30 : 24, color: COLORS.paper }}>
        Вы выбрали: честно соревноваться
      </div>
    </div>
  );
}
