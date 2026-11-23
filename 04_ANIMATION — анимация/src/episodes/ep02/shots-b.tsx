import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { boilSeedAt, stepValue } from '../../animation/motion';
import type { EmotionName } from '../../characters/expressions';
import { FORK_COLORS, ForkScene, type ForkOption } from '../../scenes/ForkScene';
import { PauseScene } from '../../scenes/ep02/BorschtScenes';
import { ChecklistScene } from '../../scenes/ep02/ChecklistScene';
import { HallStage } from '../../scenes/ep02/HallStage';
import { NO_CAMERA, type Camera } from '../../scenes/ep02/kit';
import { KitchenScene } from '../../scenes/ep02/KitchenScene';
import { PhoneReplyScene } from '../../scenes/ep02/ReviewPhone';
import { CLAMP, liveOf } from './shots-a';
import { CHECKLIST, FORK, HANG, NEWS, REPLY, ZERO } from './timeline';

// Кадры сцен 9–15 серии 2 (время — от начала своей сцены)

const REVIEW_BEFORE = ['Борщ холодный,', 'официант хамит.'];
const REVIEW_AFTER = ['Борщ был холодный,', 'но ответ тёплый.'];
const REPLY_TOTAL_CHARS = REPLY.lines.join('').length;

// 9. Пауза: последняя струйка пара
export function PauseShot() {
  const frame = useCurrentFrame();
  return <PauseScene steam={interpolate(frame, [0, 100], [0.9, 0], CLAMP)} phase={frame * 0.6} boilSeed={boilSeedAt(frame)} />;
}

// 10. Листок на столе Эдуарда, пункты влетают со щелчком
export function ChecklistShot() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <ChecklistScene
      title={CHECKLIST.title}
      items={CHECKLIST.items}
      slap={interpolate(frame, [0, 8], [0, 1], { ...CLAMP, easing: Easing.in(Easing.quad) })}
      itemsIn={CHECKLIST.itemsAt.map((at) => spring({ frame: frame - at, fps, config: { damping: 14 } }))}
      eduard={stepValue<EmotionName>(frame, [[0, 'skeptical'], [CHECKLIST.eduardAt, 'tired']])}
      eduardLive={liveOf(frame, 'checklist', 'eduard')}
      boilSeed={boilSeedAt(frame)}
    />
  );
}

// 11. Кухня: Костя вешает листок, Гена медленно поворачивается
export function HangShot() {
  const frame = useCurrentFrame();
  const kostyaX = interpolate(frame, [HANG.backOffFrom, HANG.backOffFrom + 18], [230, 110], { ...CLAMP, easing: Easing.out(Easing.quad) });
  const gena = stepValue<EmotionName>(frame, [[0, 'neutral'], [HANG.turnTo, 'skeptical'], [HANG.turnTo + 22, 'tired']]);
  return (
    <KitchenScene
      gena={gena}
      genaLive={liveOf(frame, 'hang', 'gena')}
      genaTurn={interpolate(frame, [HANG.turnFrom, HANG.turnTo], [0, 1], { ...CLAMP, easing: Easing.inOut(Easing.sin) })}
      steam={0.4}
      phase={frame}
      sheetOnWall={interpolate(frame, [6, HANG.hangTo], [0, 1], CLAMP)}
      front={[{ id: 'kostya', emotion: frame < HANG.turnFrom ? 'neutral' : 'panic', x: kostyaX, flip: frame < HANG.turnFrom }]}
      boilSeed={boilSeedAt(frame)}
    />
  );
}

// 12. Ответ на отзыв печатается в телефоне
export function ReplyShot() {
  const frame = useCurrentFrame();
  const chars = Math.floor(interpolate(frame, [REPLY.typeFrom, REPLY.typeTo], [0, REPLY_TOTAL_CHARS], CLAMP));
  return (
    <PhoneReplyScene
      rating={1}
      reviewLines={REVIEW_BEFORE}
      reply={{ lines: REPLY.lines, chars, caret: frame % 16 < 9 }}
      boilSeed={boilSeedAt(frame)}
    />
  );
}

// 13. Таймер обнулился (он — в общем слое), приходит новая оценка ★★★★☆
export function ZeroShot() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const changed = frame >= ZERO.starsAt;
  return (
    <PhoneReplyScene
      rating={changed ? 4 : 1}
      starPop={changed ? spring({ frame: frame - ZERO.starsAt, fps, from: 1.8, to: 1, config: { damping: 8 } }) : 1}
      reviewLines={changed ? REVIEW_AFTER : REVIEW_BEFORE}
      reply={{ lines: REPLY.lines, chars: REPLY_TOTAL_CHARS, caret: false }}
      notification={{ progress: spring({ frame: frame - ZERO.notifAt, fps, config: { damping: 12 } }), rating: 4, text: '«Борщ был холодный, но ответ тёплый»' }}
      boilSeed={boilSeedAt(frame)}
    />
  );
}

// 14. Эдуард влетает с новостью; Костя молча смотрит в камеру
export function NewsShot() {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, NEWS.enterTo], [0, 1], { ...CLAMP, easing: Easing.out(Easing.back(1.6)) });
  const eduard = stepValue<EmotionName>(frame, [[0, 'happy'], [NEWS.faceFallAt, 'sad']]);
  const kostya = stepValue<EmotionName>(frame, [[0, 'surprised'], [20, 'happy'], [NEWS.faceFallAt + 10, 'sad'], [NEWS.stareAt, 'neutral']]);
  const zoom = interpolate(frame, [NEWS.stareAt, NEWS.stareAt + 4], [0, 1], CLAMP);
  const camera: Camera = zoom > 0 ? { cx: 540 + 220 * zoom, cy: 360 - 70 * zoom, scale: 1 + 0.9 * zoom } : NO_CAMERA;
  return (
    <HallStage
      actors={[
        { id: 'eduard', emotion: eduard, x: interpolate(enter, [0, 1], [-380, 330]), footY: 780, height: 580, tilt: (1 - enter) * 12, live: liveOf(frame, 'news', 'eduard') },
        { id: 'kostya', emotion: kostya, x: 760, footY: 770, height: 560, live: liveOf(frame, 'news', 'kostya') },
      ]}
      camera={camera}
      boilSeed={boilSeedAt(frame)}
    />
  );
}

// 15. Развилка: А / Б / свой вариант + голосование
const BADGE_COLOR = { А: FORK_COLORS.a, Б: FORK_COLORS.b, custom: FORK_COLORS.custom } as const;

export function ForkShot() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const options: ForkOption[] = FORK.options.map((o) => ({
    badge: o.badge,
    lines: [...o.lines],
    color: BADGE_COLOR[o.badge],
    progress: spring({ frame: frame - o.at, fps, config: { damping: 11 } }),
  }));
  return (
    <ForkScene
      options={options}
      voteText={FORK.voteText}
      voteProgress={spring({ frame: frame - FORK.voteAt, fps, config: { damping: 14 } })}
      votePulse={frame > FORK.voteAt + 20 ? 1 + 0.045 * Math.sin((frame - FORK.voteAt) * 0.2) : 1}
      wobble={Math.sin(frame * 0.08) * 1.2}
      footnote={{ text: FORK.footnote, progress: interpolate(frame, [FORK.footnoteAt, FORK.footnoteAt + 10], [0, 1], CLAMP) }}
      boilSeed={boilSeedAt(frame)}
    />
  );
}
