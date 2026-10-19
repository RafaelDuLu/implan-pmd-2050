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

## Compilación y publicación: mismo flujo que los boletines

El repositorio `RafaelDuLu/implan-pmd-2050` ya está creado, con los archivos en `main`.

```bash
npm install
npm run build
```

La compilación valida los datos y genera la carpeta publicable `dist/`. No requiere dependencias externas de npm ni cambia las cifras. El origen de los datos es `assets/data.json`; el proceso genera `data.js` automáticamente para la página.

En el proyecto independiente de Cloudflare Pages:

| Campo | Valor |
| --- | --- |
| Repositorio | `RafaelDuLu/implan-pmd-2050` |
| Production branch | `main` |
| Framework preset | `None` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | Vacío |
| Environment variables | Ninguna |

Si el primer despliegue falló por falta de `package.json`, guarda esta configuración y ejecuta un nuevo despliegue del último commit de `main`. No vuelvas a desplegar el commit inicial anterior a la incorporación de la compilación.

Para una carga manual o Apache, ejecuta `npm run build` y entrega solamente el contenido de `dist/`, con `index.html` en la raíz.

## Estructura

| Archivo | Función |
| --- | --- |
| `index.html` | Estructura y contenido de la página |
| `assets/styles.css` | Diseño adaptable, tablas y movimiento |
| `assets/app.js` | Filtros, pestañas, gráficas SVG y CSV |
| `assets/data.js` | Archivo generado automáticamente desde JSON durante la compilación |
| `assets/data.json` | Archivo de datos de origen para actualizar el portal |
| `docs/inventario.csv` | Los 52 indicadores por eje y motivos de inclusión o reserva |
| `docs/ANALISIS.md` | Selección, decisiones visuales y límites |
| `docs/VALIDACION.md` | Comprobaciones realizadas y pendientes |
| `scripts/extract.py` | Extracción reproducible desde el Excel |
| `scripts/verify.cjs` | Comprobaciones de cálculos y formato |
| `package.json` | Comandos npm de compilación y pruebas |
| `scripts/build.cjs` | Genera los datos de navegador y la carpeta `dist/` |

## Actualizar los datos

Conserva el Excel original sin modificar. El extractor requiere Python con `openpyxl` en la computadora de actualización, no en el sitio ni en Cloudflare. Desde esta carpeta:

```bash
python scripts/extract.py /ruta/al/nuevo-archivo.xlsx
npm run build
```

El extractor utiliza las hojas y columnas del Excel actual. Si cambia su estructura, hay que adaptar el mapeo antes de actualizar. Lee los valores almacenados en el libro; si un futuro archivo usa fórmulas nuevas, debe guardarse previamente desde Excel con resultados calculados.

Se regeneran ambos archivos de datos y el inventario. Revisa la selección y las observaciones; luego sube los archivos al repositorio nuevo. Los conteos y las pestañas se actualizan a partir del conjunto extraído. Revisa también los textos de documentación que mencionan el número de indicadores.

Para una actualización manual de valores, edita `assets/data.json` y ejecuta `npm run build`. El archivo `data.js` se regenera automáticamente; no hay que editarlo por separado. En Cloudflare, la compilación realiza ese paso después de cada actualización en `main`.

Para admitir series anuales, nuevos ámbitos o metas 2050 en el visor, amplía el esquema explícitamente. Este libro no permite inventar esos desgloses. Los indicadores líderes tienen metas 2050 distintas de las metas 2030 por eje; no se intercambian.

## Identidad y alcance

Tipografía del sistema y marca tipográfica provisional. Sin Azo Sans, logotipo oficial ni colores presentados como autorizados. Turquesa, tinta, blanco cálido y acento lima como propuesta de diseño.

Repositorio independiente: https://github.com/RafaelDuLu/implan-pmd-2050

La primera versión se encuentra en la rama `main`. Cloudflare Pages se conectará por separado desde la cuenta del propietario; esta entrega no publica en Cloudflare.
