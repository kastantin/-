import { Sequence } from 'remotion';
import { EpisodeFrame } from '../../layout/EpisodeFrame';
import { MatPlates, MorningTimer, SceneText } from './overlays';
import { SceneAudio } from './SceneAudio';
import { FlashbackShot, FreezeShot, HookShot, PollShot, ReceiptShot, ReviewShot, RunShot, SplitShot } from './shots-a';
import { ChecklistShot, ForkShot, HangShot, NewsShot, PauseShot, ReplyShot, ZeroShot } from './shots-b';
import { EP02, SCENES, type SceneId } from './timeline';

// Серия 2 «Ноль голосов» целиком: 15 планов, жёсткие склейки (на бит).
// censored=true — мат заменён на «мяу» и 🤬 (единственная версия для всех площадок); false оставлен на всякий случай

export type Episode02Props = { censored: boolean };

const SHOTS: Record<SceneId, () => React.ReactNode> = {
  hook: HookShot,
  freeze: FreezeShot,
  poll: PollShot,
  review: ReviewShot,
  run: RunShot,
  split: SplitShot,
  receipt: ReceiptShot,
  flashback: FlashbackShot,
  pause: PauseShot,
  checklist: ChecklistShot,
  hang: HangShot,
  reply: ReplyShot,
  zero: ZeroShot,
  news: NewsShot,
  fork: ForkShot,
};

export function Episode02({ censored }: Episode02Props) {
  return (
    <EpisodeFrame episode={EP02.episode} title={EP02.title} ladderStep={EP02.ladderStep}>
      {SCENES.map((s) => {
        const Shot = SHOTS[s.id];
        return (
          <Sequence key={s.id} from={s.from} durationInFrames={s.to - s.from} name={`сцена: ${s.id}`}>
            <Shot />
            {censored && <MatPlates scene={s.id} />}
            <SceneText scene={s.id} censored={censored} />
            <SceneAudio scene={s.id} censored={censored} />
          </Sequence>
        );
      })}
      {/* фоновой музыки нет: трендовый звук добавляется в приложении при публикации (решение пользователя 21.11.2026) */}
      <MorningTimer />
    </EpisodeFrame>
  );
}
