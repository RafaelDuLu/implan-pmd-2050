import { useEffect } from 'react';
import { useWordmarkReveal } from '../hooks/useWordmarkReveal.js';
import { glyphs, viewBox } from '../assets/decidirWordmark.mjs';

/** Original letter outlines; the Plan's colors move within one shared ink field. */
export default function PlanWordmark() {
  const ref = useWordmarkReveal();
  useEffect(() => {
    const element = ref.current;
    const measure = () => element.style.setProperty('--word-stroke', String(Number(viewBox.split(' ')[2]) / Math.max(1, element.offsetWidth)));
    const resize = new ResizeObserver(measure); resize.observe(element); measure();
    return () => resize.disconnect();
  }, [ref]);
  return <span ref={ref} className="plan-wordmark" role="img" aria-label="Decidir mejor.">
    <svg className="plan-word-trace" viewBox={viewBox} aria-hidden="true" focusable="false">
      {glyphs.map((d, index) => <path key={index} d={d} pathLength="1" style={{ '--letter': index }}/>) }
    </svg>
    <span className="plan-word-ink" aria-hidden="true"/>
    <i className="plan-word-sweep" aria-hidden="true"/>
  </span>;
}
