export const isNumber = value => typeof value === 'number' && Number.isFinite(value);
export const number = (value, decimals = 2) => isNumber(value)
  ? new Intl.NumberFormat('es-MX', { maximumFractionDigits: decimals }).format(value)
  : 'No disponible';
export const displayValue = (value, indicator, decimals = 2) => isNumber(value)
  ? `${number(indicator.percent ? value * 100 : value, decimals)}${indicator.percent ? ' %' : ''}`
  : 'No disponible';
export const displayUnit = indicator => indicator.percent ? '%' : indicator.unit;
export const deltaValue = indicator => (indicator.value - indicator.base) * (indicator.percent ? 100 : 1);
export const signed = value => `${value > 0 ? '+' : ''}${number(value)}`;
export const normalize = text => String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export function progress(indicator) {
  const distance = indicator.target2030 - indicator.base;
  return distance === 0 || ![distance, indicator.value, indicator.base].every(isNumber)
    ? null : 100 * (indicator.value - indicator.base) / distance;
}
export function observedState(indicator) {
  const delta = indicator.value - indicator.base;
  if (Math.abs(delta) <= Number.EPSILON * Math.max(1, Math.abs(indicator.base)) * 8) return 'same';
  return delta * (indicator.direction === 'D' ? -1 : 1) > 0 ? 'favorable' : 'unfavorable';
}
export function assessGoal(projection, target, direction = 'A') {
  if (!isNumber(projection) || !isNumber(target) || !['A', 'D'].includes(direction)) return 'unavailable';
  const tolerance = 1e-10 * Math.max(1, Math.abs(target));
  return (projection - target) * (direction === 'D' ? -1 : 1) >= -tolerance ? 'on-track' : 'at-risk';
}
export function project(indicator, multiplier = 1, horizon = 2030) {
  const { base, baseYear, value, year, target2030, direction } = indicator;
  if (![base, baseYear, value, year, target2030, multiplier, horizon].every(isNumber)
      || year <= baseYear || horizon < year || multiplier < 0) {
    return { value: null, rate: null, state: 'unavailable', reason: 'No hay observaciones comparables suficientes.' };
  }
  const rate = (value - base) / (year - baseYear);
  const projected = value + rate * multiplier * (horizon - year);
  const outOfBounds = indicator.percent && (projected < 0 || projected > 1);
  return { value: projected, rate, state: outOfBounds ? 'unavailable' : assessGoal(projected, target2030, direction),
    reason: outOfBounds ? 'El escenario sale del rango de 0 a 100 %. No es interpretable.' : null };
}
export function toTimelineRecord(indicator, multiplier = 1) {
  const scenario = project(indicator, multiplier);
  const factor = indicator.percent ? 100 : 1;
  return {
    id: indicator.id, nombre: indicator.name, valorInicial: indicator.base * factor,
    porcentajeActual: indicator.percent ? indicator.value * 100 : null,
    valorActual: indicator.value * factor, metaObjetivo: indicator.target2030 * factor,
    proyeccionFinal: scenario.value === null ? null : scenario.value * factor,
    anioInicial: indicator.baseYear, anioActual: indicator.year, anioMeta: 2030,
    sentido: indicator.direction, unidad: displayUnit(indicator), estado: scenario.state, motivo: scenario.reason,
  };
}
export function createCSV(indicators, axes) {
  const header = ['Clave', 'Eje', 'Indicador', 'Unidad', 'Sentido', 'Año base', 'Valor base original',
    'Año reciente', 'Valor reciente original', 'Meta 2030 original', 'Cambio en unidad o puntos porcentuales',
    'Avance base-meta calculado (%)', 'Escenario lineal 2030 original (no oficial)', 'Fuente transcrita', 'Referencia', 'Hoja', 'Fila', 'Notas'];
  const rows = indicators.map(d => [d.id, axes.find(a => a.id === d.axis)?.name, d.name, d.unit, d.direction,
    d.baseYear, d.base, d.year, d.value, d.target2030, deltaValue(d), progress(d), project(d).value,
    d.source, d.link, d.sheet, d.row, d.notes.join(' | ')]);
  const quote = value => `"${String(value ?? '').replace(/"/g, '""')}"`;
  return '\ufeff' + [header, ...rows].map(row => row.map(quote).join(',')).join('\r\n');
}
export function downloadCSV(indicators, axes, filename) {
  const url = URL.createObjectURL(new Blob([createCSV(indicators, axes)], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
