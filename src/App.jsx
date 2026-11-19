import { useEffect, useMemo, useRef, useState } from 'react';
import { useEditorialMotion } from './hooks/useEditorialMotion.js';
import Hero from './components/Hero.jsx';
import AxisExplorer, { axisCopy, axisTheme } from './components/AxisExplorer.jsx';
import IndicatorExplorer from './components/IndicatorExplorer.jsx';
import AxisOverview from './components/AxisOverview.jsx';
import DataTable from './components/DataTable.jsx';
import Footer, { ClosingSections } from './components/Footer.jsx';
import { useLayerStack } from './hooks/useLayerStack.js';

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [selection, setSelection] = useState(() => ({ axis: Number(location.hash.match(/^#eje-([1-7])$/)?.[1] || 3), indicator: '', view: /^#eje-[1-7]$/.test(location.hash) ? 'axis' : 'menu' }));
  const fullscreenOwned=useRef(false),menuScroll=useRef(0);
  const pendingNavigation=useRef(location.hash.match(/^#eje-([1-7])$/) ? {type:'axis',axis:selection.axis} : ['#indicadores','#datos','#directorio'].includes(location.hash) ? {type:'menu'} : null);
  const layerStack=useLayerStack(`${Boolean(data)}:${selection.axis}:${selection.indicator}:${selection.view}`);
  const [notice, setNotice] = useState('');
  useEditorialMotion(`${Boolean(data)}:${selection.axis}:${selection.indicator}:${selection.view}`);
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
  function selectAxis(axis, scrollToPanel = true) {
    if(selection.view==='menu')menuScroll.current=window.scrollY;
    pendingNavigation.current={type:'axis',axis,scroll:scrollToPanel};
    setSelection({ axis, indicator: '', view:'axis' });
    history.pushState(null, '', `#eje-${axis}`);
    setNotice(`Eje ${axis}: ${data.axes.find(a => a.id === axis).name}`);
  }
  async function selectIndicator(indicator) {
    const selected=indicators.find(d=>d.id===indicator);
    if (!selected) return;
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      try { await document.documentElement.requestFullscreen({navigationUI:'hide'}); fullscreenOwned.current=true; } catch { fullscreenOwned.current=false; }
    }
    pendingNavigation.current={type:'detail'};
    setSelection({ axis:selected.axis, indicator, view:'axis' });
    history.replaceState(null, '', `#eje-${selected.axis}`);
    setNotice(`Indicador ${indicator} seleccionado.`);
  }
  function showOverview() {
    if(fullscreenOwned.current){fullscreenOwned.current=false;if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});}
    pendingNavigation.current={type:'back',id:selection.indicator,scroll:false};
    setSelection(current => ({ ...current, indicator: '' }));
    setNotice('Indicadores del eje seleccionado.');
  }
  function backToAxes() {
    pendingNavigation.current={type:'menu',axis:selection.axis,restore:menuScroll.current};
    setSelection(current=>({...current,indicator:'',view:'menu'}));
    history.pushState(null,'','#directorio');
    setNotice('Selecciona un eje de ciudad.');
  }
  useEffect(()=>{
    if(!selection.indicator && fullscreenOwned.current){fullscreenOwned.current=false;if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});}
    const leave=()=>{if(selection.indicator && fullscreenOwned.current && !document.fullscreenElement)showOverview();};
    document.addEventListener('fullscreenchange',leave);
    return()=>document.removeEventListener('fullscreenchange',leave);
  },[selection.indicator]);
  // Run after React commits the destination, including slow renders and hash links.
  useEffect(()=>{
    if (!data || !pendingNavigation.current) return;
    const intent=pendingNavigation.current;
    if(intent.type==='detail'){pendingNavigation.current=null;return;}
    if(intent.type==='menu'){
      const destination=document.getElementById(intent.axis ? `axis-entry-${intent.axis}` : 'axes-title');
      destination?.focus({preventScroll:true});
      if(intent.restore>0)window.scrollTo({top:intent.restore,behavior:'instant'});
      else document.getElementById('directorio')?.scrollIntoView({block:'start',behavior:'instant'});
      pendingNavigation.current=null;return;
    }
    const target=document.getElementById(intent.type==='axis' ? `lista-eje-${intent.axis}` : intent.type==='back' ? `resumen-${intent.id}` : 'active-indicator-title');
    if (!target) return;
    pendingNavigation.current=null;
    target.focus({preventScroll:true});
    if (intent.scroll===false) return;
    const destination=intent.type==='detail' ? document.getElementById('indicadores') : target;
    destination?.scrollIntoView({behavior:'instant',block:intent.type==='back' ? 'center' : 'start'});
  },[data,selection]);
  useEffect(() => {
    const change = () => {
      const axis = location.hash.match(/^#eje-([1-7])$/)?.[1];
      if (axis) { pendingNavigation.current={type:'axis',axis:Number(axis)}; setSelection({ axis: Number(axis), indicator: '', view:'axis' }); }
      else { pendingNavigation.current=location.hash==='#inicio' ? null : {type:'menu'};setSelection(current=>({...current,indicator:'',view:'menu'})); }
    };
    window.addEventListener('hashchange', change);
    window.addEventListener('popstate', change);
    return () => {window.removeEventListener('hashchange', change);window.removeEventListener('popstate', change);};
  }, []);
  if (error) return <main className="load-screen"><span className="micro">IMPLAN LEÓN</span><h1>No pudimos cargar los indicadores.</h1><p>Comprueba tu conexión e intenta nuevamente.</p><button className="solid-button" onClick={() => location.reload()}>Volver a cargar ↗</button></main>;
  if (!data) return <main className="load-screen" aria-busy="true"><span className="micro">IMPLAN LEÓN / VISIÓN 2050</span><p role="status">Cargando indicadores…</p></main>;
  const axis = data.axes.find(a => a.id === selection.axis);
  const indicatorId = selection.indicator || selectedIndicators[0]?.id;
  return <>
    <a href="#ejes" className="skip-link">Saltar a los indicadores</a>
    <div className="layer-stack" ref={layerStack}>
    {selection.view==='menu' ? <>
      <Hero count={indicators.length}/>
      <main id="main"><AxisExplorer axes={data.axes} indicators={indicators} activeAxis={null} onSelect={selectAxis}/></main>
    </> : <>
      <header className="axis-list-toolbar" style={axisTheme(axis.id)}>
        <button className="detail-back" onClick={backToAxes}>Volver a los siete ejes</button>
        <span>{axisCopy[axis.id].title} · {selectedIndicators.length} indicadores</span>
      </header>
      <main id="main">
        <div className="axis-sheet"><AxisOverview key={axis.id} axes={[axis]} indicators={selectedIndicators} onSelectIndicator={selectIndicator}/></div>
        <DataTable key={`table-${selection.axis}`} indicators={selectedIndicators} axes={data.axes} axis={axis} onSelectIndicator={selectIndicator}/>
      </main>
      <ClosingSections/>
    </>}
    </div>
    {selection.view==='axis' && <Footer/>}
    {selection.indicator && <IndicatorExplorer key={indicatorId} axis={axis} axes={data.axes} indicators={selectedIndicators} selectedId={indicatorId} onBack={showOverview}/>}
    <div className="sr-only" role="status" aria-live="polite">{notice}</div>
  </>;
}
