# León se mide · IMPLAN · Visión 2050

Portal de indicadores del Plan Municipal de Desarrollo de León. React modular, CSS propio y datos en JSON. Repositorio exclusivo del PMD: https://github.com/RafaelDuLu/implan-pmd-2050

## Ejecutar y publicar

```bash
npm ci
npm run dev
```

Para Cloudflare Pages o Apache:

```bash
npm run build
```

La salida es `dist/`. Todo funciona en el navegador. No hay servidor de aplicación, API, base de datos, CDN de dependencias, librería de animación ni seguimiento de visitantes.

| Cloudflare Pages | Valor |
| --- | --- |
| Rama | `main` |
| Framework preset | `None` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | Vacío |
| Variables de entorno | Ninguna |

El proceso de despliegue es el mismo usado en Mercado Laboral. Publica el último commit de `main`; reintentar un despliegue de un commit antiguo no incorpora los cambios nuevos. En Apache, copia el contenido de `dist/` a la carpeta pública; las rutas de assets y datos son relativas.

## Componentes

| Archivo | Responsabilidad |
| --- | --- |
| `src/App.jsx` | Carga del JSON, selección del eje e indicador y estados de carga/error |
| `src/components/Hero.jsx` | Portada y escáner operado por `onMouseMove` |
| `src/components/AxisExplorer.jsx` | Siete bloques bento seleccionables; reemplazan las pestañas |
| `src/components/IndicatorExplorer.jsx` | Valores publicados, escenario, control de ritmo y fuente |
| `src/components/GoalTimeline.jsx` | Línea del tiempo de hitos con nodos interactivos |
| `src/components/DataTable.jsx` | Consulta, filtros, ordenamiento y CSV |
| `src/components/SectionTransition.jsx` | Cuatro barridos editoriales reversibles y apertura por eje |
| `src/components/Footer.jsx` | Criterios de lectura, transición cromática y cierre con relleno reversible |
| `src/hooks/useScanner.js` | Coordenadas de ratón, interpolación temporal y una escritura CSS por frame |
| `src/hooks/useScrollScene.js` | Progreso de entrada al viewport, sin estado React por frame |
| `src/lib/indicators.mjs` | Cálculos, evaluación de meta, conversión de unidades y descargas |
| `src/styles.css` | CSS legible, adaptable y con modo de movimiento reducido |
| `assets/data.json` | Único archivo de datos editable |
| `scripts/extract.py` | Extracción desde el Excel sin modificarlo |
| `scripts/prepare.mjs` | Prepara copias públicas de los datos y el inventario |
| `scripts/verify.mjs` | Pruebas matemáticas y de integridad |

## Actualizar los datos

Conserva el Excel original. Si mantiene las mismas hojas y columnas:

```bash
python scripts/extract.py /ruta/al/nuevo-archivo.xlsx
npm run build
```

El extractor necesita Python con openpyxl en la computadora de actualización. Cloudflare no ejecuta Python: recibe el JSON preparado y compila el frontend.

También puedes actualizar manualmente `assets/data.json`. `npm run build` prepara `public/data/indicadores.json`, que se entrega en `dist/data/indicadores.json`. Las copias públicas son generadas y no se editan por separado.

## Línea del tiempo y escenarios

`GoalTimeline` recibe un arreglo de registros con `porcentajeActual`, `metaObjetivo`, `proyeccionFinal`, `sentido`, años, unidad y nombre. Para unidades distintas de porcentaje, se usa `valorActual` y `porcentajeActual` es null. El adaptador `toTimelineRecord` construye ese contrato desde los datos originales.

La proyección no es un valor publicado:

- Cambio anual medio = (valor reciente − valor base) / (año reciente − año base).
- Escenario 2030 = valor reciente + cambio anual medio × factor × (2030 − año reciente).
- Meta ascendente: proyección menor que meta → alerta; igual o mayor → verde.
- Meta descendente: proyección mayor que meta → alerta; igual o menor → verde.

El factor se controla en la interfaz de 0 a 2. Multiplica el cambio, incluido su signo; no altera los datos publicados. Los escenarios porcentuales fuera de 0–100 % se marcan como no evaluables. No se muestra una probabilidad ni se certifica que la meta vaya a cumplirse.

La línea del tiempo muestra hitos en un orden de lectura, no una escala temporal proporcional ni una serie histórica. Solo existen dos observaciones por indicador en el insumo.

El componente puede reutilizarse para empleo informal cuando existan observaciones y una meta documentadas. El Excel actual del PMD no aporta esa combinación para una tasa de informalidad: no se inventaron sus cifras ni se mezclaron repositorios.

## Movimiento y rendimiento

El escáner usa `--mouse-x`, `--mouse-y` y `mask-image: radial-gradient`. El ratón no actualiza estado React. Se usa requestAnimationFrame y una interpolación independiente de la frecuencia: alpha = 1 − exp(−dt / 32 ms). El bucle se detiene cuando la posición se estabiliza o sale el puntero. El efecto se desactiva con movimiento reducido.

El scroll usa eventos pasivos, IntersectionObserver y una sola actualización pendiente por escena. El relleno del cierre llega a 100 % cuando su bloque entra por completo al viewport y se revierte al subir. Los nodos y filtros funcionan con teclado, clic y toque. La tabla no usa columnas fijas ni animaciones sobre cifras.

Los capítulos Explorar, Avanzar, Comparar y Entender superponen dos superficies de contraste completo. Un recorte diagonal revela el fondo y el relleno tipográfico juntos. Su progreso es clamp((0.9 × alto del viewport − borde superior) / (0.65 × alto del viewport), 0, 1). No hay scroll forzado ni bloqueo de rueda. Al subir, el efecto se revierte. Cada eje abre una cortina con su color y nombre durante 1.05 s; cambiar un indicador no la reinicia. Con movimiento reducido, las superficies se muestran completas y la cortina desaparece.

La arquitectura busca respetar un presupuesto de 16.7 ms por frame, pero no se promete 60 FPS constantes sin medir en los dispositivos y navegadores de destino. Consulta `docs/VALIDACION.md`.

## Fuentes y selección

Se conservan 52 indicadores por eje y 9 líderes en el JSON. El visor mantiene los 31 registros seleccionados con información comparable y sin discrepancias sustantivas señaladas. `docs/inventario.csv` documenta los 21 reservados. Los valores, fuentes, años, notas y unidades del Excel permanecen intactos.

Las fuentes fueron transcritas del insumo proporcionado; todavía requieren cotejo externo contra los tabulados originales. No se usa Azo Sans ni logotipo oficial sin los archivos y autorización correspondientes. La marca de navegación es una propuesta tipográfica.
