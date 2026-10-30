
import { displayValue, project, downloadCSV } from '../lib/indicators.mjs';
import HistoryChart from './HistoryChart.jsx';
import GoalPlan from './GoalPlan.jsx';
import { Arrow } from './Icons.jsx';
import { AxisHeading } from './AxisOverview.jsx';

export default function IndicatorExplorer({ axis, indicators, axes, selectedId, onSelectIndicator, onSelectAxis, onBack }) {
  const d = indicators.find(d => d.id === selectedId) ?? indicators[0];
  const projected = project(d);
  const sourceLink = /^https?:\/\//.test(d.link || '') ? d.link : null;
  return <section className="indicator-section detail-section" id="indicadores" aria-labelledby="indicator-section-title">
    <button className="overview-back text-button" onClick={onBack}>← Volver al avance del eje</button>
    <AxisHeading axis={axis}/>
    <div className="indicator-content clean-detail">
    <div className="indicator-title"><div className="indicator-title-top"><span className="micro">INDICADOR {d.id} · {d.unit}</span><button className="text-button" onClick={() => downloadCSV([d], axes, `indicador-${d.id}.csv`)}>Descargar CSV <span>↓</span></button></div><h3 id="active-indicator-title" tabIndex="-1">{d.name}</h3></div>
    <div className="detail-values">{[['Valor base',d.baseYear,d.base],['Último dato',d.year,d.value],['Meta',2030,d.target2030]].map(([label,year,value]) => <div key={label}><span>{label} · {year}</span><strong>{displayValue(value,d)}</strong></div>)}</div>
    <div className="detail-layout"><div className="detail-chart"><HistoryChart indicator={d} projected={projected}/></div><GoalPlan indicator={d}/></div>
    <div className="source-bar"><span className="source-label micro">FUENTE</span><p>{d.source}{sourceLink ? <> · <a href={sourceLink} target="_blank" rel="noopener noreferrer">Consultar referencia <Arrow diagonal/></a></> : d.link ? ` · ${d.link}` : ''}</p><span className="micro">ÚLTIMO DATO: {d.year}</span></div>
    <details className="indicator-notes"><summary>Fuente y notas <span>+</span></summary><div><p>Insumo: {d.sheet}, fila {d.row}, en el archivo proporcionado de septiembre de 2026. La fuente se transcribe del Excel; su validación contra la publicación original sigue pendiente. El ámbito particular de cada fuente debe confirmarse en su ficha.</p>{d.notes.map(note => <p key={note}>{note}</p>)}<p>Próxima actualización indicada en el archivo: {d.nextUpdate ?? 'No disponible'}.</p></div></details>
    </div>
  </section>;
}
