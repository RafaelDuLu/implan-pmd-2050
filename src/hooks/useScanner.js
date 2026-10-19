import { useCallback, useEffect, useRef } from 'react';

// Movement never enters React state. At most one rAF writes CSS per frame.
export function useScanner() {
  const ref = useRef(null);
  const frame = useRef(0);
  const reduced = useRef(false);
  const pointer = useRef({ x: 0, y: 0, drawnX: 0, drawnY: 0, time: 0, rect: null });
  const paint = useCallback(function draw(time) {
    frame.current = 0;
    const element = ref.current;
    if (!element) return;
    const p = pointer.current;
    const dt = Math.min(48, p.time ? time - p.time : 16);
    const alpha = 1 - Math.exp(-dt / 32);
    p.time = time;
    p.drawnX += (p.x - p.drawnX) * alpha;
    p.drawnY += (p.y - p.drawnY) * alpha;
    element.style.setProperty('--mouse-x', `${p.drawnX.toFixed(1)}px`);
    element.style.setProperty('--mouse-y', `${p.drawnY.toFixed(1)}px`);
    // Stop the loop when the pointer settles; there is no idle animation.
    if (Math.abs(p.x - p.drawnX) + Math.abs(p.y - p.drawnY) > 0.2)
      frame.current = requestAnimationFrame(draw);
  }, []);
  const move = useCallback(event => {
    const element = ref.current;
    if (!element || reduced.current) return;
    const p = pointer.current;
    p.rect ??= element.getBoundingClientRect();
    p.x = Math.max(0, Math.min(p.rect.width, event.clientX - p.rect.left));
    p.y = Math.max(0, Math.min(p.rect.height, event.clientY - p.rect.top));
    if (element.dataset.scanning !== 'true') {
      p.drawnX = p.x; p.drawnY = p.y; p.time = 0;
      element.dataset.scanning = 'true';
    }
    if (!frame.current) frame.current = requestAnimationFrame(paint);
  }, [paint]);
  const enter = useCallback(event => {
    pointer.current.rect = ref.current?.getBoundingClientRect();
    move(event);
  }, [move]);
  const leave = useCallback(() => {
    if (ref.current) ref.current.dataset.scanning = 'false';
    pointer.current.rect = null;
    cancelAnimationFrame(frame.current); frame.current = 0;
  }, []);
  useEffect(() => {
    const invalidate = () => { pointer.current.rect = null; };
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const preference = () => { reduced.current = media.matches; if (media.matches) leave(); };
    preference();
    media.addEventListener('change', preference);
    window.addEventListener('resize', invalidate, { passive: true });
    window.addEventListener('scroll', invalidate, { passive: true });
    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener('resize', invalidate);
      window.removeEventListener('scroll', invalidate);
      media.removeEventListener('change', preference);
    };
  }, [leave]);
  return { ref, onMouseMove: move, onMouseEnter: enter, onMouseLeave: leave,
    onPointerDown: event => { if (event.pointerType !== 'mouse') enter(event); },
    onPointerUp: event => { if (event.pointerType !== 'mouse') leave(); } };
}
