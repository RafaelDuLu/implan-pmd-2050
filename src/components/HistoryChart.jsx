import { useEffect, useId, useRef, useState } from 'react';
import histories from '../../assets/histories.json';
import { displayValue, number, chartObservations } from '../lib/indicators.mjs';
import { paceChartPoints } from '../lib/pace-scenario.mjs';
import { useChartMotion } from '../hooks/useChartMotion.js';

const chartInk={1:'#805f06',2:'#006b60',3:'#a82167',4:'#985000',5:'#286c23',6:'#2b3990',7:'#006bb8'};

/** Presentation only: the approved observations, scale and scenario stay intact. */
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
  const scenarioPoints=paceChartPoints(d,projected);
  const width = compact ? 360 : 740, left = compact ? 72 : 80, right = width - 28;
  const values = [...observations.map(p => p.value),d.target2030,...(showScenario ? [projected.value] : [])];
  const bottom = Math.min(...values), top = Math.max(...values), pad = Math.max((top-bottom)*.22,Math.abs(top)*.03,.001);
  const low = bottom-pad, high=top+pad;
  const x = year => left + (year-observations[0].year)/Math.max(1,2030-observations[0].year)*(right-left);
  const y = value => 224-(value-low)/(high-low)*174;
  const path = observations.map((p,i)=>`${i ? 'L':'M'}${x(p.year)},${y(p.value)}`).join(' ');
  const scenarioPath=scenarioPoints.map((p,i)=>`${i ? 'L':'M'}${x(p.year)},${y(p.value)}`).join(' ');
  const axis = value => Math.abs(value*factor)>=10000 ? new Intl.NumberFormat('es-MX',{notation:'compact',maximumFractionDigits:1}).format(value*factor) : number(value*factor,1);
  const ticks = [...new Set([observations[0].year,last.year,2030])];

  // Labels occupy their own layer; pixel offsets never change data positions.
  const end=scenarioPoints.at(-1) || {year:2030,value:d.value};
  const middle=scenarioPoints.length===3 ? scenarioPoints[1] : end;
  const endLabelY=y(end.value)+(Math.abs(y(end.value)-y(d.target2030))<24 ? 23 : -13);
  const motion=useChartMotion([x(last.year),y(last.value),x(middle.year),y(middle.value),x(end.year),y(end.value),endLabelY]);
  const observedLabelY=y(last.value)+(Math.abs(y(last.value)-y(d.target2030))<26 ? 22 : -13);
  const targetText=`Meta 2030 · ${displayValue(d.target2030,d)}`;
  const resultNote=projected.capped ? `Meta alcanzada${projected.reachedAt<2030 ? ` en ${Math.ceil(projected.reachedAt-1e-9)}` : ''}; se mantiene hasta 2030.` : projected.maintained ? 'Se conserva el resultado ya alcanzado.' : '';
  return <div className="history-chart clean-chart editorial-chart" ref={ref} data-compact={compact} style={{'--chart-accent':chartInk[d.axis] || '#006b60'}}>
    <div className="clean-chart-heading"><h4>Evolución hacia la meta</h4><span>{d.percent ? '%' : d.unit}</span></div>
    <div className="history-canvas"><svg viewBox={`0 0 ${width} 272`} role="img" aria-labelledby={`${uid}-title ${uid}-description`}>
      <title id={`${uid}-title`}>{d.name}</title><desc id={`${uid}-description`}>Base {d.baseYear}: {displayValue(d.base,d)}. Último dato {d.year}: {displayValue(d.value,d)}. Meta 2030: {displayValue(d.target2030,d)}. {showScenario ? `Escenario simulado a 2030: ${displayValue(projected.value,d)}; no es un dato observado ni un pronóstico oficial.${projected.capped ? ' El escenario alcanza la meta y la mantiene hasta 2030.' : projected.maintained ? ' Se conserva el resultado ya alcanzado.' : ''}` : 'La continuación a 2030 no es interpretable dentro de la escala y no se representa.'} Las líneas entre observaciones son guías visuales; no añaden datos para años sin observación.</desc>
      <rect className="chart-scenario-field" x={x(last.year)} y="36" width={right-x(last.year)} height="197"/>
      <text className="chart-zone-label" x={left} y="22">{compact ? 'Datos' : 'Observado'}</text>
      {showScenario && <text className="chart-zone-label chart-zone-scenario" x={right} y="22" textAnchor="end">{compact ? 'Escenario' : 'Escenario simulado'}</text>}
      {[0,.5,1].map(t=>{const value=low+(high-low)*t,yy=y(value);return <g key={t}><line className="chart-grid" x1={left} x2={right} y1={yy} y2={yy}/><text className="chart-axis-label" x={left-12} y={yy+4} textAnchor="end">{axis(value)}</text></g>;})}
      <line className="chart-time-seam" x1={x(last.year)} x2={x(last.year)} y1="36" y2="233"/>
      <line className="chart-target" x1={left} x2={right} y1={y(d.target2030)} y2={y(d.target2030)}/>
      <path className="chart-target-notch" d={`M${left-5},${y(d.target2030)-4}V${y(d.target2030)+4}`}/>
      <text className="chart-target-label" x={left} y={y(d.target2030)-12}>{targetText}</text>
      <path className="chart-observed-line" pathLength="1" d={path}/>
      {showScenario && <g ref={motion} className="chart-scenario-motion">
        <path className="chart-scenario-line" d={scenarioPath}/>
        {projected.capped && projected.reachedAt<2030 && <g className="chart-crossing-node" transform={`translate(${x(projected.reachedAt)} ${y(d.target2030)})`}><circle r="3"/></g>}
        <g className="chart-end-node" transform={`translate(${x(2030)} ${y(projected.value)})`}><circle className="chart-end-ring" r="7"/><circle className="chart-end-core" r="2.5"/></g>
        <g className="chart-end-label" transform={`translate(${right} ${endLabelY})`}><text textAnchor="end">{displayValue(projected.value,d)}</text></g>
      </g>}
      <g className="chart-observed-marks">{observations.map(p=><circle key={p.year} className="clean-observed-dot" cx={x(p.year)} cy={y(p.value)} r={p.year===last.year ? 4:3}/>)}
      {!compact && observations.length>1 && x(last.year)-x(observations[0].year)>85 && <text className="chart-observed-value" x={x(observations[0].year)} y={y(observations[0].value)+(Math.abs(y(observations[0].value)-y(d.target2030))<26 ? 22 : -13)}>{displayValue(observations[0].value,d)}</text>}
      <text className="chart-observed-value" x={x(last.year)} y={observedLabelY} textAnchor={compact ? 'start':'middle'}>{displayValue(last.value,d)}</text></g>
      {ticks.map((year,i)=><g key={year}><line className="chart-year-tick" x1={x(year)} x2={x(year)} y1="233" y2="238"/><text className="chart-year" x={x(year)} y="257" textAnchor={i===ticks.length-1?'end':'middle'}>{year}</text></g>)}
    </svg></div>
    {showScenario ? <div className="editorial-chart-result"><span>Con el ritmo seleccionado, en 2030</span><p><strong key={displayValue(projected.value,d)}>{displayValue(projected.value,d)}</strong>{!d.percent && <span className="chart-result-unit">{d.unit.toLocaleLowerCase('es-MX')}</span>}</p>{resultNote && <small>{resultNote}</small>}</div> : <p className="clean-chart-result">{projected.reason || 'La continuación a 2030 no es evaluable.'}</p>}
  </div>;
}
