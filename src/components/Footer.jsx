import { useFooterReveal } from '../hooks/useFooterReveal.js';
import FooterWordmark from './FooterWordmark.jsx';
import EditorialBanner from './EditorialBanner.jsx';
import ImplanLogo from './ImplanLogo.jsx';

export function ClosingSections() {
  return <>
    <section className="method-section" data-page-layer id="lectura" aria-labelledby="method-title"><details className="method-disclosure"><summary id="method-title">Fuentes y metodología <span>+</span></summary><div className="method-grid">
      <details><summary><span className="micro">01</span>¿Qué información estás consultando?<span>+</span></summary><div><p>El insumo de septiembre de 2026 contiene 52 indicadores por eje y 9 líderes. El visor muestra 31 con base, dato reciente, meta 2030, unidad y fuente completas y sin discrepancias sustantivas señaladas. Los otros registros se conservan para validación.</p><p>Las cifras y fuentes se transcriben del Excel; aún requieren cotejo con las publicaciones originales antes de validación institucional definitiva.</p><p>Cartografía del municipio de León: <a href="https://www.inegi.org.mx/servicios/catalogounico.html" target="_blank" rel="noreferrer">INEGI · Marco Geoestadístico</a>.</p><a href="./docs/inventario.csv" download>Inventario y criterios de selección ↓</a></div></details>
      <details><summary><span className="micro">02</span>¿Cómo se interpreta el avance?<span>+</span></summary><div><p>Avance = (último valor − línea base) / (meta − línea base) × 100. Se conservan retrocesos y avances mayores a 100 %. La barra representa únicamente el tramo de 0 a 100 %.</p><p>La flecha indica si el valor sube o baja. El color señala si ese cambio es favorable según el sentido de la meta. Los porcentajes se comparan mediante puntos porcentuales; no se promedian unidades distintas.</p></div></details>
      <details><summary><span className="micro">03</span>¿Cómo se estima el cumplimiento?<span>+</span></summary><div><p>Cambio anual medio = (último valor − base) / (año reciente − año base). Año de cruce = año reciente + (meta − último valor) / cambio anual medio, solo cuando la tendencia acerca a una meta aún pendiente. Se muestra el primer año entero igual o posterior al cruce. Ritmo anual requerido = (meta − último valor) / (2030 − año reciente).</p><p>Es una extrapolación de dos observaciones, no un pronóstico oficial ni una probabilidad de cumplimiento. Si la meta ya se cumple, se identifica ese estado con el último dato; no se inventa el primer año histórico de cumplimiento. Si no hay avance o la tendencia se aleja, no se asigna una fecha futura. No se inventan años intermedios. Para metas descendentes, un valor menor o igual es favorable; para ascendentes, mayor o igual.</p></div></details>
    </div></details></section>
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
