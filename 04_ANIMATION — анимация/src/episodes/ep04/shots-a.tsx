import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { boilSeedAt, inSpan, isBlinking, isMouthOpen, stepValue } from '../../animation/motion';
import type { LiveState } from '../../characters/Character';
import type { EmotionName } from '../../characters/expressions';
import { KitchenScene } from '../../scenes/ep02/KitchenScene';
import type { Camera } from '../../scenes/ep02/kit';
import { CarCallScene, CommentsScene, InfoScene, SplitHallKitchen } from '../../scenes/ep04/Scenes4';
import { ChopBoard, ReceiptPrinter, ReceiptRain, ReceiptSlip, TrayWithBills } from '../../scenes/ep04/props4';
import { clipAt, PRINTER, RULE, COMMENTS_EV, sceneLength, speechSpans, type SceneId, type Speaker } from './timeline';

// Кадры сцен 1–8 серии 4 (время — от начала своей сцены)

export const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
export const PASS_Y = 452;
const LIVE_OFFSET: Record<Exclude<Speaker, 'narrator'>, number> = { owner: 0, kostya: 1, eduard: 2, dima: 3, guest: 4, gena: 5, beks: 6 };

// Рот двигается только пока в озвучке звучит речь этого персонажа
export function liveOf(frame: number, scene: SceneId, who: Exclude<Speaker, 'narrator'>): LiveState {
  const offset = LIVE_OFFSET[who];
  const speaking = speechSpans(scene, who).some((span) => inSpan(frame, span));
  return { blink: isBlinking(frame, offset), talking: speaking && isMouthOpen(frame, offset) };
}

export function shakeAt(frame: number, from: number, frames: number, amount: number): number {
  return frame >= from && frame < from + frames ? Math.sin(frame * 2.7) * amount * (1 - (frame - from) / frames) : 0;
}

// 1. Принтер чеков строчит как пулемёт, бумага валится на пол; Гена стоит спиной
export function PrinterShot() {
  const frame = useCurrentFrame();
  const shake = Math.sin(frame * 2.6) * 3;
  const camera: Camera = { cx: 540, cy: 360, scale: 1.1, shakeX: shake, shakeY: shake * 0.4 };
  return (
    <KitchenScene
      gena="neutral"
      genaTurn={0}
      borscht={false}
      phase={frame}
      camera={camera}
      front={[{ id: 'kostya', emotion: 'panic', x: 230, height: 560 }]}
      boilSeed={boilSeedAt(frame)}
    >
      <ReceiptPrinter x={830} y={PASS_Y - 6} scale={1.5} frame={frame} />
      <ReceiptRain frame={frame} from={PRINTER.rainFrom} count={PRINTER.rainCount} every={2} />
    </KitchenScene>
  );
}

// 2. Комментарии к серии 3; Костя в камеру
export function CommentsShot() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kostya = stepValue<EmotionName>(frame, [[0, 'tired'], [clipAt('comments', 'kostya_demo'), 'smirk']]);
  return (
    <CommentsScene
      kostya={kostya}
      kostyaLive={liveOf(frame, 'comments', 'kostya')}
      rowsIn={COMMENTS_EV.rowsAt.map((at) => spring({ frame: frame - at, fps, config: { damping: 13 } }))}
      boilSeed={boilSeedAt(frame)}
    />
  );
}

// 3. Раздача: чеки Кости висят гирляндой, его борщ стоит в конце и парит всё слабее
export function CounterShot() {
  const frame = useCurrentFrame();
  const len = sceneLength('counter');
  return (
    <KitchenScene
      gena="neutral"
      steam={interpolate(frame, [0, len], [0.55, 0.08], CLAMP)}
      phase={frame}
      front={[{ id: 'kostya', emotion: 'tired', x: 250, height: 560, live: liveOf(frame, 'counter', 'kostya') }]}
      boilSeed={boilSeedAt(frame)}
    >
      {Array.from({ length: 12 }, (_, i) => (
        <ReceiptSlip key={i} x={190 + i * 62} y={170 + (i % 3) * 14} angle={(i % 2 === 0 ? -1 : 1) * (3 + (i % 4))} hot />
      ))}
    </KitchenScene>
  );
}

// 4. Гена режет лук и не плачет
export function OnionShot() {
  const frame = useCurrentFrame();
  const len = sceneLength('onion');
  const gena = stepValue<EmotionName>(frame, [[0, 'neutral'], [clipAt('onion', 'gena_kuhne'), 'angry']]);
  const camera: Camera = { cx: 540, cy: 310, scale: interpolate(frame, [0, len], [1.1, 1.3], CLAMP) };
  return (
    <KitchenScene
      gena={gena}
      genaLive={liveOf(frame, 'onion', 'gena')}
      borscht={false}
      camera={camera}
      front={[{ id: 'kostya', emotion: 'sad', x: 230, height: 560 }]}
      boilSeed={boilSeedAt(frame)}
    >
      <ChopBoard x={560} y={PASS_Y - 8} scale={1.7} knife={frame / 30} />
    </KitchenScene>
  );
}

// 5. Сплит-скрин: зал и кухня
export function SplitShot() {
  const frame = useCurrentFrame();
  const kostya = stepValue<EmotionName>(frame, [[0, 'panic'], [clipAt('split', 'kostya_idu'), 'sad']]);
  return (
    <SplitHallKitchen
      frame={frame}
      guestLive={liveOf(frame, 'split', 'guest')}
      kostyaLive={liveOf(frame, 'split', 'kostya')}
      kostya={kostya}
      boilSeed={boilSeedAt(frame)}
    />
  );
}

// 6. Звонок Бексу: он в машине, дворники
export function CallShot() {
  const frame = useCurrentFrame();
  const kostya = stepValue<EmotionName>(frame, [[0, 'sad'], [clipAt('call', 'kostya_druzyam'), 'panic'], [clipAt('call', 'beks_nikto'), 'sad']]);
  const beks = stepValue<EmotionName>(frame, [[0, 'skeptical'], [clipAt('call', 'beks_nikto'), 'smirk']]);
  return (
    <CarCallScene
      frame={frame}
      kostya={kostya}
      kostyaLive={liveOf(frame, 'call', 'kostya')}
      beks={beks}
      beksLive={liveOf(frame, 'call', 'beks')}
      boilSeed={boilSeedAt(frame)}
    />
  );
}

// 7. Инфографика: правило зала и счётчик «14 → 19 → 23»
export function RuleShot() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <InfoScene
      cardIn={spring({ frame, fps, config: { damping: 12 } })}
      chipsIn={RULE.chipsAt.map((at) => spring({ frame: frame - at, fps, config: { damping: 10 } }))}
      boilSeed={boilSeedAt(frame)}
    />
  );
}

// 8. Замедленный проход Димы через кухню с подносом, звук приглушён
export function SlowmoShot() {
  const frame = useCurrentFrame();
  const len = sceneLength('slowmo');
  const camera: Camera = { cx: 540, cy: 380, scale: interpolate(frame, [0, len], [1.0, 1.15], CLAMP) };
  const walk = interpolate(frame, [0, len - 20], [-60, 340], CLAMP);
  const bob = Math.abs(Math.sin(frame * 0.07)) * -10;
  const dima = stepValue<EmotionName>(frame, [[0, 'sad'], [clipAt('slowmo', 'dima_chaevye'), 'sad']]);
  return (
    <AbsoluteFill style={{ filter: 'grayscale(0.55) brightness(0.92)' }}>
      <KitchenScene
        gena="neutral"
        borscht={false}
        camera={camera}
        front={[{ id: 'dima', emotion: dima, x: walk, footY: 790 + bob, height: 600, held: <TrayWithBills />, live: liveOf(frame, 'slowmo', 'dima') }]}
        boilSeed={boilSeedAt(frame)}
      />
    </AbsoluteFill>
  );
}
