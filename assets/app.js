/* Sin librerías, red externa ni modificación del conjunto original. */
(() => {
  'use strict';
  const numeric = n => typeof n === 'number' && Number.isFinite(n);
  const progress = d => numeric(d.target2030) && d.target2030 !== d.base ? (d.value-d.base)/(d.target2030-d.base)*100 : null;
  const state = d => d.value === d.base ? 'same' : (d.value-d.base)*(d.direction==='A'?1:-1)>0?'favorable':'unfavorable';
  const number = (n,max=4) => numeric(n) ? new Intl.NumberFormat('es-MX',{maximumFractionDigits:max}).format(n) : 'No disponible';
  const format = (n,d) => !numeric(n)?'No disponible': number(d.percent?n*100:n)+(d.percent?' %':'');
  const change = d => (d.value-d.base)*(d.percent?100:1);
  const escape = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const signed = (n,max=4) => (n>0?'+':'')+number(n,max);
  const cell = value => '"'+String(value??'').replace(/"/g,'""')+'"';
  const csv = rows => '\ufeff'+rows.map(r=>r.map(cell).join(',')).join('\r\n');
  if(typeof module !== 'undefined') module.exports={progress,state,format,change,csv};
  if(typeof document === 'undefined') return;
  const data=window.PMD_DATA, $=id=>document.getElementById(id);
  const labels=['Sociedad e identidad','Seguridad y paz','Economía e innovación','Territorio y resiliencia','Gestión del agua','Movilidad','Gobierno abierto'];
  const statusText={favorable:'En sentido favorable',unfavorable:'En sentido contrario',same:'Sin cambio'};
  let axis=1, selected='',sortKey='id', sortDirection=1;
  const all=data.indicators.filter(d=>d.eligible);
  let visible=[];
  $('eligible-count').textContent=String(all.length).padStart(2,'0');
  function announce(message){$('announcement').textContent=message;}
  function exportRows(rows,name){
    const header=['Clave','Eje','Indicador','Unidad','Año base','Valor base original','Año último dato','Último valor original','Meta 2030 original','Base presentada','Último dato presentado','Meta presentada','Cambio (unidad o puntos porcentuales)','Avance hacia meta (cálculo portal, %)','Sentido deseado','Fuente transcrita del Excel','Referencia','Hoja de origen','Fila de origen','Observaciones'];
    const values=rows.map(d=>[d.id,data.axes[d.axis-1].name,d.name,d.unit,d.baseYear,d.base,d.year,d.value,d.target2030,format(d.base,d),format(d.value,d),format(d.target2030,d),change(d),progress(d),d.direction==='A'?'Aumentar':'Disminuir',d.source,d.link,d.sheet,d.row,d.notes.join(' | ')]);
    const url=URL.createObjectURL(new Blob([csv([header,...values])],{type:'text/csv;charset=utf-8;'}));
    const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);announce('CSV descargado: '+rows.length+' indicadores.');
  }
  function renderTabs(){
    $('axis-tabs').innerHTML=data.axes.map(a=>`<button role="tab" id="tab-${a.id}" aria-controls="axis-panel" aria-selected="${a.id===axis}" tabindex="${a.id===axis?0:-1}" data-axis="${a.id}" title="${escape(a.name)}"><span>0${a.id} ↗</span>${labels[a.id-1]}</button>`).join('');
    $('axis-panel').setAttribute('aria-labelledby','tab-'+axis);
  }
  function selectAxis(id,updateHash=true){
    axis=id; selected=''; $('search').value='';$('status').value='all';sortKey='id';sortDirection=1;
    const rows=all.filter(d=>d.axis===axis);
    $('year').innerHTML='<option value="all">Todos los años</option>'+[...new Set(rows.map(d=>d.year))].sort((a,b)=>b-a).map(y=>`<option value="${y}">${y}</option>`).join('');
    $('axis-number').textContent='0'+axis;$('axis-name').textContent=data.axes[axis-1].name;
    $('axis-summary').textContent=rows.length+' indicadores en la prueba · '+data.indicators.filter(d=>d.axis===axis).length+' en el archivo · Metas 2030';
    if(updateHash) history.replaceState(null,'','#eje-'+axis);
    renderTabs(); render();
  }
  function render(){
    const q=$('search').value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    visible=all.filter(d=>d.axis===axis && (d.name+' '+d.id).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(q) && ($('status').value==='all'||state(d)===$('status').value) && ($('year').value==='all'||String(d.year)===$('year').value));
    visible.sort((a,b)=>String(a[sortKey]).localeCompare(String(b[sortKey]),'es',{numeric:true})*sortDirection);
    if(!visible.some(d=>d.id===selected)) selected=visible[0]?.id||'';
    $('result-count').textContent=visible.length;
    $('indicator-list').innerHTML=visible.map(d=>`<button data-id="${d.id}" aria-pressed="${d.id===selected}"><span>${d.id} / ${d.year}</span>${escape(d.name)}</button>`).join('')||'<p class="empty">No hay resultados. Cambia la búsqueda o los filtros.</p>';
    $('table-body').innerHTML=visible.map(d=>`<tr><td>${d.id}</td><td><button data-id="${d.id}">${escape(d.name)}</button></td><td>${escape(d.unit)}</td><td>${format(d.base,d)}<small>${d.baseYear}</small></td><td>${format(d.value,d)}<small>${d.year}</small></td><td>${format(d.target2030,d)}</td><td>${signed(change(d))}${d.percent?' puntos porcentuales':' '+escape(d.unit)}<small>${statusText[state(d)]}</small></td><td>${escape(d.source)}</td></tr>`).join('')||'<tr><td colspan="8">No hay resultados para esta consulta.</td></tr>';
    document.querySelectorAll('[data-sort]').forEach(b=>b.closest('th').setAttribute('aria-sort',b.dataset.sort===sortKey?(sortDirection===1?'ascending':'descending'):'none'));
    $('download-axis').disabled=!visible.length;
    renderDetail();
  }
  function chart(d,showTarget){
    const base=d.percent?d.base*100:d.base,last=d.percent?d.value*100:d.value,target=d.percent?d.target2030*100:d.target2030;
    const values=showTarget?[base,last,target]:[base,last];
    let min=Math.min(...values),max=Math.max(...values),pad=(max-min)*.3 || Math.max(Math.abs(max)*.1,1);min-=pad;max+=pad;
    const left=85,right=665,top=35,bottom=220;
    const x=y=>left+(y-d.baseYear)/(2030-d.baseYear)*(right-left), yy=n=>bottom-(n-min)/(max-min)*(bottom-top);
    const axisTicks=[0,.5,1].map(t=>{const v=min+(max-min)*t,y=yy(v);return `<line class="grid" x1="${left}" x2="${right}" y1="${y}" y2="${y}"/><text x="${left-12}" y="${y+4}" text-anchor="end">${number(v,2)}</text>`;}).join('');
    const points=[{year:d.baseYear,value:base,label:'Línea base'},{year:d.year,value:last,label:'Último dato'}];
    return `<svg class="chart" viewBox="0 0 720 275" role="img" aria-label="${escape(d.name)}: línea base ${format(d.base,d)} en ${d.baseYear}; último dato ${format(d.value,d)} en ${d.year}; ${showTarget?'meta '+format(d.target2030,d)+' en 2030':'meta oculta'}. Dos observaciones disponibles.">${axisTicks}${showTarget?`<line class="target" x1="${left}" x2="${right}" y1="${yy(target)}" y2="${yy(target)}"/><text x="${right}" y="${yy(target)-9}" text-anchor="end">Meta 2030 · ${number(target)}${d.percent?' %':''}</text>`:''}<line class="observed" x1="${x(d.baseYear)}" x2="${x(d.year)}" y1="${yy(base)}" y2="${yy(last)}"/>${points.map((p,i)=>`<g tabindex="0" role="img" aria-label="${p.label}, ${p.year}: ${format(i?d.value:d.base,d)}"><title>${p.label} · ${p.year}: ${format(i?d.value:d.base,d)}</title><circle cx="${x(p.year)}" cy="${yy(p.value)}" r="6"/><text class="label" x="${x(p.year)+(i?10:0)}" y="${yy(p.value)+(i?22:-14)}" text-anchor="${i?'start':'middle'}">${number(p.value)}${d.percent?' %':''}</text></g>`).join('')}${[...new Set([d.baseYear,d.year,2030])].map(y=>`<text x="${x(y)}" y="253" text-anchor="middle">${y}</text>`).join('')}</svg>`;
  }
  function renderDetail(){
    const d=visible.find(d=>d.id===selected);
    if(!d){$('detail').innerHTML='<div class="empty"><h4>No encontramos indicadores.</h4><p>Prueba con otro nombre, año o sentido del cambio.</p></div>';return;}
    const p=progress(d),s=state(d),delta=change(d);
    const url=/^https?:\/\//.test(d.link||'')?d.link:null;
    $('detail').innerHTML=`<div class="detail-head"><span class="eyebrow">INDICADOR ${d.id} / LEÓN</span><span class="badge ${s==='unfavorable'?'bad':s==='same'?'neutral':''}">${s==='favorable'?'↗':s==='same'?'→':'↘'} ${statusText[s]}</span></div><h4>${escape(d.name)}</h4><p class="detail-sub">${escape(d.unit)} · Sentido deseado: ${d.direction==='A'?'aumentar ↑':'disminuir ↓'}</p><div class="metric-row"><div class="metric"><small>LÍNEA BASE / ${d.baseYear}</small><strong>${format(d.base,d)}</strong></div><div class="metric current"><small>ÚLTIMO DATO / ${d.year}</small><strong>${format(d.value,d)}</strong></div><div class="metric"><small>META / 2030</small><strong>${format(d.target2030,d)}</strong></div></div><div class="analysis-line"><p>Cambio respecto a la línea base<br><strong>${signed(delta)} ${d.percent?'puntos porcentuales':escape(d.unit)}</strong></p><div><p>Avance en el tramo hacia la meta</p><strong>${p===null?'No calculable':number(p,1)+' %'}</strong></div></div><div class="track" aria-hidden="true"><span style="width:${p===null?0:Math.min(100,Math.max(0,p))}%"></span></div><p class="detail-note">Cálculo del portal. ${p!==null&&p>100?'La meta 2030 se alcanzó o superó respecto al sentido establecido.':p!==null&&p<0?'El dato reciente se aleja de la meta respecto a la línea base.':'Mide el cambio desde el punto de partida hacia la meta.'} La barra representa de 0 a 100%; la cifra conserva el resultado completo.</p><div class="graph-toolbar"><span>VALOR INICIAL → ÚLTIMO DATO</span><label><input type="checkbox" id="show-target" checked> Mostrar meta 2030</label></div><div id="chart">${chart(d,true)}</div><div class="legend"><span>Observaciones disponibles</span><span>Meta 2030</span></div><p class="detail-note">Dos observaciones unidas como guía visual. Sin estimaciones entre años. Escala ajustada al rango mostrado.</p><div class="source"><p><b>Fuente:</b> ${escape(d.source)} ${url?`<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">Consultar referencia ↗</a>`:''}</p>${d.link&&!url?`<p>Referencia: ${escape(d.link)}</p>`:''}<p>Procedencia: Excel proporcionado · ${escape(d.sheet)} · fila ${d.row}. Próxima actualización indicada: ${escape(d.nextUpdate??'No disponible')}.</p>${d.notes.length?`<details><summary>Observaciones del archivo (${d.notes.length})</summary>${d.notes.map(n=>`<p>${escape(n)}</p>`).join('')}</details>`:''}<p class="detail-note">Fuente transcrita del insumo; validación externa pendiente. Consulta metodológica disponible al pie.</p><button class="button outline" id="download-indicator">Descargar indicador CSV <span>↓</span></button></div>`;
    $('detail').classList.remove('panel-enter');void $('detail').offsetWidth;$('detail').classList.add('panel-enter');
    $('show-target').addEventListener('change',e=>{$('chart').innerHTML=chart(d,e.target.checked);document.querySelector('.legend').lastElementChild.hidden=!e.target.checked;});
    $('download-indicator').addEventListener('click',()=>exportRows([d],`indicador-${d.id}.csv`));
  }
  $('axis-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-axis]');if(b){selectAxis(Number(b.dataset.axis));$('tab-'+axis).focus();announce('Eje '+axis+': '+data.axes[axis-1].name);}});
  $('axis-tabs').addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=axis%7+1;if(e.key==='ArrowLeft')next=(axis+5)%7+1;if(e.key==='Home')next=1;if(e.key==='End')next=7;if(next){e.preventDefault();selectAxis(next);$('tab-'+axis).focus();}});
  ['search','status','year'].forEach(id=>$(id).addEventListener(id==='search'?'input':'change',()=>{render();announce(visible.length+' indicadores encontrados.');}));
  document.addEventListener('click',e=>{const b=e.target.closest('[data-id]');if(b){const fromTable=Boolean(b.closest('table'));selected=b.dataset.id;render();announce('Detalle del indicador '+selected);if(fromTable){$('detail').setAttribute('tabindex','-1');$('detail').focus({preventScroll:true});$('detail').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}else document.querySelector('#indicator-list [aria-pressed="true"]')?.focus({preventScroll:true});}});
  document.querySelectorAll('[data-sort]').forEach(b=>b.addEventListener('click',()=>{if(sortKey===b.dataset.sort)sortDirection*=-1;else{sortKey=b.dataset.sort;sortDirection=1;}render();}));
  $('download-axis').addEventListener('click',()=>exportRows(visible,`eje-${axis}-consulta.csv`));
  const initial=location.hash.match(/^#eje-([1-7])$/);selectAxis(initial?Number(initial[1]):1,false);
  window.addEventListener('hashchange',()=>{const m=location.hash.match(/^#eje-([1-7])$/);if(m)selectAxis(Number(m[1]),false);});
  let scheduled=false;
  function scrollFrame(){scheduled=false;const rect=document.querySelector('.footer-word').getBoundingClientRect();const p=Math.max(0,Math.min(1,(innerHeight-rect.top)/(rect.height+innerHeight*.12)));document.documentElement.style.setProperty('--progress',(p*100)+'%');}
  window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(scrollFrame);}},{passive:true});window.addEventListener('resize',scrollFrame);scrollFrame();
})();
