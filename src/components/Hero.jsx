import { useScanner } from '../hooks/useScanner.js';
import { Arrow, Mark } from './Icons.jsx';

export default function Hero({ count }) {
  const scanner = useScanner();
  return <>
    <header className="site-header">
      <a href="#inicio" className="brand" aria-label="IMPLAN León, inicio"><Mark/><span>IMPLAN<small>LEÓN · VISIÓN 2050</small></span></a>
      <nav aria-label="Principal"><a href="#ejes">Explorar los ejes <Arrow diagonal/></a><a href="#datos">Datos abiertos <span>↓</span></a></nav>
      <span className="header-sign">UN PLAN. UNA CIUDAD. <i/></span>
    </header>
    <section className="hero scanner-surface" id="inicio" {...scanner} aria-labelledby="hero-title">
      <div className="hero-top micro"><span>TABULADORES ESTADÍSTICOS / PMD</span><span>LEÓN, GUANAJUATO · MÉXICO</span></div>
      <div className="hero-composition">
        <h1 id="hero-title"><span>El futuro</span><span>se <em>mide.</em></span></h1>
        <div className="horizon-orbit" aria-label="Visión al año 2050"><span className="orbit-label micro">HORIZONTE COMPARTIDO</span><div className="orbit-rings" aria-hidden="true"><i/><i/><i/><b>↗</b></div><strong>2050</strong><span className="orbit-caption micro">UNA VISIÓN DE CIUDAD</span></div>
      </div>
      <div className="scanner-layer" aria-hidden="true"><div className="technical-grid"/><span className="scan-word">LEÓN</span><div className="scan-cross"/></div>
      <div className="scan-lens" aria-hidden="true"><span>EXPLORA EL PRESENTE</span></div>
      <div className="hero-bottom"><p>Datos para entender dónde estamos.<br/><span>Una visión para decidir hacia dónde ir.</span></p><a className="circle-link" href="#ejes"><span>Explora la ciudad<br/>a través de sus datos</span><b><Arrow diagonal/></b></a></div>
      <div className="hero-index"><div><strong>07</strong><span>EJES ESTRATÉGICOS</span></div><div><strong>{count}</strong><span>INDICADORES DISPONIBLES</span></div><div><strong>2030</strong><span>PRÓXIMO HORIZONTE DE METAS</span></div><a href="#ejes" className="scroll-cue">DESLIZA PARA EXPLORAR <span>↓</span></a></div>
    </section>
  </>;
}
