import { useEffect, useId, useRef, useState } from 'react';
import histories from '../../assets/histories.json';
import { displayValue, number, chartObservations } from '../lib/indicators.mjs';

/** One quiet view: observed values, valid linear continuation and 2030 target. */
export default function HistoryChart({ indicator: d, projected }) {
  const uid = useId(), ref = useRef(null);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setCompact(entry.contentRect.width < 500));
    observer.observe(ref.current); return () => observer.disconnect();
  }, []);
  const observations = chartObservations(d, histories.series[d.id]);
  const last = observations.at(-1), factor = d.percent ? 100 : 1;
  const showScenario = projected.state !== 'unavailable' && d.year < 2030;
  const width = compact ? 360 : 740, left = compact ? 72 : 80, right = width - 28;
  const values = [...observations.map(p => p.value),d.target2030,...(showScenario ? [projected.value] : [])];
  const bottom = Math.min(...values), top = Math.max(...values), pad = Math.max((top-bottom)*.22,Math.abs(top)*.03,.001);
  const low = bottom-pad, high=top+pad;
  const x = year => left + (year-observations[0].year)/Math.max(1,2030-observations[0].year)*(right-left);
  const y = value => 224-(value-low)/(high-low)*174;
  const path = observations.map((p,i)=>`${i ? 'L':'M'}${x(p.year)},${y(p.value)}`).join(' ');
  const axis = value => Math.abs(value*factor)>=10000 ? new Intl.NumberFormat('es-MX',{notation:'compact',maximumFractionDigits:1}).format(value*factor) : number(value*factor,1);
  const ticks = [...new Set([observations[0].year,last.year,2030])];
  return <div className="history-chart clean-chart" ref={ref}>
    <div className="clean-chart-heading"><h4>Evolución hacia la meta</h4><span>{d.percent ? '%' : d.unit}</span></div>
    <div className="history-canvas"><svg viewBox={`0 0 ${width} 272`} role="img" aria-labelledby={`${uid}-title ${uid}-description`}>
      <title id={`${uid}-title`}>{d.name}</title><desc id={`${uid}-description`}>Base {d.baseYear}: {displayValue(d.base,d)}. Último dato {d.year}: {displayValue(d.value,d)}. Meta 2030: {displayValue(d.target2030,d)}. {showScenario ? `Escenario simulado a 2030: ${displayValue(projected.value,d)}; no es un dato observado ni un pronóstico oficial.` : 'La continuación a 2030 no es interpretable dentro de la escala y no se representa.'} Las líneas entre observaciones son guías visuales; no añaden datos para años sin observación.</desc>
      {[0,.5,1].map(t=>{const value=low+(high-low)*t,yy=y(value);return <g key={t}><line className="chart-grid" x1={left} x2={right} y1={yy} y2={yy}/><text className="chart-axis-label" x={left-12} y={yy+4} textAnchor="end">{axis(value)}</text></g>;})}
      <line className="chart-target" x1={left} x2={right} y1={y(d.target2030)} y2={y(d.target2030)}/>
      <path className="chart-observed-line" d={path}/>
      {showScenario && <><path className="chart-scenario-line" d={`M${x(last.year)},${y(last.value)}L${x(2030)},${y(projected.value)}`}/><circle className="clean-scenario-dot" cx={x(2030)} cy={y(projected.value)} r="4"/></>}
      {observations.map(p=><circle key={p.year} className="clean-observed-dot" cx={x(p.year)} cy={y(p.value)} r={p.year===last.year ? 5:4}/>)}
      {ticks.map((year,i)=><text key={year} className="chart-year" x={x(year)} y="257" textAnchor={i===ticks.length-1?'end':'middle'}>{year}</text>)}
    </svg></div>
    <div className="clean-chart-legend"><span><i/>Datos disponibles</span>{showScenario && <span><i/>Escenario simulado</span>}<span><i/>Meta 2030</span></div>
    {showScenario ? <p className="clean-chart-result">Con el ritmo seleccionado, en 2030: <strong>{displayValue(projected.value,d)}</strong>{!d.percent ? ` ${d.unit.toLocaleLowerCase('es-MX')}` : ''}.</p> : <p className="clean-chart-result">{projected.reason || 'La continuación a 2030 no es evaluable.'}</p>}

  </div>;
}
