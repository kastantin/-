import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS } from '../config';

// Технический тест: проверяет формат кадра, FPS, кириллицу и анимацию от номера кадра
export function StudioTest() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const pop = spring({ frame, fps, config: { damping: 12 } });
  const wobble = Math.sin(frame / 4) * 1.5;
  const subtitleOpacity = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          transform: `scale(${pop}) rotate(${wobble}deg)`,
          background: COLORS.paper,
          border: `5px solid ${COLORS.ink}`,
          borderRadius: 28,
          padding: '60px 70px',
          textAlign: 'center',
          fontFamily: 'Segoe Print, Comic Sans MS, sans-serif',
          color: COLORS.ink,
        }}
      >
        <div style={{ fontSize: 84 }}>AI Cartoon Studio</div>
        <div style={{ fontSize: 48, marginTop: 20 }}>Тест рендера ✓</div>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 260,
          opacity: subtitleOpacity,
          color: COLORS.paper,
          fontSize: 52,
          fontFamily: 'Segoe UI, Arial, sans-serif',
        }}
      >
        Русские субтитры работают
      </div>
      <div style={{ position: 'absolute', top: 60, color: COLORS.muted, fontSize: 32, fontFamily: 'Consolas, monospace' }}>
        {width}×{height} · {fps} FPS · кадр {frame}
      </div>
    </AbsoluteFill>
  );
}
