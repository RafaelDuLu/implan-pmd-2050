import { useId, useState } from 'react';
import histories from '../../assets/histories.json';
import { displayValue, number, chartObservations } from '../lib/indicators.mjs';
import GoalTimeline from './GoalTimeline.jsx';

/** Only observed points and the explicitly labelled scenario; never synthesize historical years. */
export default function HistoryChart({ indicator: d, projected, timelineData }) {
  const [view, setView] = useState('line');
  const [showGoal, setShowGoal] = useState(true);
  const [selected, setSelected] = useState(1);
  const uid = useId();
  const factor = d.percent ? 100 : 1;
  const history = histories.series[d.id];
  const observations = chartObservations(d, history);
  const hasHistory = observations.length > 2;
  const points = [...observations.map((p, i) => ({ ...p, label: p.year === d.baseYear ? 'Línea base' : p.year === d.year ? 'Último dato' : 'Dato histórico', kind: 'observed' })), ...(projected.state !== 'unavailable' ? [{ year: 2030, value: projected.value, label: 'Escenario, no dato oficial', kind: 'scenario' }] : [])];
  const current = points[Math.min(selected, points.length - 1)];
  const values = points.map(p => p.value * factor).concat(showGoal ? [d.target2030 * factor] : []);
  let min = Math.min(...values), max = Math.max(...values);
  const pad = Math.max((max - min) * .25, Math.abs(max) * .04, .01);
  min = view === 'bars' && min >= 0 ? 0 : min - pad;
  max = (view === 'bars' ? Math.max(0, max) : max) + pad;
  const x = year => 68 + (year - observations[0].year) / Math.max(1, 2030 - observations[0].year) * 610;
  const y = value => 230 - (value * factor - min) / (max - min) * 175;
  const path = observations.map((p, i) => `${i ? 'L' : 'M'}${x(p.year)},${y(p.value)}`).join(' ');
  const last = observations.at(-1);
  return <div className="history-chart">
    <div className="chart-toolbar"><div role="group" aria-label="Vista de la gráfica">{[['line','Evolución'],['bars','Barras'],['milestones','Hitos']].map(([value,label]) => <button key={value} aria-pressed={view === value} onClick={() => setView(value)}>{label}</button>)}</div>{view !== 'milestones' && <button className="chart-goal-toggle" aria-pressed={showGoal} onClick={() => setShowGoal(!showGoal)}><span aria-hidden="true">{showGoal ? '⊕' : '+'}</span> Meta 2030</button>}</div>
    {view === 'milestones' ? <GoalTimeline data={timelineData}/> : <>
      <div className="chart-caption"><span className="micro">{observations.length} OBSERVACIONES DISPONIBLES</span><span>{d.percent ? '%' : d.unit}</span></div>
      <div className="history-canvas" tabIndex="0" role="region" aria-label="Gráfica desplazable horizontalmente"><svg viewBox="0 0 740 280" role="img" aria-labelledby={`${uid}-title ${uid}-desc`}><title id={`${uid}-title`}>{d.name}: observaciones y escenario 2030</title><desc id={`${uid}-desc`}>Los años sin observación no tienen datos. Las líneas entre puntos son una guía visual. El tramo punteado es una extrapolación, no un histórico oficial. Consulta los valores con los botones bajo la gráfica.</desc>
        {[0,.5,1].map(t => { const value = min + (max - min) * t, yy = 230 - t * 175; return <g key={t}><line className="chart-grid" x1="68" x2="690" y1={yy} y2={yy}/><text className="chart-axis-label" x="55" y={yy + 5} textAnchor="end">{number(value, 1)}</text></g>; })}
        {showGoal && <g><line className="chart-target" x1="68" x2="690" y1={y(d.target2030)} y2={y(d.target2030)}/><text className="chart-target-label" x="690" y={y(d.target2030)-10} textAnchor="end">META {displayValue(d.target2030,d)}</text></g>}
        {view === 'line' && <><path className="chart-observed-line" d={path}/>{projected.state !== 'unavailable' && <path className="chart-scenario-line" d={`M${x(last.year)},${y(last.value)}L${x(2030)},${y(projected.value)}`}/>}</>}
        {points.map((p, i) => <g key={`${p.year}-${p.kind}`} className={p.kind === 'scenario' ? 'chart-scenario-point' : 'chart-observed-point'}>{view === 'bars' ? <rect x={x(p.year)-19} y={Math.min(y(p.value),y(0))} width="38" height={Math.abs(y(p.value)-y(0))}/> : <circle cx={x(p.year)} cy={y(p.value)} r={selected === i ? 7 : 5}/>}<text className="chart-year" x={x(p.year)} y="263" textAnchor="middle">{p.year}{p.kind === 'scenario' ? '*' : ''}</text></g>)}
      </svg></div>
      <p className="chart-mobile-hint">Desliza para recorrer la gráfica →</p>
      <div className="chart-point-buttons" role="group" aria-label="Consultar valores de la gráfica">{points.map((p, i) => <button key={`${p.year}-${p.kind}`} aria-pressed={selected === i} onClick={() => setSelected(i)}><span>{p.year}{p.kind === 'scenario' ? ' / ESCENARIO' : ''}</span><strong>{displayValue(p.value,d)}</strong></button>)}</div>
      <p className="chart-point-detail" role="status">{current.label} · {current.year}: <b>{displayValue(current.value,d)}</b></p>
      <div className="chart-legend"><span><i/> {hasHistory ? 'Observaciones disponibles' : 'Observaciones del insumo'}</span><span><i/> Escenario no oficial</span>{showGoal && <span><i/> Meta 2030</span>}</div>
      <p className="chart-integrity">{hasHistory ? 'Observaciones del insumo e histórico validado. Solo se muestran los periodos disponibles.' : 'Vista de referencia con las dos observaciones del Excel. Históricos oficiales pendientes de incorporación; sin valores intermedios inventados.'} El escenario cambia con el control de ritmo.</p>
      {hasHistory && <p className="chart-integrity">Histórico: <a href={history.source.url} target="_blank" rel="noopener noreferrer">{history.source.name} ↗</a> · {history.geography}</p>}
      {d.id === '3.1.3' && <p className="chart-source-check">Periodos por cotejar: el Excel etiqueta 2019 y 2024. INEGI señala 2023 como referencia económica de los CE 2024. <a href="https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2025/ce/CE2024_def_RR.pdf" target="_blank" rel="noopener noreferrer">Ver ficha oficial ↗</a></p>}
    </>}
  </div>;
}
