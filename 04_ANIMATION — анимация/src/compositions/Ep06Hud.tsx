import { AbsoluteFill } from 'remotion';
import { COLORS } from '../config';
import { BetsSheet, ChecklistBoard, PollTicker, Scoreboard, ShiftTimer, Stopwatch } from '../scenes/ep06/hud';

// Предпросмотр элементов экрана серии 6 (16:9)
export function Ep06Hud() {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background, padding: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Scoreboard kostya={2} beks={2} />
      </div>
      <div style={{ display: 'flex', gap: 24, marginTop: 30, alignItems: 'center' }}>
        <ShiftTimer label="ПЯТНИЦА · СМЕНА" />
        <ShiftTimer label="ПЯТНИЦА · 21:40" urgent />
        <PollTicker text="Вы выбрали: А 67% · Б 33% · 💬 0" />
      </div>
      <div style={{ display: 'flex', gap: 50, marginTop: 40, alignItems: 'flex-start' }}>
        <ChecklistBoard />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
          <Stopwatch seconds={900} />
          <Stopwatch seconds={220} />
        </div>
        <BetsSheet />
      </div>
    </AbsoluteFill>
  );
}
