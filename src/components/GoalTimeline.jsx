import { useState } from 'react';
import { number, assessGoal } from '../lib/indicators.mjs';

const format = (value, unit) => `${number(value)}${unit === '%' ? ' %' : ''}`;

// Reusable data contract: porcentajeActual, metaObjetivo, proyeccionFinal, sentido.
// For non-percentage indicators, valorActual is used instead of porcentajeActual.
export default function GoalTimeline({ data }) {
  const [activeNode, setActiveNode] = useState(1);
  return data.map(record => {
    const state = record.estado ?? assessGoal(record.proyeccionFinal, record.metaObjetivo, record.sentido ?? 'A');
    const current = record.porcentajeActual ?? record.valorActual;
    const stages = [
      { label: 'Punto de partida', year: record.anioInicial, value: record.valorInicial, detail: 'La línea base del indicador, tal como aparece en el archivo de origen.' },
      { label: 'Último valor', year: record.anioActual, value: current, detail: 'El dato observado más reciente. Su año corresponde a la fuente de este indicador.' },
      { label: 'Proyección lineal', year: record.anioMeta, value: state === 'unavailable' ? null : record.proyeccionFinal, detail: 'Un escenario que extiende el cambio medio entre la línea base y el último dato. No es un pronóstico oficial.' },
    ];
    return <div key={record.id} className="goal-timeline" data-state={state}>
      <div className="timeline-heading"><span className="micro">LA LÍNEA DEL TIEMPO</span><span className="timeline-direction micro">{record.sentido === 'D' ? '↓ DISMINUIR ES EL OBJETIVO' : '↑ AUMENTAR ES EL OBJETIVO'}</span></div>
      <div className="timeline-track" aria-hidden="true"><svg viewBox="0 0 1000 60" preserveAspectRatio="none"><path className="timeline-track-base" d="M15 30H985"/><path className="timeline-track-observed" d="M15 30H500" pathLength="1"/><path className="timeline-track-future" d="M500 30H985"/></svg><span className="timeline-sweep"/></div>
      <ol className="timeline-stages">{stages.map((stage, index) => <li key={stage.label}>
        <button className={`timeline-node timeline-node-${index}`} aria-pressed={activeNode === index} aria-label={`${stage.label}, ${stage.year}: ${format(stage.value, record.unidad)}`} onClick={() => setActiveNode(index)}><span aria-hidden="true"/></button>
        <span className="stage-year">{stage.year}</span><span className="stage-label">{stage.label}</span><strong>{format(stage.value, record.unidad)}</strong><small>{record.unidad !== '%' ? record.unidad : index === 2 ? 'Escenario, no dato publicado' : 'Dato publicado'}</small>
      </li>)}</ol>
      <div className="timeline-selection" aria-live="polite"><span className="micro">0{activeNode + 1} /</span><p>{stages[activeNode].detail}</p></div>
      <div className="target-rail"><span className="target-symbol" aria-hidden="true">⊕</span><span className="micro">META {record.anioMeta}</span><strong>{format(record.metaObjetivo, record.unidad)}</strong><span>{record.sentido === 'D' ? 'Llegar a este valor o menos' : 'Llegar a este valor o más'}</span></div>
    </div>;
  });
}
