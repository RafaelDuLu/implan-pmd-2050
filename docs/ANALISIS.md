# Prueba 1 · Análisis y decisiones

## Insumo y selección

Archivo: `Tablero_ind_estratégicos_2050_Sep2026.xlsx`.
Hojas: `TC Indicadores Lider`, `TC Indicadores por eje` y `Observaciones`.
Inventario: 9 indicadores líderes y 52 por eje. Las filas de formato vacías no cuentan como indicadores.

Para el visor se seleccionaron 31 indicadores por eje. Requisitos: año y valor base, año y valor reciente, meta 2030, unidad explícita y fuente declarada. Se reservaron además registros con observaciones sustantivas en las columnas de línea base o meta de Observaciones, o notas en la columna S de la tabla por eje. Las diferencias de denominación se conservan como notas, sin renombrar automáticamente los indicadores.

| Eje | Incluidos | En el archivo |
| --- | ---: | ---: |
| Sociedad educada, incluyente y con identidad | 4 | 9 |
| Seguridad ciudadana y paz social | 5 | 8 |
| Economía próspera, innovadora y diversificada | 1 | 8 |
| Territorio sustentable y resiliente | 10 | 12 |
| Gestión integral del agua | 1 | 4 |
| Movilidad eficiente, inclusiva y de calidad | 7 | 8 |
| Gobierno abierto e innovador | 3 | 3 |
| Total por eje | 31 | 52 |

La selección es conservadora: una observación de base permanece como pendiente aunque el valor de la tabla parezca haber sido corregido. No se resuelve una discrepancia silenciosamente. Los 21 indicadores reservados y sus motivos están en `inventario.csv`. Los 9 líderes se conservan separados en los datos, sin integrarlos al visor hasta disponer de sus fichas y fuentes completas.

En Agua hay tres filas sin unidad explícita. El formato de porcentaje de sus celdas se conserva en los datos, pero no se utiliza como sustituto de una unidad declarada para incluirlas. La red de línea morada presenta además un valor reciente de 1e-16 y observaciones de comparabilidad; permanece reservada.

## Lectura estadística

- H/I/L contienen valores base, meta 2030 y último valor; G/K contienen sus años. Se preservan los valores originales, incluidas proporciones almacenadas como decimales.
- La conversión de proporción a porcentaje sigue el formato de celda del Excel y solo afecta la presentación. CSV incluye valores originales y presentados.
- La hoja contiene cálculos rotulados «Cumplimiento de meta 2026», pero no incluye una meta explícita para 2026 en esas filas. No se presentan como avance desde la línea base.
- El portal calcula por separado `(último − base) / (meta2030 − base) × 100`, rotulado como cálculo propio. Valores mayores a 100% y negativos se conservan numéricamente. Una barra limitada al tramo 0–100% sirve solo de guía.
- «En sentido favorable» significa que el cambio observado coincide con aumentar o disminuir según F; no equivale a certificar el cumplimiento del ritmo anual requerido.
- No se generan semáforos de desempeño oficial, pronósticos, promedio global, ritmo esperado ni series históricas inexistentes.
- Las referencias se transcriben de Observaciones; no se afirma haber contrastado sus cifras con los tabulados originales. Se requiere esa verificación antes de publicar como portal institucional definitivo.
- El encabezado general del proyecto usa León como contexto. El ámbito estadístico específico de fuentes como ENSU debe validarse en las fichas; el Excel no provee una columna de ámbito por indicador.

## Referencia Gridarco

Inspección directa de `https://gridarco.com/`, con redirección observada a `/es`.

Observado: portada clara con tipografía de gran formato e imágenes integradas; banda oscura que enlaza presentación y navegación; encabezado compacto que acompaña el desplazamiento; proyectos en carrusel; servicios en filas numeradas; cierre oscuro con marca naranja de gran tamaño y detalle de retícula vinculado al puntero.

La visita permitió inspeccionar portada, zona de proyectos, servicios y cierre. No fue una verificación exhaustiva de cada interacción de todas las secciones. No se verificaron la versión móvil, los hovers en todos los componentes ni el mecanismo exacto del barrido entre contorno y relleno. Ese barrido se implementa aquí como decisión original solicitada, sin afirmar que se haya comprobado su funcionamiento en la referencia.

## Adaptación original

1. Portada editorial: título amplio, tipografía del sistema, indicador gráfico de dirección y cierre mediante una regla de metadatos.
2. Cambio de fondo: paso de blanco cálido a tinta para introducir las preguntas de seguimiento; vuelta a fondo claro para el trabajo estadístico.
3. Navegación: siete pestañas persistentes dentro de la zona de consulta. Todas permanecen visibles, también en móvil; flechas, Inicio y Fin operan con teclado.
4. Interacciones de consulta: respuesta inmediata a filtros y selección, entrada discreta de detalle, conservación de fuentes a la vista.
5. Cierre: texto «LEÓN 2050» trazado en contorno con relleno progresivo desde abajo según la posición de scroll. Se revierte al subir. No se usa un logotipo oficial recreado.
6. Accesibilidad: controles nativos, enlace de salto, foco visible, avisos de resultados, tabla desplazable sin columnas fijas, etiquetas SVG accesibles y respeto de movimiento reducido. Sin secuestro de scroll, cursor artificial ni dependencias externas.

El movimiento se concentra en portada, estados interactivos y cierre. La tabla no tiene animaciones de cifras ni cambios automáticos que alteren su lectura.
