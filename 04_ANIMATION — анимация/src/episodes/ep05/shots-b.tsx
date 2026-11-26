import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { boilSeedAt, isBlinking, stepValue } from '../../animation/motion';
import { SceneCharacter } from '../../characters/Character';
import type { EmotionName } from '../../characters/expressions';
import { FORK_COLORS, ForkScene, type ForkOption } from '../../scenes/ForkScene';
import { OfficeScene } from '../../scenes/OfficeScene';
import { HallStage } from '../../scenes/ep02/HallStage';
import { INK, TITLE_FONT } from '../../scenes/ep02/kit';
import { DoorScene, EduardCamScene, MirrorScene, WallScene } from '../../scenes/ep05/Scenes5';
import { CLAMP, liveOf } from './shots-a';
import { clipAt, FORK, SMILE } from './timeline';

// Кадры сцен 9–15 серии 5 (время — от начала своей сцены)

// 9. Зал: гость щёлкает пальцами, Бекс в форме с бликом на зубах, Костя про себя
export function SmileShot() {
  const frame = useCurrentFrame();
  const burst = interpolate(frame, [SMILE.snapAt, SMILE.snapAt + 16], [0, 1], CLAMP);
  const seed = boilSeedAt(frame);
  return (
    <HallStage
      boilSeed={seed}
      actors={[
        { id: 'kostya', emotion: 'smirk', x: 170, footY: 770, height: 540, live: { blink: isBlinking(frame, 1) } },
        { id: 'beks', emotion: 'happy', x: 520, footY: 770, height: 580, live: liveOf(frame, 'smile', 'beks') },
        { id: 'guest', emotion: stepValue<EmotionName>(frame, [[0, 'angry'], [SMILE.beksAt + 40, 'neutral']]), x: 830, footY: 720, height: 520, live: liveOf(frame, 'smile', 'guest') },
      ]}
    >
      {burst > 0 && burst < 1 && (
        <g transform={`translate(790 ${250 - burst * 20}) scale(${0.6 + burst * 0.6})`} opacity={1 - burst * 0.4}>
          <path d="M -34 0 L -8 -8 M 34 0 L 8 -8 M 0 -34 L 0 -14" stroke={INK} strokeWidth={7} strokeLinecap="round" />
          <text x={0} y={-48} textAnchor="middle" fontFamily={TITLE_FONT} fontSize={34} fill="#f2c14e" stroke={INK} strokeWidth={5} paintOrder="stroke">
            щёлк!
          </text>
        </g>
      )}
    </HallStage>
  );
}

// 10. Пауза: Костя репетирует улыбку в зеркале, получается оскал
export function MirrorShot() {
  const frame = useCurrentFrame();
  const emotion: EmotionName = frame < clipAt('mirror', 'kostya_servis') ? (Math.floor(frame / 12) % 2 === 0 ? 'happy' : 'smirk') : 'smirk';
  return <MirrorScene frame={frame} emotion={emotion} boilSeed={boilSeedAt(frame)} />;
}

// 11. Кабинет: хозяйка встаёт, Бекс рядом с Костей; таймер меняется на «2 ДНЯ» (общий слой)
export function Office2Shot() {
  const frame = useCurrentFrame();
  const seed = boilSeedAt(frame);
  const rise = interpolate(frame, [0, 20], [60, 0], CLAMP);
  return (
    <OfficeScene
      kostya="skeptical"
      eduard="tired"
      kostyaX={250}
      kostyaLive={liveOf(frame, 'office2', 'kostya')}
      sheetProgress={0}
      boilSeed={seed}
      frontChildren={
        <g>
          <SceneCharacter id="beks" emotion="happy" x={470} footY={780} height={560} boilSeed={seed} {...liveOf(frame, 'office2', 'beks')} />
          <SceneCharacter id="owner" emotion="neutral" x={990} footY={780 + rise} height={560} boilSeed={seed} {...liveOf(frame, 'office2', 'owner')} />
        </g>
      }
    />
  );
}

// 12. Эдуард в сторону, к камере; Костя просит поддержки
export function EduardShot() {
  const frame = useCurrentFrame();
  const eduard = stepValue<EmotionName>(frame, [[0, 'tired'], [clipAt('eduard', 'eduard_ne_videl2'), 'skeptical']]);
  return (
    <EduardCamScene
      eduard={eduard}
      eduardLive={liveOf(frame, 'eduard', 'eduard')}
      kostya="sad"
      kostyaLive={liveOf(frame, 'eduard', 'kostya')}
      boilSeed={boilSeedAt(frame)}
    />
  );
}

// 13. За стеной Ахма и Надир подслушивают с чашками чая
export function WallShot() {
  const frame = useCurrentFrame();
  return (
    <WallScene
      frame={frame}
      akhma="neutral"
      akhmaLive={liveOf(frame, 'wall', 'akhma')}
      nadir={stepValue<EmotionName>(frame, [[0, 'surprised'], [clipAt('wall', 'akhma_goryachee'), 'skeptical']])}
      nadirLive={liveOf(frame, 'wall', 'nadir')}
      boilSeed={boilSeedAt(frame)}
    />
  );
}

// 14. Костя в камеру на фоне закрытой двери кабинета
export function DoorShot() {
  const frame = useCurrentFrame();
  return (
    <DoorScene
      kostya={stepValue<EmotionName>(frame, [[0, 'neutral'], [clipAt('door', 'kostya_druzhba') + 40, 'smirk']])}
      kostyaLive={liveOf(frame, 'door', 'kostya')}
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
