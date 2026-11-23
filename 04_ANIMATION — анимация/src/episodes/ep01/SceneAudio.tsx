import { Audio, interpolate, Sequence, staticFile } from 'remotion';
import { SFX, VOICE, VOICE_RATE, type SceneId, type SfxClip } from './timeline';

// Звук одной сцены: озвучка + эффекты. Файлы лежат в public/audio/ep01
// (копии из 05_VOICE и 06_MUSIC_SFX; серия 1 — без музыки)
const AUDIO_DIR = 'audio/ep01';

function sfxVolume(clip: SfxClip): number | ((frame: number) => number) {
  if (!clip.duration || !clip.fade) return clip.volume;
  const end = clip.duration;
  const fadeStart = end - clip.fade;
  return (f: number) =>
    interpolate(f, [0, fadeStart, end], [clip.volume, clip.volume, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
}

export function SceneAudio({ scene }: { scene: SceneId }) {
  return (
    <>
      {VOICE[scene].map((v) => (
        <Sequence key={v.file} from={v.at} layout="none" name={`голос: ${v.file}`}>
          <Audio src={staticFile(`${AUDIO_DIR}/${v.file}`)} playbackRate={VOICE_RATE} />
        </Sequence>
      ))}
      {SFX[scene].map((clip) => (
        <Sequence
          key={`${clip.file}-${clip.at}`}
          from={clip.at}
          durationInFrames={clip.duration}
          layout="none"
          name={`звук: ${clip.file}`}
        >
          <Audio src={staticFile(`${AUDIO_DIR}/${clip.file}`)} volume={sfxVolume(clip)} />
        </Sequence>
      ))}
    </>
  );
}
