import { AbsoluteFill, Audio, interpolate, Sequence, staticFile } from 'remotion';
import { COLORS } from '../../config';
import { EpisodeFrame } from '../../layout/EpisodeFrame';
import { TimelineContext } from './context';
import { ChoicePlate, SceneText } from './overlays';
import { SceneAudio } from './SceneAudio';
import { CaughtShot, ColdShot, CountShot, EnvelopeShot, LastShot, RuleShot } from './shots';
import { createTimeline, DEFAULT_RULE_VARIANT, EP07, type RuleVariant, type SceneId, type Timeline } from './timeline';

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

// Очень тихий фон-джаз на всю серию: плавный вход 0,5 с, обрыв вместе со скрипом пластинки на стоп-кадре сцены 6
const BG_FILE = 'audio/ep07/restaurant_jazz_a.mp3';
const BG_VOLUME = 0.07;
const BG_FADE_IN = 15;

function Background({ tl }: { tl: Timeline }) {
  const lastScene = tl.scenes[tl.scenes.length - 1];
  const stop = lastScene.from + tl.events.last.stopAt;
  return (
    <Sequence from={0} durationInFrames={stop} layout="none" name="фон: джаз">
      <Audio
        src={staticFile(BG_FILE)}
        loop
        volume={(f) => BG_VOLUME * interpolate(f, [0, BG_FADE_IN], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
      />
    </Sequence>
  );
}

function Scenes({ variant, v }: { variant: RuleVariant; v?: boolean }) {
  const tl = createTimeline(variant);
  return (
    <TimelineContext.Provider value={tl}>
      <Background tl={tl} />
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
