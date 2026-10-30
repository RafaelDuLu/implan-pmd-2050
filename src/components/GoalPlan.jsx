import { goalPlan } from '../lib/goal-plan.mjs';
import { number } from '../lib/indicators.mjs';
import { indicatorActions } from '../lib/indicator-actions.mjs';

const rateUnits = { '1.3.2': 'años de escolaridad por año', '5.3.1': 'litros diarios por habitante, cada año', '4.5.2': 'kg diarios por persona, cada año', '6.2.1': 'usuarios diarios, cada año', '4.1.3': 'habitantes por hectárea, cada año' };
const annualUnit = d => rateUnits[d.id] || (d.percent ? 'puntos porcentuales por año' : /^Escala/i.test(d.unit) ? 'puntos del índice por año' : `${d.unit.toLocaleLowerCase('es-MX')} por año`);
const rate = (value,d) => `${number(Math.abs(value)*(d.percent ? 100:1),3)} ${annualUnit(d)}`;
export default function GoalPlan({ indicator: d, multiplier, projected, pace, reverse, onPace, onReverse, onReset }) {
  const plan = goalPlan(d,2030,multiplier);
  const risk = projected.state === 'at-risk';
  const title = plan.status === 'achieved' ? risk ? 'Meta cumplida; el escenario pierde el avance' : 'Meta alcanzada' : projected.state === 'unavailable' ? 'El escenario sale de la escala' : plan.crossingYear !== null ? plan.crossingYear <= 2030 ? 'La meta se alcanzaría en' : 'La meta se alcanzaría después de 2030' : 'Con este ritmo no se alcanza la meta';
  const actions = indicatorActions[d.id];
  const direction = plan.annual === null || plan.annual === 0 ? 'Sin cambio anual' : `${plan.annual > 0 ? 'Aumento' : 'Reducción'} de ${rate(plan.annual,d)}`;
  return <aside className="goal-plan" aria-label="Simulador del ritmo hacia la meta">
    <h4>Explora el ritmo</h4>
    <div className="pace-tool"><label htmlFor="pace">{reverse ? 'Tendencia invertida' : pace === 0 ? 'Sin cambio' : pace === 1 ? 'Ritmo observado' : pace < 1 ? 'Desaceleración' : 'Aceleración'}<output htmlFor="pace">{number(pace,2)}×</output></label>
      <input id="pace" type="range" min="0" max="3" step="0.05" value={pace} onChange={e => onPace(Number(e.target.value))}/>
      <div className="pace-scale"><span>Detener</span><span>1×</span><span>3×</span></div>
      <div className="pace-actions"><button onClick={onReverse} aria-pressed={reverse}>{reverse ? 'Volver a tendencia observada' : 'Invertir tendencia'}</button><button onClick={onReset}>Restablecer</button></div>
    </div>
    <div className="pace-result" aria-live="polite" aria-atomic="true"><p className="goal-plan-status">{title}</p>{plan.status === 'approaching' && projected.state !== 'unavailable' && <strong className="goal-plan-year">{String(plan.crossingYear)}</strong>}<p className="pace-direction">{direction}.</p></div>
    {plan.status !== 'achieved' && plan.required !== null && <p className="pace-needed">Para llegar a 2030 se necesita {d.direction === 'D' ? 'reducir' : 'aumentar'} aproximadamente <strong>{rate(plan.required,d)}</strong>.</p>}
    {actions && <div className="goal-plan-required"><h5>{plan.status === 'achieved' && !risk ? 'Para sostener el resultado' : 'Prioridades para cerrar la brecha'}</h5><p className="action-suggestion">Prioridades sugeridas</p><p>{actions[plan.status === 'achieved' && !risk ? 1:0]}</p></div>}
    <p className="pace-simulation-label">Escenario simulado</p>
  </aside>;
}
