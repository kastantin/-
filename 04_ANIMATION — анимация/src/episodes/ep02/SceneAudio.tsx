import { Audio, interpolate, Sequence, staticFile } from 'remotion';
import { CENSOR_MEOWS, CENSOR_TONE, CENSOR_VOLUME, musicClips, SFX, VOICE, VOICE_RATE, voiceFrames, type MusicClip, type SceneId, type SfxClip, type VoiceClip } from './timeline';

// Звук одной сцены серии 2: озвучка + эффекты (копии в public/audio/ep02).
// censored — на мате голос глушится и звучит кошачье «мяу».
const AUDIO_DIR = 'audio/ep02';
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

function sfxVolume(clip: SfxClip): number | ((frame: number) => number) {
  if (!clip.duration || !clip.fade) return clip.volume;
  const fadeStart = clip.duration - clip.fade;
  return (f: number) => interpolate(f, [0, fadeStart, clip.duration ?? 0], [clip.volume, clip.volume, 0], CLAMP);
}

// Окно мата в кадрах от начала реплики (с запасом в кадр с каждой стороны)
function matWindow(clip: VoiceClip): { from: number; to: number } | null {
  if (!clip.mat) return null;
  return { from: voiceFrames(clip.mat[0]) - 1, to: voiceFrames(clip.mat[1]) + 1 };
}

// длина «мяу» (0,5 с); понижение тона длительность не меняет
const MEOW_FRAMES = 15;

function VoiceTrack({ clip, censored, meow }: { clip: VoiceClip; censored: boolean; meow: string }) {
  const mat = censored ? matWindow(clip) : null;
  const volume = mat ? (f: number) => (f >= mat.from && f < mat.to ? 0 : 1) : 1;
  return (
    <>
      <Sequence from={clip.at} layout="none" name={`голос: ${clip.file}`}>
        <Audio src={staticFile(`${AUDIO_DIR}/${clip.file}`)} playbackRate={VOICE_RATE} volume={volume} />
      </Sequence>
      {mat && (
        <Sequence from={clip.at + mat.from} durationInFrames={Math.max(MEOW_FRAMES, mat.to - mat.from)} layout="none" name="мяу">
          <Audio src={staticFile(`${AUDIO_DIR}/${meow}`)} volume={CENSOR_VOLUME} toneFrequency={CENSOR_TONE} />
        </Sequence>
      )}
    </>
  );
}

function musicVolume(clip: MusicClip): (frame: number) => number {
  const length = clip.to - clip.from;
  return (f: number) => interpolate(f, [0, clip.fade, length - clip.fade, length], [0, clip.volume, clip.volume, 0], CLAMP);
}

// Фоновая музыка всей серии (кадры абсолютные — ставится вне сцен)
export function EpisodeMusic() {
  return (
    <>
      {musicClips().map((clip) => (
        <Sequence key={`${clip.file}-${clip.from}`} from={clip.from} durationInFrames={clip.to - clip.from} layout="none" name={`музыка: ${clip.file}`}>
          <Audio src={staticFile(`${AUDIO_DIR}/${clip.file}`)} startFrom={clip.startFrom ?? 0} loop={clip.loop} volume={musicVolume(clip)} />
        </Sequence>
      ))}
    </>
  );
}

// Номер мата по порядку в серии — чтобы «мяу» чередовались
const MAT_SCENES = Object.keys(VOICE).filter((id) => VOICE[id as SceneId].some((v) => v.mat));
function meowIndex(scene: SceneId): number {
  return Math.max(0, MAT_SCENES.indexOf(scene));
}

export function SceneAudio({ scene, censored }: { scene: SceneId; censored: boolean }) {
  return (
    <>
      {VOICE[scene].map((clip) => (
        <VoiceTrack key={clip.file} clip={clip} censored={censored} meow={CENSOR_MEOWS[meowIndex(scene) % CENSOR_MEOWS.length]} />
      ))}
      {SFX[scene].map((clip) => (
        <Sequence key={`${clip.file}-${clip.at}`} from={clip.at} durationInFrames={clip.duration} layout="none" name={`звук: ${clip.file}`}>
          <Audio src={staticFile(`${AUDIO_DIR}/${clip.file}`)} volume={sfxVolume(clip)} />
        </Sequence>
      ))}
    </>
  );
}
