import { assessGoal, isNumber, progress } from './indicators.mjs';
import { goalPlan, goalPaceMultiplier } from './goal-plan.mjs';

/** Orientation only: recovery tests the fixed 3× comparison threshold, not feasibility. */
export function overviewStatus(d) {
  const p=progress(d);
  if (!isNumber(p)) return { state:'unknown', label:'Revisar información', progress:p };
  if (assessGoal(d.value,d.target2030,d.direction)==='on-track')
    return { state:'good', label:p>100 ? 'Meta superada' : 'Meta cumplida', progress:p };
  if (p<=-100) return { state:'risk', label:'Retroceso crítico · atención prioritaria', progress:p };
  const observed=goalPlan(d,2030,1);
  if (observed.crossingYear!==null && observed.crossingYear<=2030)
    return { state:'good', label:'En ruta a la meta', progress:p };
  const recovery=goalPlan(d,2030,goalPaceMultiplier(d,3));
  if (recovery.crossingYear!==null && recovery.crossingYear<=2030)
    return { state:'watch', label:p<0 ? 'Retroceso · recuperación en escenario de mejora' : 'Requiere acelerar', progress:p };
  return { state:'risk', label:p<0 ? 'Retroceso · atención prioritaria' : 'Atención prioritaria', progress:p };
}

/** Fixed shared scale −100…100; overflow remains explicit, never shrinks other bars. */
export function overviewRail(p) {
  if (!isNumber(p)) return { left:50, width:0, marker:50, overflow:0 };
  const position=50+Math.max(-100,Math.min(100,p))/2;
  return { left:Math.min(50,position), width:Math.abs(position-50), marker:position, overflow:p>100 ? 1 : p< -100 ? -1 : 0 };
}
