import { goalPlan } from './goal-plan.mjs';
import { isNumber, project } from './indicators.mjs';

/** Each control is sized from its own gap, observation period and years to 2030. */
export function paceProfile(d) {
  const baseline=goalPlan(d,2030,0);
  const observed=Math.abs((d.value-d.base)/(d.year-d.baseYear));
  const flatReference=observed===0 && isNumber(baseline.required) && baseline.required!==0;
  const reference=flatReference ? Math.abs(baseline.required) : observed;
  const required=baseline.status!=='achieved' && isNumber(baseline.required) && reference>0 ? Math.abs(baseline.required)/reference : null;
  const step=.01;
  // Round the actionable tick upward so selecting it reaches the target, not just near it.
  const requiredPace=required===null ? null : Math.ceil((required-1e-10)/step)*step;
  const max=requiredPace===null ? 3 : Math.max(3,Math.ceil(requiredPace*1.25));
  return {reference:isNumber(reference) ? reference : 0,flatReference,requiredPace,max,step};
}

export function paceScenario(d,pace=0) {
  const profile=paceProfile(d);
  const selected=isNumber(pace) ? Math.max(0,Math.min(profile.max,pace)) : 0;
  const annual=(d.direction==='D' ? -1 : 1)*profile.reference*selected;
  // Override only the hypothetical annual change; published observations stay intact.
  return {profile,plan:goalPlan(d,2030,1,annual),projected:project(d,1,2030,true,annual)};
}
