import { AbsoluteFill, Sequence } from 'remotion';
import { COLORS } from '../../config';
import { EpisodeFrame } from '../../layout/EpisodeFrame';
import { TimelineContext } from './context';
import { ChoicePlate, SceneText } from './overlays';
import { SceneAudio } from './SceneAudio';
import { CaughtShot, ColdShot, CountShot, EnvelopeShot, LastShot, RuleShot } from './shots';
import { createTimeline, DEFAULT_RULE_VARIANT, EP07, type RuleVariant, type SceneId } from './timeline';

// Серия 7 «Для Кости»: шесть сцен для 16:9 (Telegram) и вертикали 9:16 (TikTok). Хук в кадре 0: без заставки и титров.
// variant выбирает сцену 2 по итогам голосования серии 6: 'money' (деньгами) или 'review' (отзывом).

export type Episode07Props = { variant: RuleVariant };
export const episode07Defaults: Episode07Props = { variant: DEFAULT_RULE_VARIANT };

const SHOTS: Record<SceneId, (props: { v?: boolean }) => React.ReactNode> = {
  cold: ColdShot,
  rule: RuleShot,
  count: CountShot,
  envelope: EnvelopeShot,
  caught: CaughtShot,
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

function Scenes({ variant, v }: { variant: RuleVariant; v?: boolean }) {
  const tl = createTimeline(variant);
  return (
    <TimelineContext.Provider value={tl}>
      {tl.scenes.map((s) => (
        <Sequence key={s.id} from={s.from} durationInFrames={s.to - s.from} name={`сцена: ${s.id}`}>
          <SceneLayers id={s.id} v={v} />
        </Sequence>
      ))}
    </TimelineContext.Provider>
  );
}

export function EpisodeDlyaKosti({ variant }: Episode07Props) {
  return (
    <EpisodeFrame episode={EP07.episode} title={EP07.title} ladderStep={EP07.ladderStep}>
      <Scenes variant={variant} />
    </EpisodeFrame>
  );
}

// Вертикаль: без плашки серии и лестницы, первый кадр сразу действие
export function EpisodeDlyaKostiVertical({ variant }: Episode07Props) {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <Scenes variant={variant} v />
    </AbsoluteFill>
  );
}
