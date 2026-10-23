import { useEffect, useRef } from 'react';

/** Finish while the whole word is visible, before the sticky sheet can hold its position. */
export function useWordmarkReveal(finishRatio = .5) {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, previous = 0, value = null, target = 0;
    const measure = () => {
      const rect = element.getBoundingClientRect();
      const start = innerHeight * .98;
      const finish = Math.max(24, Math.min(innerHeight * finishRatio, innerHeight - rect.height - 32));
      target = reduced.matches ? 1 : Math.max(0, Math.min(1, (start - rect.top) / Math.max(1, start - finish)));
    };
    const paint = time => {
      frame = 0;
      const dt = previous ? Math.min(64, time - previous) : 16;
      previous = time;
      value = value === null || reduced.matches ? target : value + (target - value) * (1 - Math.exp(-dt / 65));
      if (Math.abs(value - target) < .0003) value = target;
      element.style.setProperty('--word-progress', value.toFixed(5));
      if (value !== target) frame = requestAnimationFrame(paint);
      else previous = 0;
    };
    const update = () => { measure(); if (!frame) frame = requestAnimationFrame(paint); };
    const resize = new ResizeObserver(update);
    resize.observe(element);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    reduced.addEventListener('change', update);
    update();
    return () => {
      cancelAnimationFrame(frame); resize.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      reduced.removeEventListener('change', update);
    };
  }, [finishRatio]);
  return ref;
}
