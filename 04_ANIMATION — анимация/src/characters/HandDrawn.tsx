import { useId } from 'react';

interface HandDrawnProps {
  // Меняя seed раз в несколько кадров, получаем «дрожание» линии как у рисованной анимации
  seed?: number;
  strength?: number;
  children: React.ReactNode;
}

// Делает ровные SVG-контуры слегка неровными, как нарисованные от руки
export function HandDrawn({ seed = 1, strength = 2.2, children }: HandDrawnProps) {
  const id = `hd-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <g>
      <defs>
        <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency={0.035} numOctaves={2} seed={seed} />
          <feDisplacementMap in="SourceGraphic" scale={strength} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g filter={`url(#${id})`}>{children}</g>
    </g>
  );
}
