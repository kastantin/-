import { Audio, interpolate, Sequence, staticFile } from 'remotion';
import { CENSOR_MEOWS, CENSOR_TONE, CENSOR_VOLUME, MEOW_FRAMES, SFX, VOICE, voiceFrames, type PlacedClip, type SceneId, type SfxClip } from './timeline';

// Звук одной сцены серии 3: озвучка и эффекты (копии в public/audio/ep03).
// На мате голос глушится, вместо него звучит кошачье «мяу» пониженного тона.
const AUDIO_DIR = 'audio/ep03';
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

function sfxVolume(clip: SfxClip): number | ((frame: number) => number) {
  if (!clip.duration || !clip.fade) return clip.volume;
  const fadeStart = clip.duration - clip.fade;
  return (f: number) => interpolate(f, [0, fadeStart, clip.duration ?? 0], [clip.volume, clip.volume, 0], CLAMP);
}

// Окно мата в кадрах от начала реплики (с запасом в кадр с каждой стороны)
function matWindow(clip: PlacedClip): { from: number; to: number } | null {
  if (!clip.mat) return null;
  return { from: voiceFrames(clip.mat[0], clip.rate) - 1, to: voiceFrames(clip.mat[1], clip.rate) + 1 };
}

function VoiceTrack({ clip, meow }: { clip: PlacedClip; meow: string }) {
  const mat = matWindow(clip);
  const volume = mat ? (f: number) => (f >= mat.from && f < mat.to ? 0 : 1) : 1;
  return (
    <>
      <Sequence from={clip.at} layout="none" name={`голос: ${clip.file}`}>
        <Audio src={staticFile(`${AUDIO_DIR}/${clip.file}`)} playbackRate={clip.rate} volume={volume} />
      </Sequence>
      {mat && (
        <Sequence from={clip.at + mat.from} durationInFrames={Math.max(MEOW_FRAMES, mat.to - mat.from)} layout="none" name="мяу">
          <Audio src={staticFile(`${AUDIO_DIR}/${meow}`)} volume={CENSOR_VOLUME} toneFrequency={CENSOR_TONE} />
        </Sequence>
      )}
    </>
  );
}

// Номер мата по порядку в серии — чтобы «мяу» чередовались
const MAT_SCENES = (Object.keys(VOICE) as SceneId[]).filter((id) => VOICE[id].some((c) => c.mat));

export function SceneAudio({ scene }: { scene: SceneId }) {
  const meow = CENSOR_MEOWS[Math.max(0, MAT_SCENES.indexOf(scene)) % CENSOR_MEOWS.length];
  return (
    <>
      {VOICE[scene].map((clip) => (
        <VoiceTrack key={clip.file} clip={clip} meow={meow} />
      ))}
      {SFX[scene].map((clip) => (
        <Sequence key={`${clip.file}-${clip.at}`} from={clip.at} durationInFrames={clip.duration} layout="none" name={`звук: ${clip.file}`}>
          <Audio src={staticFile(`${AUDIO_DIR}/${clip.file}`)} volume={sfxVolume(clip)} />
        </Sequence>
      ))}
    </>
  );
}
