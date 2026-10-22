import XRayText from './XRayText.jsx';
import { Arrow, Mark } from './Icons.jsx';

export default function Hero({ count }) {
  return <>
    <header className="site-header"><a href="#inicio" className="brand" aria-label="IMPLAN León, inicio"><Mark/><span>IMPLAN<small>LEÓN, GUANAJUATO</small></span></a><nav aria-label="Principal"><a href="#ejes">Los ejes <span>↗</span></a><a href="#indicadores">Indicadores <span>↗</span></a><a href="#datos">Datos abiertos <span>↓</span></a></nav><a className="header-project micro" href="#lectura">PMD / VISIÓN 2050 <span className="status-dot"/></a></header>
    <section className="hero scanner-surface" data-page-layer id="inicio" aria-labelledby="hero-title">
      <div className="hero-top micro"><span>PORTAL DE TABULADORES ESTADÍSTICOS</span><span>INSTITUTO MUNICIPAL DE PLANEACIÓN</span></div>
      <div className="hero-composition"><h1 id="hero-title" aria-label="Una ciudad. Todas sus perspectivas."><XRayText className="hero-title-plot"><span className="headline-line"><span>Una ciudad.</span></span><span className="headline-line"><span>Todas sus</span></span><span className="headline-line"><span>perspectivas<span className="headline-period">.</span></span></span></XRayText></h1><div className="hero-side"><span className="micro">OBSERVAR. ENTENDER. PLANEAR.</span><p>El presente de León,<br/>con la mirada en el futuro.</p><a href="#ejes" className="arrow-link">Explorar la información <Arrow diagonal/></a></div></div>
      <div className="hero-blueprint" aria-hidden="true"><svg viewBox="0 0 430 430" fill="none"><path d="M20 20h390v390H20zM20 215h390M215 20v390M20 20l390 390M410 20 20 410"/><circle cx="215" cy="215" r="195"/><circle cx="215" cy="215" r="130"/><path d="M85 85h260v260H85z"/></svg><span className="micro">UNA VISIÓN COMPARTIDA / 2050</span></div>
      <div className="hero-bottom"><p>Conoce el punto de partida.<br/>Observa el cambio. Explora las metas.</p><div className="hero-stat"><strong>07</strong><span className="micro">EJES DE CIUDAD</span></div><div className="hero-stat"><strong>{count}</strong><span className="micro">INDICADORES DISPONIBLES</span></div><a href="#ejes" className="hero-scroll micro"><span>COMIENZA A EXPLORAR</span><Arrow/></a></div>
    </section>
  </>;
}
