import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { displayValue, downloadCSV } from '../lib/indicators.mjs';
import HistoryChart from './HistoryChart.jsx';
import GoalPlan from './GoalPlan.jsx';
import { goalPaceMultiplier } from '../lib/goal-plan.mjs';
import { paceScenario } from '../lib/pace-scenario.mjs';
import { axisCopy, axisTheme } from './AxisExplorer.jsx';

export default function IndicatorExplorer({ axis, indicators, axes, selectedId, onBack }) {
  const d=indicators.find(d=>d.id===selectedId) ?? indicators[0];
  const dialog=useRef(null),heading=useRef(null);
  const [detailView,setDetailView]=useState('rhythm');
  const [pace,setPace]=useState(0);
  const {profile,plan,projected}=paceScenario(d,pace);
  const autoAdjusted=goalPaceMultiplier(d,1)<0;
  useLayoutEffect(()=>{
    const node=dialog.current,body=document.body,html=document.documentElement;
    const scrollY=window.scrollY,scrollX=window.scrollX;
    const saved={position:body.style.position,top:body.style.top,left:body.style.left,width:body.style.width,overflow:body.style.overflow,htmlOverflow:html.style.overflow};
    body.style.position='fixed';body.style.top=`${-scrollY}px`;body.style.left=`${-scrollX}px`;body.style.width='100%';body.style.overflow='hidden';html.style.overflow='hidden';
    if(!node.open)node.showModal();
    heading.current?.focus({preventScroll:true});
    return()=>{
      node.close();
      Object.assign(body.style,{position:saved.position,top:saved.top,left:saved.left,width:saved.width,overflow:saved.overflow});
      html.style.overflow=saved.htmlOverflow;
      window.scrollTo({left:scrollX,top:scrollY,behavior:'instant'});
    };
  },[]);
  return createPortal(<dialog ref={dialog} className="focus-dialog" style={axisTheme(axis.id)} aria-modal="true" aria-labelledby="active-indicator-title" onCancel={event=>{event.preventDefault();onBack();}}>
    <div className="focus-frame">
      <header className="focus-toolbar"><button className="detail-back" onClick={onBack}>← Volver a los indicadores</button><div className="focus-axis"><img src={`./axes/official/eje-${axis.id}.webp`} alt="" width="1063" height="1200"/><span>{axisCopy[axis.id].title}</span><span className="focus-code">{d.id}</span></div><button className="text-button focus-csv" onClick={()=>downloadCSV([d],axes,`indicador-${d.id}.csv`)}>Descargar CSV <span aria-hidden="true">↓</span></button></header>
      <h2 ref={heading} id="active-indicator-title" className="focus-title" tabIndex="-1">{d.name}</h2>
      <div className="detail-values focus-values">{[['Valor base',d.baseYear,d.base],['Último dato',d.year,d.value],['Meta',2030,d.target2030]].map(([label,year,value])=><div key={label}><span>{label} · {year}</span><strong>{displayValue(value,d)}{!d.percent && <small>{d.unit}</small>}</strong></div>)}</div>
      <div className="detail-view-tabs focus-tabs" role="group" aria-label="Contenido del indicador">{[['chart','Gráfica','detail-chart'],['rhythm','Ritmo','detail-rhythm'],['actions','Acciones','detail-rhythm']].map(([view,label,controls])=><button key={view} id={`${view}-tab`} aria-pressed={detailView===view} aria-controls={controls} onClick={()=>setDetailView(view)}>{label}</button>)}</div>
      <div className="detail-layout focus-layout" data-view={detailView}><div className="detail-chart" id="detail-chart"><HistoryChart indicator={d} projected={projected}/></div><GoalPlan indicator={d} plan={plan} profile={profile} projected={projected} pace={pace} autoAdjusted={autoAdjusted} onPace={setPace} onReset={()=>setPace(0)}/></div>
    </div>
  </dialog>,document.body);
}
