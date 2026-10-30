import { goalPlan } from '../lib/goal-plan.mjs';
import { displayValue, number } from '../lib/indicators.mjs';

const rateUnits = { '1.3.2': 'años de escolaridad por año', '5.3.1': 'litros diarios por habitante, cada año', '4.5.2': 'kg diarios por persona, cada año', '6.2.1': 'usuarios diarios, cada año', '4.1.3': 'habitantes por hectárea, cada año' };
const annualUnit = d => rateUnits[d.id] || (d.percent ? 'puntos porcentuales por año' : /^Escala/i.test(d.unit) ? 'puntos del índice por año' : `${d.unit.toLocaleLowerCase('es-MX')} por año`);
const rate = (value, d) => `${number(Math.abs(value) * (d.percent ? 100 : 1), 3)} ${annualUnit(d)}`;
export default function GoalPlan({ indicator: d }) {
  const plan = goalPlan(d);
  const movement = plan.annual > 0 ? 'aumentó' : plan.annual < 0 ? 'disminuyó' : 'no cambió';
  const status = {
    achieved: ['Meta ya alcanzada', `El dato de ${d.year} ya cumple la meta. Con estas observaciones no se identifica el primer año exacto de cumplimiento.`],
    approaching: [plan.crossingYear <= 2030 ? 'Al ritmo observado, llegaría en' : 'Al ritmo observado, llegaría después de 2030', 'Año estimado por continuidad del cambio medio observado.'],
    flat: ['Sin fecha de cumplimiento', 'El indicador no ha cambiado entre las dos observaciones. Mantener ese ritmo no permite alcanzar la meta.'],
    away: ['La tendencia se aleja de la meta', 'No se estima un año de cumplimiento si continúa el cambio observado. Es necesario revertir la dirección.'],
    unavailable: ['No se puede estimar una fecha', 'Los periodos o la escala no permiten calcular un ritmo comparable.'],
  }[plan.status];
  return <aside className="goal-plan" aria-label="Lectura del ritmo hacia la meta">
    <h4>¿Cuándo se alcanzaría?</h4><p className="goal-plan-status">{status[0]}</p>
    {plan.crossingYear !== null && <strong className="goal-plan-year">{number(plan.crossingYear,0)}</strong>}
    <p className="goal-plan-context">{status[1]}</p>
    {plan.annual !== null && <div className="goal-plan-current"><h5>Lo observado</h5><p>Entre {d.baseYear} y {d.year}, {movement}{plan.annual !== 0 ? <> un promedio de <strong>{rate(plan.annual,d)}</strong></> : ''}.</p></div>}
    {plan.status !== 'unavailable' && <div className="goal-plan-required"><h5>{plan.status === 'achieved' ? 'Para conservar la meta' : 'Para llegar a 2030'}</h5>
      {plan.status === 'achieved' ? <p>Mantener el indicador {d.direction === 'D' ? 'en o por debajo de' : 'en o por encima de'} <strong>{displayValue(d.target2030,d)}</strong>{!d.percent ? ` ${d.unit.toLocaleLowerCase('es-MX')}` : ''}.</p> : plan.required !== null ? <p>Pasar de <strong>{displayValue(d.value,d)}</strong> a <strong>{displayValue(d.target2030,d)}</strong>: {d.direction === 'D' ? 'reducir' : 'aumentar'} aproximadamente <strong>{rate(plan.required,d)}</strong>, en promedio desde {d.year}.{plan.factor !== null && plan.factor > 1 && <> Requiere aproximadamente <strong>{number(plan.factor,2)} veces</strong> el ritmo favorable observado.</>}{plan.factor !== null && plan.factor <= 1 && <> El ritmo observado sería suficiente.</>}</p> : <p>El último dato ya corresponde a 2030 y aún no cumple la meta. No queda un intervalo futuro para calcular el ritmo anual requerido en ese horizonte.</p>}
    </div>}
    <p className="goal-plan-caveat">Estimación lineal, no pronóstico oficial. No incorpora cambios de política, población o contexto.</p>
  </aside>;
}
