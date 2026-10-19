import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { progress, assessGoal, project, displayValue, deltaValue, toTimelineRecord, createCSV } from '../src/lib/indicators.mjs';

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
