import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { boilSeedAt, inSpan, isBlinking, isMouthOpen } from '../../animation/motion';
import type { LiveState } from '../../characters/Character';
import { ForkScene } from '../../scenes/ForkScene';
import { ThoughtScene } from '../../scenes/ThoughtScene';
import { Button, Gum, Note, TipJar } from '../../scenes/ep06/props';
import { Stage6, type Actor } from '../../scenes/ep06/Stage6';
import { CashStack, Clipboard, Envelope } from '../../scenes/ep07/props';
import { BADGE_COLOR, VerticalFork } from '../ep06c/shots';
import { useTimeline } from './context';
import type { SceneId, Speaker, Timeline } from './timeline';

// Кадры серии 7 «Для Кости». Каждая сцена рисуется в 16:9 и в вертикали 9:16 (prop `v`); время — от начала сцены.

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
type ShotProps = { v?: boolean };
type OnScreen = Exclude<Speaker, 'narrator'>;
const LIVE_OFFSET: Record<OnScreen, number> = { owner: 0, kostya: 1, eduard: 2, gena: 3, beks: 6 };

// Рот двигается только пока звучит речь этого персонажа
function liveOf(tl: Timeline, frame: number, scene: SceneId, who: OnScreen): LiveState {
  const offset = LIVE_OFFSET[who];
  const speaking = tl.speechSpans(scene, who).some((span) => inSpan(frame, span));
  return { blink: isBlinking(frame, offset), talking: speaking && isMouthOpen(frame, offset) };
}

function idle(frame: number, offset: number): LiveState {
  return { blink: isBlinking(frame, offset) };
}

// Падение предмета на стойку: старт s (кадр), длина len
function drop(frame: number, s: number, len: number, fromY: number, toY: number): number {
  const p = interpolate(frame, [s, s + len], [0, 1], CLAMP);
  return fromY + (toY - fromY) * p * p;
}

// 1. Холодный старт: крупно банка Бекса тяжело садится на стойку, в кадре 0 она ещё в воздухе
export function ColdShot({ v }: ShotProps) {
  const frame = useCurrentFrame();
  const tl = useTimeline();
  const fall = interpolate(frame, [0, 4], [-70, 0], CLAMP);
  const rattle = frame >= 4 && frame < 26 ? Math.sin((frame - 4) * 1.7) * 5 * (1 - (frame - 4) / 22) : 0;
  const squash = frame >= 4 && frame < 10 ? 1 - 0.07 * Math.sin(((frame - 4) / 6) * Math.PI) : 1;
  const actors: Actor[] = [{ id: 'kostya', emotion: 'neutral', x: 280, vx: 500, vh: 470, live: liveOf(tl, frame, 'cold', 'kostya') }];
  return (
    <Stage6
      bg="cashier"
      actors={actors}
      vertical={v}
      focus={v ? 620 : 540}
      boilSeed={boilSeedAt(frame)}
      front={
        <g transform={`translate(${700 + rattle} ${470 + fall}) scale(2.1 ${2.1 * squash})`}>
          <TipJar x={0} y={0} name="Бекс" fill={0.95} kind="coins" />
        </g>
      }
    />
  );
}

// 2. Закрытие: хозяйка у кассы, на стойке две банки
export function RuleShot({ v }: ShotProps) {
  const frame = useCurrentFrame();
  const tl = useTimeline();
  const actors: Actor[] = [
    { id: 'kostya', emotion: 'tired', x: 320, vx: 480, vh: 360, live: liveOf(tl, frame, 'rule', 'kostya') },
    { id: 'owner', emotion: 'neutral', x: 760, flip: true, vx: 735, vh: 360, live: liveOf(tl, frame, 'rule', 'owner') },
  ];
  const jarX = v ? [565, 685] : [580, 710];
  return (
    <Stage6
      bg="cashier"
      actors={actors}
      vertical={v}
      focus={v ? 600 : 540}
      boilSeed={boilSeedAt(frame)}
      front={
        <g>
          <TipJar x={jarX[0]} y={470} name="Бекс" fill={0.9} kind="coins" />
          <TipJar x={jarX[1]} y={470} name="Костя" fill={0.1} kind="paper" />
        </g>
      }
    />
  );
}

// 3. Подсчёт при всех: сначала банка Бекса (пачки), затем банка Кости (пуговица, жвачка, записка)
export function CountShot({ v }: ShotProps) {
  const frame = useCurrentFrame();
  const tl = useTimeline();
  const cut = tl.events.countCut;
  const second = frame >= cut;
  const t = second ? frame - cut : frame;
  const cx = v ? 620 : 640;
  const tilt = interpolate(t, [0, 10], [140, 165], CLAMP);
  const actors: Actor[] = [
    second
      ? { id: 'kostya', emotion: 'sad', x: 320, vx: 480, vh: 360, live: liveOf(tl, frame, 'count', 'kostya') }
      : { id: 'beks', emotion: 'happy', x: 320, vx: 480, vh: 360, live: idle(frame, 6) },
    { id: 'owner', emotion: 'neutral', x: 760, flip: true, vx: 735, vh: 360, live: liveOf(tl, frame, 'count', 'owner') },
  ];
  return (
    <Stage6
      bg="cashier"
      actors={actors}
      vertical={v}
      focus={v ? 620 : 540}
      boilSeed={boilSeedAt(frame)}
      front={
        second ? (
          <g>
            <g transform={`translate(${cx} 300) rotate(${tilt})`}>
              <TipJar x={0} y={0} name="Костя" fill={0.05} kind="paper" />
            </g>
            <Button x={cx - 70} y={drop(t, 2, 12, 330, 468)} />
            <Gum x={cx} y={drop(t, 6, 12, 330, 470)} />
            <Note x={cx + 90} y={drop(t, 10, 14, 330, 470)} lines={['Не ешьте', 'рыбу']} angle={-6} width={160} />
          </g>
        ) : (
          <g>
            <g transform={`translate(${cx} 300) rotate(${tilt})`}>
              <TipJar x={0} y={0} name="Бекс" fill={0.9} kind="coins" />
            </g>
            <CashStack x={cx - 95} y={drop(t, 2, 12, 330, 470)} label="2000" />
            <CashStack x={cx} y={drop(t, 6, 12, 330, 470)} label="1500" />
            <CashStack x={cx + 95} y={drop(t, 10, 12, 330, 470)} label="600" />
          </g>
        )
      }
    />
  );
}

// 4. Эдуард добирает монеты со дна банки Бекса и находит конверт «Для Кости»
export function EnvelopeShot({ v }: ShotProps) {
  const frame = useCurrentFrame();
  const tl = useTimeline();
  const { envelopeFound, envelopeCard } = tl.events;
  const jarX = v ? [600, 720] : [640, 760];
  const clang = frame >= 6 && frame < 20 ? Math.sin((frame - 6) * 1.6) * 4 : 0;
  const found = frame >= envelopeFound;
  const big = spring({ frame: frame - envelopeCard, fps: useVideoConfig().fps, config: { damping: 14 } });
  const envX = v ? 660 : 700;
  const envY = found ? drop(frame, envelopeFound, 10, 360, 480) : 0;
  const actors: Actor[] = [
    { id: 'eduard', emotion: 'skeptical', x: 330, vx: 480, vh: 380, live: liveOf(tl, frame, 'envelope', 'eduard') },
    { id: 'beks', emotion: found ? 'surprised' : 'smirk', x: 960, flip: true, vx: 800, vh: 380, live: idle(frame, 6) },
  ];
  return (
    <Stage6
      bg="cashier"
      actors={actors}
      vertical={v}
      focus={v ? 630 : 540}
      boilSeed={boilSeedAt(frame)}
      front={
        <g>
          <g transform={`translate(${clang} 0)`}>
            <TipJar x={jarX[0]} y={470} name="Бекс" fill={0.9} kind="coins" />
          </g>
          <TipJar x={jarX[1]} y={470} name="Костя" fill={0.1} kind="paper" />
          {found && <Envelope x={envX} y={envY - 20 * big} scale={1 + 0.3 * big} cash={big > 0.5} lines={big > 0.5 ? ['Для Кости', 'За честность про рыбу'] : ['Для Кости']} />}
        </g>
      }
    />
  );
}

// 5. Бекс бледнеет, Гена выглядывает из раздачи; затем Костя с конвертом
export function CaughtShot({ v }: ShotProps) {
  const frame = useCurrentFrame();
  const tl = useTimeline();
  const matNow = tl.matSpans.some((m) => m.scene === 'caught' && frame >= m.from && frame < m.to);
  if (frame < tl.events.kostyaCaught) {
    return (
      <Stage6
        bg="pass"
        mat={matNow ? { actor: 1, size: 84 } : null}
        vertical={v}
        focus={v ? 560 : 540}
        boilSeed={boilSeedAt(frame)}
        actors={[
          { id: 'beks', emotion: 'sad', x: 330, vx: 470, vh: 430, live: liveOf(tl, frame, 'caught', 'beks') },
          { id: 'gena', emotion: 'yell', x: 760, flip: true, vx: 660, vh: 430, live: liveOf(tl, frame, 'caught', 'gena') },
        ]}
      />
    );
  }
  return (
    <Stage6
      bg="cashier"
      vertical={v}
      focus={v ? 620 : 540}
      boilSeed={boilSeedAt(frame)}
      actors={[{ id: 'kostya', emotion: 'smirk', x: 380, vx: 520, vh: 520, live: liveOf(tl, frame, 'caught', 'kostya') }]}
      front={<Envelope x={v ? 700 : 760} y={470} scale={1.2} cash lines={['Для Кости']} />}
    />
  );
}

// 6. Хозяйка с ручкой над списком → стоп-кадр → лицо Кости → развилка
export function LastShot({ v }: ShotProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tl = useTimeline();
  const last = tl.events.last;
  if (frame >= last.forkAt) {
    if (v) return <VerticalFork frame={frame} options={last.options} finalText={last.finalText} finalAt={last.finalAt} />;
    const options = last.options.map((o) => ({
      badge: o.badge,
      lines: [...o.lines],
      color: BADGE_COLOR[o.badge],
      progress: spring({ frame: frame - o.at, fps, config: { damping: 11 } }),
    }));
    return (
      <ForkScene
        options={options}
        voteText={last.finalText}
        voteProgress={spring({ frame: frame - last.finalAt, fps, config: { damping: 14 } })}
        votePulse={frame > last.finalAt + 20 ? 1 + 0.045 * Math.sin((frame - last.finalAt) * 0.2) : 1}
        wobble={Math.sin(frame * 0.08) * 1.2}
        boilSeed={boilSeedAt(frame)}
      />
    );
  }
  if (frame >= last.closeUpAt) {
    if (v) {
      return (
        <Stage6
          bg="back"
          vertical
          focus={540}
          boilSeed={boilSeedAt(last.closeUpAt)}
          gray
          actors={[{ id: 'kostya', emotion: 'panic', x: 540, footY: 960, vx: 540, vh: 900, live: idle(frame, 1) }]}
        />
      );
    }
    return <ThoughtScene emotion="panic" live={idle(frame, 1)} cards={[]} boilSeed={boilSeedAt(last.closeUpAt)} />;
  }
  const frozen = frame >= last.stopAt;
  const seed = frozen ? boilSeedAt(last.stopAt) : boilSeedAt(frame);
  return (
    <Stage6
      bg="cashier"
      vertical={v}
      focus={v ? 640 : 560}
      boilSeed={seed}
      gray={frozen}
      actors={[
        { id: 'kostya', emotion: frozen ? 'panic' : 'neutral', x: 330, vx: 520, vh: 430, live: frozen ? undefined : idle(frame, 1) },
        { id: 'owner', emotion: 'neutral', x: 760, flip: true, vx: 780, vh: 430, live: frozen ? undefined : idle(frame, 0) },
      ]}
      front={
        <g>
          <Envelope x={v ? 660 : 560} y={470} scale={1} cash lines={['Для Кости']} />
          <Clipboard x={v ? 760 : 880} y={470} />
        </g>
      }
    />
  );
}
