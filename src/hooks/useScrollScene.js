import { useEffect, useRef } from 'react';

export function useScrollScene(travel = 'element') {
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
      // Entry progress: element scenes complete when their bottom enters the viewport.
      // This also lets a footer finish its fill before scrolling reaches the page end.
      const start = travel === 'viewport' ? innerHeight * 0.9 : innerHeight;
      const distance = travel === 'viewport' ? innerHeight * 0.65 : rect.height;
      const progress = Math.max(0, Math.min(1, (start - rect.top) / Math.max(distance, 1)));
      element.style.setProperty('--scene', media.matches ? '1' : progress.toFixed(4));
    };
    const schedule = () => { if (visible && !frame) frame = requestAnimationFrame(paint); };
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      // Measure once on exit too: a quick scroll must settle at the endpoint.
      if (!frame) frame = requestAnimationFrame(paint);
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
  }, [travel]);
  return ref;
}
