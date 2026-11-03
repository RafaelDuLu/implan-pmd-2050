import { useMemo, useState } from 'react';
import { normalize, number } from '../lib/indicators.mjs';
import { overviewRail, overviewStatus } from '../lib/overview-status.mjs';
import { axisCopy, axisTheme } from './AxisExplorer.jsx';
import { Arrow } from './Icons.jsx';

export function AxisHeading({ axis }) {
  return <div className="indicator-section-heading"><div className="axis-heading-art"><img src={`./axes/official/eje-${axis.id}.webp`} alt="" width="1063" height="1200" decoding="async"/></div><div className="axis-heading-copy"><h2 id="indicator-section-title" tabIndex="-1">{axisCopy[axis.id].title}</h2><p>{axis.name}</p></div></div>;
}

export default function AxisOverview({ axes, indicators, onSelectIndicator }) {
  const [query,setQuery]=useState('');
  const groups=useMemo(()=>axes.map(axis=>({axis,rows:indicators.filter(d=>d.axis===axis.id && normalize(`${d.id} ${d.name} ${axis.name}`).includes(normalize(query)))})),[axes,indicators,query]);
  return <section className="indicator-section axis-overview" id="indicadores" aria-labelledby="overview-title">
    <div className="overview-heading"><div><h2 id="overview-title">Avance de los indicadores</h2><p>Selecciona una barra para explorar el ritmo y las acciones hacia la meta.</p></div><label className="overview-search"><span className="sr-only">Buscar en todos los indicadores</span><input type="search" placeholder="Buscar indicador…" value={query} onChange={e=>setQuery(e.target.value)}/></label></div>
    <div className="overview-legend" aria-label="Semáforo de avance"><span data-state="good">Cumple o va en ruta</span><span data-state="watch">Requiere recuperación o aceleración</span><span data-state="risk">Atención prioritaria</span></div>
    <p className="overview-key">Avance respecto a la base. Amarillo: el escenario de mejora de hasta 3× llega a 2030; rojo: retroceso de un tramo base–meta o más, o esfuerzo superior a 3×. Es una referencia del simulador, no una garantía.</p>
    {groups.map(({axis,rows})=><section className="overview-axis" key={axis.id} style={axisTheme(axis.id)} aria-labelledby={`lista-eje-${axis.id}`}>
      <h3 id={`lista-eje-${axis.id}`} tabIndex="-1">{axis.name}</h3>
      <div className="overview-list">{rows.map(d=>{
        const status=overviewStatus(d), p=status.progress, rail=overviewRail(p);
        const value=p===null ? 'Sin cálculo' : `${number(p,1)} %`;
        return <button type="button" className="overview-indicator" data-state={status.state} key={d.id} id={`resumen-${d.id}`} onClick={()=>onSelectIndicator(d.id)} aria-label={`${d.name}. Avance ${value}. ${status.label}. Ver ritmo y acciones.`}>
          <span className="overview-row-name">{d.name}</span>
          <span className="overview-bar-area">
            <span className="overview-bar-heading"><span className="overview-status">{status.state==='risk' && <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2 19 18H1Z"/><path d="M10 7v5m0 2v1"/></svg>}{status.label}</span><strong>{value}</strong></span>
            <span className="overview-rail" data-overflow={rail.overflow} aria-hidden="true"><span className="overview-rail-negative"/><span className="overview-rail-fill" style={{left:`${rail.left}%`,width:`${rail.width}%`}}/><i className="overview-rail-zero"/><i className="overview-rail-marker" style={{left:`${rail.marker}%`}}/>{rail.overflow!==0 && <span className={`overview-overflow overview-overflow-${rail.overflow>0?'right':'left'}`}>{rail.overflow>0?'›':'‹'}</span>}</span>
            <span className="overview-rail-labels" aria-hidden="true"><span>{rail.overflow<0?'Retroceso fuera de escala':'Retroceso'}</span><span>Base</span><span>{rail.overflow>0?'Meta superada':'Meta'}</span></span>
          </span>
          <span className="overview-open">Ver ritmo <Arrow/></span>
        </button>;
      })}</div>
      {!rows.length && <p className="overview-axis-empty">Sin coincidencias en este eje.</p>}
    </section>)}
    {!groups.some(group=>group.rows.length) && <div className="overview-empty"><p>No hay indicadores para esta búsqueda.</p><button className="text-button" onClick={()=>setQuery('')}>Mostrar todos</button></div>}
  </section>;
}
