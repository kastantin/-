import { interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS } from '../../config';
import { ACCENT, Remark, Subtitle } from '../../layout/EpisodeFrame';
import { censorText, PopIn } from '../ep02/overlays';
import { PollTicker, Scoreboard, ShiftTimer, Stopwatch } from '../../scenes/ep06/hud';
import { FPS, REMARKS, SCORE, SCORE_FLASH, STOPWATCH_START, SUBTITLES, TIMER_LABEL, type SceneId } from './timeline';

// Поверх сцен серии 6: субтитры (мат → 🤬), табло счёта, таймер смены, секундомер, бегущая строка, плашки.
// v — вертикаль 9:16: субтитры в центральной трети, нижние ~20% и правый край свободны под интерфейс TikTok.

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const OUTLINE = Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2;
  return `${(Math.cos(a) * 4).toFixed(1)}px ${(Math.sin(a) * 4).toFixed(1)}px 0 ${COLORS.ink}`;
})
  .concat(`0 6px 0 ${COLORS.ink}`)
  .join(', ');

function VerticalSubtitle({ text, highlight }: { text: string; highlight?: string }) {
  const idx = highlight ? text.indexOf(highlight) : -1;
  const parts = idx >= 0 && highlight ? [text.slice(0, idx), highlight, text.slice(idx + highlight.length)] : [text, '', ''];
  return (
    <div
      style={{
        position: 'absolute',
        top: 480,
        left: 90,
        width: 900,
        fontFamily: 'Segoe UI, Arial, sans-serif',
        fontWeight: 800,
        fontSize: 70,
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
      {REMARKS[scene].map((r) => (
        <Sequence key={r.text} from={r.from} durationInFrames={Math.max(1, r.to - r.from)} name={`ремарка: ${r.text}`}>
          <PopIn>
            {v ? (
              <div style={{ position: 'absolute', top: 430, left: 90, width: 900, textAlign: 'center' }}>
                <Remark text={r.text} />
              </div>
            ) : (
              <Remark text={r.text} />
            )}
          </PopIn>
        </Sequence>
      ))}
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

function QqeboPlate() {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [24, 32], [0, 1], CLAMP);
  return (
    <div style={{ position: 'absolute', top: 220, left: 0, width: 1920, display: 'flex', justifyContent: 'center', opacity: p, transform: `translateY(${(1 - p) * 14}px)` }}>
      <div style={{ background: '#f2c14e', border: `3px solid ${COLORS.ink}`, borderRadius: 12, padding: '6px 22px', fontFamily: 'Segoe Print, Comic Sans MS, sans-serif', fontSize: 30, color: COLORS.ink, transform: 'rotate(-2deg)' }}>
        совпало с комментарием qqebo
      </div>
    </div>
  );
}

// Табло, таймер смены, секундомер, бегущая строка опроса
export function Hud({ scene, v }: { scene: SceneId; v?: boolean }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [kostya, beks] = SCORE[scene];
  const flash = SCORE_FLASH[scene];
  const hot = flash ? frame >= flash.at && frame < flash.at + 24 : false;
  const timer = TIMER_LABEL[scene];
  const stopStart = STOPWATCH_START[scene];
  const pop = flash ? spring({ frame: frame - flash.at, fps, config: { damping: 7, stiffness: 220 } }) : 1;
  return (
    <>
      <div style={{ position: 'absolute', top: v ? 70 : 28, left: 0, width: v ? 1080 : 1920, display: 'flex', justifyContent: 'center', transform: `scale(${hot ? 1 + 0.12 * pop : 1})` }}>
        <Scoreboard kostya={kostya} beks={beks} scale={v ? 1.35 : 1} flash={hot ? flash?.who : undefined} />
      </div>
      {timer && (
        <div style={{ position: 'absolute', top: v ? 215 : 128, left: v ? 70 : 32 }}>
          <ShiftTimer label={timer.label} urgent={timer.urgent} />
        </div>
      )}
      {stopStart !== undefined && (
        <div style={{ position: 'absolute', top: v ? 330 : 150, right: v ? 'auto' : 48, left: v ? 70 : 'auto' }}>
          <Stopwatch seconds={stopStart - frame / FPS} size={v ? 1.1 : 1} />
        </div>
      )}
      {scene === 'pass' && (
        <div style={{ position: 'absolute', top: v ? 280 : 'auto', bottom: v ? 'auto' : 8, left: 0, width: v ? 1080 : 1920, display: 'flex', justifyContent: 'center' }}>
          <PollTicker text="Вы выбрали: А 67% · Б 33% · 💬 0" />
        </div>
      )}
      {scene === 'cashier' && !v && <QqeboPlate />}
    </>
  );
}

// Плашки очков «БЕКС +1» / «КОСТЯ +1» в момент изменения счёта
export function ScorePlates({ scene, v }: { scene: SceneId; v?: boolean }) {
  const frame = useCurrentFrame();
  const flash = SCORE_FLASH[scene];
  if (!flash) return null;
  const p = interpolate(frame, [flash.at, flash.at + 8, flash.at + 40, flash.at + 52], [0, 1, 1, 0], CLAMP);
  if (p <= 0) return null;
  return (
    <div style={{ position: 'absolute', top: v ? 160 : 100, left: 0, width: v ? 1080 : 1920, display: 'flex', justifyContent: 'center', opacity: p, transform: `translateY(${(1 - p) * -10}px)` }}>
      <div style={{ background: ACCENT, color: COLORS.paper, border: `3px solid ${COLORS.ink}`, borderRadius: 12, padding: '4px 22px', fontFamily: 'Segoe UI Black, Arial Black, sans-serif', fontSize: v ? 44 : 36 }}>
        {flash.who === 'beks' ? 'БЕКС +1' : 'КОСТЯ +1'}
      </div>
    </div>
  );
}
