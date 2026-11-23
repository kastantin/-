import { EpisodeFrame } from '../layout/EpisodeFrame';
import { HallScene } from '../scenes/HallScene';
import { OfficeScene } from '../scenes/OfficeScene';
import { PhoneScene } from '../scenes/PhoneScene';

// Превью ключевых кадров серии 1 — для согласования фонов и оформления
export type Shot = 'phone' | 'office' | 'hall';

// type, а не interface: Remotion требует совместимость с Record<string, unknown>
export type EpisodePreviewProps = {
  shot: Shot;
};

export function EpisodePreview({ shot }: EpisodePreviewProps) {
  const base = { episode: 1, title: 'Поговорим', ladderStep: 0 };

  if (shot === 'phone') {
    return (
      <EpisodeFrame {...base} remark="23:47. Смена закончилась." subtitle={{ text: 'Поговорим. Без смайлика.', highlight: 'Без смайлика.' }}>
        <PhoneScene sender="Эдуард Борисович" message={['Зайди после смены.', 'Поговорим.']} time="23:47" />
      </EpisodeFrame>
    );
  }

  if (shot === 'hall') {
    return (
      <EpisodeFrame {...base} remark="Вчера. Стол 7." subtitle={{ text: 'Зато свежий! Из холодильника!', highlight: 'Из холодильника!' }}>
        <HallScene dima="happy" guest="angry" />
      </EpisodeFrame>
    );
  }

  return (
    <EpisodeFrame
      {...base}
      remark="Эдуард Борисович молчит. Это хуже, чем крик."
      subtitle={{ text: 'Стол семь — твоя зона.', highlight: 'твоя зона.' }}
    >
      <OfficeScene kostya="panic" eduard="tired" />
    </EpisodeFrame>
  );
}
