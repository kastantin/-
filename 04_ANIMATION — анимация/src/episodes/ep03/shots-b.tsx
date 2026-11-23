import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { boilSeedAt, stepValue } from '../../animation/motion';
import { SceneCharacter } from '../../characters/Character';
import type { EmotionName } from '../../characters/expressions';
import { CHAR } from '../../characters/palette';
import { FORK_COLORS, ForkScene, type ForkOption } from '../../scenes/ForkScene';
import { HallStage } from '../../scenes/ep02/HallStage';
import { KitchenScene } from '../../scenes/ep02/KitchenScene';
import { INK, NO_CAMERA, S, TITLE_FONT, type Camera } from '../../scenes/ep02/kit';
import { BanquetStage, Puff } from '../../scenes/ep03/BanquetStage';
import { Cake, DoorFrame, Envelope, NotebookProp, PlateTower } from '../../scenes/ep03/props3';
import { TimingScene } from '../../scenes/ep03/ScenesA';
import { CAKE, ENVELOPE, FORK, HOTRUSH, MONTAGE, RELIEF, sceneLength, TIMING, TIMING_ROWS, WHISPER } from './timeline';
import { CLAMP, liveOf, shakeAt } from './shots-a';

// Кадры сцен 9–16 серии 3 (время — от начала своей сцены)

const PASS_Y = 452;

// 9. Тайминг банкета, Дима записывает
export function TimingShot() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <TimingScene
      rows={TIMING_ROWS}
      rowsIn={TIMING.rowsAt.map((at) => spring({ frame: frame - at, fps, config: { damping: 13 } }))}
      highlight={frame >= TIMING.highlightAt ? 1 : -1}
      kostya="smirk"
      dima="happy"
      kostyaLive={liveOf(frame, 'timing', 'kostya')}
      dimaTilt={Math.sin(frame * 0.4) * 3}
      dimaHeld={<NotebookProp pen={Math.sin(frame * 1.2) * 3} />}
      boilSeed={boilSeedAt(frame)}
    />
  );
}

function Heart({ x, y, t }: { x: number; y: number; t: number }) {
  const s = 0.5 + Math.min(1, t) * 0.7;
  return (
    <g transform={`translate(${x} ${y - t * 40}) scale(${s})`} opacity={1 - t * 0.6}>
      <path d="M 0 22 C -44 -8 -22 -42 0 -18 C 22 -42 44 -8 0 22 Z" fill="#e5533d" stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
    </g>
  );
}

// 10. Банкет, монтаж: Бекс обнимается с начальником, Ахма несёт восемь салатов, зал аплодирует
export function MontageShot() {
  const frame = useCurrentFrame();
  const seed = boilSeedAt(frame);
  const flash = interpolate(frame, [MONTAGE.cutAt, MONTAGE.cutAt + 6], [0.9, 0], CLAMP);
  if (frame < MONTAGE.cutAt) {
    const hug = interpolate(frame, [20, 50], [0, 1], CLAMP);
    return (
      <BanquetStage
        phase={frame}
        boilSeed={seed}
        actors={[
          { id: 'beks', emotion: 'happy', x: 460 + hug * 40, height: 580, tilt: 3 + hug * 3, live: liveOf(frame, 'montage', 'beks') },
          { id: 'boss', emotion: 'happy', x: 700 - hug * 70, height: 560, tilt: -3 - hug * 3 },
        ]}
      >
        <Heart x={575} y={255} t={interpolate(frame, [44, 74], [0, 1], CLAMP)} />
      </BanquetStage>
    );
  }
  const walk = frame - MONTAGE.cutAt;
  return (
    <AbsoluteFill>
      <BanquetStage
        phase={frame}
        clap
        boilSeed={seed}
        actors={[
          {
            id: 'akhma',
            emotion: 'neutral',
            x: interpolate(walk, [0, sceneLength('montage') - MONTAGE.cutAt - 8], [1250, -200], CLAMP),
            height: 640,
            footY: 780 - Math.abs(Math.sin(walk * 0.35)) * 10,
            held: <PlateTower count={8} salad />,
            live: liveOf(frame, 'montage', 'akhma'),
          },
        ]}
      />
      <AbsoluteFill style={{ backgroundColor: '#ffffff', opacity: flash }} />
    </AbsoluteFill>
  );
}

// 11. Горячее вынесли раньше времени: Ахма с башней из сорока тарелок, Тамада замер, Костя в панике
export function HotRushShot() {
  const frame = useCurrentFrame();
  const seed = boilSeedAt(frame);
  const tamada = stepValue<EmotionName>(frame, [[0, 'happy'], [HOTRUSH.freezeAt, 'surprised'], [HOTRUSH.kostyaShoutAt, 'neutral']]);
  const kostya = stepValue<EmotionName>(frame, [[0, 'neutral'], [HOTRUSH.akhmaFrom, 'surprised'], [HOTRUSH.kostyaShoutAt, 'yell'], [HOTRUSH.kostyaPanicAt, 'panic']]);
  const akhmaX = interpolate(frame, [HOTRUSH.akhmaFrom, HOTRUSH.akhmaTo], [1320, 640], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const shake = shakeAt(frame, HOTRUSH.kostyaShoutAt, 10, 8);
  const camera: Camera = { ...NO_CAMERA, shakeX: shake, shakeY: shake * 0.5 };
  return (
    <BanquetStage
      phase={frame}
      camera={camera}
      boilSeed={seed}
      actors={[
        { id: 'tamada', emotion: tamada, x: 210, height: 540, live: liveOf(frame, 'hotrush', 'tamada') },
        {
          id: 'akhma',
          emotion: 'neutral',
          x: akhmaX,
          height: 640,
          footY: 780,
          held: <PlateTower count={40} hot phase={frame} />,
          live: liveOf(frame, 'hotrush', 'akhma'),
        },
        { id: 'kostya', emotion: kostya, x: 950, height: 540, live: liveOf(frame, 'hotrush', 'kostya') },
      ]}
    />
  );
}

// Телефон на раздаче с фото торта
function PhoneWithCake() {
  return (
    <g transform={`translate(450 ${PASS_Y - 30}) rotate(-6)`}>
      <rect x={-24} y={-70} width={48} height={74} rx={6} fill="#1f1f22" stroke={INK} strokeWidth={2.4} />
      <rect x={-20} y={-66} width={40} height={64} rx={3} fill="#fbe4ea" />
      <Cake x={0} y={-8} scale={0.22} tiers={3} berries={5} topBerry={1} />
    </g>
  );
}

// 12. Кухня: Гена в ужасе, Надир спокойно собирает торт по фото
export function CakeShot() {
  const frame = useCurrentFrame();
  const gena = stepValue<EmotionName>(frame, [[0, 'panic'], [16, 'yell'], [CAKE.genaCalmAt, 'surprised'], [CAKE.topBerryAt + 14, 'skeptical']]);
  const nadir = stepValue<EmotionName>(frame, [[0, 'neutral'], [CAKE.topBerryAt + 14, 'smirk']]);
  const tiers = CAKE.tiersAt.filter((at) => frame >= at).length;
  const berries = Math.max(0, Math.min(5, Math.floor((frame - CAKE.berriesFrom) / 8) + 1));
  const topBerry = interpolate(frame, [CAKE.topBerryAt, CAKE.topBerryAt + 14], [0, 1], { ...CLAMP, easing: Easing.in(Easing.quad) });
  return (
    <KitchenScene
      gena={gena}
      genaLive={liveOf(frame, 'cake', 'gena')}
      borscht={false}
      front={[{ id: 'nadir', emotion: nadir, x: 300, height: 580, live: liveOf(frame, 'cake', 'nadir') }]}
      boilSeed={boilSeedAt(frame)}
    >
      <PhoneWithCake />
      <Cake x={740} y={PASS_Y - 4} scale={1.25} tiers={tiers} berries={berries} topBerry={topBerry} />
    </KitchenScene>
  );
}

// 13. Зал доволен: Костя выдыхает «фух», друзья и Тамада рядом
export function ReliefShot() {
  const frame = useCurrentFrame();
  const kostya = stepValue<EmotionName>(frame, [[0, 'tired'], [RELIEF.happyAt, 'happy']]);
  const puff = interpolate(frame, [RELIEF.puffFrom, RELIEF.puffTo], [0, 1], CLAMP);
  return (
    <BanquetStage
      phase={frame}
      clap
      boilSeed={boilSeedAt(frame)}
      actors={[
        { id: 'beks', emotion: 'happy', x: 120, height: 440 },
        { id: 'akhma', emotion: 'neutral', x: 270, height: 500 },
        { id: 'nadir', emotion: 'neutral', x: 430, height: 440 },
        { id: 'kostya', emotion: kostya, x: 660, height: 560, live: liveOf(frame, 'relief', 'kostya') },
        { id: 'tamada', emotion: 'happy', x: 930, height: 520 },
      ]}
    >
      <Puff x={690} y={360} grow={puff} />
    </BanquetStage>
  );
}

// 14. Конец вечера: начальник отдаёт конверт, крупно «Чаевые: 12 000 ₽», в дверях кухни Гена и Дима
export function EnvelopeShot() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seed = boilSeedAt(frame);
  const pass = interpolate(frame, [ENVELOPE.passFrom, ENVELOPE.passTo], [0, 1], { ...CLAMP, easing: Easing.inOut(Easing.cubic) });
  const z = interpolate(frame, [ENVELOPE.zoomIn, ENVELOPE.zoomIn + 14], [0, 1], CLAMP) - interpolate(frame, [ENVELOPE.zoomOut, ENVELOPE.zoomOut + 16], [0, 1], CLAMP);
  const camera: Camera = { cx: 540 + 20 * z, cy: 360 + 200 * z, scale: 1 + 0.7 * z };
  const plate = spring({ frame: frame - ENVELOPE.plateAt, fps, config: { damping: 9 } });
  const kostya = stepValue<EmotionName>(frame, [[0, 'tired'], [ENVELOPE.passTo, 'surprised'], [ENVELOPE.zoomOut + 10, 'happy']]);
  const showPlate = frame >= ENVELOPE.plateAt && frame < ENVELOPE.zoomOut + 8;
  return (
    <BanquetStage
      crowd={false}
      phase={frame}
      camera={camera}
      boilSeed={seed}
      actors={[
        { id: 'boss', emotion: 'happy', x: 300, height: 560 },
        { id: 'kostya', emotion: kostya, x: 610, height: 540 },
      ]}
    >
      <DoorFrame x={800} y={240} w={230} h={440} />
      <SceneCharacter id="gena" emotion="skeptical" x={880} footY={700} height={470} boilSeed={seed} {...liveOf(frame, 'envelope', 'gena')} />
      <SceneCharacter id="dima" emotion="sad" x={985} footY={700} height={420} boilSeed={seed} {...liveOf(frame, 'envelope', 'dima')} />
      <Envelope x={interpolate(pass, [0, 1], [392, 590])} y={interpolate(pass, [0, 1], [584, 600]) - Math.sin(pass * Math.PI) * 30} scale={1.1} angle={-10 + pass * 10} />
      {showPlate && (
        <g transform={`translate(560 500) rotate(-5) scale(${plate})`}>
          <rect x={-190} y={-44} width={380} height={88} rx={14} fill={CHAR.gold} stroke={INK} strokeWidth={S + 1} />
          <text x={0} y={16} textAnchor="middle" fontFamily={TITLE_FONT} fontSize={42} fill={INK}>
            ЧАЕВЫЕ: 12 000 ₽
          </text>
        </g>
      )}
    </BanquetStage>
  );
}

// 15. Эдуард заглядывает и шепчет, Костя смотрит в камеру
export function WhisperShot() {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, WHISPER.enterTo], [0, 1], { ...CLAMP, easing: Easing.out(Easing.back(1.4)) });
  const z = interpolate(frame, [WHISPER.zoomAt, WHISPER.zoomAt + 6], [0, 1], CLAMP);
  const camera: Camera = z > 0 ? { cx: 540 - 20 * z, cy: 360 - 60 * z, scale: 1 + 0.95 * z } : NO_CAMERA;
  return (
    <HallStage
      camera={camera}
      boilSeed={boilSeedAt(frame)}
      actors={[
        { id: 'kostya', emotion: 'neutral', x: 520, footY: 770, height: 560, live: liveOf(frame, 'whisper', 'kostya') },
        { id: 'eduard', emotion: 'tired', x: interpolate(enter, [0, 1], [1300, 930]), footY: 780, height: 560, tilt: -14 * (1 - enter) - 7, live: liveOf(frame, 'whisper', 'eduard') },
      ]}
    />
  );
}

// 16. Развилка: А / Б / свой вариант + голосование + «идея серии» (титры — в общем слое)
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
