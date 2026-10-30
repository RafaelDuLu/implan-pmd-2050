import { useEffect, useRef, useState } from 'react';
import { axisCopy, axisTheme } from './AxisExplorer.jsx';

/** A typographic chapter, independent of image loading; never repeated per indicator. */
export function AxisSheet({ axis, children }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState('pending');
  const finish = () => setPhase('done');
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const preference = () => { if (reduced.matches) setPhase('done'); };
    preference();
    reduced.addEventListener('change', preference);
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setVisible(true);
        setPhase(current => current === 'pending' ? 'playing' : current);
        observer.disconnect();
      }
    }, { threshold: .55 });
    observer.observe(ref.current);
    return () => { observer.disconnect(); reduced.removeEventListener('change', preference); };
  }, []);
  useEffect(() => {
    if (!visible || phase === 'done') return;
    const fallback = setTimeout(finish, 2400);
    const escape = event => { if (event.key === 'Escape') finish(); };
    window.addEventListener('keydown', escape);
    return () => { clearTimeout(fallback); window.removeEventListener('keydown', escape); };
  }, [visible, phase]);
  useEffect(() => {
    if (phase !== 'done' || !visible) return;
    const focused = document.activeElement;
    if (focused === document.body || focused?.classList.contains('axis-entrance-name')) {
      const heading = document.getElementById('indicator-section-title');
      heading?.setAttribute('tabindex', '-1');
      heading?.focus({ preventScroll: true });
    }
  }, [phase, visible]);
  const copy = axisCopy[axis.id];
  const active = visible && phase !== 'done';
  return <div className="axis-sheet" style={axisTheme(axis.id)} data-page-layer>
    <div ref={ref} className="axis-entrance" data-phase={phase} data-visible={visible} aria-hidden={!active} onAnimationEnd={event => { if (event.target === event.currentTarget) finish(); }}>
      <button className="axis-entrance-name" onClick={finish} tabIndex={active ? 0 : -1} aria-label={`${copy.title}: omitir transición y consultar indicadores`}>{copy.title}</button>
    </div>
    <div inert={active ? true : undefined}>{children}</div>
  </div>;
}
