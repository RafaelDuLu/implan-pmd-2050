// Compilación estática para el mismo flujo npm run build → dist de los boletines.
// data.json es el archivo de datos de origen; data.js se genera automáticamente.
const fs = require('node:fs');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
const data = JSON.parse(fs.readFileSync(path.join(root, 'assets/data.json'), 'utf8'));
if (!Array.isArray(data.axes) || !Array.isArray(data.indicators)) {
  throw new Error('El JSON debe incluir axes e indicators.');
}
fs.writeFileSync(path.join(root, 'assets/data.js'), 'window.PMD_DATA = '+JSON.stringify(data,null,2)+';\n');
const check = spawnSync(process.execPath,[path.join(root,'scripts/verify.cjs')],{stdio:'inherit'});
if (check.error) throw check.error;
if (check.status !== 0) process.exit(check.status || 1);
fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(path.join(out,'docs'),{recursive:true});
fs.copyFileSync(path.join(root,'index.html'),path.join(out,'index.html'));
fs.cpSync(path.join(root,'assets'),path.join(out,'assets'),{recursive:true});
fs.copyFileSync(path.join(root,'docs/inventario.csv'),path.join(out,'docs/inventario.csv'));
const html=fs.readFileSync(path.join(out,'index.html'),'utf8');
for(const match of html.matchAll(/(?:src|href)="((?:assets|docs)\/[^"]+)"/g)) {
  if(!fs.existsSync(path.join(out,match[1]))) throw new Error('Falta archivo publicable: '+match[1]);
}
console.log('Compilación completa. Carpeta publicable: dist/');
