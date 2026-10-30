import { useEffect, useRef } from 'react';
import { warmAxisArtwork } from '../lib/axis-artwork.js';
import EditorialBanner from './EditorialBanner.jsx';
import { Arrow } from './Icons.jsx';

export const axisCopy = {
  1: { title: 'Sociedad', subtitle: 'Educada, incluyente y con identidad', text: 'Las condiciones que construyen oportunidades.', color: '#f9c217', light: '#f9c217', tint: '#fff8de' },
  2: { title: 'Seguridad', subtitle: 'Ciudadana y paz social', text: 'La tranquilidad como condición de vida.', color: '#00b8a3', light: '#00b8a3', tint: '#e5f7f4' },
  3: { title: 'Economía', subtitle: 'Próspera, innovadora y diversificada', text: 'El valor que generamos como ciudad.', color: '#a82167', light: '#ef9fc7', tint: '#faedf4' },
  4: { title: 'Territorio', subtitle: 'Sustentable y resiliente', text: 'Un entorno preparado para el futuro.', color: '#ff8201', light: '#ffab57', tint: '#fff1e4' },
  5: { title: 'Agua', subtitle: 'Gestión integral del agua', text: 'El recurso que conecta nuestro futuro.', color: '#4fb348', light: '#89d382', tint: '#edf7ec' },
  6: { title: 'Movilidad', subtitle: 'Eficiente, inclusiva y de calidad', text: 'Las formas de encontrarnos.', color: '#2b3990', light: '#a8b4ff', tint: '#eef0fa' },
  7: { title: 'Gobierno', subtitle: 'Abierto e innovador', text: 'Una ciudad que participa y confía.', color: '#0194fe', light: '#64baff', tint: '#e8f4ff' },
};

/** Brand colors taken from the official Plan León 2050 stylesheet. */
export function axisTheme(id) {
  const a = axisCopy[id];
  return { '--axis-color': a.color, '--axis-ink': [3, 6].includes(Number(id)) ? '#ffffff' : '#121c24', '--axis-light': a.light, '--axis-tint': a.tint, '--lime': a.light, '--cyan': a.light };
}

export default function AxisExplorer({ axes, indicators, activeAxis, onSelect }) {
  const directory = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        axes.forEach(axis => warmAxisArtwork(axis.id));
        observer.disconnect();
      }
    }, { rootMargin: '400px' });
    observer.observe(directory.current);
    return () => observer.disconnect();
  }, [axes]);
  return <div className="axis-section" data-page-layer id="ejes">
    <EditorialBanner id="axes-banner-title" title={<>¿Cómo está<br/>cambiando León?</>} action="Explorar"/>
    <section ref={directory} className="axis-directory" id="directorio" aria-labelledby="axes-title"><div className="directory-aside" data-reveal><h2 id="axes-title">Siete ejes <br/>de ciudad.</h2><p>Consulta los indicadores del Plan León 2050 por eje estratégico.</p></div><div className="axis-ledger">{axes.map(axis => {
      const copy=axisCopy[axis.id], count=indicators.filter(d=>d.axis===axis.id).length;
      return <button key={axis.id} className={`axis-card axis-card-${axis.id}`} style={axisTheme(axis.id)} data-reveal aria-pressed={axis.id===activeAxis} aria-controls="indicadores" onClick={()=>onSelect(axis.id)}><span className="axis-number micro">0{axis.id}</span><span className="axis-name"><strong>{copy.title}</strong><span>{copy.subtitle}</span></span><span className="axis-symbol"><img className="axis-art" src={`./axes/official/eje-${axis.id}.webp`} alt="" width="1063" height="1200" loading="lazy" decoding="async"/></span><span className="axis-count micro">{String(count).padStart(2,'0')}<small>INDICADORES</small></span><Arrow diagonal/></button>;
    })}</div></section>
  </div>;
}
