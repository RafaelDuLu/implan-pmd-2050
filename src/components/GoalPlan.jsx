import { goalPlan, paceKeyStep } from '../lib/goal-plan.mjs';
import { number } from '../lib/indicators.mjs';
import { indicatorActions } from '../lib/indicator-actions.mjs';

const rateUnits = { '1.3.2': 'años de escolaridad por año', '5.3.1': 'litros diarios por habitante, cada año', '4.5.2': 'kg diarios por persona, cada año', '6.2.1': 'usuarios diarios, cada año', '4.1.3': 'habitantes por hectárea, cada año' };
const annualUnit = d => rateUnits[d.id] || (d.percent ? 'puntos porcentuales por año' : /^Escala/i.test(d.unit) ? 'puntos del índice por año' : `${d.unit.toLocaleLowerCase('es-MX')} por año`);
const rate = (value,d) => `${number(Math.abs(value)*(d.percent ? 100:1),3)} ${annualUnit(d)}`;
export default function GoalPlan({ indicator: d, multiplier, projected, pace, autoAdjusted, onPace, onReset }) {
  const plan = goalPlan(d,2030,multiplier);
  const risk = projected.state === 'at-risk';
  const title = plan.status === 'achieved' ? risk ? 'Meta cumplida; el escenario pierde el avance' : 'Meta alcanzada' : projected.state === 'unavailable' ? 'El escenario sale de la escala' : plan.crossingYear !== null ? plan.crossingYear <= 2030 ? 'La meta se alcanzaría en' : 'La meta se alcanzaría después de 2030' : 'Con este ritmo no se alcanza la meta';
  const actions = indicatorActions[d.id];
  const direction = plan.annual === null || plan.annual === 0 ? 'Sin cambio anual' : `${plan.annual > 0 ? 'Aumento' : 'Reducción'} de ${rate(plan.annual,d)}`;
  return <aside id="detail-rhythm" className="goal-plan" aria-label="Simulador del ritmo hacia la meta">
    <h4>{d.direction === 'D' ? 'Ritmo de reducción' : 'Ritmo de aumento'}</h4>
    {autoAdjusted && <p className="pace-auto-direction">Escenario de mejora · el cambio observado va en sentido contrario.</p>}
    <div className="pace-workspace">
      <div className="pace-tool" data-direction={d.direction}>
        <label className="sr-only" htmlFor="pace">{d.direction === 'D' ? 'Ritmo de reducción: mueve hacia abajo para acelerar' : 'Ritmo de aumento: mueve hacia arriba para acelerar'}</label>
        <output className="pace-output" htmlFor="pace">{plan.annual === 0 ? '→' : plan.annual > 0 ? '↑' : '↓'} {number(pace,2)}×</output>
        <div className="pace-vertical"><span className="pace-end">{d.direction === 'D' ? '0×' : '3×'}</span>
          <input id="pace" type="range" min="0" max="3" step="0.05" value={pace} aria-valuetext={`${direction}. ${number(pace,2)} veces la magnitud del cambio observado, hacia la meta.`} onKeyDown={e => { const step = paceKeyStep(d.direction,e.key); if(step) { e.preventDefault(); onPace(Number(Math.max(0,Math.min(3,pace+step*.05)).toFixed(2))); } }} onChange={e => onPace(Number(e.target.value))}/>
          <span className="pace-end">{d.direction === 'D' ? '3× ↓' : '0×'}</span>
        </div>
      </div>
      <div className="pace-reading">
        <div className="pace-result" aria-live="polite" aria-atomic="true"><p className="goal-plan-status">{title}</p>{plan.status === 'approaching' && projected.state !== 'unavailable' && <strong className="goal-plan-year">{String(plan.crossingYear)}</strong>}<p className="pace-direction">{direction}.</p></div>
        {plan.status !== 'achieved' && plan.required !== null && <p className="pace-needed">Para 2030: {d.direction === 'D' ? 'reducir' : 'aumentar'} aproximadamente <strong>{rate(plan.required,d)}</strong>.</p>}
        <div className="pace-actions"><button onClick={onReset}>Restablecer</button></div>
      </div>
    </div>
    {actions && <div className="goal-plan-required"><h5>{plan.status === 'achieved' && !risk ? 'Para sostener el resultado' : 'Prioridades para cerrar la brecha'}</h5><p className="action-suggestion">Prioridades sugeridas</p><p>{actions[plan.status === 'achieved' && !risk ? 1:0]}</p></div>}
    <p className="pace-simulation-label">Escenario simulado</p>
  </aside>;
}
