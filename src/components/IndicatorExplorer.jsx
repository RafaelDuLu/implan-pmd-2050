
import { useState } from 'react';
import { displayValue, project, downloadCSV } from '../lib/indicators.mjs';
import HistoryChart from './HistoryChart.jsx';
import GoalPlan from './GoalPlan.jsx';
import { goalPaceMultiplier } from '../lib/goal-plan.mjs';
import { AxisHeading } from './AxisOverview.jsx';

export default function IndicatorExplorer({ axis, indicators, axes, selectedId, onSelectIndicator, onSelectAxis, onBack }) {
  const d = indicators.find(d => d.id === selectedId) ?? indicators[0];
  const [detailView, setDetailView] = useState('rhythm');
  const [pace, setPace] = useState(1);
  const multiplier = goalPaceMultiplier(d, pace);
  const autoAdjusted = goalPaceMultiplier(d, 1) < 0;
  const projected = project(d, multiplier, 2030, true);
  return <section className="indicator-section detail-section" id="indicadores" aria-labelledby="indicator-section-title">
    <button className="overview-back detail-back" onClick={onBack}>← Volver a los indicadores</button>
    <AxisHeading axis={axis}/>
    <div className="indicator-content clean-detail">
    <div className="indicator-title"><div className="indicator-title-top"><span className="micro">INDICADOR {d.id} · {d.unit}</span><button className="text-button" onClick={() => downloadCSV([d], axes, `indicador-${d.id}.csv`)}>Descargar CSV <span>↓</span></button></div><h3 id="active-indicator-title" tabIndex="-1">{d.name}</h3></div>
    <div className="detail-values">{[['Valor base',d.baseYear,d.base],['Último dato',d.year,d.value],['Meta',2030,d.target2030]].map(([label,year,value]) => <div key={label}><span>{label} · {year}</span><strong>{displayValue(value,d)}</strong></div>)}</div>
    <div className="detail-view-tabs" role="group" aria-label="Contenido del indicador"><button id="chart-tab" aria-pressed={detailView === 'chart'} aria-controls="detail-chart" onClick={() => setDetailView('chart')}>Gráfica</button><button id="rhythm-tab" aria-pressed={detailView === 'rhythm'} aria-controls="detail-rhythm" onClick={() => setDetailView('rhythm')}>Ritmo y acciones</button></div>
    <div className="detail-layout" data-view={detailView}><div className="detail-chart" id="detail-chart"><HistoryChart indicator={d} projected={projected}/></div><GoalPlan indicator={d} multiplier={multiplier} projected={projected} pace={pace} autoAdjusted={autoAdjusted} onPace={setPace} onReset={() => setPace(1)}/></div>
    </div>
  </section>;
}
