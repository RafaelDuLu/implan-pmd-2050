import { useEffect, useRef } from 'react';

export function useScrollScene() {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let visible = true;
    const paint = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      // Entry progress: reaches 1 when the element's bottom enters the viewport.
      // This also lets a footer finish its fill before scrolling reaches the page end.
      const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / Math.max(rect.height, 1)));
      element.style.setProperty('--scene', media.matches ? '1' : progress.toFixed(4));
    };
    const schedule = () => { if (visible && !frame) frame = requestAnimationFrame(paint); };
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) schedule();
    }, { rootMargin: '120px' });
    observer.observe(element);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    media.addEventListener('change', schedule);
    paint();
    return () => {
      observer.disconnect(); cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      media.removeEventListener('change', schedule);
    };
  }, []);
  return ref;
}
