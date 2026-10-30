import { useFooterReveal } from '../hooks/useFooterReveal.js';
import FooterWordmark from './FooterWordmark.jsx';
import EditorialBanner from './EditorialBanner.jsx';
import ImplanLogo from './ImplanLogo.jsx';

export function ClosingSections() {
  return <>
    <EditorialBanner closing id="closing-title" title={<>¿Hacia dónde<br/>va nuestra ciudad?</>} action="Decidir mejor."/>
  </>;
}

export default function Footer() {
  const ref=useFooterReveal();
  return <footer className="site-footer" ref={ref}><div className="footer-stage">
    <div className="footer-top"><div className="brand"><ImplanLogo/></div></div>
    <div className="footer-drawing"><FooterWordmark/></div>
    <div className="footer-bottom micro"><span>INSTITUTO MUNICIPAL DE PLANEACIÓN</span><span>LEÓN, GUANAJUATO</span></div>
  </div></footer>;
}
