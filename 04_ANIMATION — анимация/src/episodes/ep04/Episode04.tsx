import { Sequence } from 'remotion';
import { EpisodeFrame } from '../../layout/EpisodeFrame';
import { ChecksCounter, Credit, MatPlates, SceneText } from './overlays';
import { SceneAudio } from './SceneAudio';
import { CallShot, CommentsShot, CounterShot, OnionShot, PrinterShot, RuleShot, SlowmoShot, SplitShot } from './shots-a';
import { AliveShot, CloseUpShot, FreezeShot, ForkShot, GuestShot, HeelsShot, OfficeShot, SotnyaShot } from './shots-b';
import { EP04, SCENES, type SceneId } from './timeline';

// Серия 4 «Холодная война» целиком: 16 планов, жёсткие склейки. Одна версия для всех площадок:
// мат заменён плашкой 🤬 (и «мяу» при озвучке).

const SHOTS: Record<SceneId, () => React.ReactNode> = {
  printer: PrinterShot,
  comments: CommentsShot,
  counter: CounterShot,
  onion: OnionShot,
  split: SplitShot,
  call: CallShot,
  rule: RuleShot,
  slowmo: SlowmoShot,
  freeze: FreezeShot,
  sotnya: SotnyaShot,
  alive: AliveShot,
  guest: GuestShot,
  office: OfficeShot,
  heels: HeelsShot,
  closeup: CloseUpShot,
  fork: ForkShot,
};

export function Episode04() {
  return (
    <EpisodeFrame episode={EP04.episode} title={EP04.title} ladderStep={EP04.ladderStep}>
      {SCENES.map((s) => {
        const Shot = SHOTS[s.id];
        return (
          <Sequence key={s.id} from={s.from} durationInFrames={s.to - s.from} name={`сцена: ${s.id}`}>
            <Shot />
            <MatPlates scene={s.id} />
            <SceneText scene={s.id} />
            <ChecksCounter scene={s.id} />
            <SceneAudio scene={s.id} />
            {s.id === 'fork' && <Credit />}
          </Sequence>
        );
      })}
    </EpisodeFrame>
  );
}
