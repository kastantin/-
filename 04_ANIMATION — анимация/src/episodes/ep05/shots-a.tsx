import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { boilSeedAt, inSpan, isBlinking, isMouthOpen, stepValue } from '../../animation/motion';
import { SceneCharacter, type LiveState } from '../../characters/Character';
import type { EmotionName } from '../../characters/expressions';
import { RedPenHeld } from '../../characters/parts-ep05';
import { SCENE_VIEWBOX, VIDEO } from '../../config';
import { OfficeScene } from '../../scenes/OfficeScene';
import { ChecklistScene } from '../../scenes/ep02/ChecklistScene';
import { INK, S, TEXT_FONT } from '../../scenes/ep02/kit';
import { ChatPhoneScene, FormScene, PollScene5, QueueScene, ScheduleSheet, StampScene, StoreroomCallScene } from '../../scenes/ep05/Scenes5';
import { CHAT, CHECKLIST_EV, clipAt, FREEZE, LEDGER, MONTAGE, POLL, speechSpans, voiceFrames, type SceneId, type Speaker } from './timeline';

// Кадры сцен 1–8 серии 5 (время — от начала своей сцены)

export const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const LIVE_OFFSET: Record<Exclude<Speaker, 'narrator'>, number> = { owner: 0, kostya: 1, eduard: 2, nadir: 3, guest: 4, akhma: 5, beks: 6 };

// Рот двигается только пока в озвучке звучит речь этого персонажа
export function liveOf(frame: number, scene: SceneId, who: Exclude<Speaker, 'narrator'>): LiveState {
  const offset = LIVE_OFFSET[who];
  const speaking = speechSpans(scene, who).some((span) => inSpan(frame, span));
  return { blink: isBlinking(frame, offset), talking: speaking && isMouthOpen(frame, offset) };
}

// 1. Хозяйка тычет в камеру телефоном: чат района и красная цифра штрафа
export function ChatShot() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <ChatPhoneScene
      chatIn={spring({ frame: frame - 2, fps, config: { damping: 12 } })}
      bigIn={spring({ frame: frame - CHAT.bigAt, fps, config: { damping: 8, stiffness: 200 } })}
      owner="neutral"
      ownerLive={liveOf(frame, 'chat', 'owner')}
      boilSeed={boilSeedAt(frame)}
    />
  );
}

function FreezeLabel({ text, x, y, progress }: { text: string; x: number; y: number; progress: number }) {
  if (progress <= 0) return null;
  const w = text.length * 14 + 40;
  return (
    <g transform={`translate(${x} ${y}) scale(${progress}) rotate(-3)`}>
      <rect x={-w / 2} y={-28} width={w} height={56} rx={10} fill="#f2c14e" stroke={INK} strokeWidth={S} />
      <text x={0} y={9} textAnchor="middle" fontFamily={TEXT_FONT} fontWeight={800} fontSize={27} fill={INK}>
        {text}
      </text>
    </g>
  );
}

// 2. Стоп-кадр в кабинете: плашки «Костя — признался», «Эдуард — «ничего не видел»», «Маргарита Львовна — хозяйка»
export function FreezeShot() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seed = 3;
  const labels = [
    { text: 'Костя — признался', x: 230, y: 150 },
    { text: 'Эдуард — «ничего не видел»', x: 610, y: 245 },
    { text: 'Маргарита Львовна — хозяйка', x: 930, y: 130 },
  ];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: 'grayscale(0.7) contrast(1.1)' }}>
        <OfficeScene
          kostya="sad"
          eduard="tired"
          sheetProgress={0}
          boilSeed={seed}
          frontChildren={<SceneCharacter id="owner" emotion="neutral" x={990} footY={780} height={560} boilSeed={seed} />}
        />
      </AbsoluteFill>
      <svg width={VIDEO.width} height={VIDEO.height} viewBox={SCENE_VIEWBOX} style={{ position: 'absolute' }}>
        {labels.map((l, i) => (
          <FreezeLabel key={l.text} text={l.text} x={l.x} y={l.y} progress={spring({ frame: frame - FREEZE.plateAt[i], fps, config: { damping: 10 } })} />
        ))}
      </svg>
      <AbsoluteFill style={{ backgroundColor: '#ffffff', opacity: interpolate(frame, [0, 4], [0.8, 0], CLAMP) }} />
    </AbsoluteFill>
  );
}

// 3. «Вы выбрали»: А 67% · Б 33% · 💬 0, плашка «3 голоса — рекорд канала»
export function PollShot() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shout = clipAt('poll', 'kostya_tri');
  const kostya = stepValue<EmotionName>(frame, [[0, 'tired'], [POLL.plateAt, 'surprised'], [shout + voiceFrames(4.4), 'panic']]);
  const grow = interpolate(frame, [POLL.barsAt, POLL.barsAt + 30], [0, 1], CLAMP);
  return (
    <PollScene5
      kostya={kostya}
      kostyaLive={liveOf(frame, 'poll', 'kostya')}
      bars={[grow, grow, grow]}
      plateIn={spring({ frame: frame - POLL.plateAt, fps, config: { damping: 9 } })}
      boilSeed={boilSeedAt(frame)}
    />
  );
}

// 4. Кабинет: Эдуард багровый, усы дрожат; в углу включается таймер (он — в общем слое)
export function Office1Shot() {
  const frame = useCurrentFrame();
  return (
    <OfficeScene
      kostya="tired"
      eduard="angry"
      kostyaLive={liveOf(frame, 'office1', 'kostya')}
      eduardLive={liveOf(frame, 'office1', 'eduard')}
      eduardTilt={Math.sin(frame * 1.6) * 1.2}
      sheetProgress={0}
      boilSeed={boilSeedAt(frame)}
    />
  );
}

// 5. Хозяйка листает график смен и красной ручкой обводит три фамилии
export function LedgerShot() {
  const frame = useCurrentFrame();
  const seed = boilSeedAt(frame);
  const circles = LEDGER.circlesAt.map((at) => interpolate(frame, [at, at + 20], [0, 1], CLAMP));
  return (
    <OfficeScene
      kostya="sad"
      eduard="panic"
      kostyaLive={liveOf(frame, 'ledger', 'kostya')}
      sheetProgress={0}
      boilSeed={seed}
      frontChildren={
        <g>
          <ScheduleSheet circles={circles} />
          <SceneCharacter id="owner" emotion="skeptical" x={990} footY={780} height={560} boilSeed={seed} held={<RedPenHeld />} {...liveOf(frame, 'ledger', 'owner')} />
        </g>
      }
    />
  );
}

// 6. Чек-лист оформления влетает пунктами, Эдуард устало соглашается
export function ChecklistShot() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <ChecklistScene
      title="ОФОРМЛЕНИЕ"
      items={['трудовой', 'медкнижка', 'инструктаж', 'форма']}
      slap={interpolate(frame, [0, 8], [0, 1], CLAMP)}
      itemsIn={CHECKLIST_EV.itemsAt.map((at) => spring({ frame: frame - at, fps, config: { damping: 14 } }))}
      eduard={stepValue<EmotionName>(frame, [[0, 'tired'], [clipAt('checklist', 'eduard_konechno') - 6, 'sad']])}
      eduardLive={liveOf(frame, 'checklist', 'eduard')}
      boilSeed={boilSeedAt(frame)}
    />
  );
}

// 7. Звонок Бексу: он в подсобке соседнего ресторана и говорит шёпотом
export function CallShot() {
  const frame = useCurrentFrame();
  const kostya = stepValue<EmotionName>(frame, [[0, 'sad'], [clipAt('call', 'kostya_raznica'), 'surprised'], [clipAt('call', 'beks_uvidish'), 'panic']]);
  return (
    <StoreroomCallScene
      frame={frame}
      kostya={kostya}
      kostyaLive={liveOf(frame, 'call', 'kostya')}
      beks="skeptical"
      beksLive={liveOf(frame, 'call', 'beks')}
      boilSeed={boilSeedAt(frame)}
    />
  );
}

// 8. Монтаж «оформление»: Ахма с анкетой и ломающейся ручкой, Надир в очереди, Дима со штампом
export function MontageShot() {
  const frame = useCurrentFrame();
  const seed = boilSeedAt(frame);
  if (frame < MONTAGE.cutQueue) {
    return (
      <FormScene
        written={interpolate(frame, [6, MONTAGE.breakFrom], [0, 1], CLAMP)}
        akhma={frame >= MONTAGE.breakFrom ? 'surprised' : 'neutral'}
        akhmaLive={liveOf(frame, 'montage', 'akhma')}
        breakT={interpolate(frame, [MONTAGE.breakFrom, MONTAGE.breakTo], [0, 1], CLAMP)}
        boilSeed={seed}
      />
    );
  }
  if (frame < MONTAGE.cutStamp) {
    return <QueueScene frame={frame} nadir="neutral" nadirLive={liveOf(frame, 'montage', 'nadir')} boilSeed={seed} />;
  }
  return <StampScene frame={frame - MONTAGE.cutStamp} dima="happy" boilSeed={seed} />;
}
