import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { boilSeedAt, inSpan, isBlinking, isMouthOpen, stepValue } from '../../animation/motion';
import type { LiveState } from '../../characters/Character';
import type { EmotionName } from '../../characters/expressions';
import { Ladle } from '../../characters/parts';
import { AkhmaHeld } from '../../characters/parts-ep03';
import { CHAR } from '../../characters/palette';
import { OfficeScene } from '../../scenes/OfficeScene';
import { INK, TEXT_FONT, TITLE_FONT, type Camera } from '../../scenes/ep02/kit';
import { KitchenScene } from '../../scenes/ep02/KitchenScene';
import { DoorFrame, PhoneProp } from '../../scenes/ep03/props3';
import { CallScene, CrewScene, IdeaScene, PollScene3 } from '../../scenes/ep03/ScenesA';
import { SceneCharacter } from '../../characters/Character';
import { CREW_PLATES, HOOK, IDEA, OFFICE, POLL, sceneLength, speechSpans, type SceneId, type Speaker } from './timeline';

// Кадры сцен 1–8 серии 3 (время — от начала своей сцены)

export const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const LIVE_OFFSET: Record<Exclude<Speaker, 'narrator'>, number> = { kostya: 1, eduard: 2, dima: 3, gena: 5, beks: 6, akhma: 7, nadir: 8, tamada: 9 };

// Рот двигается, пока идёт реплика этого персонажа в кадре
export function liveOf(frame: number, scene: SceneId, who: Exclude<Speaker, 'narrator'>): LiveState {
  const offset = LIVE_OFFSET[who];
  // рот двигается только пока в озвучке звучит речь этого персонажа
  const speaking = speechSpans(scene, who).some((span) => inSpan(frame, span));
  return { blink: isBlinking(frame, offset), talking: speaking && isMouthOpen(frame, offset) };
}

export function shakeAt(frame: number, from: number, frames: number, amount: number): number {
  return frame >= from && frame < from + frames ? Math.sin(frame * 2.7) * amount * (1 - (frame - from) / frames) : 0;
}

const PASS_Y = 452;

// Бланк банкета на стене кухни
function OrderSlip() {
  return (
    <g transform="translate(330 285) rotate(-4) scale(1.45)">
      <rect x={-84} y={-76} width={168} height={152} fill="#fffdf7" stroke={INK} strokeWidth={3} />
      <circle cx={0} cy={-72} r={6} fill="#e0523e" stroke={INK} strokeWidth={2} />
      <text x={0} y={-44} textAnchor="middle" fontFamily={TITLE_FONT} fontSize={24} fill="#c2412f">
        БАНКЕТ
      </text>
      <text x={0} y={-8} textAnchor="middle" fontFamily={TITLE_FONT} fontSize={25} fill={INK}>
        40 ПЕРСОН
      </text>
      <path d="M -66 6 L 66 6" stroke={INK} strokeWidth={2} />
      <text x={0} y={34} textAnchor="middle" fontFamily={TEXT_FONT} fontWeight={800} fontSize={17} fill={INK}>
        горячее
      </text>
      <text x={0} y={56} textAnchor="middle" fontFamily={TEXT_FONT} fontWeight={800} fontSize={17} fill="#c2412f">
        одновременно!
      </text>
    </g>
  );
}

// 1. Кухня: Гена смотрит на бланк, роняет половник и орёт
export function HookShot() {
  const frame = useCurrentFrame();
  const t = frame - HOOK.dropAt;
  const gena = stepValue<EmotionName>(frame, [[0, 'neutral'], [HOOK.surpriseAt, 'surprised'], [HOOK.dropAt, 'yell']]);
  const shake = shakeAt(frame, HOOK.dropAt, 12, 8);
  const camera: Camera = { cx: 560, cy: 330, scale: 1.6, shakeX: shake, shakeY: shake * 0.6 };
  return (
    <KitchenScene
      gena={gena}
      genaLive={liveOf(frame, 'hook', 'gena')}
      ladleAngle={frame < HOOK.dropAt ? 0 : null}
      borscht={false}
      phase={frame}
      camera={camera}
      boilSeed={boilSeedAt(frame)}
    >
      <OrderSlip />
      {t >= 0 && (
        <g transform={`translate(${650 + t * 2} ${Math.min(690, PASS_Y - 70 + 0.6 * t * t)}) rotate(${t * 9})`}>
          <Ladle />
        </g>
      )}
    </KitchenScene>
  );
}

// 2. «Вы выбрали»: нули, комментарий и кот
export function PollShot() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kostya = stepValue<EmotionName>(frame, [[0, 'tired'], [POLL.smirkAt, 'happy']]);
  return (
    <PollScene3
      kostya={kostya}
      kostyaLive={liveOf(frame, 'poll', 'kostya')}
      zeroPop={spring({ frame: frame - 3, fps, config: { damping: 8 } })}
      flyT={frame / 70}
      frame={frame}
      commentIn={spring({ frame: frame - POLL.commentAt, fps, config: { damping: 11 } })}
      catIn={spring({ frame: frame - POLL.catAt, fps, config: { damping: 12 } })}
      boilSeed={boilSeedAt(frame)}
    />
  );
}

// 3. Идея зрителя крупно, Костя достаёт телефон
export function IdeaShot() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <IdeaScene
      kostya="smirk"
      kostyaLive={liveOf(frame, 'idea', 'kostya')}
      cardIn={spring({ frame, fps, config: { damping: 12 } })}
      stampIn={spring({ frame: frame - IDEA.stampAt, fps, config: { damping: 8 } })}
      phone={frame >= IDEA.phoneAt ? <PhoneProp /> : undefined}
      boilSeed={boilSeedAt(frame)}
    />
  );
}

// 4. Видеозвонок
export function CallShot() {
  const frame = useCurrentFrame();
  return <CallScene frame={frame} boilSeed={boilSeedAt(frame)} />;
}

// 5–7. Сбор команды: стоп-кадр и плашка-титул
function usePlate(frame: number): { plateIn: number; flash: number } {
  return {
    plateIn: interpolate(frame, [6, 22], [0, 1], { ...CLAMP, easing: Easing.out(Easing.back(1.3)) }),
    flash: interpolate(frame, [0, 6], [0.9, 0], CLAMP),
  };
}

export function BeksShot() {
  const frame = useCurrentFrame();
  return <CrewScene id="beks" emotion="happy" plate={CREW_PLATES.beks} {...usePlate(frame)} push={interpolate(frame, [0, sceneLength('beks')], [1, 1.05])} frame={frame} sparkle boilSeed={3} />;
}

export function AkhmaShot() {
  const frame = useCurrentFrame();
  return <CrewScene id="akhma" emotion="neutral" held={<AkhmaHeld />} plate={CREW_PLATES.akhma} {...usePlate(frame)} push={interpolate(frame, [0, sceneLength('akhma')], [1, 1.05])} frame={frame} boilSeed={3} />;
}

export function NadirShot() {
  const frame = useCurrentFrame();
  const plate = { ...CREW_PLATES.nadir, extraIn: interpolate(frame, [CREW_PLATES.nadir.extraAt, CREW_PLATES.nadir.extraAt + 10], [0, 1], CLAMP) };
  return <CrewScene id="nadir" emotion="neutral" plate={plate} {...usePlate(frame)} push={interpolate(frame, [0, sceneLength('nadir')], [1, 1.04])} frame={frame} boilSeed={3} />;
}

// 8. Кабинет: Эдуард смотрит на троих в дверях
export function OfficeShot() {
  const frame = useCurrentFrame();
  const eduard = stepValue<EmotionName>(frame, [[0, 'skeptical'], [OFFICE.tiredAt, 'tired']]);
  const kostya = stepValue<EmotionName>(frame, [[0, 'smirk'], [OFFICE.kostyaHappyAt, 'happy']]);
  const seed = boilSeedAt(frame);
  const door = (
    <g>
      <DoorFrame x={-100} y={170} w={400} h={400} />
    </g>
  );
  return (
    <OfficeScene
      kostya={kostya}
      eduard={eduard}
      kostyaX={470}
      kostyaLive={liveOf(frame, 'office', 'kostya')}
      eduardLive={liveOf(frame, 'office', 'eduard')}
      sheetProgress={0}
      boilSeed={seed}
      backChildren={door}
      frontChildren={
        <g>
          <SceneCharacter id="beks" emotion="happy" x={10} footY={590} height={330} boilSeed={seed} blink={isBlinking(frame, 6)} />
          <SceneCharacter id="nadir" emotion="neutral" x={205} footY={590} height={330} boilSeed={seed} blink={isBlinking(frame, 8)} />
          <SceneCharacter id="akhma" emotion="neutral" x={105} footY={596} height={375} boilSeed={seed} held={<AkhmaHeldTea />} blink={isBlinking(frame, 7)} />
        </g>
      }
    />
  );
}

// В дверях у Ахмы только чай в руке (тарелки остались на кухне)
function AkhmaHeldTea() {
  return (
    <g transform="translate(-76 168)">
      <path d="M -9 -34 L 9 -34 L 7 0 L -7 0 Z" fill="#b8651f" stroke={INK} strokeWidth={2.2} />
      <path d="M -11 -30 L 11 -30 L 9 -4 L -9 -4 Z" fill="none" stroke={CHAR.steel} strokeWidth={4} strokeLinejoin="round" />
    </g>
  );
}
