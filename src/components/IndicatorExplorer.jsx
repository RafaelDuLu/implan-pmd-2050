import { useMemo, useState } from 'react';
import { displayValue, progress, project, toTimelineRecord, number, downloadCSV } from '../lib/indicators.mjs';
import HistoryChart from './HistoryChart.jsx';
import ChangeSummary from './ChangeSummary.jsx';
import IndicatorNavigator, { TopicNavigation } from './IndicatorNavigator.jsx';
import { Arrow } from './Icons.jsx';
import { axisCopy } from './AxisExplorer.jsx';

const stateCopy = {
  'on-track': { label: 'El ritmo apunta a la meta.', badge: 'ALCANZARÍA LA META', text: 'Si se mantuviera el cambio medio observado, el valor alcanzaría o superaría la meta en el sentido deseado.' },
  'at-risk': { label: 'La meta exige otro ritmo.', badge: 'NO ALCANZARÍA LA META', text: 'Con la continuidad del cambio medio observado, el valor no alcanzaría la meta en el sentido deseado.' },
  unavailable: { label: 'El escenario tiene un límite.', badge: 'NO EVALUABLE', text: 'Los datos no permiten interpretar este escenario dentro del rango del indicador.' },
};

export default function IndicatorExplorer({ axis, indicators, axes, selectedId, onSelectIndicator, onSelectAxis }) {
  const [multiplier, setMultiplier] = useState(1);
  const [scenarioOpen, setScenarioOpen] = useState(true);
  const d = indicators.find(d => d.id === selectedId) ?? indicators[0];
  const projected = useMemo(() => project(d, multiplier), [d, multiplier]);
  const timelineData = useMemo(() => [toTimelineRecord(d, multiplier)], [d, multiplier]);
  const p = progress(d), copy = stateCopy[projected.state];
  const sourceLink = /^https?:\/\//.test(d.link || '') ? d.link : null;
  return <section className="indicator-section" id="indicadores" aria-labelledby="indicator-section-title">
    <div className="indicator-section-heading" data-reveal><div><h2 id="indicator-section-title">{axisCopy[axis.id].title}</h2></div><p>{axis.name}</p></div>
    <TopicNavigation axes={axes} activeAxis={axis.id} onSelect={onSelectAxis}/>
    <div className={`indicator-workspace${indicators.length < 2 ? ' single-indicator' : ''}`}><IndicatorNavigator indicators={indicators} selectedId={d.id} onSelect={onSelectIndicator}/><div className="indicator-content">
    <div className="indicator-title"><div className="indicator-title-top"><span className="micro">INDICADOR {d.id} · {d.unit}</span><button className="text-button" onClick={() => downloadCSV([d], axes, `indicador-${d.id}.csv`)}>Descargar CSV <span>↓</span></button></div><h3 id="active-indicator-title" tabIndex="-1">{d.name}</h3></div>
    <ChangeSummary indicator={d}/>
    <div className="data-bento" data-state={projected.state}>
      <div className="timeline-panel"><HistoryChart indicator={d} projected={projected} timelineData={timelineData}/></div>
      <aside className="projection-panel"><div className="projection-top"><span className="micro">SI EL RITMO CONTINÚA</span><span className="status-orbit" aria-hidden="true"><i/></span></div><span className="projection-badge"><i/>{copy.badge}</span><h4>{copy.label}</h4><div className="projection-number">{projected.state === 'unavailable' ? 'No evaluable' : displayValue(projected.value, d)}</div><p className="projection-year">ESCENARIO AL 2030{d.percent ? '' : ` · ${d.unit}`}</p>{projected.reason && <p className="projection-explanation">{projected.reason}</p>}<div className="projection-limit">Escenario no oficial.</div></aside>
      <div className="progress-panel"><span className="micro">DEL VALOR BASE A LA META</span><div className="progress-value"><strong>{p === null ? 'No calculable' : `${number(p,1)} %`}</strong><span>del tramo recorrido</span></div><div className="progress-track" aria-hidden="true"><span style={{ transform: `scaleX(${p === null ? 0 : Math.max(0, Math.min(1, p / 100))})` }}/></div></div>
      <div className="scenario-panel"><div><h4>¿Y si cambia el ritmo?</h4></div><button className="round-button" aria-expanded={scenarioOpen} aria-controls="scenario-controls" aria-label={scenarioOpen ? 'Cerrar explorador de escenarios' : 'Abrir explorador de escenarios'} onClick={() => setScenarioOpen(open => !open)}>{scenarioOpen ? '−' : '+'}</button><div id="scenario-controls" className="scenario-controls" hidden={!scenarioOpen}><label htmlFor="pace">Cambio anual observado <output>{number(multiplier,2)}×</output></label><input id="pace" type="range" min="0" max="2" step="0.05" value={multiplier} onChange={event => setMultiplier(Number(event.target.value))}/><div className="range-ends"><span>Sin cambio</span><button onClick={() => setMultiplier(1)}>Restablecer 1×</button><span>El doble</span></div><p>Un factor mayor amplifica la tendencia, también si es desfavorable.</p></div></div>
    </div>
    <div className="source-bar"><span className="source-label micro">FUENTE</span><p>{d.source}{sourceLink ? <> · <a href={sourceLink} target="_blank" rel="noopener noreferrer">Consultar referencia <Arrow diagonal/></a></> : d.link ? ` · ${d.link}` : ''}</p><span className="micro">ÚLTIMO DATO: {d.year}</span></div>
    <details className="indicator-notes"><summary>Fuente y notas <span>+</span></summary><div><p>Insumo: {d.sheet}, fila {d.row}, en el archivo proporcionado de septiembre de 2026. La fuente se transcribe del Excel; su validación contra la publicación original sigue pendiente. El ámbito particular de cada fuente debe confirmarse en su ficha.</p>{d.notes.map(note => <p key={note}>{note}</p>)}<p>Próxima actualización indicada en el archivo: {d.nextUpdate ?? 'No disponible'}.</p></div></details>
    </div></div>
  </section>;
}
