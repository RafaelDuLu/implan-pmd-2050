import { useEffect } from 'react';
import { useScrollScene } from '../hooks/useScrollScene.js';
import { glyphs, viewBox } from '../assets/explorarWordmark.mjs';

/** The same normalized path drawing and reversible sweep as the closing wordmark. */
export default function ScrollWordmark() {
  const ref = useScrollScene('viewport');
  useEffect(() => {
    const word = ref.current;
    const measure = () => word.style.setProperty('--word-stroke', String(Number(viewBox.split(' ')[2]) / Math.max(1, word.offsetWidth)));
    const observer = new ResizeObserver(measure);
    observer.observe(word); measure();
    return () => observer.disconnect();
  }, [ref]);
  return <span ref={ref} className="scroll-wordmark" aria-hidden="true">
    {['trace', 'fill'].map(layer => <svg key={layer} className={`scroll-word-${layer}`} viewBox={viewBox} focusable="false" aria-hidden="true">
      {glyphs.map((d, index) => <path key={index} d={d} pathLength="1" style={{ '--glyph-index': index }}/>) }
    </svg>)}
    <i className="scroll-word-sweep"/>
  </span>;
}
