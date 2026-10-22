import { useEffect } from 'react';
import { useScanner } from '../hooks/useScanner.js';
import LeonMap from './LeonMap.jsx';
import ScannerOverlay from './ScannerOverlay.jsx';
import { Arrow, Mark } from './Icons.jsx';

export default function Hero({ count }) {
  const scanner=useScanner();
  useEffect(()=>{
    const surface=scanner.ref.current;
    const title=surface.querySelector('.hero-title-plot');
    const map=surface.querySelector('.leon-map-canvas');
    const measure=()=>{
      const origin=surface.getBoundingClientRect(),plot=title.getBoundingClientRect();
      surface.style.setProperty('--title-x',`${plot.left-origin.left}px`);
      surface.style.setProperty('--title-y',`${plot.top-origin.top}px`);
      const bounds=map.getBoundingClientRect();
      surface.style.setProperty('--map-x',`${bounds.left-origin.left}px`);
      surface.style.setProperty('--map-y',`${bounds.top-origin.top}px`);
    };
    const observer=new ResizeObserver(measure);
    observer.observe(surface);observer.observe(title);observer.observe(map);measure();
    document.fonts.ready.then(()=>{if(surface.isConnected)measure();});
    return()=>observer.disconnect();
  },[scanner.ref]);
  const headline=<><span className="headline-line"><span>Una ciudad.</span></span><span className="headline-line"><span>Todas sus</span></span><span className="headline-line"><span>perspectivas<span className="headline-period">.</span></span></span></>;
  return <>
    <header className="site-header site-header-dark"><a href="#inicio" className="brand" aria-label="IMPLAN León, inicio"><Mark/><span>IMPLAN<small>LEÓN, GUANAJUATO</small></span></a><nav aria-label="Principal"><a href="#ejes">Los ejes <span>↗</span></a><a href="#indicadores">Indicadores <span>↗</span></a><a href="#datos">Datos abiertos <span>↓</span></a></nav><a className="header-project micro" href="#lectura">PMD / VISIÓN 2050 <span className="status-dot"/></a></header>
    <section className="hero scanner-surface" {...scanner} data-page-layer id="inicio" aria-labelledby="hero-title">
      <div className="hero-top micro"><span>PORTAL DE TABULADORES ESTADÍSTICOS</span><span>INSTITUTO MUNICIPAL DE PLANEACIÓN</span></div>
      <div className="hero-composition"><div className="hero-story"><h1 id="hero-title" aria-label="Una ciudad. Todas sus perspectivas."><span className="hero-title-plot" aria-hidden="true"><span className="hero-title-outline">{headline}</span><span className="hero-title-fill">{headline}</span></span></h1><div className="hero-side"><span className="micro">OBSERVAR. ENTENDER. PLANEAR.</span><p>El presente de León,<br/>con la mirada en el futuro.</p><a href="#ejes" className="arrow-link">Explorar la información <Arrow diagonal/></a></div></div><LeonMap/></div>
      <div className="hero-bottom"><p>Conoce el punto de partida.<br/>Observa el cambio. Explora las metas.</p><div className="hero-stat"><strong>07</strong><span className="micro">EJES DE CIUDAD</span></div><div className="hero-stat"><strong>{count}</strong><span className="micro">INDICADORES DISPONIBLES</span></div><a href="#ejes" className="hero-scroll micro"><span>COMIENZA A EXPLORAR</span><Arrow/></a></div>
      <ScannerOverlay/>
    </section>
  </>;
}
