import { Sequence } from 'remotion';
import { EpisodeFrame } from '../../layout/EpisodeFrame';
import { FridayTimer, MatPlates, SceneText } from './overlays';
import { SceneAudio } from './SceneAudio';
import { CallShot, ChatShot, ChecklistShot, FreezeShot, LedgerShot, MontageShot, Office1Shot, PollShot } from './shots-a';
import { DoorShot, EduardShot, ForkShot, MirrorShot, Office2Shot, SmileShot, WallShot } from './shots-b';
import { EP05, SCENES, type SceneId } from './timeline';

// Серия 5 «Дружба дружбой» целиком: 15 планов, жёсткие склейки. Одна версия для всех площадок:
// мат заменён плашкой 🤬 и низким «мяу».

const SHOTS: Record<SceneId, () => React.ReactNode> = {
  chat: ChatShot,
  freeze: FreezeShot,
  poll: PollShot,
  office1: Office1Shot,
  ledger: LedgerShot,
  checklist: ChecklistShot,
  call: CallShot,
  montage: MontageShot,
  smile: SmileShot,
  mirror: MirrorShot,
  office2: Office2Shot,
  eduard: EduardShot,
  wall: WallShot,
  door: DoorShot,
  fork: ForkShot,
};

export function Episode05() {
  return (
    <EpisodeFrame episode={EP05.episode} title={EP05.title} ladderStep={EP05.ladderStep}>
      {SCENES.map((s) => {
        const Shot = SHOTS[s.id];
        return (
          <Sequence key={s.id} from={s.from} durationInFrames={s.to - s.from} name={`сцена: ${s.id}`}>
            <Shot />
            <MatPlates scene={s.id} />
            <SceneText scene={s.id} />
            <FridayTimer scene={s.id} />
            <SceneAudio scene={s.id} />
          </Sequence>
        );
      })}
    </EpisodeFrame>
  );
}
