import { AbsoluteFill, Sequence } from 'remotion';
import { COLORS } from '../../config';
import { EpisodeFrame } from '../../layout/EpisodeFrame';
import { ChoicePlate, SceneText } from './overlays';
import { SceneAudio } from './SceneAudio';
import { JarShot, JarsShot, LastShot, NotesShot, RuleShot, TipsShot } from './shots';
import { EP06, SCENES, type SceneId } from './timeline';

// Серия 6 «На чай»: шесть сцен для 16:9 (Telegram) и вертикали 9:16 (TikTok). Хук в кадре 0: без заставки и титров.

const SHOTS: Record<SceneId, (props: { v?: boolean }) => React.ReactNode> = {
  jar: JarShot,
  rule: RuleShot,
  tips: TipsShot,
  notes: NotesShot,
  jars: JarsShot,
  last: LastShot,
};

function SceneLayers({ id, v }: { id: SceneId; v?: boolean }) {
  const Shot = SHOTS[id];
  return (
    <>
      <Shot v={v} />
      <ChoicePlate scene={id} v={v} />
      <SceneText scene={id} v={v} />
      <SceneAudio scene={id} />
    </>
  );
}

export function EpisodeNaChay() {
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

// Вертикаль: без плашки серии и лестницы, первый кадр сразу действие
export function EpisodeNaChayVertical() {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {SCENES.map((s) => (
        <Sequence key={s.id} from={s.from} durationInFrames={s.to - s.from} name={`сцена: ${s.id}`}>
          <SceneLayers id={s.id} v />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}
