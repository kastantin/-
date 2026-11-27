import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { boilSeedAt, inSpan, isBlinking, isMouthOpen, stepValue } from '../../animation/motion';
import type { LiveState } from '../../characters/Character';
import type { EmotionName } from '../../characters/expressions';
import { BagHeld } from '../../characters/parts-ep06';
import { ForkScene } from '../../scenes/ForkScene';
import { ThoughtScene } from '../../scenes/ThoughtScene';
import { BetsSheet, ChecklistBoard, CHECKLIST_ITEMS } from '../../scenes/ep06/hud';
import { Stage6, type Actor } from '../../scenes/ep06/Stage6';
import { BETS_EV, BOARD_EV, clipAt, clipEnd, FORK, speechSpans, VOICE, type SceneId, type Speaker } from './timeline';

// Кадры серии 6. Каждая сцена рисуется и в 16:9, и в вертикали 9:16 (prop `v`): в вертикали сцена
// кадрируется по лицам. Время — от начала своей сцены.

export const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
type ShotProps = { v?: boolean };
type OnScreen = Exclude<Speaker, 'narrator'>;
const LIVE_OFFSET: Record<OnScreen, number> = { owner: 0, kostya: 1, eduard: 2, gena: 3, beks: 6 };

// Рот двигается, только пока звучит речь этого персонажа
export function liveOf(frame: number, scene: SceneId, who: OnScreen): LiveState {
  const offset = LIVE_OFFSET[who];
  const speaking = speechSpans(scene, who).some((span) => inSpan(frame, span));
  return { blink: isBlinking(frame, offset), talking: speaking && isMouthOpen(frame, offset) };
}

// Герои без собственного голоса «говорят» вместе с диктором: рот шевелится, пока читается их реплика
function talkWith(frame: number, scene: SceneId, clipId: string, offset: number): LiveState {
  const clip = VOICE[scene].find((c) => c.id === clipId);
  const speaking = clip ? frame >= clip.at && frame < clip.end : false;
  return { blink: isBlinking(frame, offset), talking: speaking && isMouthOpen(frame, offset) };
}

function idle(frame: number, offset: number): LiveState {
  return { blink: isBlinking(frame, offset) };
}

function Chair() {
  return (
    <g transform="translate(0 -10)">
      <rect x={-34} y={-130} width={14} height={140} rx={3} fill="#8b6b4a" stroke="#151515" strokeWidth={4} />
      <rect x={-34} y={-130} width={70} height={14} rx={3} fill="#8b6b4a" stroke="#151515" strokeWidth={4} />
      <rect x={-34} y={-30} width={84} height={14} rx={3} fill="#8b6b4a" stroke="#151515" strokeWidth={4} />
      <rect x={32} y={-16} width={14} height={90} rx={3} fill="#8b6b4a" stroke="#151515" strokeWidth={4} />
    </g>
  );
}

function Plate({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={46} ry={12} fill="#f6f3ec" stroke="#151515" strokeWidth={3.5} />
      <ellipse cx={x} cy={y - 6} rx={28} ry={7} fill="#b8322a" />
    </g>
  );
}

const shiver = (frame: number, amp: number) => Math.sin(frame * 0.9) * amp;

// 1. Холодный старт: Костя на коленях трёт сумку бабушки, Бекс несёт стул
export function ColdShot({ v }: ShotProps) {
  const frame = useCurrentFrame();
  const actors: Actor[] = [
    { id: 'kostya', emotion: 'panic', x: 380, tilt: 14, bob: shiver(frame, 4), live: idle(frame, 1), height: 470 },
    { id: 'granny', emotion: 'skeptical', x: 640, flip: true, held: <BagHeld />, live: talkWith(frame, 'cold', 'narr_bab', 4) },
    { id: 'beks', emotion: 'happy', x: 900, flip: true, live: idle(frame, 6) },
  ];
  return <Stage6 bg="hall" actors={actors} vertical={v} focus={640} spread={0.7} boilSeed={boilSeedAt(frame)} front={<g transform="translate(1020 700)"><Chair /></g>} />;
}

// 2. Раздача: Гена красный, орёт; Костя отвечает
export function PassShot({ v }: ShotProps) {
  const frame = useCurrentFrame();
  const kostyaStart = clipAt('pass', 'kostya_s02');
  const actors: Actor[] = [
    { id: 'gena', emotion: 'yell', x: 330, live: liveOf(frame, 'pass', 'gena') },
    { id: 'kostya', emotion: stepValue<EmotionName>(frame, [[0, 'tired'], [kostyaStart, 'smirk']]), x: 760, flip: true, live: liveOf(frame, 'pass', 'kostya') },
  ];
  const matNow = frame >= clipAt('pass', 'gena_s02') + 40 && frame < clipAt('pass', 'gena_s02') + 82;
  return <Stage6 bg="pass" actors={actors} vertical={v} focus={470} spread={0.65} mat={matNow ? { actor: 0, size: 130 } : null} boilSeed={boilSeedAt(frame)} />;
}

// 3. Касса: хозяйка и Эдуард
export function CashierShot({ v }: ShotProps) {
  const frame = useCurrentFrame();
  const actors: Actor[] = [
    { id: 'eduard', emotion: 'tired', x: 340, live: liveOf(frame, 'cashier', 'eduard') },
    { id: 'owner', emotion: 'neutral', x: 720, flip: true, live: liveOf(frame, 'cashier', 'owner') },
  ];
  return <Stage6 bg="cashier" actors={actors} vertical={v} boilSeed={boilSeedAt(frame)} />;
}

// 4. Доска с чек-листом (по центру), Костя и Бекс по краям
export function BoardShot({ v }: ShotProps) {
  const frame = useCurrentFrame();
  const shown = BOARD_EV.itemsAt.filter((at) => frame >= at).length;
  const actors: Actor[] = [
    { id: 'kostya', emotion: 'panic', x: 90, height: 500, live: liveOf(frame, 'board', 'kostya') },
    { id: 'beks', emotion: 'happy', x: 990, flip: true, height: 500, live: liveOf(frame, 'board', 'beks') },
  ];
  return (
    <AbsoluteFill>
      <Stage6 bg="board" actors={actors} vertical={v} boilSeed={boilSeedAt(frame)} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 210 }}>
        <ChecklistBoard shown={Math.min(shown, CHECKLIST_ITEMS.length)} width={820} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

// 5. Сплит-скрин: слева Костя → поэт, справа Бекс → блогерша. В вертикали показываем половины по очереди.
function SplitHalf({ left, frame }: { left: boolean; frame: number }) {
  const run = Math.sin(frame * 0.7) * 6;
  const actors: Actor[] = left
    ? [
        { id: 'kostya', emotion: 'panic', x: 170 + Math.min(frame, 40) * 4, tilt: 8, bob: run, live: liveOf(frame, 'split', 'kostya'), height: 480 },
        { id: 'poet', emotion: 'happy', x: 600, flip: true, live: talkWith(frame, 'split', 'narr_stihi', 5), height: 480 },
      ]
    : [
        { id: 'beks', emotion: 'happy', x: 170 + Math.min(frame, 40) * 4, tilt: 8, bob: run, live: liveOf(frame, 'split', 'beks'), height: 480 },
        { id: 'blogger', emotion: 'happy', x: 600, flip: true, live: idle(frame, 3), height: 480 },
      ];
  return <Stage6 bg="hall" actors={actors} boilSeed={boilSeedAt(frame)} />;
}

export function SplitShot({ v }: ShotProps) {
  const frame = useCurrentFrame();
  if (v) {
    const second = frame >= clipEnd('split', 'narr_stihi') - 40;
    return (
      <Stage6
        bg="hall"
        vertical
        focus={280}
        spread={0.8}
        boilSeed={boilSeedAt(frame)}
        actors={
          second
            ? [
                { id: 'beks', emotion: 'happy', x: 140, tilt: 6, live: liveOf(frame, 'split', 'beks'), height: 500 },
                { id: 'blogger', emotion: 'happy', x: 440, flip: true, live: idle(frame, 3), height: 500 },
              ]
            : [
                { id: 'kostya', emotion: 'panic', x: 140, tilt: 6, live: liveOf(frame, 'split', 'kostya'), height: 500 },
                { id: 'poet', emotion: 'happy', x: 440, flip: true, live: talkWith(frame, 'split', 'narr_stihi', 5), height: 500 },
              ]
        }
      />
    );
  }
  return (
    <AbsoluteFill style={{ flexDirection: 'row' }}>
      {[true, false].map((left) => (
        <div key={String(left)} style={{ width: '50%', height: '100%', overflow: 'hidden', borderRight: left ? '6px solid #f6f3ec' : 'none', boxSizing: 'border-box', position: 'relative' }}>
          <div style={{ position: 'absolute', left: -300, top: 0 }}>
            <SplitHalf left={left} frame={frame} />
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
}

// 6. Бекс подаёт блюда, гость хлопает; Костя у стены, Дима молчит
export function ServeShot({ v }: ShotProps) {
  const frame = useCurrentFrame();
  const dimaAsks = VOICE.serve.find((c) => c.id === 'narr_dima');
  const actors: Actor[] = [
    { id: 'kostya', emotion: 'sad', x: 200, tilt: -3, live: liveOf(frame, 'serve', 'kostya') },
    { id: 'dima', emotion: dimaAsks && frame >= dimaAsks.at ? 'surprised' : 'neutral', x: 450, height: 440, live: talkWith(frame, 'serve', 'narr_dima', 2) },
    { id: 'beks', emotion: 'happy', x: 720, flip: true, live: idle(frame, 6) },
    { id: 'poet', emotion: 'happy', x: 950, flip: true, bob: Math.abs(Math.sin(frame * 0.5)) * -6, live: idle(frame, 5) },
  ];
  return (
    <Stage6
      bg="hall"
      actors={actors}
      vertical={v}
      focus={450}
      boilSeed={boilSeedAt(frame)}
      front={
        <g>
          <Plate x={640} y={480} />
          <Plate x={700} y={462} />
          <Plate x={760} y={480} />
        </g>
      }
    />
  );
}

// 7. Кухня: Ахма и Надир принимают ставки, Дима спрашивает (молча)
export function BetsShot({ v }: ShotProps) {
  const frame = useCurrentFrame();
  const shown = [BETS_EV.firstAt, BETS_EV.secondAt].filter((at) => frame >= at).length;
  const actors: Actor[] = [
    { id: 'akhma', emotion: 'neutral', x: 230, live: idle(frame, 5) },
    { id: 'nadir', emotion: 'smirk', x: 540, live: idle(frame, 3) },
    { id: 'dima', emotion: 'happy', x: 820, height: 450, live: idle(frame, 2) },
  ];
  const pop = interpolate(frame, [BETS_EV.sheetAt, BETS_EV.sheetAt + 8], [0, 1], CLAMP);
  return (
    <AbsoluteFill>
      <Stage6 bg="kitchen" actors={actors} vertical={v} boilSeed={boilSeedAt(frame)} />
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 150, opacity: pop }}>
        <BetsSheet shown={shown} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

// 8. Подсобка, зеркало: Костя репетирует приветствие, Бекс учит
export function MirrorShot({ v }: ShotProps) {
  const frame = useCurrentFrame();
  const kostyaStart = clipAt('mirror', 'kostya_s08');
  const actors: Actor[] = [
    { id: 'kostya', emotion: stepValue<EmotionName>(frame, [[0, 'neutral'], [kostyaStart - 4, 'smirk']]), x: 330, live: liveOf(frame, 'mirror', 'kostya') },
    { id: 'beks', emotion: 'happy', x: 800, flip: true, live: liveOf(frame, 'mirror', 'beks') },
  ];
  return <Stage6 bg="back" actors={actors} vertical={v} focus={560} spread={0.6} boilSeed={boilSeedAt(frame)} />;
}

// 9. Зал: Костя выпаливает приветствие, пока гость снимает куртку
export function GreetShot({ v }: ShotProps) {
  const frame = useCurrentFrame();
  const actors: Actor[] = [
    { id: 'kostya', emotion: 'happy', x: 300, tilt: 6, bob: Math.sin(frame * 1.1) * 5, live: liveOf(frame, 'greet', 'kostya') },
    { id: 'poet', emotion: 'surprised', x: 760, flip: true, live: talkWith(frame, 'greet', 'narr_gost', 5) },
  ];
  return <Stage6 bg="hall" actors={actors} vertical={v} focus={530} spread={0.65} boilSeed={boilSeedAt(frame)} />;
}

// 10. Стол 7: гостья в очках, часы, блокнот; Эдуард замечает
export function SevenShot({ v }: ShotProps) {
  const frame = useCurrentFrame();
  const actors: Actor[] = [
    { id: 'eduard', emotion: stepValue<EmotionName>(frame, [[0, 'tired'], [clipAt('seven', 'eduard_s10') + 70, 'skeptical']]), x: 250, live: liveOf(frame, 'seven', 'eduard') },
    { id: 'tguest', emotion: 'skeptical', x: 880, flip: true, live: idle(frame, 4) },
  ];
  return (
    <Stage6
      bg="hall"
      actors={actors}
      vertical={v}
      focus={560}
      spread={0.6}
      boilSeed={boilSeedAt(frame)}
      front={
        <g>
          <circle cx={810} cy={520} r={20} fill="#f6f3ec" stroke="#151515" strokeWidth={4} />
          <path d="M 810 520 L 810 506 M 810 520 L 820 524" stroke="#151515" strokeWidth={3} />
          <rect x={850} y={500} width={50} height={34} rx={3} fill="#f2e6b8" stroke="#151515" strokeWidth={3} />
        </g>
      }
    />
  );
}

// 11. Заказ: Костя и Бекс сталкиваются у кухни, гостья запускает секундомер (он — в HUD)
export function OrderShot({ v }: ShotProps) {
  const frame = useCurrentFrame();
  const bump = interpolate(frame, [40, 52], [0, 1], CLAMP);
  const actors: Actor[] = [
    { id: 'kostya', emotion: 'panic', x: 200 + bump * 90, tilt: 8 * bump, live: idle(frame, 1), height: 480 },
    { id: 'beks', emotion: 'surprised', x: 520 - bump * 70, flip: true, tilt: -8 * bump, live: idle(frame, 6), height: 480 },
    { id: 'tguest', emotion: 'neutral', x: 900, flip: true, live: talkWith(frame, 'order', 'narr_stejk', 4) },
  ];
  return <Stage6 bg="hall" actors={actors} vertical={v} focus={720} spread={0.7} boilSeed={boilSeedAt(frame)} />;
}

// 12. Раздача: Гена разводит руками, Бекс шепчет
export function PassLineShot({ v }: ShotProps) {
  const frame = useCurrentFrame();
  const actors: Actor[] = [
    { id: 'gena', emotion: 'yell', x: 330, live: liveOf(frame, 'passline', 'gena') },
    { id: 'beks', emotion: 'smirk', x: 800, flip: true, live: liveOf(frame, 'passline', 'beks') },
  ];
  return <Stage6 bg="pass" actors={actors} vertical={v} focus={560} spread={0.6} boilSeed={boilSeedAt(frame)} />;
}

// 13. Крупно Костя: подсказки чек-листа
export function ThoughtShot() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = (text: string, x: number, y: number, angle: number, at: number) => ({ text, x, y, angle, progress: spring({ frame: frame - at, fps, config: { damping: 11 } }) });
  return (
    <ThoughtScene
      emotion="panic"
      live={liveOf(frame, 'thought', 'kostya')}
      cards={[
        card('Ошибку признать и компенсировать', 250, 150, -4, 24),
        card('Не выглядеть слабым', 850, 170, 4, 54),
        card('Соврать?', 160, 380, -8, 74),
        card('Признать?', 930, 400, 8, 94),
      ]}
      boilSeed={boilSeedAt(frame)}
    />
  );
}

// 14. Касса: хозяйка смотрит на часы, Эдуард потеет; в конце реплики — стоп-кадр
export function FreezeShot({ v }: ShotProps) {
  const frame = useCurrentFrame();
  const stopAt = clipEnd('freeze', 'eduard_s14') + 4;
  const frozen = frame >= stopAt;
  const live: LiveState = frozen ? { talking: false } : liveOf(frame, 'freeze', 'eduard');
  const actors: Actor[] = [
    { id: 'eduard', emotion: 'panic', x: 340, bob: frozen ? 0 : shiver(frame, 2), live },
    { id: 'owner', emotion: 'skeptical', x: 740, flip: true, live: frozen ? undefined : idle(frame, 0) },
  ];
  return <Stage6 bg="cashier" actors={actors} vertical={v} boilSeed={frozen ? boilSeedAt(stopAt) : boilSeedAt(frame)} gray={frozen} />;
}

// 15. Развилка: три карточки + «Голосуй в Telegram»
const BADGE_COLOR = { А: '#e5533d', Б: '#3f7a5a', custom: '#2c9ad6' } as const;

export function ForkShot({ v }: ShotProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const options = FORK.options.map((o) => ({
    badge: o.badge,
    lines: [...o.lines],
    color: BADGE_COLOR[o.badge],
    progress: spring({ frame: frame - o.at, fps, config: { damping: 11 } }),
  }));
  const scene = (
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
  if (!v) return scene;
  const vote = spring({ frame: frame - FORK.voteAt, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill style={{ backgroundColor: '#2b2a2e', alignItems: 'center', paddingTop: 680, gap: 24 }}>
      {options.map((o, i) => (
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
            opacity: o.progress,
            transform: `scale(${0.8 + 0.2 * o.progress}) rotate(${(i - 1) * 1.2}deg)`,
          }}
        >
          <div
            style={{
              flexShrink: 0,
              width: 96,
              height: 96,
              borderRadius: 999,
              background: o.color,
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
      ))}
      <div
        style={{
          marginTop: 12,
          background: '#2c9ad6',
          color: '#f6f3ec',
          border: '5px solid #151515',
          borderRadius: 999,
          padding: '14px 44px',
          textAlign: 'center',
          lineHeight: 1.15,
          fontFamily: 'Segoe UI Black, Arial Black, sans-serif',
          fontSize: 46,
          opacity: vote,
          transform: `scale(${0.85 + 0.15 * vote})`,
        }}
      >
        Что ответит Костя?
        <br />
        Пиши в комментариях
      </div>
    </AbsoluteFill>
  );
}
