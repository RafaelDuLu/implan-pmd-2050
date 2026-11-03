import RepeatStepButton from './RepeatStepButton.jsx';
import { paceKeyStep } from '../lib/goal-plan.mjs';
import { number } from '../lib/indicators.mjs';
import { indicatorActions } from '../lib/indicator-actions.mjs';
import { paceContext } from '../lib/pace-context.mjs';

const rateUnits = { '1.3.2': 'años de escolaridad por año', '5.3.1': 'litros diarios por habitante, cada año', '4.5.2': 'kg diarios por persona, cada año', '6.2.1': 'usuarios diarios, cada año', '4.1.3': 'habitantes por hectárea, cada año' };
const annualUnit = d => rateUnits[d.id] || (d.percent ? 'puntos porcentuales por año' : /^Escala/i.test(d.unit) ? 'puntos del índice por año' : `${d.unit.toLocaleLowerCase('es-MX')} por año`);
const rate = (value,d) => `${number(Math.abs(value)*(d.percent ? 100:1),3)} ${annualUnit(d)}`;
export default function GoalPlan({ indicator: d, plan, profile, projected, pace, onPace, onReset }) {
  const risk = projected.state === 'at-risk';
  const title = plan.status === 'achieved' ? risk ? 'Meta cumplida; el escenario pierde el avance' : 'Meta alcanzada' : projected.state === 'unavailable' ? 'El escenario sale de la escala' : plan.crossingYear !== null ? plan.crossingYear <= 2030 ? 'La meta se alcanzaría en' : 'La meta se alcanzaría después de 2030' : 'Con este ritmo no se alcanza la meta';
  const actions = indicatorActions[d.id];
  const direction = plan.annual === null || plan.annual === 0 ? 'Sin cambio anual' : `${plan.annual > 0 ? 'Aumento' : 'Reducción'} de ${rate(plan.annual,d)}`;
  const context = paceContext(d,plan.annual);
  const needed = paceContext(d,plan.required);
  const adjustPace=delta=>onPace(Number(Math.max(0,Math.min(profile.max,pace+delta*profile.step)).toFixed(2)));
  return <aside id="detail-rhythm" className="goal-plan" aria-label="Simulador del ritmo hacia la meta">
    <h4>{d.direction === 'D' ? 'Ritmo de reducción' : 'Ritmo de aumento'}</h4>
    {plan.status !== 'achieved' && plan.required !== null && <div className="pace-priority"><h5>Lo necesario para llegar en 2030</h5><p>{needed || rate(plan.required,d)}.</p>{profile.requiredPace!==null && <div className="pace-required-row"><span>Ritmo necesario: <strong>{number(profile.requiredPace,2)}×</strong></span><button className="pace-goal-button" onClick={()=>onPace(profile.requiredPace)} aria-label="Ajustar al ritmo necesario para llegar en 2030">Llegar en 2030 <span aria-hidden="true">↗</span></button></div>}</div>}
    {plan.status === 'achieved' && actions && <div className="pace-priority"><h5>Meta cumplida · cómo sostenerla</h5><p>{actions[1]}</p></div>}
    <div className="pace-workspace">
      <div className="pace-tool" data-direction={d.direction}>
        <label className="sr-only" htmlFor="pace">{d.direction === 'D' ? 'Ritmo de reducción: mueve hacia abajo para acelerar' : 'Ritmo de aumento: mueve hacia arriba para acelerar'}</label>
        <output className="pace-output" htmlFor="pace">{plan.annual === 0 ? '→' : plan.annual > 0 ? '↑' : '↓'} {number(pace,2)}×</output>
        <div className="pace-vertical"><span className="pace-end">{d.direction === 'D' ? '0×' : `${number(profile.max)}×`}</span>
          <div className="pace-slider-wrap"><input id="pace" type="range" min="0" max={profile.max} step={profile.step} value={pace} disabled={plan.status==='achieved'} aria-valuetext={`${direction}. ${number(pace,2)} veces ${profile.flatReference ? 'el ritmo necesario para 2030' : 'la magnitud del cambio observado'}, hacia la meta.`} onKeyDown={e => { const step = paceKeyStep(d.direction,e.key); if(step) { e.preventDefault(); onPace(Number(Math.max(0,Math.min(profile.max,pace+step*profile.step)).toFixed(2))); } }} onChange={e => onPace(Number(e.target.value))}/>{profile.requiredPace!==null && <span className="pace-target-mark" style={{top:`${(d.direction==='D' ? profile.requiredPace/profile.max : 1-profile.requiredPace/profile.max)*100}%`}} aria-hidden="true"><span>2030</span></span>}</div>
          <span className="pace-end">{d.direction === 'D' ? `${number(profile.max)}× ↓` : '0×'}</span>
        </div>
      </div>
      <div className="pace-reading">
        <div className="pace-result" aria-live="polite" aria-atomic="true"><p className="goal-plan-status">{title}</p>{plan.status === 'approaching' && projected.state !== 'unavailable' && <strong className="goal-plan-year">{String(plan.crossingYear)}</strong>}<p className="pace-direction">{projected.state === 'unavailable' ? 'Ajusta el ritmo para mantener un escenario dentro de la escala del indicador.' : context ? `${context}.` : `${direction}.`}</p></div>

        <div className="pace-actions"><div className="pace-fine-controls" role="group" aria-label="Ajuste preciso del ritmo"><RepeatStepButton onStep={()=>adjustPace(-1)} disabled={plan.status==='achieved' || pace<=0} aria-label="Reducir ritmo en 0.01" title="Reducir 0.01×">−</RepeatStepButton><RepeatStepButton onStep={()=>adjustPace(1)} disabled={plan.status==='achieved' || pace>=profile.max} aria-label="Aumentar ritmo en 0.01" title="Aumentar 0.01×">+</RepeatStepButton></div><button onClick={onReset}>Volver a 0</button></div>
      </div>
    </div>
    {actions && plan.status !== 'achieved' && <div className="goal-plan-required"><h5>Prioridades para cerrar la brecha</h5><p className="action-suggestion">Prioridades sugeridas</p><p>{actions[0]}</p></div>}
  </aside>;
}
