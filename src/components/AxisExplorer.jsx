import EditorialBanner from './EditorialBanner.jsx';
import { Arrow, AxisGlyph } from './Icons.jsx';

export const axisCopy = {
  1: { title: 'Sociedad', subtitle: 'Educación, inclusión e identidad', text: 'Las condiciones que construyen oportunidades.', color: '#b6ff00' },
  2: { title: 'Seguridad', subtitle: 'Ciudadanía y paz social', text: 'La tranquilidad como condición de vida.', color: '#b6ff00' },
  3: { title: 'Economía', subtitle: 'Prosperidad e innovación', text: 'El valor que generamos como ciudad.', color: '#b6ff00' },
  4: { title: 'Territorio', subtitle: 'Sustentabilidad y resiliencia', text: 'Un entorno preparado para el futuro.', color: '#b6ff00' },
  5: { title: 'Agua', subtitle: 'Gestión integral', text: 'El recurso que conecta nuestro futuro.', color: '#b6ff00' },
  6: { title: 'Movilidad', subtitle: 'Eficiencia, inclusión y calidad', text: 'Las formas de encontrarnos.', color: '#b6ff00' },
  7: { title: 'Gobierno', subtitle: 'Apertura e innovación', text: 'Una ciudad que participa y confía.', color: '#b6ff00' },
};

export default function AxisExplorer({ axes, indicators, activeAxis, onSelect }) {
  return <div className="axis-section" id="ejes">
    <EditorialBanner index="01 / LOS EJES" id="axes-banner-title" title={<>¿Cómo está<br/>cambiando León?</>} description="Cada dato cuenta una parte de nuestra ciudad. Encuentra el tema que te interesa y explora su avance." action="Explorar" href="#directorio"><a href="#indicadores" className="outline-link">Ir al visor de indicadores ↗</a></EditorialBanner>
    <section className="axis-directory" id="directorio" aria-labelledby="axes-title"><div className="directory-aside" data-reveal><span className="micro">UN PLAN. SIETE EJES.</span><h2 id="axes-title">La ciudad,<br/>desde cada<br/>perspectiva.</h2><p>Selecciona un tema.<br/>Consulta sus indicadores, sus cambios y sus metas.</p><span className="directory-count micro">01 — 07 <span>↓</span></span></div><div className="axis-ledger">{axes.map(axis => {
      const copy=axisCopy[axis.id], count=indicators.filter(d=>d.axis===axis.id).length;
      return <button key={axis.id} className={`axis-card axis-card-${axis.id}`} data-reveal aria-pressed={axis.id===activeAxis} aria-controls="indicadores" onClick={()=>onSelect(axis.id)}><span className="axis-number micro">0{axis.id}</span><span className="axis-name"><strong>{copy.title}</strong><span>{copy.subtitle}</span></span><span className="axis-symbol"><AxisGlyph axis={axis.id}/></span><span className="axis-count micro">{String(count).padStart(2,'0')}<small>INDICADORES</small></span><Arrow diagonal/></button>;
    })}</div></section>
  </div>;
}
