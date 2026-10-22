import { useCallback } from 'react';
import { useScrollScene } from '../hooks/useScrollScene.js';
import { useScanner } from '../hooks/useScanner.js';
import XRayText from './XRayText.jsx';
import { Arrow } from './Icons.jsx';

/** A complete editorial composition, rather than an empty chapter separator. */
export default function EditorialBanner({ index, title, description, action, href, children, id, closing=false }) {
  const scene = useScrollScene();
  const scanner = useScanner();
  const bind = useCallback(element => { scene.current=element; scanner.ref.current=element; }, [scene, scanner.ref]);
  return <section className={`editorial-band scanner-surface${closing ? ' closing-band' : ''}`} data-page-layer={closing ? undefined : ''} {...scanner} ref={bind} aria-labelledby={id}>
    <div className="band-grid" aria-hidden="true"/>
    <div className="band-top"><div className="band-ask" data-reveal><span className="micro">{index}</span><h2 id={id}>{title}</h2></div><div className="band-aside"><p>{description}</p>{children}</div></div>
    <a href={href} className="band-action" aria-label={action}><XRayText className="band-word">{action}</XRayText><Arrow/></a>
    <div className="band-bottom micro"><span>LEÓN, GUANAJUATO</span><span>INFORMACIÓN PARA MIRAR MÁS LEJOS</span></div>
  </section>;
}
