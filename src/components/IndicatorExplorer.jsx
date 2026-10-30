
import { useState } from 'react';
import { displayValue, project, downloadCSV } from '../lib/indicators.mjs';
import HistoryChart from './HistoryChart.jsx';
import GoalPlan from './GoalPlan.jsx';
import { AxisHeading } from './AxisOverview.jsx';

export default function IndicatorExplorer({ axis, indicators, axes, selectedId, onSelectIndicator, onSelectAxis, onBack }) {
  const d = indicators.find(d => d.id === selectedId) ?? indicators[0];
  const [pace, setPace] = useState(1);
  const [reverse, setReverse] = useState(false);
  const multiplier = reverse ? -pace : pace;
  const projected = project(d, multiplier, 2030, true);
  return <section className="indicator-section detail-section" id="indicadores" aria-labelledby="indicator-section-title">
    <button className="overview-back text-button" onClick={onBack}>← Volver al avance del eje</button>
    <AxisHeading axis={axis}/>
    <div className="indicator-content clean-detail">
    <div className="indicator-title"><div className="indicator-title-top"><span className="micro">INDICADOR {d.id} · {d.unit}</span><button className="text-button" onClick={() => downloadCSV([d], axes, `indicador-${d.id}.csv`)}>Descargar CSV <span>↓</span></button></div><h3 id="active-indicator-title" tabIndex="-1">{d.name}</h3></div>
    <div className="detail-values">{[['Valor base',d.baseYear,d.base],['Último dato',d.year,d.value],['Meta',2030,d.target2030]].map(([label,year,value]) => <div key={label}><span>{label} · {year}</span><strong>{displayValue(value,d)}</strong></div>)}</div>
    <div className="detail-layout"><div className="detail-chart"><HistoryChart indicator={d} projected={projected}/></div><GoalPlan indicator={d} multiplier={multiplier} projected={projected} pace={pace} reverse={reverse} onPace={setPace} onReverse={() => setReverse(value => !value)} onReset={() => { setPace(1); setReverse(false); }}/></div>
    </div>
  </section>;
}
