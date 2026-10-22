import { useEffect, useRef } from 'react';
import { useScrollScene } from '../hooks/useScrollScene.js';
import { axisCopy } from './AxisExplorer.jsx';

/** Both layers occupy the same pixels: the wipe changes the surface and ink together. */
export default function SectionTransition({ word, number, caption, detail, from = 'dark', to = 'paper' }) {
  const ref = useScrollScene('viewport');
  const content = <><div className="chapter-meta micro"><span>{number} — {caption}</span><span>LEÓN / VISIÓN 2050</span></div><div className="chapter-type"><span>{word}</span><b>↘</b></div><div className="chapter-bottom"><span>{detail}</span><i/><span aria-hidden="true">↓</span></div></>;
  return <div className={`chapter-transition chapter-from-${from} chapter-to-${to}`} ref={ref} role="img" aria-label={`${caption}. ${detail}`}>
    <div className="chapter-layer chapter-outline" aria-hidden="true">{content}</div>
    <div className="chapter-layer chapter-solid" aria-hidden="true">{content}</div>
  </div>;
}

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
  return <div className="axis-sheet" ref={ref} style={{ '--sheet-accent': copy.color }}>
    <div className="sheet-curtain" aria-hidden="true"><span className="micro">EJE {String(axis.id).padStart(2, '0')} / LEÓN 2050</span><strong>{copy.title}.</strong><span>Una perspectiva para entender la ciudad. ↗</span></div>
    {children}
  </div>;
}
