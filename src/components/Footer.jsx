import { useScrollScene } from '../hooks/useScrollScene.js';
import { useScanner } from '../hooks/useScanner.js';
import SectionTransition from './SectionTransition.jsx';
import { Arrow, Mark } from './Icons.jsx';

export default function Footer() {
  const sceneRef = useScrollScene();
  return <>
    <SectionTransition word="Entender." number="04" caption="DATOS CON CRITERIO" detail="La información es más útil cuando sabemos cómo leerla." from="paper" to="sage"/>
    <section className="method-section" id="lectura"><span className="micro">04 — DATOS CON CRITERIO</span><h2>La claridad también<br/>está en <em>cómo los leemos.</em></h2><div className="method-grid"><details><summary>Qué datos estás consultando <span>↗</span></summary><p>El archivo de septiembre de 2026 contiene 52 indicadores por eje y 9 líderes. Se muestran 31 con línea base, dato reciente, meta 2030, unidad y fuente completas, sin discrepancias sustantivas señaladas en el insumo. Los otros registros se conservan para su validación.</p><a href="./docs/inventario.csv" download>Ver inventario y motivos de selección ↓</a><p>Las fuentes se transcriben del Excel; las cifras aún deben cotejarse con cada publicación original antes de su validación institucional definitiva.</p></details><details><summary>Cómo se construye la proyección <span>↗</span></summary><p>Cambio anual medio = (último valor − línea base) / (año reciente − año base). Escenario 2030 = último valor + cambio anual medio × factor de escenario × (2030 − año reciente).</p><p>Solo hay dos observaciones por indicador. No se estiman años intermedios, no se atribuye certeza estadística y no se trata de un pronóstico oficial. Si el objetivo es disminuir, una proyección menor o igual a la meta es favorable; si es aumentar, debe ser mayor o igual.</p></details><details><summary>Qué significa el tramo recorrido <span>↗</span></summary><p>Avance = (último valor − línea base) / (meta − línea base) × 100. La cifra conserva valores negativos y mayores a 100 %. La barra solo representa el tramo de 0 a 100 %.</p><p>Se distingue de los cálculos de cumplimiento incluidos en el Excel. Los porcentajes se comparan mediante puntos porcentuales. No se promedian indicadores de unidades distintas.</p></details></div></section>
    <section className="closing-section" ref={sceneRef}><span className="micro">EL FUTURO SE CONSTRUYE CON INFORMACIÓN.</span><h2>Una ciudad.<br/><span>Más posibilidades.</span><Arrow diagonal/></h2><div className="closing-bottom"><p>Mirar los datos es el primer paso.<br/>Entenderlos nos permite avanzar.</p><a href="#ejes" className="circle-link"><span>Volver a explorar</span><b><Arrow diagonal/></b></a></div></section>
    <footer className="site-footer"><div className="footer-meta"><a className="brand" href="#inicio"><Mark/><span>IMPLAN<small>LEÓN · VISIÓN 2050</small></span></a><p>Planeación que observa.<br/>Información que conecta.</p><a className="footer-up" href="#inicio">VOLVER ARRIBA <span>↑</span></a></div><FooterWord/><div className="footer-bottom micro"><span>MONITOREO DEL PLAN MUNICIPAL DE DESARROLLO</span><a href="#lectura">FUENTES Y CRITERIOS DE LECTURA ↗</a><span>CORTE DEL INSUMO · SEPTIEMBRE 2026</span></div></footer>
  </>;
}

function FooterWord() {
  const ref = useScrollScene();
  const scanner = useScanner();
  return <div className="footer-drawing" ref={ref}><div className="drawing-ruler micro" aria-hidden="true"><span>EL HORIZONTE NOS CONECTA</span><i/><span>2050</span></div><div className="footer-word scanner-surface" {...scanner} aria-label="León 2050"><span aria-hidden="true">LEÓN 2050</span><span className="footer-word-fill" aria-hidden="true">LEÓN 2050</span><span className="footer-word-wire" aria-hidden="true">LEÓN 2050</span></div></div>;
}
