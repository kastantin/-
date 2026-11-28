import { createContext, useContext } from 'react';
import { DEFAULT_TIMELINE, type Timeline } from './timeline';

// Тайминг серии зависит от варианта сцены 2, поэтому кадры берут его из контекста, а не из констант модуля
export const TimelineContext = createContext<Timeline>(DEFAULT_TIMELINE);

export function useTimeline(): Timeline {
  return useContext(TimelineContext);
}
