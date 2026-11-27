import { Audio, interpolate, Sequence, staticFile } from 'remotion';
import { CENSOR_MEOWS, CENSOR_TONE, CENSOR_VOLUME, MEOW_FRAMES, SFX, VOICE, voiceFrames, type PlacedClip, type SceneId, type SfxClip } from './timeline';

// Звук одной сцены серии 6 «На чай»: озвучка и эффекты (копии в public/audio/ep06c).
const AUDIO_DIR = 'audio/ep06c';
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

function sfxVolume(clip: SfxClip): number | ((frame: number) => number) {
  if (!clip.duration || !clip.fade) return clip.volume;
  const fadeStart = clip.duration - clip.fade;
  return (f: number) => interpolate(f, [0, fadeStart, clip.duration ?? 0], [clip.volume, clip.volume, 0], CLAMP);
}

// Голос; на мате он глушится, вместо него — кошачье «мяу» пониженного тона
function VoiceTrack({ clip }: { clip: PlacedClip }) {
  const mat = clip.mat ? { from: voiceFrames(clip.mat[0], clip.rate) - 1, to: voiceFrames(clip.mat[1], clip.rate) + 1 } : null;
  const volume = mat ? (f: number) => (f >= mat.from && f < mat.to ? 0 : 1) : 1;
  return (
    <>
      <Sequence from={clip.at} layout="none" name={`голос: ${clip.file}`}>
        <Audio src={staticFile(`${AUDIO_DIR}/${clip.file}`)} playbackRate={clip.rate} volume={volume} />
      </Sequence>
      {mat && (
        <Sequence from={clip.at + mat.from} durationInFrames={Math.max(MEOW_FRAMES, mat.to - mat.from)} layout="none" name="мяу">
          <Audio src={staticFile(`${AUDIO_DIR}/${CENSOR_MEOWS[0]}`)} volume={CENSOR_VOLUME} toneFrequency={CENSOR_TONE} />
        </Sequence>
      )}
    </>
  );
}

export function SceneAudio({ scene }: { scene: SceneId }) {
  return (
    <>
      {VOICE[scene].map((clip) => (
        <VoiceTrack key={clip.id} clip={clip} />
      ))}
      {SFX[scene].map((clip) => (
        <Sequence key={`${clip.file}-${clip.at}`} from={clip.at} durationInFrames={clip.duration} layout="none" name={`звук: ${clip.file}`}>
          <Audio src={staticFile(`${AUDIO_DIR}/${clip.file}`)} volume={sfxVolume(clip)} />
        </Sequence>
      ))}
    </>
  );
}
