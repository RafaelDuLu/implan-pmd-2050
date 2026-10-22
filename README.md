# IMPLAN León · Tabuladores Estadísticos

Portal de indicadores del Plan Municipal de Desarrollo Visión 2050. Repositorio independiente: https://github.com/RafaelDuLu/implan-pmd-2050

Interfaz editorial con Mona Sans local, portada en gran formato, banners verdes, directorio por ejes y visor estadístico. React y CSS propio; sin backend, API de aplicación, librería de animación, CDN de dependencias ni analítica.

## Desarrollo y publicación

```bash
npm ci
npm run dev
```

```bash
npm run build
```

La compilación prepara datos, ejecuta las pruebas y genera `dist/` para Cloudflare Pages o Apache.

| Cloudflare Pages | Valor |
| --- | --- |
| Rama | `main` |
| Framework preset | `None` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | Vacío |
| Variables de entorno | Ninguna |

Publica el último commit de main. En Apache, sirve el contenido de `dist/`. Los datos y las fuentes tipográficas se sirven desde el mismo sitio, mediante rutas relativas de producción.

## Organización

| Ruta | Responsabilidad |
| --- | --- |
| `src/App.jsx` | Datos, estado de selección y navegación |
| `src/components/Hero.jsx` | Portada, marca y escáner del puntero |
| `src/components/EditorialBanner.jsx` | Banners con pregunta, contexto y llamada grande |
| `src/components/AxisExplorer.jsx` | Directorio de siete ejes |
| `src/components/AxisSheet.jsx` | Apertura al cambiar de tema |
| `src/components/IndicatorNavigator.jsx` | Menú de temas, búsqueda e índice de indicadores |
| `src/components/ChangeSummary.jsx` | Base, valor reciente y flechas de cambio |
| `src/components/HistoryChart.jsx` | Evolución, Barras, meta y escenario |
| `src/components/GoalTimeline.jsx` | Vista Hitos con nodos consultables |
| `src/components/IndicatorExplorer.jsx` | Visor y control de ritmo |
| `src/components/DataTable.jsx` | Tabla, filtros, ordenamiento y CSV |
| `src/components/Footer.jsx` | Criterios, banner final y rótulo del cierre |
| `src/hooks/` | Puntero, escenas, revelados y pie estacionario |
| `src/styles/` | Foundation, editorial, explorer, data y responsive |
| `src/lib/indicators.mjs` | Cálculos, formato, validación histórica y descargas |
| `assets/data.json` | Datos originales del insumo |
| `assets/histories.json` | Históricos adicionales sujetos a cotejo; actualmente vacío |
| `public/fonts/` | Mona Sans y Mona Sans Mono, licencia y procedencia |
| `scripts/prepare.mjs` | Copias públicas de datos e inventario |
| `scripts/verify.mjs` | Pruebas de integridad y cálculos |

## Datos y actualización

Se preservan 52 indicadores por eje y 9 líderes en el JSON. El visor muestra 31 registros completos, sin discrepancias sustantivas señaladas en el insumo; el inventario explica los otros 21. Las fuentes transcritas requieren cotejo institucional. Las dos observaciones del Excel no se presentan como una serie anual completa.

Si el siguiente Excel conserva sus hojas y columnas:

```bash
python scripts/extract.py /ruta/al/archivo.xlsx
npm run build
```

El extractor usa Python y openpyxl en la computadora de actualización; Cloudflare solo compila el frontend. También se puede editar `assets/data.json`, preservando unidades, fuentes y notas. `public/data/indicadores.json` es una copia generada; no se edita por separado.

Los históricos se incorporan únicamente tras revisión. `docs/HISTORICOS.md` describe fuentes buscadas, límites del cotejo y esquema de validación. No se agregaron cifras sin verificar.

## Lectura estadística

Las flechas ↑/↓ indican si subió o bajó el valor; su color indica si el cambio favorece la meta. Una disminución favorable muestra ↓ verde. Los cambios porcentuales se expresan en puntos porcentuales.

El escenario se calcula con dos observaciones: `(valor reciente − base) / (año reciente − año base)` y se extiende al 2030 multiplicando ese cambio anual por un factor de 0 a 2. No es un pronóstico oficial. El control inicia abierto. No modifica los valores publicados ni el CSV original. Se rechazan escenarios fuera de 0–100 % o de escalas explícitas en la unidad.

El avance del tramo base–meta conserva cifras negativas y mayores a 100 %; la barra solo representa 0–100 %. Las notas en pantalla detallan la metodología.

## Diseño, movimiento y verificación

`docs/RECONSTRUCCION_VISUAL.md` registra el análisis del código fuente de referencia y la reconstrucción de la interfaz. Se retiraron los separadores repetidos. Los banners y el directorio tienen funciones de navegación concretas.

El cierre usa posición sticky solo cuando cabe en el viewport. El banner anterior lo descubre; el relleno se interpola con rAF y se revierte al subir. Al final del documento se completa. En movimiento reducido, el pie fluye normalmente y el rótulo aparece relleno. Las tablas y cifras no se animan.

Los revelados usan IntersectionObserver y transform/opacity; el puntero utiliza variables CSS, una máscara limitada y rAF que se detiene al estabilizarse. No se garantiza una tasa fija de FPS sin medir hardware de destino.

Validación detallada en `docs/VALIDACION.md`. La identidad tipográfica es una propuesta hasta recibir los archivos institucionales autorizados; no se usa Azo Sans ni un logotipo oficial sin autorización.
