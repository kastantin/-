import { AbsoluteFill, Sequence } from 'remotion';
import { COLORS } from '../../config';
import { EpisodeFrame } from '../../layout/EpisodeFrame';
import { Hud, SceneText, ScorePlates } from './overlays';
import { SceneAudio } from './SceneAudio';
import { BetsShot, BoardShot, CashierShot, ColdShot, FreezeShot, ForkShot, GreetShot, MirrorShot, OrderShot, PassLineShot, PassShot, SevenShot, ServeShot, SplitShot, ThoughtShot } from './shots';
import { EP06, SCENES, VERTICAL, type SceneId } from './timeline';

// Серия 6 «Тайный гость»: 16:9 (Telegram, все 15 сцен) и вертикаль 9:16 (TikTok, сцены 1, 2, 5, 8, 9, 10, 11, 12, 14, 15).
// Одна версия для всех площадок: мат закрыт плашкой 🤬 и низким «мяу».

const SHOTS: Record<SceneId, (props: { v?: boolean }) => React.ReactNode> = {
  cold: ColdShot,
  pass: PassShot,
  cashier: CashierShot,
  board: BoardShot,
  split: SplitShot,
  serve: ServeShot,
  bets: BetsShot,
  mirror: MirrorShot,
  greet: GreetShot,
  seven: SevenShot,
  order: OrderShot,
  passline: PassLineShot,
  thought: ThoughtShot,
  freeze: FreezeShot,
  fork: ForkShot,
};

function SceneLayers({ id, v }: { id: SceneId; v?: boolean }) {
  const Shot = SHOTS[id];
  return (
    <>
      <Shot v={v} />
      <Hud scene={id} v={v} />
      <ScorePlates scene={id} v={v} />
      <SceneText scene={id} v={v} />
      <SceneAudio scene={id} />
    </>
  );
}

export function Episode06() {
  return (
    <EpisodeFrame episode={EP06.episode} title={EP06.title} ladderStep={EP06.ladderStep}>
      {SCENES.map((s) => (
        <Sequence key={s.id} from={s.from} durationInFrames={s.to - s.from} name={`сцена: ${s.id}`}>
          <SceneLayers id={s.id} />
        </Sequence>
      ))}
    </EpisodeFrame>
  );
}

// Вертикаль: без заставки, плашки серии и лестницы — первый кадр сразу действие
export function Episode06Vertical() {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {VERTICAL.map((s) => (
        <Sequence key={s.id} from={s.from} durationInFrames={s.to - s.from} name={`сцена: ${s.id}`}>
          <SceneLayers id={s.id} v />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}
