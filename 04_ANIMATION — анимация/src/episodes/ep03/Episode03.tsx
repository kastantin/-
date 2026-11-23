import { Sequence } from 'remotion';
import { EpisodeFrame } from '../../layout/EpisodeFrame';
import { BanquetClock, Credit, MatPlates, SceneText } from './overlays';
import { SceneAudio } from './SceneAudio';
import { AkhmaShot, BeksShot, CallShot, HookShot, IdeaShot, NadirShot, OfficeShot, PollShot } from './shots-a';
import { CakeShot, EnvelopeShot, ForkShot, HotRushShot, MontageShot, ReliefShot, TimingShot, WhisperShot } from './shots-b';
import { EP03, SCENES, type SceneId } from './timeline';

// Серия 3 «Друзья» целиком: 16 планов, жёсткие склейки. Одна версия для всех площадок:
// мат заменён плашкой 🤬 (и «мяу» при озвучке).

const SHOTS: Record<SceneId, () => React.ReactNode> = {
  hook: HookShot,
  poll: PollShot,
  idea: IdeaShot,
  call: CallShot,
  beks: BeksShot,
  akhma: AkhmaShot,
  nadir: NadirShot,
  office: OfficeShot,
  timing: TimingShot,
  montage: MontageShot,
  hotrush: HotRushShot,
  cake: CakeShot,
  relief: ReliefShot,
  envelope: EnvelopeShot,
  whisper: WhisperShot,
  fork: ForkShot,
};

export function Episode03() {
  return (
    <EpisodeFrame episode={EP03.episode} title={EP03.title} ladderStep={EP03.ladderStep}>
      {SCENES.map((s) => {
        const Shot = SHOTS[s.id];
        return (
          <Sequence key={s.id} from={s.from} durationInFrames={s.to - s.from} name={`сцена: ${s.id}`}>
            <Shot />
            <MatPlates scene={s.id} />
            <SceneText scene={s.id} />
            <BanquetClock scene={s.id} />
            <SceneAudio scene={s.id} />
            {s.id === 'fork' && <Credit />}
          </Sequence>
        );
      })}
    </EpisodeFrame>
  );
}
