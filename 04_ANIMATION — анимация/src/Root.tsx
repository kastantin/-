import { Composition } from 'remotion';
import { VIDEO } from './config';
import { StudioTest } from './compositions/StudioTest';
import { CharacterSheet, CharacterSheetEp03, CharacterSheetEp05 } from './compositions/CharacterSheet';
import { EpisodePreview, type EpisodePreviewProps } from './compositions/EpisodePreview';
import { Episode01 } from './episodes/ep01/Episode01';
import { Avatar, AVATAR_SIZE, type AvatarProps } from './compositions/Avatar';
import { COVER, TikTokCover, type TikTokCoverProps } from './compositions/TikTokCover';
import { EP01_DURATION } from './episodes/ep01/timeline';
import { Episode02, type Episode02Props } from './episodes/ep02/Episode02';
import { EP02_DURATION } from './episodes/ep02/timeline';
import { Episode03 } from './episodes/ep03/Episode03';
import { EP03_DURATION } from './episodes/ep03/timeline';
import { Episode04 } from './episodes/ep04/Episode04';
import { EP04_DURATION } from './episodes/ep04/timeline';
import { Episode05 } from './episodes/ep05/Episode05';
import { EP05_DURATION } from './episodes/ep05/timeline';

// Серия 2 — одна версия для всех площадок: мат заменён на «мяу» и 🤬 (решение пользователя 21.11.2026)
const ep02Props: Episode02Props = { censored: true };

const previewDefaults: EpisodePreviewProps = { shot: 'office' };
// Обложка TikTok для серии 1 «Поговорим»
const coverEp01: TikTokCoverProps = {
  episode: 1,
  series: 'СКАТЕРТЬ',
  sender: 'Эдуард Борисович',
  message: ['Зайди после смены.', 'Поговорим.'],
  time: '23:47',
  headline: 'БЕЗ СМАЙЛИКА.',
  caption: 'что делать Косте? решаете вы',
  emotion: 'panic',
};
// Обложка TikTok для серии 2 «Ноль голосов»: орущий Гена и отзыв гостьи
const coverEp02: TikTokCoverProps = {
  episode: 2,
  series: 'СКАТЕРТЬ',
  sender: 'Гостья, стол 7 · ★☆☆☆☆',
  message: ['Борщ холодный,', 'официант хамит.'],
  time: 'Карты',
  headline: 'НОЛЬ ГОЛОСОВ.',
  caption: 'что делать Косте? решаете вы',
  emotion: 'yell',
  hero: 'gena',
  avatar: 'guest',
  avatarEmotion: 'angry',
};
// Обложка TikTok для серии 3 «Друзья»: идея зрителя и вся команда в ряд
const coverEp03: TikTokCoverProps = {
  episode: 3,
  series: 'СКАТЕРТЬ',
  sender: 'me · идея зрителя',
  message: ['позвать друзей', 'и работать'],
  time: 'комментарий',
  headline: 'ДРУЗЬЯ.',
  caption: 'кому чаевые? решаете вы',
  emotion: 'happy',
  avatar: 'guest',
  avatarEmotion: 'happy',
  crew: [
    { id: 'beks', x: 190, height: 900, footY: 1860, emotion: 'happy' },
    { id: 'nadir', x: 890, height: 900, footY: 1860, emotion: 'neutral' },
    { id: 'akhma', x: 540, height: 1040, footY: 1840, emotion: 'neutral' },
  ],
};
// Обложка TikTok для серии 4 «Холодная война»: обиженный Гена с половником
const coverEp04: TikTokCoverProps = {
  episode: 4,
  series: 'СКАТЕРТЬ',
  sender: 'Гена · повар',
  message: ['Забыл сказать,', 'Константин.'],
  time: 'бойкот',
  headline: 'ХОЛОДНАЯ ВОЙНА.',
  headlineSize: 78,
  caption: 'как выкрутиться? решаете вы',
  emotion: 'angry',
  hero: 'gena',
  avatar: 'gena',
  avatarEmotion: 'angry',
};
// Обложка TikTok для серии 5 «Дружба дружбой»: Костя с вымученной улыбкой и ультиматум хозяйки
const coverEp05: TikTokCoverProps = {
  episode: 5,
  series: 'СКАТЕРТЬ',
  sender: 'Маргарита Львовна · хозяйка',
  message: ['Вас двое.', 'В пятницу решу.'],
  time: 'ультиматум',
  headline: 'ДРУЖБА ДРУЖБОЙ.',
  headlineSize: 78,
  caption: 'кого выберут? решаете вы',
  emotion: 'smirk',
  avatar: 'owner',
  avatarEmotion: 'neutral',
};
const avatarDefaults: AvatarProps = {
  emotion: 'smirk',
  texts: { channel: '@obshchepit_yama', tagline: 'выживи в общепите' },
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="StudioTest"
        component={StudioTest}
        durationInFrames={3 * VIDEO.fps}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="CharacterSheet"
        component={CharacterSheet}
        durationInFrames={1}
        fps={VIDEO.fps}
        width={1080}
        height={1920}
      />
      <Composition
        id="CharacterSheetEp03"
        component={CharacterSheetEp03}
        durationInFrames={1}
        fps={VIDEO.fps}
        width={1080}
        height={1920}
      />
      <Composition
        id="CharacterSheetEp05"
        component={CharacterSheetEp05}
        durationInFrames={1}
        fps={VIDEO.fps}
        width={1080}
        height={640}
      />
      <Composition
        id="Avatar"
        component={Avatar}
        defaultProps={avatarDefaults}
        durationInFrames={1}
        fps={VIDEO.fps}
        width={AVATAR_SIZE}
        height={AVATAR_SIZE}
      />
      <Composition
        id="TikTokCover"
        component={TikTokCover}
        defaultProps={coverEp01}
        durationInFrames={1}
        fps={VIDEO.fps}
        width={COVER.width}
        height={COVER.height}
      />
      <Composition
        id="TikTokCoverEp02"
        component={TikTokCover}
        defaultProps={coverEp02}
        durationInFrames={1}
        fps={VIDEO.fps}
        width={COVER.width}
        height={COVER.height}
      />
      <Composition
        id="TikTokCoverEp03"
        component={TikTokCover}
        defaultProps={coverEp03}
        durationInFrames={1}
        fps={VIDEO.fps}
        width={COVER.width}
        height={COVER.height}
      />
      <Composition
        id="TikTokCoverEp04"
        component={TikTokCover}
        defaultProps={coverEp04}
        durationInFrames={1}
        fps={VIDEO.fps}
        width={COVER.width}
        height={COVER.height}
      />
      <Composition
        id="TikTokCoverEp05"
        component={TikTokCover}
        defaultProps={coverEp05}
        durationInFrames={1}
        fps={VIDEO.fps}
        width={COVER.width}
        height={COVER.height}
      />
      <Composition
        id="Episode01"
        component={Episode01}
        durationInFrames={EP01_DURATION}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="Episode02"
        component={Episode02}
        defaultProps={ep02Props}
        durationInFrames={EP02_DURATION}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="Episode03"
        component={Episode03}
        durationInFrames={EP03_DURATION}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="Episode04"
        component={Episode04}
        durationInFrames={EP04_DURATION}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="Episode05"
        component={Episode05}
        durationInFrames={EP05_DURATION}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="EpisodePreview"
        component={EpisodePreview}
        defaultProps={previewDefaults}
        durationInFrames={1}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
    </>
  );
};
