import { useScrollScene } from '../hooks/useScrollScene.js';
import { Arrow, AxisGlyph } from './Icons.jsx';

export const axisCopy = {
  1: { title: 'Sociedad', subtitle: 'Educación, inclusión e identidad', text: 'Las condiciones que construyen oportunidades.', color: '#d0f58b' },
  2: { title: 'Seguridad', subtitle: 'Ciudadanía y paz social', text: 'La tranquilidad como condición de vida.', color: '#edbda3' },
  3: { title: 'Economía', subtitle: 'Prosperidad e innovación', text: 'El valor que generamos como ciudad.', color: '#b5b8ef' },
  4: { title: 'Territorio', subtitle: 'Sustentabilidad y resiliencia', text: 'Un entorno preparado para el futuro.', color: '#94d6b5' },
  5: { title: 'Agua', subtitle: 'Gestión integral', text: 'El recurso que conecta nuestro futuro.', color: '#91d7e3' },
  6: { title: 'Movilidad', subtitle: 'Eficiencia, inclusión y calidad', text: 'Las formas de encontrarnos.', color: '#e7d58b' },
  7: { title: 'Gobierno', subtitle: 'Apertura e innovación', text: 'Una ciudad que participa y confía.', color: '#c3b3dd' },
};

export default function AxisExplorer({ axes, indicators, activeAxis, onSelect }) {
  const ref = useScrollScene();
  return <section className="axis-section" id="ejes" ref={ref} aria-labelledby="axes-title">
    <div className="section-intro"><span className="micro section-index">01 — EXPLORA LEÓN</span><div><h2 id="axes-title">Una visión.<br/><span>Siete perspectivas.</span></h2><p>Cada eje cuenta una parte de nuestra ciudad.<br/>Elige uno y descubre qué está cambiando.</p></div><span className="section-aside micro">DEL PUNTO DE PARTIDA<br/>A LA META.</span></div>
    <div className="bento-grid">{axes.map(axis => {
      const copy = axisCopy[axis.id], count = indicators.filter(d => d.axis === axis.id).length;
      return <button key={axis.id} className={`axis-card axis-card-${axis.id}`} style={{ '--card-accent': copy.color }} aria-pressed={axis.id === activeAxis} aria-controls="indicadores" onClick={() => onSelect(axis.id)}>
        <span className="card-sheen" aria-hidden="true"/><span className="axis-card-top micro"><span>EJE 0{axis.id}</span><span>{String(count).padStart(2,'0')} INDICADORES</span></span>
        <div className="axis-glyph"><AxisGlyph axis={axis.id}/></div><div className="axis-card-bottom"><span><strong>{copy.title}</strong><span>{copy.subtitle}</span></span><b><Arrow diagonal/></b></div>
        {axis.id === 1 && <p>{copy.text}</p>}
      </button>;
    })}</div>
    <div className="axis-foot micro"><span>SIETE EJES / UNA CONSULTA ABIERTA</span><span>SELECCIONA UN BLOQUE PARA EXPLORAR <Arrow diagonal/></span></div>
  </section>;
}
