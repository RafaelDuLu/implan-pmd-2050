const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'assets/data.json'),'utf8'));
const {progress,state,format,change,csv}=require('../assets/app.js');
const approximate=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-9,`${actual} != ${expected}`);
// Casos de aumento, reducción, retroceso y meta sobrepasada.
approximate(progress({base:10,value:15,target2030:20}),50);
approximate(progress({base:100,value:80,target2030:60}),50);
approximate(progress({base:100,value:110,target2030:60}),-25);
approximate(progress({base:10,value:25,target2030:20}),150);
assert.equal(progress({base:10,value:10,target2030:10}),null);
assert.equal(state({base:100,value:80,direction:'D'}),'favorable');
assert.equal(state({base:100,value:110,direction:'D'}),'unfavorable');
assert.equal(state({base:0,value:0,direction:'A'}),'same');
assert.equal(format(.9759,{percent:true}),'97.59 %');
approximate(change({base:.96,value:.9759,percent:true}),1.59);
assert.equal(format(null,{percent:true}),'No disponible');
assert.equal(csv([['A,"B"','C\nD',null]]),'\ufeff"A,""B""","C\nD",""');
const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'assets/data.js'),'utf8'),context);
assert.equal(JSON.stringify(context.window.PMD_DATA),JSON.stringify(data));
assert.equal(new Set(data.indicators.map(d=>d.id)).size,data.indicators.length);
assert.equal(data.axes.length,7);assert.equal(data.leaders.length,9);
for(const axis of data.axes)assert.ok(data.indicators.some(d=>d.axis===axis.id&&d.eligible));
for(const d of data.indicators.filter(d=>d.eligible)){
 assert.ok([d.base,d.value,d.target2030,d.baseYear,d.year].every(Number.isFinite));
 assert.ok(d.unit&&d.source&&!d.reasons.length);
 assert.ok(d.year>=d.baseYear&&d.year<2030);
 assert.ok(['A','D'].includes(d.direction));
 assert.ok(Number.isFinite(progress(d)));
}
// Datos reales de prueba: proporciones mostradas como % y diferencia en pp.
const housing=data.indicators.find(d=>d.id==='1.1.2');
assert.equal(format(housing.value,housing),'97.59 %');approximate(change(housing),1.59);approximate(progress(housing),106);
const water=data.indicators.find(d=>d.id==='5.3.1');
approximate(change(water),-2.93);approximate(progress(water),20.02734107997263);
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
for(const m of html.matchAll(/(?:src|href)="((?:assets|docs)\/[^"]+)"/g))assert.ok(fs.existsSync(path.join(root,m[1])),m[1]);
console.log('Correcto: cálculos, formatos, CSV, consistencia JS/JSON, selección y archivos enlazados.');
console.log(`${data.indicators.filter(d=>d.eligible).length} indicadores seleccionados; ${data.indicators.filter(d=>!d.eligible).length} reservados; ${data.leaders.length} líderes preservados.`);
