import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { SCENE_VIEWBOX, VIDEO } from '../../config';
import { boilSeedAt, inSpan, isBlinking, isMouthOpen, stepValue } from '../../animation/motion';
import type { LiveState } from '../../characters/Character';
import type { EmotionName } from '../../characters/expressions';
import { HandDrawn } from '../../characters/HandDrawn';
import { OfficeScene } from '../../scenes/OfficeScene';
import { FlashbackScene } from '../../scenes/ep02/BorschtScenes';
import { FlyingTray, HallStage, SpeedLines } from '../../scenes/ep02/HallStage';
import { INK, NO_CAMERA, S, TEXT_FONT, type Camera } from '../../scenes/ep02/kit';
import { KitchenScene } from '../../scenes/ep02/KitchenScene';
import { PollScene } from '../../scenes/ep02/PollScene';
import { ReceiptScene } from '../../scenes/ep02/ReceiptScene';
import { ReviewPhone } from '../../scenes/ep02/ReviewPhone';
import { SplitScene } from '../../scenes/ep02/SplitScene';
import { FLASHBACK, FREEZE_LABELS, HOOK, POLL, RECEIPT, REVIEW, SPLIT, speechSpans, type SceneId, type Speaker } from './timeline';

// Кадры сцен 1–8 серии 2 (время — от начала своей сцены)

export const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const LIVE_OFFSET: Record<Exclude<Speaker, 'voice'>, number> = { kostya: 1, eduard: 2, dima: 3, gena: 5 };

// Рот двигается, пока в озвучке звучит речь этого персонажа в кадре
export function liveOf(frame: number, scene: SceneId, who: Exclude<Speaker, 'voice'>): LiveState {
  const offset = LIVE_OFFSET[who];
  const speaking = speechSpans(scene, who).some((span) => inSpan(frame, span));
  return { blink: isBlinking(frame, offset), talking: speaking && isMouthOpen(frame, offset) };
}

function shakeAt(frame: number, from: number, frames: number, amount: number): number {
  return frame >= from && frame < from + frames ? Math.sin(frame * 2.7) * amount * (1 - (frame - from) / frames) : 0;
}

// 1. Гена бьёт половником по раздаче, тарелка подпрыгивает
export function HookShot() {
  const frame = useCurrentFrame();
  const t = frame - HOOK.hitAt;
  const ladleAngle = t < 0 ? interpolate(frame, [0, HOOK.hitAt], [150, 0], { ...CLAMP, easing: Easing.in(Easing.cubic) }) : Math.sin(Math.min(t, 6) * 0.5) * -10;
  const bowlJump = t >= 0 ? 46 * Math.abs(Math.sin(t * 0.35)) * Math.exp(-t * 0.12) : 0;
  const shake = shakeAt(frame, HOOK.hitAt, 10, 9);
  // медленный наезд, пока Гена орёт
  const camera: Camera = { cx: 600, cy: 330, scale: interpolate(frame, [0, 120], [1.8, 1.95], CLAMP), shakeX: shake, shakeY: shake * 0.6 };
  return (
    <KitchenScene gena="yell" genaLive={liveOf(frame, 'hook', 'gena')} ladleAngle={ladleAngle} bowlJump={bowlJump} phase={frame} camera={camera} boilSeed={boilSeedAt(frame)} />
  );
}

function FreezeLabel({ text, x, y, progress }: { text: string; x: number; y: number; progress: number }) {
  if (progress <= 0) return null;
  const w = text.length * 17 + 50;
  return (
    <g transform={`translate(${x} ${y}) scale(${progress}) rotate(-3)`}>
      <rect x={-w / 2} y={-30} width={w} height={60} rx={10} fill="#f2c14e" stroke={INK} strokeWidth={S} />
      <text x={0} y={10} textAnchor="middle" fontFamily={TEXT_FONT} fontWeight={800} fontSize={30} fill={INK}>
        {text}
      </text>
    </g>
  );
}

// 2. Стоп-кадр со скрипом пластинки и плашками-представлениями
export function FreezeShot() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flash = interpolate(frame, [0, 4], [0.8, 0], CLAMP);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: 'grayscale(0.7) contrast(1.1)' }}>
        <KitchenScene
          gena="yell"
          genaLive={{ talking: true }}
          ladleAngle={0}
          phase={0}
          front={[
            { id: 'kostya', emotion: 'sad', x: 190 },
            { id: 'dima', emotion: 'panic', x: 880 },
          ]}
          boilSeed={3}
        />
      </AbsoluteFill>
      <svg width={VIDEO.width} height={VIDEO.height} viewBox={SCENE_VIEWBOX} style={{ position: 'absolute' }}>
        <HandDrawn seed={boilSeedAt(frame)}>
          {FREEZE_LABELS.map((l) => (
            <FreezeLabel key={l.text} text={l.text} x={l.x} y={l.y} progress={spring({ frame: frame - l.at, fps, config: { damping: 10 } })} />
          ))}
        </HandDrawn>
      </svg>
      <AbsoluteFill style={{ backgroundColor: '#ffffff', opacity: flash }} />
    </AbsoluteFill>
  );
}

// 3. «Вы выбрали»: три нуля, муха, Костя в камеру
export function PollShot() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kostya = stepValue<EmotionName>(frame, [[0, 'tired'], [POLL.smirkAt, 'smirk']]);
  return (
    <PollScene
      kostya={kostya}
      kostyaLive={liveOf(frame, 'poll', 'kostya')}
      zeroPop={spring({ frame: frame - 3, fps, config: { damping: 8 } })}
      flyT={frame / 100}
      frame={frame}
      boilSeed={boilSeedAt(frame)}
    />
  );
}

// 4. Кабинет: Эдуард суёт телефон с отзывом Косте в лицо
export function ReviewShot() {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [REVIEW.phoneFrom, REVIEW.phoneTo], [0, 1], { ...CLAMP, easing: Easing.out(Easing.back(1.4)) });
  const x = interpolate(p, [0, 1], [760, 370]);
  const y = interpolate(p, [0, 1], [520, 330]);
  const scale = interpolate(p, [0, 1], [0.15, 0.62]);
  const angle = interpolate(p, [0, 1], [12, -8]);
  const kostya = stepValue<EmotionName>(frame, [[0, 'neutral'], [REVIEW.phoneTo, 'panic']]);
  return (
    <AbsoluteFill>
      <OfficeScene
        kostya={kostya}
        eduard="tired"
        kostyaLive={liveOf(frame, 'review', 'kostya')}
        eduardLive={liveOf(frame, 'review', 'eduard')}
        sheetProgress={0}
        boilSeed={boilSeedAt(frame)}
      />
      {p > 0 && (
        <svg width={VIDEO.width} height={VIDEO.height} viewBox={SCENE_VIEWBOX} style={{ position: 'absolute' }}>
          <g transform={`translate(${x} ${y}) scale(${scale}) rotate(${angle})`}>
            <ReviewPhone rating={1} reviewLines={['Борщ холодный,', 'официант хамит.']} boilSeed={boilSeedAt(frame)} />
          </g>
        </svg>
      )}
    </AbsoluteFill>
  );
}

// 5. Костя несётся через зал, уворачиваясь от подносов
const TRAYS = [
  { start: 0, y: 250, speed: 34 },
  { start: 38, y: 330, speed: 40 },
];
const KOSTYA_RUN_X = 420;

export function RunShot() {
  const frame = useCurrentFrame();
  const trays = TRAYS.map((t) => ({ ...t, x: 1300 - (frame - t.start) * t.speed }));
  const ducking = trays.some((t) => Math.abs(t.x - KOSTYA_RUN_X) < 150);
  const bob = -Math.abs(Math.sin(frame * 0.6)) * 22 + (ducking ? 60 : 0);
  return (
    <HallStage
      scroll={frame * 28}
      actors={[{ id: 'kostya', emotion: ducking ? 'surprised' : 'panic', x: KOSTYA_RUN_X, footY: 770 + bob, height: 540, tilt: 9 }]}
      boilSeed={boilSeedAt(frame)}
    >
      <SpeedLines frame={frame} />
      {trays.filter((t) => frame >= t.start && t.x > -300).map((t) => (
        <FlyingTray key={t.start} x={t.x} y={t.y} angle={Math.sin(frame * 0.3) * 6} />
      ))}
    </HallStage>
  );
}

// 6. Сплит-скрин: Гена и Дима орут одновременно, Костя вертит головой
export function SplitShot() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shout = (s: { from: number; to: number }) =>
    frame >= s.to ? interpolate(frame, [s.to, s.to + 4], [1, 0], CLAMP) : spring({ frame: frame - s.from, fps, config: { damping: 11 } });
  const stopped = frame >= SPLIT.kostyaStopAt;
  const kostyaLook = stopped ? 0 : Math.floor(frame / 10) % 2 === 0 ? -1 : 1;
  return (
    <SplitScene
      genaLive={liveOf(frame, 'split', 'gena')}
      dimaLive={liveOf(frame, 'split', 'dima')}
      kostyaLive={liveOf(frame, 'split', 'kostya')}
      kostya={stopped ? 'skeptical' : 'panic'}
      kostyaLook={kostyaLook}
      genaShout={{ text: SPLIT.gena.text, progress: shout(SPLIT.gena) }}
      dimaShout={{ text: SPLIT.dima.text, progress: shout(SPLIT.dima) }}
      shake={inSpan(frame, SPLIT.gena) ? Math.sin(frame * 2.1) * 4 : 0}
      boilSeed={boilSeedAt(frame)}
    />
  );
}

// 7. Резкий наезд на чек, грохнулся штамп «12 МИН»
export function ReceiptShot() {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 10], [1, 1.45], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const shake = shakeAt(frame, RECEIPT.stampAt + 6, 10, 10);
  return (
    <ReceiptScene
      camera={{ cx: 540, cy: 400, scale: zoom, shakeX: shake, shakeY: shake }}
      secondLine={interpolate(frame, [RECEIPT.secondLineAt, RECEIPT.secondLineAt + 14], [0, 1], CLAMP)}
      stamp={interpolate(frame, [RECEIPT.stampAt, RECEIPT.stampAt + 6], [0, 1], { ...CLAMP, easing: Easing.in(Easing.quad) })}
      boilSeed={boilSeedAt(frame)}
    />
  );
}

// 8. Флешбэк ×4: борщ стынет, Дима носит хлеб, приборы, сметану
export function FlashbackShot() {
  const frame = useCurrentFrame();
  const done = FLASHBACK.steps.filter((s) => frame >= s).length;
  const zoom = interpolate(frame, [FLASHBACK.zoomAt, FLASHBACK.zoomAt + 16], [0, 1], { ...CLAMP, easing: Easing.inOut(Easing.cubic) });
  const camera: Camera = zoom > 0 ? { cx: 540 - 280 * zoom, cy: 360 + 30 * zoom, scale: 1 + 0.9 * zoom } : NO_CAMERA;
  return (
    <FlashbackScene
      steam={interpolate(frame, [0, 160], [1, 0.2], CLAMP)}
      phase={frame * 2}
      minuteAngle={done * 24}
      done={done}
      dima="happy"
      dimaLive={{ blink: isBlinking(frame, 3) }}
      dimaBob={-Math.abs(Math.sin(frame * 0.9)) * 16}
      camera={camera}
      boilSeed={boilSeedAt(frame)}
    />
  );
}
