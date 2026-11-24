import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { boilSeedAt, stepValue } from '../../animation/motion';
import type { EmotionName } from '../../characters/expressions';
import { CHAR } from '../../characters/palette';
import { OfficeScene } from '../../scenes/OfficeScene';
import { FORK_COLORS, ForkScene, type ForkOption } from '../../scenes/ForkScene';
import { SpeedLines } from '../../scenes/ep02/HallStage';
import { KitchenScene } from '../../scenes/ep02/KitchenScene';
import { HotBorscht, INK, S, type Camera } from '../../scenes/ep02/kit';
import { CloseUpScene, HotHallScene } from '../../scenes/ep04/Scenes4';
import { Bill100, OwnerSilhouette, ReceiptPrinter, ReceiptSlip } from '../../scenes/ep04/props4';
import { CLAMP, liveOf, PASS_Y } from './shots-a';
import { clipAt, FORK, FREEZE, GUEST, HEELS, sceneLength, SOTNYA, voiceFrames } from './timeline';

// Кадры сцен 9–16 серии 4 (время — от начала своей сцены)

// 9. Стоп-кадр: Гена смотрит на купюры, на Диму, на купюры; дёргается глаз, «лук»
export function FreezeShot() {
  const frame = useCurrentFrame();
  const turn = interpolate(frame, [FREEZE.turnAt, FREEZE.turnAt + 14], [1, 0], CLAMP);
  const twitching = frame >= FREEZE.twitchFrom && frame < FREEZE.turnAt;
  const gena: EmotionName = twitching ? (Math.floor(frame / 3) % 2 === 0 ? 'angry' : 'skeptical') : frame < FREEZE.twitchFrom ? 'surprised' : 'neutral';
  const camera: Camera = { cx: 540, cy: 260, scale: 2 };
  return (
    <KitchenScene
      gena={gena}
      genaLive={liveOf(frame, 'freeze', 'gena')}
      genaTurn={turn}
      borscht={false}
      camera={camera}
      front={[{ id: 'dima', emotion: 'sad', x: 380, height: 560 }]}
      boilSeed={boilSeedAt(frame)}
    >
      {[0, 1, 2].map((i) => (
        <Bill100 key={i} x={470 + i * 36} y={PASS_Y - 22 - (i % 2) * 6} angle={-8 + i * 9} scale={1.15} />
      ))}
    </KitchenScene>
  );
}

function SlipStack({ x, y, count, hot }: { x: number; y: number; count: number; hot: boolean }) {
  return (
    <g>
      {Array.from({ length: count }, (_, i) => (
        <ReceiptSlip key={i} x={x + (i % 2) * 3} y={y - i * 4} angle={(i % 3) * 3 - 3} scale={0.95} hot={hot} />
      ))}
    </g>
  );
}

// 10. Гена берёт одну сотню, две возвращает Диме, кладёт чеки Кости первыми
export function SotnyaShot() {
  const frame = useCurrentFrame();
  const take = interpolate(frame, [SOTNYA.takeAt, SOTNYA.takeAt + 14], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const give = interpolate(frame, [SOTNYA.giveBackAt, SOTNYA.giveBackAt + 16], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const sweep = interpolate(frame, [SOTNYA.sweepFrom, SOTNYA.sweepTo], [0, 1], { ...CLAMP, easing: Easing.inOut(Easing.cubic) });
  const gena = stepValue<EmotionName>(frame, [[0, 'neutral'], [SOTNYA.nodAt, 'skeptical']]);
  const dima = stepValue<EmotionName>(frame, [[0, 'sad'], [SOTNYA.giveBackAt + 16, 'happy']]);
  const kostya = stepValue<EmotionName>(frame, [[0, 'sad'], [SOTNYA.nodAt + 10, 'surprised']]);
  return (
    <KitchenScene
      gena={gena}
      genaLive={liveOf(frame, 'sotnya', 'gena')}
      borscht={false}
      front={[
        { id: 'kostya', emotion: kostya, x: 110, height: 540 },
        { id: 'dima', emotion: dima, x: 290, height: 560 },
      ]}
      boilSeed={boilSeedAt(frame)}
    >
      <ReceiptPrinter x={990} y={PASS_Y - 6} scale={1.2} frame={frame} printing={false} />
      {take < 1 && <Bill100 x={470 + take * 70} y={PASS_Y - 22 - take * 90} angle={-8 + take * 20} scale={1.1} />}
      {give < 1 && (
        <g>
          <Bill100 x={506 - give * 220} y={PASS_Y - 26 + give * 70} angle={1 + give * 18} scale={1.1} />
          <Bill100 x={542 - give * 250} y={PASS_Y - 28 + give * 90} angle={10 + give * 12} scale={1.1} />
        </g>
      )}
      <SlipStack x={900 - sweep * 250} y={PASS_Y - 28} count={7} hot />
      <SlipStack x={690 + sweep * 210} y={PASS_Y - 28} count={5} hot={false} />
    </KitchenScene>
  );
}

// 11. Раздача оживает: тарелки подряд, Костя и Дима носятся, счётчик падает
export function AliveShot() {
  const frame = useCurrentFrame();
  const kostya = stepValue<EmotionName>(frame, [[0, 'panic'], [clipAt('alive', 'kostya_mest'), 'smirk']]);
  return (
    <KitchenScene
      gena="neutral"
      borscht={false}
      phase={frame}
      front={[
        { id: 'kostya', emotion: kostya, x: 250 + Math.sin(frame * 0.22) * 100, footY: 780 - Math.abs(Math.sin(frame * 0.5)) * 18, height: 560, tilt: 8, live: liveOf(frame, 'alive', 'kostya') },
        { id: 'dima', emotion: 'happy', x: 460 + Math.cos(frame * 0.22) * 100, footY: 780 - Math.abs(Math.cos(frame * 0.5)) * 18, height: 520, tilt: -8 },
      ]}
      boilSeed={boilSeedAt(frame)}
    >
      {Array.from({ length: 7 }, (_, i) => (
        <HotBorscht key={i} x={640 + ((frame * 8 + i * 75) % 520)} y={PASS_Y - 8} scale={0.95} steam={1} phase={frame + i * 5} />
      ))}
      <SpeedLines frame={frame} />
    </KitchenScene>
  );
}

// 12. Гость получает горячий борщ и улыбается
export function GuestShot() {
  const frame = useCurrentFrame();
  const guest = stepValue<EmotionName>(frame, [[0, 'angry'], [GUEST.smileAt, 'happy']]);
  return <HotHallScene frame={frame} guest={guest} guestLive={liveOf(frame, 'guest', 'guest')} kostya="surprised" boilSeed={boilSeedAt(frame)} />;
}

// Лист «график смены» на столе Эдуарда; листается
function ShiftSheets({ frame }: { frame: number }) {
  const flip = Math.floor(frame / 14) % 3;
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${660 + i * 8} ${480 - i * 3}) rotate(${i === flip ? -10 : 2 - i * 2})`}>
          <rect x={-56} y={-14} width={112} height={26} fill="#fffdf7" stroke={INK} strokeWidth={2.5} />
          <path d="M -44 -6 L 44 -6 M -44 2 L 30 2" stroke="#9a9a9a" strokeWidth={2} />
          <path d={`M ${-44 + i * 20} -9 l 12 0`} stroke="#c2412f" strokeWidth={3} />
        </g>
      ))}
    </g>
  );
}

// 13. Кабинет: Эдуард листает смену
export function OfficeShot() {
  const frame = useCurrentFrame();
  return (
    <OfficeScene
      kostya="tired"
      eduard="tired"
      kostyaLive={{ blink: frame % 80 < 4 }}
      eduardLive={liveOf(frame, 'office', 'eduard')}
      sheetProgress={0}
      boilSeed={boilSeedAt(frame)}
      frontChildren={<ShiftSheets frame={frame} />}
    />
  );
}

// Дверь кабинета с матовым стеклом, за ним — тень хозяйки; shake — дрожь от стука
function OfficeDoor({ shadow, shake }: { shadow: number; shake: number }) {
  return (
    <g transform={`translate(${shake} 0)`}>
      <rect x={-70} y={228} width={330} height={342} fill="#8a6a4c" stroke={INK} strokeWidth={S} />
      <rect x={-30} y={258} width={250} height={190} rx={8} fill="#d8e4ea" stroke={INK} strokeWidth={S} />
      <clipPath id="door-glass">
        <rect x={-30} y={258} width={250} height={190} rx={8} />
      </clipPath>
      <g clipPath="url(#door-glass)">
        <OwnerSilhouette x={95} y={375} scale={0.45 + 0.5 * shadow} alpha={0.25 + 0.7 * shadow} />
      </g>
      <circle cx={232} cy={440} r={9} fill={CHAR.gold} stroke={INK} strokeWidth={2.4} />
    </g>
  );
}

// 14. Стук каблуков, тень хозяйки в двери, Эдуард шепчет
export function HeelsShot() {
  const frame = useCurrentFrame();
  const shadow = interpolate(frame, [HEELS.shadowFrom, HEELS.shadowTo], [0, 1], { ...CLAMP, easing: Easing.in(Easing.quad) });
  const knock = frame >= HEELS.knockAt && frame < HEELS.knockAt + 16 ? Math.sin(frame * 3) * 3 : 0;
  const eduard = stepValue<EmotionName>(frame, [[0, 'tired'], [HEELS.knockAt, 'surprised'], [clipAt('heels', 'eduard_shepot'), 'skeptical']]);
  const kostya = stepValue<EmotionName>(frame, [[0, 'tired'], [HEELS.knockAt, 'panic']]);
  return (
    <OfficeScene
      kostya={kostya}
      eduard={eduard}
      kostyaX={500}
      kostyaLive={{ blink: frame % 80 < 4 }}
      eduardLive={liveOf(frame, 'heels', 'eduard')}
      sheetProgress={0}
      boilSeed={boilSeedAt(frame)}
      backChildren={<OfficeDoor shadow={shadow} shake={knock} />}
    />
  );
}

// 15. Крупный план: Костя в камеру, брови вверх
export function CloseUpShot() {
  const frame = useCurrentFrame();
  const len = sceneLength('closeup');
  const kostya = stepValue<EmotionName>(frame, [[0, 'surprised'], [clipAt('closeup', 'kostya_beda') + voiceFrames(2.4), 'panic']]);
  return (
    <CloseUpScene
      kostya={kostya}
      kostyaLive={liveOf(frame, 'closeup', 'kostya')}
      push={interpolate(frame, [0, len], [0.92, 1.08], CLAMP)}
      boilSeed={boilSeedAt(frame)}
    />
  );
}

// 16. Развилка: А / Б / свой вариант + голосование + титры «спасибо за идею»
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
