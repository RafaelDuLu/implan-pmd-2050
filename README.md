# IMPLAN León · Tabuladores Estadísticos

Primera prueba del monitoreo del Plan Municipal de Desarrollo Visión 2050.
Proyecto independiente: no depende de los boletines ni modifica sus archivos.

## Abrir la prueba

Descomprime el ZIP y abre `index.html` en Chrome, Edge, Firefox o Safari.
No requiere instalación, servidor, API, cuenta ni conexión externa para consultar datos.
Los enlaces a las fuentes sí necesitan internet.

## Contenido

- Siete pestañas por eje, con navegación por teclado y selección mediante clic o toque.
- 31 indicadores seleccionados de 52 indicadores por eje. Los 9 líderes se conservan en el archivo de datos para su integración posterior.
- Búsqueda por nombre o clave, filtros por último año disponible y sentido del cambio.
- Valor base, último valor disponible y meta 2030. Gráfica de dos observaciones y línea de meta que puede ocultarse.
- Cambio en la unidad correspondiente; los porcentajes cambian en puntos porcentuales.
- Avance del tramo base–meta calculado por el portal y explicado en pantalla.
- Tabla del eje con ordenamiento por clave o nombre y descarga del resultado filtrado en CSV. Descarga individual por indicador.
- Fuentes, referencias, hoja y fila de procedencia, notas e inventario de registros reservados.

## Publicar como NUEVO proyecto en Cloudflare Pages

### Opción recomendada: nuevo repositorio GitHub

1. Crea un repositorio nuevo, por ejemplo `implan-pmd-2050`. No uses una rama de los boletines.
2. Sube el contenido descomprimido: `index.html` debe estar en la raíz, junto a `assets/`, `docs/` y `scripts/`.
3. En Cloudflare abre **Workers & Pages → Create application → Pages → Connect to Git** (los nombres pueden variar con el idioma del panel).
4. Selecciona exclusivamente ese repositorio. Usa un nombre de proyecto nuevo, como `implan-pmd-2050`.
5. Rama de producción: `main`. Framework: `None`. Comando de compilación: `exit 0`. Directorio de salida: `.`. Directorio raíz: el del repositorio.
6. Despliega y revisa la dirección `.pages.dev` que Cloudflare te asigne.
7. Los cambios posteriores en `main` generarán nuevos despliegues del portal independiente.

### Alternativa: subir el ZIP directamente

En un nuevo proyecto **Pages → Direct Upload / Upload assets**, asigna un nombre independiente, arrastra este ZIP y despliega. El ZIP ya coloca `index.html` en la raíz.

Cloudflare advierte que un proyecto creado por carga directa no puede convertirse después en uno con integración Git; para esa integración habría que crear otro proyecto. Si quieres mantener GitHub como origen de actualizaciones, elige la primera opción desde el principio.

Documentación oficial consultada el 19 de octubre de 2026:

- https://developers.cloudflare.com/pages/framework-guides/deploy-anything/
- https://developers.cloudflare.com/pages/get-started/direct-upload/

## Estructura

| Archivo | Función |
| --- | --- |
| `index.html` | Estructura y contenido de la página |
| `assets/styles.css` | Diseño adaptable, tablas y movimiento |
| `assets/app.js` | Filtros, pestañas, gráficas SVG y CSV |
| `assets/data.js` | Datos cargables incluso al abrir el HTML localmente |
| `assets/data.json` | Copia legible para integración futura; generada con el mismo extractor |
| `docs/inventario.csv` | Los 52 indicadores por eje y motivos de inclusión o reserva |
| `docs/ANALISIS.md` | Selección, decisiones visuales y límites |
| `docs/VALIDACION.md` | Comprobaciones realizadas y pendientes |
| `scripts/extract.py` | Extracción reproducible desde el Excel |
| `scripts/verify.cjs` | Comprobaciones de cálculos y formato |

## Actualizar los datos

Conserva el Excel original sin modificar. El extractor requiere Python con `openpyxl` en la computadora de actualización, no en el sitio ni en Cloudflare. Desde esta carpeta:

```bash
python scripts/extract.py /ruta/al/nuevo-archivo.xlsx
node scripts/verify.cjs
```

El extractor utiliza las hojas y columnas del Excel actual. Si cambia su estructura, hay que adaptar el mapeo antes de actualizar. Lee los valores almacenados en el libro; si un futuro archivo usa fórmulas nuevas, debe guardarse previamente desde Excel con resultados calculados.

Se regeneran ambos archivos de datos y el inventario. Revisa la selección y las observaciones; luego sube los archivos al repositorio nuevo. Los conteos y las pestañas se actualizan a partir del conjunto extraído. Revisa también los textos de documentación que mencionan el número de indicadores.

No edites solo `data.json`: la página usa `data.js`. Ambos deben salir de la misma ejecución del extractor.

Para admitir series anuales, nuevos ámbitos o metas 2050 en el visor, amplía el esquema explícitamente. Este libro no permite inventar esos desgloses. Los indicadores líderes tienen metas 2050 distintas de las metas 2030 por eje; no se intercambian.

## Identidad y alcance

Tipografía del sistema y marca tipográfica provisional. Sin Azo Sans, logotipo oficial ni colores presentados como autorizados. Turquesa, tinta, blanco cálido y acento lima como propuesta de diseño.

Repositorio independiente: https://github.com/RafaelDuLu/implan-pmd-2050

La primera versión se encuentra en la rama `main`. Cloudflare Pages se conectará por separado desde la cuenta del propietario; esta entrega no publica en Cloudflare.
