import { indicatorActions } from '../src/lib/indicator-actions.mjs';
import { goalPlan, paceKeyStep, goalPaceMultiplier } from '../src/lib/goal-plan.mjs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { progress, assessGoal, project, displayValue, deltaValue, toTimelineRecord, createCSV, movement, chartObservations } from '../src/lib/indicators.mjs';

const data = JSON.parse(readFileSync(new URL('../assets/data.json', import.meta.url),'utf8'));
const eligible = data.indicators.filter(d => d.eligible);
const close = (a,b) => assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
test('La selección conserva los datos y unidades declaradas', () => {
  assert.equal(data.axes.length,7); assert.equal(data.leaders.length,9);
  assert.equal(data.indicators.length,52); assert.equal(eligible.length,31);
  assert.equal(new Set(data.indicators.map(d => d.id)).size,data.indicators.length);
  for(const d of eligible) {
    assert.ok([d.base,d.baseYear,d.value,d.year,d.target2030].every(Number.isFinite));
    assert.ok(d.unit && d.source && !d.reasons.length);
    assert.ok(['A','D'].includes(d.direction));
  }
  for(const axis of data.axes) assert.ok(eligible.some(d => d.axis===axis.id));
});
test('El avance conserva retrocesos, sobrecumplimiento y bases iguales a meta', () => {
  close(progress({base:10,value:15,target2030:20}),50);
  close(progress({base:100,value:80,target2030:60}),50);
  close(progress({base:100,value:110,target2030:60}),-25);
  close(progress({base:10,value:25,target2030:20}),150);
  assert.equal(progress({base:10,value:12,target2030:10}),null);
});
test('Una meta ascendente enciende alerta si la proyección es menor', () => {
  assert.equal(assessGoal(40,50,'A'),'at-risk');
  assert.equal(assessGoal(60,50,'A'),'on-track');
  assert.equal(assessGoal(50,50,'A'),'on-track');
});
test('Una meta descendente invierte correctamente el criterio', () => {
  assert.equal(assessGoal(40,50,'D'),'on-track');
  assert.equal(assessGoal(60,50,'D'),'at-risk');
  assert.equal(assessGoal(50,50,'D'),'on-track');
  assert.equal(assessGoal(null,50,'D'),'unavailable');
});
test('Economía: proyección real de 2024 a 2030 y contrato de porcentaje', () => {
  const d=eligible.find(d=>d.id==='3.1.3');
  close(project(d).value,.19696);
  assert.equal(project(d).state,'at-risk');
  const record=toTimelineRecord(d);
  close(record.porcentajeActual,23.02); close(record.metaObjetivo,33.5); close(record.proyeccionFinal,19.696);
});
test('Agua: modificar el escenario cambia el aviso sin cambiar el dato', () => {
  const d=structuredClone(eligible.find(d=>d.id==='5.3.1'));
  const snapshot=JSON.stringify(d);
  close(project(d).value,119.375); assert.equal(project(d).state,'at-risk');
  close(project(d,2).value,112.05); assert.equal(project(d,2).state,'on-track');
  assert.equal(JSON.stringify(d),snapshot);
});
test('Fecundidad: bajar la tasa constituye avance favorable', () => {
  const d=eligible.find(d=>d.id==='1.5.2');
  close(project(d).value,26.7); assert.equal(project(d).state,'on-track');
});
test('No se proyectan periodos incomparables ni escenarios porcentuales imposibles', () => {
  assert.equal(project({base:1,baseYear:2025,value:2,year:2025,target2030:3,direction:'A'}).state,'unavailable');
  assert.equal(project({base:.1,baseYear:2024,value:.9,year:2025,target2030:.95,direction:'A',percent:true}).state,'unavailable');
});
test('Porcentajes y puntos porcentuales no se confunden', () => {
  const d=eligible.find(d=>d.id==='1.1.2');
  assert.equal(displayValue(d.value,d),'97.59 %'); close(deltaValue(d),1.59);
  assert.equal(displayValue(null,d),'No disponible');
});
test('CSV conserva valores originales y declara que el escenario no es oficial', () => {
  const csv=createCSV([eligible[0]],data.axes);
  assert.ok(csv.startsWith('\ufeff')); assert.ok(csv.includes('Escenario lineal 2030 original (no oficial)'));
  assert.ok(csv.includes('"0.9759"')); assert.ok(csv.includes('"TC Indicadores por eje"'));
});
test('La interfaz no muestra marcadores de desarrollo', () => {
  const files=['src/App.jsx','src/components/Hero.jsx','src/components/AxisExplorer.jsx','src/components/IndicatorExplorer.jsx','src/components/GoalTimeline.jsx','src/components/DataTable.jsx','src/components/Footer.jsx'];
  for(const file of files) assert.doesNotMatch(readFileSync(new URL('../'+file,import.meta.url),'utf8'),/prueba\s*0?1|lorem ipsum|placeholder de desarrollo/i);
});

test('La flecha representa subir o bajar independientemente del sentido favorable', () => {
  const water=eligible.find(d=>d.id==='5.3.1');
  assert.equal(movement(water).arrow,'↓');
  assert.equal(movement(water).label,'Bajó');
  assert.equal(movement({base:1,value:2,direction:'D'}).arrow,'↑');
  assert.equal(movement({base:2,value:2,direction:'A'}).arrow,'→');
});

test('Los históricos validados se ordenan sin reemplazar las observaciones originales', () => {
  const d=eligible.find(d=>d.id==='1.3.2');
  const history={validated:true,unit:d.unit,geography:'Municipio de León, Guanajuato',source:{name:'Fuente de validación',url:'https://www.inegi.org.mx/'},observations:[{year:2015,value:9.2}]};
  assert.deepEqual(chartObservations(d,history).map(p=>p.year),[2015,2020,2025]);
  assert.deepEqual(chartObservations(d,{...history,validated:false}).map(p=>p.year),[2020,2025]);
  assert.equal(chartObservations(d,{...history,unit:'Otra unidad'}).length,2);
  assert.equal(chartObservations(d,{...history,observations:[{year:2020,value:100}]}).length,2);
  assert.equal(chartObservations(d,{...history,observations:[{year:2030,value:10}]}).length,2);
  assert.equal(chartObservations(d,{...history,observations:[{year:2015,value:9},{year:2015,value:10}]}).length,2);
});

test('El escenario respeta los límites de una escala declarada en la unidad', () => {
  const biodiversity=eligible.find(d=>d.id==='4.1.1');
  assert.equal(project(biodiversity,1).state,'on-track');
  assert.equal(project(biodiversity,2).state,'unavailable');
  assert.match(project(biodiversity,2).reason,/0 a 112/);
});


test('El diagnóstico fecha el cruce de metas ascendentes y descendentes sin modificar los datos', () => {
  const school=eligible.find(d=>d.id==='1.3.2'), water=eligible.find(d=>d.id==='5.3.1');
  const snapshot=JSON.stringify([school,water]);
  assert.equal(goalPlan(school).crossingYear,2029);
  close(goalPlan(school).required,.064);
  assert.equal(goalPlan(water).crossingYear,2033);
  close(goalPlan(water).required,-2.34);
  assert.equal(JSON.stringify([school,water]),snapshot);
});
test('Una tendencia contraria o inmóvil no produce un año de cumplimiento inventado', () => {
  const economy=goalPlan(eligible.find(d=>d.id==='3.1.3'));
  assert.equal(economy.status,'away'); assert.equal(economy.crossingYear,null);
  close(economy.required,.01746666666666667);
  const flat=goalPlan({base:10,baseYear:2020,value:10,year:2025,target2030:20,direction:'A'});
  assert.equal(flat.status,'flat'); assert.equal(flat.crossingYear,null); close(flat.required,2);
});
test('Las metas ya cumplidas no se anuncian como cumplimientos futuros', () => {
  const fertility=goalPlan(eligible.find(d=>d.id==='1.5.2'));
  assert.equal(fertility.status,'achieved'); assert.equal(fertility.crossingYear,null); assert.equal(fertility.required,0);
});
test('La fecha usa el primer año entero del cruce y maneja periodos y escalas inválidos', () => {
  const d={base:10,baseYear:2020,value:15,year:2025,target2030:20,direction:'A'};
  assert.equal(goalPlan(d).crossingYear,2030);
  assert.equal(goalPlan({...d,baseYear:2025}).status,'unavailable');
  assert.equal(goalPlan({...d,percent:true}).status,'unavailable');
  const end=goalPlan({...d,year:2030});
  assert.equal(end.required,null);
});


test('El control simula aceleración, pausa e inversión sin cambiar observaciones', () => {
  const water=eligible.find(d=>d.id==='5.3.1');
  const snapshot=JSON.stringify(water);
  assert.equal(goalPlan(water,2030,2).crossingYear,2029);
  assert.equal(goalPlan(water,2030,.5).crossingYear,2041);
  assert.equal(goalPlan(water,2030,0).status,'flat');
  assert.equal(goalPlan(water,2030,-1).status,'away');
  close(project(water,0,2030,true).value,water.value);
  assert.equal(JSON.stringify(water),snapshot);
  const economy=eligible.find(d=>d.id==='3.1.3');
  assert.equal(goalPlan(economy,2030,-2).status,'approaching');
  assert.ok(project(economy,-2,2030,true).value>economy.value);
  assert.equal(project(economy,-2).state,'unavailable');
});
test('La simulación respeta la escala y cada indicador tiene prioridades específicas', () => {
  for(const d of eligible) assert.equal(indicatorActions[d.id]?.length,2);
  const waterHousing=eligible.find(d=>d.id==='1.1.2');
  assert.equal(project(waterHousing,3,2030,true).state,'unavailable');
  assert.notEqual(indicatorActions['1.1.2'][1],indicatorActions['1.3.2'][1]);
});


test('El teclado acelera reducciones hacia abajo y aumentos hacia arriba', () => {
  assert.equal(paceKeyStep('D','ArrowDown'),1);
  assert.equal(paceKeyStep('D','ArrowUp'),-1);
  assert.equal(paceKeyStep('A','ArrowUp'),1);
  assert.equal(paceKeyStep('A','ArrowDown'),-1);
  assert.equal(paceKeyStep('D','Tab'),0);
});


test('El ritmo se orienta automáticamente a la meta sin alterar el histórico', () => {
  const cases=[
    {base:10,value:12,direction:'D',expected:-2},
    {base:12,value:10,direction:'D',expected:2},
    {base:12,value:10,direction:'A',expected:-2},
    {base:10,value:12,direction:'A',expected:2},
  ];
  for(const d of cases) assert.equal(goalPaceMultiplier(d,2),d.expected);
  assert.equal(goalPaceMultiplier({base:10,value:10,direction:'D'},2),2);
});
test('Los 31 indicadores conservan datos reales y simulan el sentido de su meta', () => {
  for(const d of eligible) {
    const snapshot=JSON.stringify(d);
    const m=goalPaceMultiplier(d,1);
    const p=goalPlan(d,2030,m);
    assert.ok(p.annual*(d.direction==='D'?-1:1)>=0);
    close(project(d,m,2030,true).value,d.value+(d.value-d.base)/(d.year-d.baseYear)*m*(2030-d.year));
    assert.equal(JSON.stringify(d),snapshot);
  }
});

test('Las equivalencias contextualizan los 31 ritmos sin inventar totales municipales', async () => {
  const { paceContext, paceContexts } = await import('../src/lib/pace-context.mjs');
  assert.equal(Object.keys(paceContexts).length,31);
  for(const d of eligible) {
    const snapshot=JSON.stringify(d);
    const p=goalPlan(d,2030,goalPaceMultiplier(d));
    const text=paceContext(d,p.annual);
    assert.ok(text && !/NaN|undefined|No disponible/.test(text),d.id);
    if(p.annual!==0) assert.notEqual(text,paceContext(d,p.annual*2),d.id);
    assert.match(paceContext(d,0),/pausa/);
    assert.equal(paceContext(d,null),null);
    assert.equal(JSON.stringify(d),snapshot);
  }
});
test('Escolaridad expresa grados completados y conserva la equivalencia al mover el ritmo', async () => {
  const { paceContext } = await import('../src/lib/pace-context.mjs');
  const school=eligible.find(d=>d.id==='1.3.2');
  const p=goalPlan(school,2030,1);
  assert.match(paceContext(school,p.required),/64 personas de cada 1,000.*completando un grado/);
  assert.match(paceContext(school,p.required*2),/128 personas de cada 1,000/);
  assert.doesNotMatch(paceContext(school,p.required),/reincorpor/);
});
test('Se convierten segundos, metros, gramos y días sin perder sus denominadores', async () => {
  const { paceContext } = await import('../src/lib/pace-context.mjs');
  const d = id => eligible.find(x=>x.id===id);
  assert.match(paceContext(d('2.1.2'),-1.5),/90 segundos/);
  assert.match(paceContext(d('6.1.1'),-.25),/250 metros/);
  assert.match(paceContext(d('4.5.2'),-.006),/6 gramos/);
  assert.match(paceContext(d('4.3.4'),.01),/3.65 días/);
  assert.match(paceContext(d('1.5.1'),.01),/10 personas.*1,000/);
  assert.match(paceContext(d('1.5.1'),-.01),/aleja/);
  assert.match(paceContext(d('1.5.1'),.000001),/menos de 0.01/);
});

test('El semáforo distingue cumplimiento real, recuperación y atención sin alterar datos', async () => {
  const { overviewStatus }=await import('../src/lib/overview-status.mjs');
  const base={base:0,baseYear:2020,value:5,year:2025,target2030:10,direction:'A',unit:'Unidades',percent:false};
  assert.equal(overviewStatus(base).state,'good');
  assert.equal(overviewStatus({...base,value:12}).label,'Meta superada');
  assert.equal(overviewStatus({...base,value:3}).state,'watch');
  assert.equal(overviewStatus({...base,value:-6}).state,'watch');
  assert.equal(overviewStatus({...base,value:-1}).state,'risk');
  assert.equal(overviewStatus({...base,value:-20}).state,'risk');
  assert.equal(overviewStatus({...base,value:0}).state,'risk');
  assert.equal(overviewStatus({...base,target2030:0}).state,'unknown');
  const lower={base:100,baseYear:2020,value:80,year:2025,target2030:60,direction:'D',unit:'Unidades'};
  assert.equal(overviewStatus(lower).state,'good');
  assert.equal(overviewStatus({...lower,value:120}).state,'watch');
  assert.equal(overviewStatus({...lower,value:105}).state,'risk');
  for(const d of eligible){const before=JSON.stringify(d);assert.ok(['good','watch','risk','unknown'].includes(overviewStatus(d).state));assert.equal(JSON.stringify(d),before);}
});
test('Las barras comparten origen y escala, con desbordamiento explícito en ambos sentidos', async () => {
  const { overviewRail }=await import('../src/lib/overview-status.mjs');
  assert.deepEqual(overviewRail(40),{left:50,width:20,marker:70,overflow:0});
  assert.deepEqual(overviewRail(-40),{left:30,width:20,marker:30,overflow:0});
  assert.deepEqual(overviewRail(332.5),{left:50,width:50,marker:100,overflow:1});
  assert.deepEqual(overviewRail(-612.5),{left:0,width:50,marker:0,overflow:-1});
  assert.equal(overviewRail(100).overflow,0);
  assert.equal(overviewRail(null).width,0);
});

test('Los 31 controles inician en cero y su referencia llega a 2030 sin alterar observaciones', async () => {
  const {paceProfile,paceScenario}=await import('../src/lib/pace-scenario.mjs');
  for(const d of eligible){
    const before=JSON.stringify(d),profile=paceProfile(d),paused=paceScenario(d);
    close(paused.projected.value,d.value);close(paused.plan.annual,0);
    assert.ok(Number.isFinite(profile.max) && profile.max>=3);
    if(profile.requiredPace!==null){
      assert.ok(profile.requiredPace<=profile.max,d.id);
      const target=paceScenario(d,profile.requiredPace);
      assert.ok(target.plan.crossingYear<=2030,d.id);
      assert.equal(target.projected.state,'on-track',d.id);
      close(target.projected.value,d.value+target.plan.annual*(2030-d.year));
    }
    assert.equal(JSON.stringify(d),before);
  }
});
test('Densidad y economía tienen escalas suficientes y referencias específicas', async () => {
  const {paceProfile,paceScenario}=await import('../src/lib/pace-scenario.mjs');
  const density=eligible.find(d=>d.id==='4.1.3'),economy=eligible.find(d=>d.id==='3.1.3');
  assert.equal(paceProfile(density).requiredPace,4.19);
  assert.equal(paceProfile(density).max,6);
  assert.equal(paceScenario(density,3).projected.state,'at-risk');
  assert.equal(paceScenario(density,4.19).projected.state,'on-track');
  assert.equal(paceProfile(economy).max,4);
  assert.equal(paceProfile(economy).requiredPace,3.16);
  assert.equal(paceScenario(density,100).plan.annual,paceScenario(density,6).plan.annual);
});
test('Un histórico plano usa una referencia explícita sin inventar cambio observado', async () => {
  const {paceScenario}=await import('../src/lib/pace-scenario.mjs');
  const d={base:10,baseYear:2020,value:10,year:2025,target2030:20,direction:'A',unit:'Unidades'};
  assert.equal(paceScenario(d).profile.flatReference,true);
  assert.equal(paceScenario(d).plan.status,'flat');
  assert.equal(paceScenario(d,1).projected.value,20);
  assert.equal(project(d).rate,0);
  assert.equal(paceScenario(d,NaN).projected.value,10);
  assert.equal(project(d,1,2030,false,2).state,'unavailable');
});
