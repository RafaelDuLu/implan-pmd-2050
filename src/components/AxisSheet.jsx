import { useEffect, useRef } from 'react';
import { axisCopy } from './AxisExplorer.jsx';

/** One entrance per axis; changing an indicator never restarts this curtain. */
export function AxisSheet({ axis, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        element.dataset.entered = 'true';
        observer.disconnect();
      }
    }, { threshold: 0.08 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const copy = axisCopy[axis.id];
  return <div className="axis-sheet" data-page-layer ref={ref} style={{ '--sheet-accent': '#b6ff00' }}>
    <div className="sheet-curtain" aria-hidden="true"><span className="micro">EJE {String(axis.id).padStart(2, '0')} / LEÓN 2050</span><strong>{copy.title}.</strong><span>Una perspectiva para entender la ciudad. ↗</span></div>
    {children}
  </div>;
}
