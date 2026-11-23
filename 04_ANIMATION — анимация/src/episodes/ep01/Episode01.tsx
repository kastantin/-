import { AbsoluteFill, Easing, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { boilSeedAt, inSpan, isBlinking, isMouthOpen, stepValue } from '../../animation/motion';
import type { LiveState } from '../../characters/Character';
import type { EmotionName } from '../../characters/expressions';
import { EpisodeFrame, Remark, Subtitle } from '../../layout/EpisodeFrame';
import { ComplaintScene } from '../../scenes/ComplaintScene';
import { FORK_COLORS, ForkScene, type ForkOption } from '../../scenes/ForkScene';
import { HallScene } from '../../scenes/HallScene';
import { OfficeScene } from '../../scenes/OfficeScene';
import { PhoneScene } from '../../scenes/PhoneScene';
import { ThoughtScene } from '../../scenes/ThoughtScene';
import { SceneAudio } from './SceneAudio';
import { COMPLAINT, complaintRevealKeys, EP01, FORK, OFFICE, REMARKS, SCENES, speechSpans, SUBTITLES, THOUGHTS, type SceneId, type Speaker } from './timeline';

// Серия 1 «Поговорим» целиком: 7 сцен по таймингу озвучки

const FADE_FRAMES = 6;
const CUE_POP_FRAMES = 5;
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// У каждого персонажа свой ритм моргания и рта
const LIVE_OFFSET: Record<Exclude<Speaker, 'voice'>, number> = { kostya: 1, eduard: 2, dima: 3, guest: 4 };

function liveOf(frame: number, scene: SceneId, who: Exclude<Speaker, 'voice'>): LiveState {
  const offset = LIVE_OFFSET[who];
  // рот двигается только пока в озвучке звучит речь этого персонажа
  const speaking = speechSpans(scene, who).some((span) => inSpan(frame, span));
  return { blink: isBlinking(frame, offset), talking: speaking && isMouthOpen(frame, offset) };
}

// Дрожь от паники — мелкая и быстрая
function panicShake(frame: number, emotion: EmotionName): number {
  return emotion === 'panic' ? Math.sin(frame * 1.7) * 2.5 : 0;
}

function usePop(delay: number): number {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping: 13 } });
}

function PhoneShot() {
  const frame = useCurrentFrame();
  const messageIn = usePop(8);
  const shake = frame < 20 ? Math.sin(frame * 2.2) * 8 * (1 - frame / 20) : 0;
  return (
    <PhoneScene
      sender="Эдуард Борисович"
      message={['Зайди после смены.', 'Поговорим.']}
      time="23:47"
      shake={shake}
      messageIn={messageIn}
      boilSeed={boilSeedAt(frame)}
    />
  );
}

function ThoughtsShot() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const emotion = stepValue<EmotionName>(frame, [[0, 'panic'], [180, 'sad']]);
  const cards = THOUGHTS.map((t) => ({ ...t, progress: spring({ frame: frame - t.at, fps, config: { damping: 11 } }) }));
  return (
    <ThoughtScene
      emotion={emotion}
      live={liveOf(frame, 'thoughts', 'kostya')}
      shake={panicShake(frame, emotion)}
      cards={cards}
      boilSeed={boilSeedAt(frame)}
    />
  );
}

// Минутная стрелка тикает раз в секунду — тишина в кабинете
function clockAngle(frame: number, start: number): number {
  return start + Math.floor(frame / 30) * 6;
}

function OfficeShot() {
  const frame = useCurrentFrame();
  const kostya = stepValue<EmotionName>(frame, [[0, 'neutral'], [60, 'sad'], [OFFICE.sheetTo + 4, 'surprised']]);
  const sheetProgress = interpolate(frame, [OFFICE.sheetFrom, OFFICE.sheetTo], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  return (
    <OfficeScene
      kostya={kostya}
      eduard="tired"
      kostyaLive={liveOf(frame, 'office', 'kostya')}
      eduardLive={liveOf(frame, 'office', 'eduard')}
      kostyaShake={panicShake(frame, kostya)}
      sheetProgress={sheetProgress}
      clockMinuteAngle={clockAngle(frame, 0)}
      boilSeed={boilSeedAt(frame)}
    />
  );
}

function ComplaintShot() {
  const frame = useCurrentFrame();
  const cardIn = usePop(0);
  const keys = complaintRevealKeys();
  const reveal = interpolate(frame, keys.input, keys.output, CLAMP);
  return (
    <ComplaintScene
      title={COMPLAINT.title}
      lines={[...COMPLAINT.lines]}
      cardIn={cardIn}
      reveal={reveal}
      eduardLive={liveOf(frame, 'complaint', 'eduard')}
      boilSeed={boilSeedAt(frame)}
    />
  );
}

const WALK_FRAMES = 45;

function FlashbackShot() {
  const frame = useCurrentFrame();
  const offset = interpolate(frame, [0, WALK_FRAMES], [-700, 0], { ...CLAMP, easing: Easing.out(Easing.quad) });
  const bob = frame < WALK_FRAMES ? -Math.abs(Math.sin(frame * 0.45)) * 14 : 0;
  const guest = stepValue<EmotionName>(frame, [[0, 'neutral'], [88, 'surprised'], [135, 'angry']]);
  // флешбэк чуть «выцветший», как воспоминание
  return (
    <AbsoluteFill style={{ filter: 'sepia(0.45) saturate(0.85)' }}>
      <HallScene
        dima="happy"
        guest={guest}
        dimaLive={liveOf(frame, 'flashback', 'dima')}
        guestLive={liveOf(frame, 'flashback', 'guest')}
        dimaOffsetX={offset}
        dimaBob={bob}
        boilSeed={boilSeedAt(frame)}
      />
    </AbsoluteFill>
  );
}

function LeanShot() {
  const frame = useCurrentFrame();
  const tilt = interpolate(frame, [6, 30], [0, -6], { ...CLAMP, easing: Easing.inOut(Easing.cubic) });
  const eduard = stepValue<EmotionName>(frame, [[0, 'tired'], [30, 'skeptical'], [176, 'tired']]);
  const kostya = stepValue<EmotionName>(frame, [[0, 'panic'], [176, 'sad']]);
  return (
    <OfficeScene
      kostya={kostya}
      eduard={eduard}
      kostyaLive={liveOf(frame, 'lean', 'kostya')}
      eduardLive={liveOf(frame, 'lean', 'eduard')}
      eduardTilt={tilt}
      kostyaShake={panicShake(frame, kostya)}
      sheetProgress={1}
      clockMinuteAngle={clockAngle(frame, 60)}
      boilSeed={boilSeedAt(frame)}
    />
  );
}

const BADGE_COLOR = { А: FORK_COLORS.a, Б: FORK_COLORS.b, custom: FORK_COLORS.custom } as const;

function ForkShot() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const options: ForkOption[] = FORK.options.map((o) => ({
    badge: o.badge,
    lines: [...o.lines],
    color: BADGE_COLOR[o.badge],
    progress: spring({ frame: frame - o.at, fps, config: { damping: 11 } }),
  }));
  const voteProgress = spring({ frame: frame - FORK.voteAt, fps, config: { damping: 14 } });
  const votePulse = frame > FORK.voteAt + 20 ? 1 + 0.045 * Math.sin((frame - FORK.voteAt) * 0.2) : 1;
  return (
    <ForkScene
      options={options}
      voteText={FORK.voteText}
      voteProgress={voteProgress}
      votePulse={votePulse}
      wobble={Math.sin(frame * 0.08) * 1.2}
      boilSeed={boilSeedAt(frame)}
    />
  );
}

const SHOTS: Record<SceneId, () => React.ReactNode> = {
  phone: PhoneShot,
  thoughts: ThoughtsShot,
  office: OfficeShot,
  complaint: ComplaintShot,
  flashback: FlashbackShot,
  lean: LeanShot,
  fork: ForkShot,
};

// Реплика или ремарка мягко «выпрыгивает» при появлении
function PopIn({ children }: { children: React.ReactNode }) {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, CUE_POP_FRAMES], [0, 1], CLAMP);
  return <AbsoluteFill style={{ opacity: p, transform: `translateY(${(1 - p) * 12}px)` }}>{children}</AbsoluteFill>;
}

function SceneText({ scene }: { scene: SceneId }) {
  return (
    <>
      {REMARKS[scene].map((r) => (
        <Sequence key={r.text} from={r.from} durationInFrames={r.to - r.from} name={`ремарка: ${r.text}`}>
          <PopIn>
            <Remark text={r.text} />
          </PopIn>
        </Sequence>
      ))}
      {SUBTITLES[scene].map((cue) => (
        <Sequence key={cue.text} from={cue.from} durationInFrames={cue.to - cue.from} name={`реплика: ${cue.text}`}>
          <PopIn>
            <Subtitle text={cue.text} highlight={cue.highlight} />
          </PopIn>
        </Sequence>
      ))}
    </>
  );
}

// Короткое затемнение на стыке сцен
function SceneFade({ duration, children }: { duration: number; children: React.ReactNode }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, FADE_FRAMES, duration - FADE_FRAMES, duration], [0, 1, 1, 0], CLAMP);
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
}

export function Episode01() {
  return (
    <EpisodeFrame episode={EP01.episode} title={EP01.title} ladderStep={EP01.ladderStep}>
      {SCENES.map((s) => {
        const Shot = SHOTS[s.id];
        const duration = s.to - s.from;
        return (
          <Sequence key={s.id} from={s.from} durationInFrames={duration} name={`сцена: ${s.id}`}>
            <SceneFade duration={duration}>
              <Shot />
              <SceneText scene={s.id} />
            </SceneFade>
            <SceneAudio scene={s.id} />
          </Sequence>
        );
      })}
    </EpisodeFrame>
  );
}
