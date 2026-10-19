import { readFile, mkdir, copyFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const data = JSON.parse(await readFile(new URL('assets/data.json', root), 'utf8'));
if (!Array.isArray(data.axes) || !Array.isArray(data.indicators)) throw new Error('Estructura JSON inválida.');
await mkdir(new URL('public/data/', root), { recursive: true });
await mkdir(new URL('public/docs/', root), { recursive: true });
await copyFile(new URL('assets/data.json', root), new URL('public/data/indicadores.json', root));
await copyFile(new URL('docs/inventario.csv', root), new URL('public/docs/inventario.csv', root));
console.log('Datos preparados para publicación estática.');
