import { useFooterReveal } from '../hooks/useFooterReveal.js';
import FooterWordmark from './FooterWordmark.jsx';
import EditorialBanner from './EditorialBanner.jsx';
import { Arrow, Mark } from './Icons.jsx';

export function ClosingSections() {
  return <>
    <section className="method-section" data-page-layer id="lectura" aria-labelledby="method-title"><div className="method-heading" data-reveal><span className="micro">04 / CRITERIOS DE LECTURA</span><h2 id="method-title">Detrás de cada cifra,<br/>un contexto.</h2><p>Fuentes claras. Unidades precisas.<br/>Supuestos a la vista.</p></div><div className="method-grid">
      <details><summary><span className="micro">01</span>¿Qué información estás consultando?<span>+</span></summary><div><p>El insumo de septiembre de 2026 contiene 52 indicadores por eje y 9 líderes. El visor muestra 31 con base, dato reciente, meta 2030, unidad y fuente completas y sin discrepancias sustantivas señaladas. Los otros registros se conservan para validación.</p><p>Las cifras y fuentes se transcriben del Excel; aún requieren cotejo con las publicaciones originales antes de validación institucional definitiva.</p><a href="./docs/inventario.csv" download>Inventario y criterios de selección ↓</a></div></details>
      <details><summary><span className="micro">02</span>¿Cómo se interpreta el avance?<span>+</span></summary><div><p>Avance = (último valor − línea base) / (meta − línea base) × 100. Se conservan retrocesos y avances mayores a 100 %. La barra representa únicamente el tramo de 0 a 100 %.</p><p>La flecha indica si el valor sube o baja. El color señala si ese cambio es favorable según el sentido de la meta. Los porcentajes se comparan mediante puntos porcentuales; no se promedian unidades distintas.</p></div></details>
      <details><summary><span className="micro">03</span>¿Qué significa cambiar el ritmo?<span>+</span></summary><div><p>Cambio anual medio = (último valor − base) / (año reciente − año base). Escenario 2030 = último valor + cambio anual medio × factor × (2030 − año reciente).</p><p>Es una extrapolación de dos observaciones, no un pronóstico oficial ni una probabilidad de cumplimiento. No se inventan años intermedios. Para metas descendentes, un valor menor o igual es favorable; para ascendentes, mayor o igual.</p></div></details>
    </div></section>
    <EditorialBanner closing index="EL FUTURO SE CONSTRUYE CON INFORMACIÓN" id="closing-title" title={<>¿Hacia dónde<br/>va nuestra ciudad?</>} description="Entender dónde estamos nos permite decidir hacia dónde ir. Vuelve a los datos y encuentra una nueva perspectiva." action="Avancemos" href="#ejes"><a className="outline-link" href="#datos">Consultar los datos abiertos <Arrow diagonal/></a></EditorialBanner>
  </>;
}

export default function Footer() {
  const ref=useFooterReveal();
  return <footer className="site-footer" ref={ref}><div className="footer-stage"><div className="footer-top"><div><a className="brand" href="#inicio"><Mark/><span>IMPLAN<small>LEÓN · VISIÓN 2050</small></span></a><p>Información para entender<br/>la ciudad que compartimos.</p></div><nav aria-label="Índice del portal"><span className="micro">EXPLORAR</span><a href="#ejes">Los siete ejes ↗</a><a href="#indicadores">Indicadores ↗</a><a href="#datos">Datos abiertos ↗</a></nav><div className="footer-context"><span className="micro">ACERCA DEL PORTAL</span><p>Monitoreo del Plan Municipal<br/>de Desarrollo Visión 2050.</p><a href="#lectura">Fuentes y criterios ↗</a></div></div>
      <div className="footer-drawing"><div className="drawing-ruler micro" aria-hidden="true"><span>LEÓN / GUANAJUATO</span><i/><span data-fill-progress>000%</span><span>HORIZONTE 2050</span></div><FooterWordmark/></div>
      <div className="footer-bottom micro"><span>IMPLAN LEÓN · TABULADORES ESTADÍSTICOS</span><span>INSUMO / SEPTIEMBRE 2026</span><a href="#inicio">VOLVER ARRIBA ↑</a></div>
    </div></footer>;
}