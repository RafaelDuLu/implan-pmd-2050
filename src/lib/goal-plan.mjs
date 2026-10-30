import { isNumber, assessGoal } from './indicators.mjs';

/** Two-point linear diagnostic, never a causal forecast or a policy prescription. */
export function goalPlan(d, horizon = 2030) {
  const { base, baseYear, value, year, target2030, direction } = d;
  const empty = { status: 'unavailable', annual: null, required: null, crossingYear: null, horizon, latestYear: year, factor: null };
  if (![base, baseYear, value, year, target2030, horizon].every(isNumber) || year <= baseYear || !['A','D'].includes(direction) || year > horizon) return empty;
  const scale = String(d.unit || '').match(/^Escala\s+(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)$/i);
  const bounds = d.percent ? [0,1] : scale ? [Number(scale[1]),Number(scale[2])] : null;
  if (bounds && [base,value,target2030].some(n => n < bounds[0] || n > bounds[1])) return empty;
  const annual = (value - base) / (year - baseYear);
  const achieved = assessGoal(value, target2030, direction) === 'on-track';
  const required = achieved ? 0 : year < horizon ? (target2030 - value) / (horizon - year) : null;
  const tolerance = 1e-10 * Math.max(Math.abs(value), Math.abs(base), 1);
  const favorable = annual * (direction === 'D' ? -1 : 1) > tolerance;
  const status = achieved ? 'achieved' : Math.abs(annual) <= tolerance ? 'flat' : favorable ? 'approaching' : 'away';
  const crossing = status === 'approaching' ? year + (target2030 - value) / annual : null;
  return { status, annual, required, crossingYear: crossing === null ? null : Math.ceil(crossing - 1e-9), horizon, latestYear: year,
    factor: !achieved && favorable && required !== null ? Math.abs(required / annual) : null };
}
