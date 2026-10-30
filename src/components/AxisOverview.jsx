import { useMemo, useState } from 'react';
import { displayValue, normalize, number, progress } from '../lib/indicators.mjs';
import { axisCopy } from './AxisExplorer.jsx';
import { TopicNavigation } from './IndicatorNavigator.jsx';
import { Arrow } from './Icons.jsx';

export function AxisHeading({ axis }) {
  return <div className="indicator-section-heading"><div className="axis-heading-art"><img src={`./axes/official/eje-${axis.id}.webp`} alt="" width="1063" height="1200" decoding="async"/></div><div className="axis-heading-copy"><h2 id="indicator-section-title" tabIndex="-1">{axisCopy[axis.id].title}</h2><p>{axis.name}</p></div></div>;
}

export default function AxisOverview({ axis, axes, indicators, onSelectAxis, onSelectIndicator }) {
  const [query, setQuery] = useState('');
  const rows = useMemo(() => indicators.filter(d => normalize(`${d.id} ${d.name}`).includes(normalize(query))), [indicators, query]);
  return <section className="indicator-section axis-overview" id="indicadores" aria-labelledby="indicator-section-title">
    <AxisHeading axis={axis}/>
    <TopicNavigation axes={axes} activeAxis={axis.id} onSelect={onSelectAxis}/>
    <div className="overview-heading"><div><h3>Avance de los indicadores</h3><p>Selecciona un indicador para consultar su evolución y explorar el ritmo hacia la meta.</p></div><label className="overview-search"><span className="sr-only">Buscar indicador del eje</span><input type="search" placeholder="Buscar indicador…" value={query} onChange={e => setQuery(e.target.value)}/></label></div>
    <div className="overview-list" aria-label="Avance de los indicadores del eje">{rows.map(d => {
      const p = progress(d), position = p === null ? 0 : Math.max(0, Math.min(100, p));
      const status = p === null ? 'Avance no calculable' : p < 0 ? 'Retroceso respecto a la base' : p > 100 ? 'Meta superada' : p === 100 ? 'Meta alcanzada' : 'Del tramo base–meta';
      return <button className="overview-indicator" key={d.id} id={`resumen-${d.id}`} onClick={() => onSelectIndicator(d.id)} aria-label={`${d.name}. Ver análisis detallado`}>
        <div className="overview-indicator-title"><span className="micro">{d.id}</span><span className="overview-indicator-name">{d.name}</span><Arrow diagonal/></div>
        <p className="overview-latest">Último dato · {d.year}: <strong>{displayValue(d.value,d)}</strong>{!d.percent && <span> · {d.unit}</span>}</p>
        <div className="overview-values"><div><span>Valor base · {d.baseYear}</span><strong>{displayValue(d.base,d)}</strong></div><div className="overview-progress" data-state={p === null ? 'unknown' : p < 0 ? 'negative' : 'positive'}><span>Avance hacia la meta</span><strong>{p === null ? 'No calculable' : `${number(p,1)} %`}</strong><small>{status}</small></div><div><span>Meta · 2030</span><strong>{displayValue(d.target2030,d)}</strong></div></div>
        <div className="overview-track" aria-hidden="true"><span className="overview-track-fill" style={{ width: `${position}%` }}/><i className="overview-track-start"/>{p !== null && <i className="overview-track-current" style={{ left: `${position}%` }}/>}<i className="overview-track-goal"/></div>
        <div className="overview-row-footer"><span>{d.unit}</span><span>Ver análisis <Arrow/></span></div>
      </button>;
    })}</div>
    {!rows.length && <div className="overview-empty"><p>No hay indicadores para esta búsqueda.</p><button className="text-button" onClick={() => setQuery('')}>Mostrar todos</button></div>}
    <details className="overview-method"><summary>¿Cómo se interpreta el avance?</summary><p>El porcentaje representa el tramo recorrido entre el valor base y la meta, según el último dato disponible. Puede ser negativo o mayor a 100 %. La línea muestra el tramo de 0 a 100 %; la cifra conserva el avance completo. Cuando la base coincide con la meta, este avance no es calculable. No es una proyección.</p></details>
  </section>;
}
