import { useEffect, useRef, useState } from 'react';
import { axisCopy } from './AxisExplorer.jsx';

/** One decoded, viewport-synchronized entrance per axis, never per indicator. */
export function AxisSheet({ axis, children }) {
  const ref = useRef(null);
  const image = useRef(null);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState('pending');
  const finish = () => setPhase('done');
  useEffect(() => {
    let alive = true;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const preference = () => { if (reduced.matches) setPhase('done'); };
    preference();
    reduced.addEventListener('change', preference);
    image.current.decode().then(() => { if (alive) setReady(true); }).catch(() => { if (alive) setPhase('done'); });
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: .55 });
    observer.observe(ref.current);
    return () => { alive = false; observer.disconnect(); reduced.removeEventListener('change', preference); };
  }, []);
  useEffect(() => {
    if (visible && ready) setPhase(current => current === 'pending' ? 'playing' : current);
  }, [visible, ready]);
  useEffect(() => {
    if (!visible || phase === 'done') return;
    // Failed connections cannot leave the statistical controls behind an overlay.
    const fallback = setTimeout(finish, phase === 'playing' ? 3300 : 2500);
    const escape = event => { if (event.key === 'Escape') finish(); };
    window.addEventListener('keydown', escape);
    return () => { clearTimeout(fallback); window.removeEventListener('keydown', escape); };
  }, [visible, phase]);
  useEffect(() => {
    if (phase !== 'done') return;
    const focused = document.activeElement;
    if (visible && (focused === document.body || focused?.classList.contains('axis-entrance-skip'))) {
      const heading = document.getElementById('indicator-section-title');
      heading?.setAttribute('tabindex', '-1');
      heading?.focus({ preventScroll: true });
    }
  }, [phase, visible]);
  const copy = axisCopy[axis.id];
  const active = visible && phase !== 'done';
  return <div className="axis-sheet" data-page-layer>
    <div ref={ref} className="axis-entrance" data-phase={phase} data-visible={visible} onAnimationEnd={event => { if (event.target === event.currentTarget) finish(); }}>
      <img ref={image} className="axis-entrance-art" src={`./axes/entrances/eje-${axis.id}.webp`} alt="" width="1440" height="960" decoding="async" fetchPriority="high"/>
      <div className="axis-entrance-shade" aria-hidden="true"/>
      <div className="axis-entrance-caption" aria-hidden="true"><span className="micro">0{axis.id}</span><span>{copy.title}</span></div>
      <button className="axis-entrance-skip" onClick={finish} tabIndex={active ? 0 : -1} aria-label={`Ver indicadores de ${copy.title}; omitir animación`}>Ver indicadores <span aria-hidden="true">↗</span></button>
      <div className="axis-entrance-rule" aria-hidden="true"/>
    </div>
    <div inert={active ? true : undefined}>{children}</div>
  </div>;
}
