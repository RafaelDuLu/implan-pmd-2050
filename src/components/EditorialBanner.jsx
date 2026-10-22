import { useScrollScene } from '../hooks/useScrollScene.js';
import PlanWordmark from './PlanWordmark.jsx';
import ScrollWordmark from './ScrollWordmark.jsx';

/** A complete editorial composition, rather than an empty chapter separator. */
export default function EditorialBanner({ title, action, id, closing=false }) {
  const scene = useScrollScene();
  return <section className={`editorial-band${closing ? ' closing-band' : ''}`} data-page-layer={closing ? undefined : ''} ref={scene} aria-labelledby={id}>
    <div className="band-top"><div className="band-ask" data-reveal><h2 id={id}>{title}</h2></div></div>
    <div className="band-action" aria-hidden="true">{action === 'Explorar' ? <ScrollWordmark/> : <PlanWordmark/>}</div>
  </section>;
}
