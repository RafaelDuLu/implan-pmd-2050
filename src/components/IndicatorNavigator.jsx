import { useState } from 'react';
import { normalize, movement, observedState } from '../lib/indicators.mjs';
import { axisCopy } from './AxisExplorer.jsx';

export function TopicNavigation({ axes, activeAxis, onSelect }) {
  return <nav className="topic-navigation" aria-label="Temas estadísticos"><span className="micro">EXPLORAR POR TEMA</span><div>{axes.map(axis => <button key={axis.id} aria-pressed={axis.id === activeAxis} onClick={() => onSelect(axis.id)}><span className="topic-number">0{axis.id}</span>{axisCopy[axis.id].title}</button>)}</div></nav>;
}

export default function IndicatorNavigator({ indicators, selectedId, onSelect }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const rows = indicators.filter(d => normalize(`${d.id} ${d.name}`).includes(normalize(query)));
  const index = indicators.findIndex(d => d.id === selectedId);
  return <aside className="indicator-navigator" aria-label="Indicadores del tema">
    <div className="navigator-heading"><span className="micro">INDICADORES / {String(indicators.length).padStart(2, '0')}</span><button className="navigator-toggle" aria-expanded={open} aria-controls="navigator-options" onClick={() => setOpen(!open)}>{open ? 'Cerrar −' : 'Cambiar indicador +'}</button></div>
    <div id="navigator-options" className="navigator-options" data-open={open}>
      <label className="navigator-search"><span className="sr-only">Buscar indicador del tema</span><span aria-hidden="true">⌕</span><input type="search" value={query} placeholder="Buscar indicador…" onChange={e => setQuery(e.target.value)}/></label>
      <div className="navigator-list">{rows.map(d => <button key={d.id} aria-current={d.id === selectedId ? 'true' : undefined} onClick={() => { onSelect(d.id); setOpen(false); }}><span className="micro">{d.id}<b className={observedState(d)} aria-label={movement(d).label}>{movement(d).arrow}</b></span><strong>{d.name}</strong><span className="navigator-open">Ver indicador ↗</span></button>)}</div>
      {!rows.length && <p role="status">Sin coincidencias. Prueba con otro término.</p>}
    </div>
    <div className="navigator-pager"><button aria-label="Indicador anterior" disabled={index <= 0} onClick={() => onSelect(indicators[index - 1].id)}>←</button><span className="micro">{index + 1} / {indicators.length}</span><button aria-label="Indicador siguiente" disabled={index >= indicators.length - 1} onClick={() => onSelect(indicators[index + 1].id)}>→</button></div>
    <p className="navigator-help">Las flechas muestran si el valor subió o bajó. El color indica si el cambio acerca a la meta.</p>
    <a href="#datos" className="navigator-table">Consultar tabla del tema <span>↘</span></a>
  </aside>;
}
