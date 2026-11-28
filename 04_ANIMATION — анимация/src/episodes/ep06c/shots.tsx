import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { boilSeedAt, inSpan, isBlinking, isMouthOpen, stepValue } from '../../animation/motion';
import type { LiveState } from '../../characters/Character';
import type { EmotionName } from '../../characters/expressions';
import { ForkScene } from '../../scenes/ForkScene';
import { ThoughtScene } from '../../scenes/ThoughtScene';
import { Banknote, Button, Gum, Note, Sticker, TipJar } from '../../scenes/ep06/props';
import { Stage6, type Actor } from '../../scenes/ep06/Stage6';
import { clipAt, LAST, MAT_SPANS, NOTES, speechSpans, TIPS, type SceneId, type Speaker } from './timeline';

// Кадры серии 6 «На чай». Каждая сцена рисуется в 16:9 и в вертикали 9:16 (prop `v`); время — от начала сцены.

export const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
type ShotProps = { v?: boolean };
type OnScreen = Exclude<Speaker, 'narrator'>;
const LIVE_OFFSET: Record<OnScreen, number> = { owner: 0, kostya: 1, eduard: 2, gena: 3, beks: 6 };

// Рот двигается только пока звучит речь этого персонажа
export function liveOf(frame: number, scene: SceneId, who: OnScreen): LiveState {
  const offset = LIVE_OFFSET[who];
  const speaking = speechSpans(scene, who).some((span) => inSpan(frame, span));
  return { blink: isBlinking(frame, offset), talking: speaking && isMouthOpen(frame, offset) };
}

// Гости без своего голоса только моргают: их реплики читает диктор
function idle(frame: number, offset: number): LiveState {
  return { blink: isBlinking(frame, offset) };
}

// Падение предмета на стойку: старт s (кадр), финиш s+len
function drop(frame: number, s: number, len: number, fromY: number, toY: number): number {
  const p = interpolate(frame, [s, s + len], [0, 1], CLAMP);
  return fromY + (toY - fromY) * p * p;
}

// 1. Хук: Костя высыпает банку; в кадре 0 предметы уже летят
export function JarShot({ v }: ShotProps) {
  const frame = useCurrentFrame();
  const cx = v ? 640 : 600;
  const actors: Actor[] = [{ id: 'kostya', emotion: 'neutral', x: 380, vx: 520, vh: 470, live: liveOf(frame, 'jar', 'kostya') }];
  const tilt = interpolate(frame, [0, 10], [140, 165], CLAMP);
  return (
    <Stage6
      bg="cashier"
      actors={actors}
      vertical={v}
      focus={v ? 600 : 540}
      boilSeed={boilSeedAt(frame)}
      front={
        <g>
          <g transform={`translate(${cx} 300) rotate(${tilt})`}>
            <TipJar x={0} y={0} name="Костя" fill={0.05} kind="paper" />
          </g>
          <Button x={cx - 80} y={drop(frame, -6, 12, 330, 468)} />
          <Gum x={cx - 10} y={drop(frame, 0, 12, 330, 470)} />
          <Note x={cx + 90} y={drop(frame, 4, 14, 330, 470)} lines={['Не ешьте', 'рыбу']} angle={-6} width={160} />
        </g>
      }
    />
  );
}

// 2. Касса: хозяйка объясняет правило, рядом две банки с именами
export function RuleShot({ v }: ShotProps) {
  const frame = useCurrentFrame();
  const actors: Actor[] = [
    { id: 'beks', emotion: 'happy', x: 320, vx: 480, vh: 360, live: liveOf(frame, 'rule', 'beks') },
    { id: 'owner', emotion: 'neutral', x: 760, flip: true, vx: 735, vh: 360, live: liveOf(frame, 'rule', 'owner') },
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
          <TipJar x={jarX[0]} y={470} name="Бекс" fill={0.6} kind="coins" />
          <TipJar x={jarX[1]} y={470} name="Костя" fill={0.1} kind="paper" />
        </g>
      }
    />
  );
}

// 3. Зал, две склейки: Бексу — деньги, Косте — совет
export function TipsShot({ v }: ShotProps) {
  const frame = useCurrentFrame();
  const second = frame >= TIPS.cutAt;
  const t = second ? frame - TIPS.cutAt : frame;
  const jarAt = v ? 760 : 880;
  const actors: Actor[] = second
    ? [
        { id: 'poet', emotion: 'neutral', x: 400, vx: 600, vh: 400, live: idle(frame, 5) },
        { id: 'kostya', emotion: 'tired', x: 640, flip: true, vx: 890, vh: 400, live: idle(frame, 1) },
      ]
    : [
        { id: 'poet', emotion: 'happy', x: 400, vx: 600, vh: 400, live: idle(frame, 5) },
        { id: 'beks', emotion: 'happy', x: 640, flip: true, vx: 890, vh: 400, live: idle(frame, 6) },
      ];
  return (
    <Stage6
      bg="hall"
      actors={actors}
      vertical={v}
      focus={v ? 745 : 640}
      boilSeed={boilSeedAt(frame)}
      front={
        second ? (
          <Note x={jarAt - 20} y={drop(t, 6, 10, 400, v ? 540 : 500)} lines={['Улыбайтесь', 'чаще']} angle={4} width={190} />
        ) : (
          <g>
            <TipJar x={jarAt} y={500} name="Бекс" fill={0.7} kind="coins" />
            <Banknote x={jarAt} y={drop(t, 4, 12, 330, 430)} label="500" angle={-8} />
          </g>
        )
      }
    />
  );
}

// 4. Склейки: Бекс получает тысячу, Косте — наклейка и записка; потом Гена с запиской и ответ Кости
export function NotesShot({ v }: ShotProps) {
  const frame = useCurrentFrame();
  const genaAt = clipAt('notes', 'gena_s04');
  const boil = boilSeedAt(frame);
  if (frame < NOTES.secondCutAt) {
    return (
      <Stage6
        bg="hall"
        vertical={v}
        focus={v ? 745 : 640}
        boilSeed={boil}
        actors={[
          { id: 'blogger', emotion: 'happy', x: 400, vx: 600, vh: 400, live: idle(frame, 3) },
          { id: 'beks', emotion: 'happy', x: 640, flip: true, vx: 890, vh: 400, live: idle(frame, 6) },
        ]}
        front={
          <g>
            <TipJar x={v ? 760 : 880} y={v ? 470 : 500} name="Бекс" fill={0.85} kind="coins" />
            <Banknote x={v ? 760 : 880} y={drop(frame, 2, 12, 330, v ? 400 : 430)} label="1000" angle={8} />
            <Note x={v ? 600 : 690} y={drop(frame, 10, 12, 380, v ? 700 : 520)} lines={['Спасибо,', 'вы лучший']} angle={-5} width={170} />
          </g>
        }
      />
    );
  }
  if (frame < genaAt) {
    const t = frame - NOTES.secondCutAt;
    return (
      <Stage6
        bg="hall"
        vertical={v}
        focus={v ? 745 : 640}
        boilSeed={boil}
        actors={[
          { id: 'poet', emotion: 'happy', x: 400, vx: 600, vh: 400, live: idle(frame, 5) },
          { id: 'kostya', emotion: 'sad', x: 640, flip: true, vx: 890, vh: 400, live: idle(frame, 1) },
        ]}
        front={
          <g>
            <Note x={v ? 745 : 850} y={drop(t, 2, 10, 380, v ? 640 : 500)} lines={['В следующий раз', 'борщ потеплее']} angle={-4} width={230} />
            <Sticker x={v ? 700 : 960} y={drop(t, 8, 10, 380, v ? 700 : 470)} />
          </g>
        }
      />
    );
  }
  const kostyaEmotion = stepValue<EmotionName>(frame, [[0, 'neutral'], [clipAt('notes', 'kostya_s04') - 4, 'sad']]);
  const matNow = MAT_SPANS.some((m) => m.scene === 'notes' && frame >= m.from && frame < m.to);
  return (
    <Stage6
      bg="pass"
      mat={matNow ? { actor: 0, size: 84 } : null}
      vertical={v}
      focus={v ? 560 : 540}
      boilSeed={boil}
      actors={[
        { id: 'gena', emotion: 'yell', x: 330, vx: 470, vh: 430, live: liveOf(frame, 'notes', 'gena') },
        { id: 'kostya', emotion: kostyaEmotion, x: 760, flip: true, vx: 660, vh: 430, live: liveOf(frame, 'notes', 'kostya') },
      ]}
    />
  );
}

// 5. Эдуард заглядывает в банки: у Бекса звенит, у Кости шуршит
export function JarsShot({ v }: ShotProps) {
  const frame = useCurrentFrame();
  const clang = frame >= 10 && frame < 24 ? Math.sin((frame - 10) * 1.6) * 4 : 0;
  const jarX = v ? [600, 720] : [640, 760];
  const actors: Actor[] = [
    { id: 'eduard', emotion: 'skeptical', x: 330, vx: 480, vh: 380, live: liveOf(frame, 'jars', 'eduard') },
    { id: 'beks', emotion: 'smirk', x: 960, flip: true, vx: 800, vh: 380, live: liveOf(frame, 'jars', 'beks') },
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
            <TipJar x={jarX[0]} y={470} name="Бекс" fill={0.95} kind="coins" />
          </g>
          <TipJar x={jarX[1]} y={470} name="Костя" fill={0.15} kind="paper" />
        </g>
      }
    />
  );
}

export const BADGE_COLOR = { А: '#e5533d', Б: '#3f7a5a', custom: '#2c9ad6' } as const;

export type ForkOption = { badge: keyof typeof BADGE_COLOR; lines: readonly string[]; at: number };

// Развилка для вертикали: три карточки стопкой и финальная плашка (низ кадра свободен); данные по умолчанию — серия 6
export function VerticalFork({
  frame,
  options = LAST.options,
  finalText = LAST.finalText,
  finalAt = LAST.finalAt,
}: {
  frame: number;
  options?: readonly ForkOption[];
  finalText?: string;
  finalAt?: number;
}) {
  const { fps } = useVideoConfig();
  const final = spring({ frame: frame - finalAt, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill style={{ backgroundColor: '#2b2a2e', alignItems: 'center', paddingTop: 520, gap: 24 }}>
      {options.map((o, i) => {
        const p = spring({ frame: frame - o.at, fps, config: { damping: 11 } });
        return (
          <div
            key={o.badge}
            style={{
              width: 900,
              display: 'flex',
              alignItems: 'center',
              gap: 28,
              background: '#f6f3ec',
              border: '5px solid #151515',
              borderRadius: 26,
              padding: '20px 28px',
              boxSizing: 'border-box',
              opacity: p,
              transform: `scale(${0.8 + 0.2 * p}) rotate(${(i - 1) * 1.2}deg)`,
            }}
          >
            <div
              style={{
                flexShrink: 0,
                width: 96,
                height: 96,
                borderRadius: 999,
                background: BADGE_COLOR[o.badge],
                border: '4px solid #151515',
                color: '#f6f3ec',
                fontFamily: 'Segoe UI Black, Arial Black, sans-serif',
                fontSize: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {o.badge === 'custom' ? '💬' : o.badge}
            </div>
            <div style={{ fontFamily: 'Segoe UI, Arial, sans-serif', fontWeight: 800, fontSize: 40, lineHeight: 1.12, color: '#151515' }}>{o.lines.join(' ')}</div>
          </div>
        );
      })}
      <div
        style={{
          marginTop: 12,
          background: '#e5533d',
          color: '#f6f3ec',
          border: '5px solid #151515',
          borderRadius: 40,
          padding: '14px 44px',
          textAlign: 'center',
          lineHeight: 1.15,
          fontFamily: 'Segoe UI Black, Arial Black, sans-serif',
          fontSize: 46,
          opacity: final,
          transform: `scale(${0.85 + 0.15 * final})`,
        }}
      >
        {finalText}
      </div>
    </AbsoluteFill>
  );
}

// 6. Последний стол: гость с картой и телефоном → стоп-кадр → лицо Кости → развилка
export function LastShot({ v }: ShotProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame >= LAST.forkAt) {
    if (v) return <VerticalFork frame={frame} />;
    const options = LAST.options.map((o) => ({
      badge: o.badge,
      lines: [...o.lines],
      color: BADGE_COLOR[o.badge],
      progress: spring({ frame: frame - o.at, fps, config: { damping: 11 } }),
    }));
    return (
      <ForkScene
        options={options}
        voteText={LAST.finalText}
        voteProgress={spring({ frame: frame - LAST.finalAt, fps, config: { damping: 14 } })}
        votePulse={frame > LAST.finalAt + 20 ? 1 + 0.045 * Math.sin((frame - LAST.finalAt) * 0.2) : 1}
        wobble={Math.sin(frame * 0.08) * 1.2}
        boilSeed={boilSeedAt(frame)}
      />
    );
  }
  if (frame >= LAST.closeUpAt) {
    if (v) {
      return (
        <Stage6
          bg="back"
          vertical
          focus={540}
          boilSeed={boilSeedAt(LAST.closeUpAt)}
          gray
          actors={[{ id: 'kostya', emotion: 'panic', x: 540, footY: 960, vx: 540, vh: 900, live: idle(frame, 1) }]}
        />
      );
    }
    return <ThoughtScene emotion="panic" live={idle(frame, 1)} cards={[]} boilSeed={boilSeedAt(LAST.closeUpAt)} />;
  }
  const frozen = frame >= LAST.stopAt;
  const seed = frozen ? boilSeedAt(LAST.stopAt) : boilSeedAt(frame);
  return (
    <Stage6
      bg="hall"
      vertical={v}
      focus={v ? 700 : 640}
      boilSeed={seed}
      gray={frozen}
      actors={[
        { id: 'kostya', emotion: frozen ? 'panic' : 'neutral', x: 330, vx: 560, vh: 430, live: frozen ? undefined : idle(frame, 1) },
        { id: 'poet', emotion: 'neutral', x: 700, flip: true, vx: 800, vh: 430, live: frozen ? undefined : idle(frame, 5) },
      ]}
      front={
        <g>
          <rect x={800} y={470} width={70} height={44} rx={5} fill="#2b2a2e" stroke="#151515" strokeWidth={4} transform="rotate(-6 835 492)" />
          <rect x={886} y={478} width={34} height={56} rx={6} fill="#151515" stroke="#151515" strokeWidth={4} />
          <rect x={890} y={484} width={26} height={40} rx={3} fill="#8fd0e8" />
        </g>
      }
    />
  );
}
