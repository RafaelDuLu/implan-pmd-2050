import { useEffect, useId, useRef, useState } from 'react';
import histories from '../../assets/histories.json';
import { displayValue, number, chartObservations } from '../lib/indicators.mjs';
import { paceChartPoints } from '../lib/pace-scenario.mjs';
import { useChartMotion } from '../hooks/useChartMotion.js';


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
  const endLabelY=y(end.value)-18;
  const bubbleWidth=Math.max(70,displayValue(end.value,d).length*8.5+26);
  const motion=useChartMotion([x(last.year),y(last.value),x(middle.year),y(middle.value),x(end.year),y(end.value),endLabelY]);
  return <div className="history-chart clean-chart editorial-chart" ref={ref} data-compact={compact} style={{'--chart-accent':'#23ded0'}}>
    <div className="clean-chart-heading"><h4>Evolución hacia la meta</h4><span>{d.percent ? '%' : d.unit}</span></div>
    <div className="history-canvas"><svg viewBox={`0 0 ${width} 272`} role="img" aria-labelledby={`${uid}-title ${uid}-description`}>
      <title id={`${uid}-title`}>{d.name}</title><desc id={`${uid}-description`}>Base {d.baseYear}: {displayValue(d.base,d)}. Último dato {d.year}: {displayValue(d.value,d)}. Meta 2030: {displayValue(d.target2030,d)}. {showScenario ? `Escenario simulado a 2030: ${displayValue(projected.value,d)}; no es un dato observado ni un pronóstico oficial.${projected.capped ? ' El escenario alcanza la meta y la mantiene hasta 2030.' : projected.maintained ? ' Se conserva el resultado ya alcanzado.' : ''}` : 'La continuación a 2030 no es interpretable dentro de la escala y no se representa.'} Las líneas entre observaciones son guías visuales; no añaden datos para años sin observación.</desc>
      <defs><linearGradient id={`${uid}-history-fill`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#31c8c3" stopOpacity=".28"/><stop offset="100%" stopColor="#14303e" stopOpacity="0"/></linearGradient><linearGradient id={`${uid}-scenario-fill`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#85b8d6" stopOpacity=".23"/><stop offset="100%" stopColor="#173342" stopOpacity=".02"/></linearGradient></defs>
      {[0,.5,1].map(t=>{const value=low+(high-low)*t,yy=y(value);return <g key={t}><line className="chart-grid" x1={left} x2={right} y1={yy} y2={yy}/><text className="chart-axis-label" x={left-12} y={yy+4} textAnchor="end">{axis(value)}</text></g>;})}
      <path className="chart-frame-axis" d={`M${left-7},50V233H${right+10}`}/>
      <line className="chart-target" x1={left} x2={right} y1={y(d.target2030)} y2={y(d.target2030)}/>
      <path className="chart-history-area" fill={`url(#${uid}-history-fill)`} d={`${path}L${x(last.year)},233L${x(observations[0].year)},233Z`}/>
      <path className="chart-observed-line" pathLength="1" d={path}/>
      {showScenario && <g ref={motion} className="chart-scenario-motion">
        <path className="chart-scenario-area" fill={`url(#${uid}-scenario-fill)`} d={`${scenarioPath}L${right},233L${x(last.year)},233Z`}/><path className="chart-scenario-line" d={scenarioPath}/>
        {projected.capped && projected.reachedAt<2030 && <g className="chart-crossing-node" transform={`translate(${x(projected.reachedAt)} ${y(d.target2030)})`}><circle r="3"/></g>}
        <g className="chart-end-node" transform={`translate(${x(2030)} ${y(projected.value)})`}><circle className="chart-end-ring" r="7"/><circle className="chart-end-core" r="2.5"/></g>
        <g className="chart-end-label" transform={`translate(${right} ${endLabelY})`}><path className="chart-value-bubble" d={`M${-bubbleWidth+12},-30H4Q12,-30 12,-22V-8Q12,0 4,0H6L0,8L-6,0H${-bubbleWidth+20}Q${-bubbleWidth+12},0 ${-bubbleWidth+12},-8V-22Q${-bubbleWidth+12},-30 ${-bubbleWidth+20},-30Z`}/><text x={-bubbleWidth/2+12} y="-11" textAnchor="middle">{displayValue(projected.value,d)}</text></g>
      </g>}
      <g className="chart-observed-marks">{observations.map(p=><circle key={p.year} className="clean-observed-dot" cx={x(p.year)} cy={y(p.value)} r={p.year===last.year ? 4:3}/>)}
      </g>
      {ticks.map((year,i)=><g key={year}><line className="chart-year-tick" x1={x(year)} x2={x(year)} y1="233" y2="238"/><text className="chart-year" x={x(year)} y="257" textAnchor={i===ticks.length-1?'end':'middle'}>{year}</text></g>)}
    </svg></div>
    <div className="reference-chart-legend"><span><i/>Datos disponibles</span>{showScenario && <span><i/>Escenario simulado</span>}<span><i/>Meta 2030</span></div>
    {!showScenario && <p className="chart-unavailable" role="status">{projected.reason || 'La continuación a 2030 no es evaluable.'}</p>}
  </div>;
}
