import { Audio, interpolate, Sequence, staticFile } from 'remotion';
import { useTimeline } from './context';
import { CENSOR_MEOW, CENSOR_TONE, CENSOR_VOLUME, MEOW_FRAMES, type PlacedClip, type SceneId, type Sfx } from './timeline';

// Звук одной сцены серии 7: озвучка (когда файлы появятся) и эффекты. Эффекты лежат в public/audio/ep06c.
const VOICE_DIR = 'audio/ep07';
const SFX_DIR = 'audio/ep06c';
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

function sfxVolume(clip: Sfx): number | ((frame: number) => number) {
  if (!clip.duration || !clip.fade) return clip.volume;
  const fadeStart = clip.duration - clip.fade;
  return (f: number) => interpolate(f, [0, fadeStart, clip.duration ?? 0], [clip.volume, clip.volume, 0], CLAMP);
}

// Голос; на мате он глушится, вместо него — кошачье «мяу» пониженного тона. Без файла озвучки реплика не звучит.
function VoiceTrack({ clip }: { clip: PlacedClip }) {
  const mat = clip.matFrames ? { from: clip.matFrames[0] - clip.at, to: clip.matFrames[1] - clip.at } : null;
  const volume = mat ? (f: number) => (f >= mat.from && f < mat.to ? 0 : 1) : 1;
  return (
    <>
      {clip.file && (
        <Sequence from={clip.at} layout="none" name={`голос: ${clip.file}`}>
          <Audio src={staticFile(`${VOICE_DIR}/${clip.file}`)} playbackRate={clip.rate} volume={volume} />
        </Sequence>
      )}
      {mat && (
        <Sequence from={clip.at + mat.from} durationInFrames={Math.max(MEOW_FRAMES, mat.to - mat.from)} layout="none" name="мяу">
          <Audio src={staticFile(`${SFX_DIR}/${CENSOR_MEOW}`)} volume={CENSOR_VOLUME} toneFrequency={CENSOR_TONE} />
        </Sequence>
      )}
    </>
  );
}

export function SceneAudio({ scene }: { scene: SceneId }) {
  const tl = useTimeline();
  return (
    <>
      {tl.voice[scene].map((clip) => (
        <VoiceTrack key={clip.id} clip={clip} />
      ))}
      {tl.sfx[scene].map((clip) => (
        <Sequence key={`${clip.file}-${clip.at}`} from={clip.at} durationInFrames={clip.duration} layout="none" name={`звук: ${clip.file}`}>
          <Audio src={staticFile(`${SFX_DIR}/${clip.file}`)} volume={sfxVolume(clip)} />
        </Sequence>
      ))}
    </>
  );
}
