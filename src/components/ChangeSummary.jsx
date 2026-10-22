import { displayValue, deltaValue, signed, observedState, movement } from '../lib/indicators.mjs';

export default function ChangeSummary({ indicator: d }) {
  const state = observedState(d), direction = movement(d);
  return <div className="change-summary">
    <div className="change-base"><span className="micro">PUNTO DE PARTIDA / {d.baseYear}</span><strong>{displayValue(d.base, d)}</strong><small>{d.percent ? 'Porcentaje' : d.unit}</small></div>
    <div className="change-latest"><span className="micro">ÚLTIMO DATO / {d.year}</span><strong>{displayValue(d.value, d)}</strong><small>{d.percent ? 'Porcentaje' : d.unit}</small></div>
    <div className={`change-direction ${state}`}><span className="change-arrow" aria-hidden="true">{direction.arrow}</span><div><span className="micro">{direction.label.toUpperCase()} / {d.baseYear}–{d.year}</span><strong>{signed(deltaValue(d))}<small>{d.percent ? 'puntos porcentuales' : d.unit}</small></strong><span className="change-verdict">{state === 'favorable' ? 'Cambio favorable hacia la meta' : state === 'same' ? 'Sin cambio respecto de la base' : 'Cambio contrario a la meta'}</span></div></div>
  </div>;
}
