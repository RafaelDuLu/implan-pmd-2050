import { useEffect, useMemo, useState } from 'react';
import Hero from './components/Hero.jsx';
import AxisExplorer from './components/AxisExplorer.jsx';
import IndicatorExplorer from './components/IndicatorExplorer.jsx';
import DataTable from './components/DataTable.jsx';
import Footer from './components/Footer.jsx';
import SectionTransition, { AxisSheet } from './components/SectionTransition.jsx';

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [selection, setSelection] = useState(() => ({ axis: Number(location.hash.match(/^#eje-([1-7])$/)?.[1] || 3), indicator: '' }));
  const [notice, setNotice] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${import.meta.env.BASE_URL}data/indicadores.json`, { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('Datos no disponibles'); return response.json(); })
      .then(value => { if (!Array.isArray(value.axes) || !Array.isArray(value.indicators)) throw new Error('Datos no válidos'); setData(value); })
      .catch(error => { if (error.name !== 'AbortError') setError(true); });
    return () => controller.abort();
  }, []);
  const indicators = useMemo(() => data?.indicators.filter(d => d.eligible) ?? [], [data]);
  const selectedIndicators = useMemo(() => indicators.filter(d => d.axis === selection.axis), [indicators, selection.axis]);
  function selectAxis(axis) {
    setSelection({ axis, indicator: '' });
    history.replaceState(null, '', `#eje-${axis}`);
    setNotice(`Eje ${axis}: ${data.axes.find(a => a.id === axis).name}`);
    requestAnimationFrame(() => {
      const title = document.getElementById('indicator-section-title');
      title?.setAttribute('tabindex', '-1'); title?.focus({ preventScroll: true });
      document.getElementById('indicadores')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    });
  }
  function selectIndicator(indicator) { setSelection(current => ({ ...current, indicator })); setNotice(`Indicador ${indicator} seleccionado.`); }
  useEffect(() => {
    const change = () => { const axis = location.hash.match(/^#eje-([1-7])$/)?.[1]; if (axis) setSelection({ axis: Number(axis), indicator: '' }); };
    window.addEventListener('hashchange', change);
    return () => window.removeEventListener('hashchange', change);
  }, []);
  if (error) return <main className="load-screen"><span className="micro">IMPLAN LEÓN</span><h1>No pudimos cargar los indicadores.</h1><p>Comprueba tu conexión e intenta nuevamente.</p><button className="solid-button" onClick={() => location.reload()}>Volver a cargar ↗</button></main>;
  if (!data) return <main className="load-screen" aria-busy="true"><span className="micro">IMPLAN LEÓN / VISIÓN 2050</span><p role="status">Cargando indicadores…</p></main>;
  const axis = data.axes.find(a => a.id === selection.axis);
  const indicatorId = selection.indicator || selectedIndicators[0]?.id;
  return <>
    <a href="#ejes" className="skip-link">Saltar a los indicadores</a>
    <Hero count={indicators.length}/>
    <main>
      <SectionTransition word="Explorar." number="01" caption="SIETE PERSPECTIVAS" detail="Un plan de ciudad. Distintas formas de mirarlo."/>
      <AxisExplorer axes={data.axes} indicators={indicators} activeAxis={selection.axis} onSelect={selectAxis}/>
      <SectionTransition word="Avanzar." number="02" caption="DEL PRESENTE A LA META" detail="Observa el punto de partida y explora el horizonte." from="paper" to="violet"/>
      {!!selectedIndicators.length && <AxisSheet key={`sheet-${selection.axis}`} axis={axis}><IndicatorExplorer key={indicatorId} axis={axis} axes={data.axes} indicators={selectedIndicators} selectedId={indicatorId} onSelectIndicator={selectIndicator}/></AxisSheet>}
      <SectionTransition word="Comparar." number="03" caption="CADA CIFRA CUENTA" detail="Los datos abiertos. El contexto completo." from="dark" to="paper"/>
      <DataTable key={`table-${selection.axis}`} indicators={selectedIndicators} axes={data.axes} axis={axis} onSelectIndicator={selectIndicator}/>
      <Footer/>
    </main>
    <div className="sr-only" role="status" aria-live="polite">{notice}</div>
  </>;
}
