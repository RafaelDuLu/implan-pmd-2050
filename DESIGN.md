# Portal de tabuladores · Plan León 2050

Identidad homologada el 30 de octubre de 2026 con https://www.leonplan2050.gob.mx/ejes/ y sus clases mini-eje1-card a mini-eje7-card en all.css?6526.

| Eje | Color oficial | Variable oficial |
|---|---|---|
| Sociedad | #F9C217 | swatch-var-5957 |
| Seguridad | #00B8A3 | swatch-var-3835 |
| Economía | #A82167 | swatch-var-374 |
| Territorio | #FF8201 | swatch-var-779 |
| Agua | #4FB348 | swatch-var-5405 |
| Movilidad | #2B3990 | swatch-var-2823 |
| Gobierno | #0194FE | swatch-var-5014 |

Modo: portada y banners de presentación; directorio y consulta orientados a operación. Mantener la tipografía local Mona Sans y vectores existentes, la lente cartográfica, las capas de desplazamiento nativo y las aperturas de 2.2 s. Fondos blanco frío y azul carbón, sin secciones verde neón. Nombres oficiales completos en el panel y etiquetas breves en navegación. El número del eje es parte de la clasificación oficial.

El color identifica el eje en el directorio, navegación, títulos, barra de avance y apertura; variantes claras sobre superficies oscuras y tintas suaves en superficies claras garantizan legibilidad. Las señales favorable y desfavorable son independientes del eje. Las siete imágenes originales del sitio oficial se guardan sin alterar en public/axes/official y se muestran completas en el directorio y encabezado del eje. El menú y el encabezado utilizan el fondo exacto del eje, con texto oscuro o blanco según contraste. La apertura solo muestra el nombre y el color oficial, sin fotografías ni dependencia de su descarga.

Implementación estática, fuentes, datos e imágenes locales, sin servicios externos durante la navegación. Preservar los datos y advertencias metodológicas, CSV, controles de escenario, teclado, móvil y movimiento reducido.

## Consulta en dos niveles

Al seleccionar un eje se muestra AxisOverview: una fila interactiva por indicador con valor base, último dato, avance del tramo base–meta y meta 2030. El porcentaje usa la función de avance existente, conserva retrocesos y valores superiores a 100 %, y solo acota la línea visual. Las unidades se muestran sin mezclar magnitudes. Incluye búsqueda del eje y explicación desplegable.

Al seleccionar una fila o un indicador de Datos abiertos se monta el análisis detallado existente con gráfica, navegación y ritmo. Volver al avance del eje restaura el foco en la fila elegida. Cambiar de eje siempre vuelve al resumen; la apertura de color se ejecuta únicamente por eje.

## Análisis de cumplimiento

El detalle se lee a ancho completo, sin lista lateral de indicadores ni control multiplicador. Presenta base, último dato y meta una sola vez; una gráfica de observaciones, continuación lineal y meta; y un diagnóstico de año de cumplimiento y cambio anual necesario a 2030. Volver al resumen permite escoger otro indicador. Los colores de identidad no sustituyen una evaluación causal.

El módulo goal-plan.mjs distingue meta cumplida en el último dato (sin fechar retrospectivamente el cruce), tendencia favorable con año futuro de cruce redondeado hacia arriba, tendencia inmóvil, tendencia contraria y datos no evaluables. La exigencia anual parte del último año del dato y no del reloj del navegador. En porcentajes se expresa en puntos porcentuales por año. No se sugieren políticas causales desde dos observaciones. Se conservan fuentes, notas de cotejo de periodos y limitaciones.

## Simulador y prioridades por indicador (revisión)

Se restituye el control de 0× a 3×, con inversión explícita opcional de la dirección y restablecimiento. La gráfica y el año simulado usan exactamente el mismo multiplicador. Nunca se alteran la base, el último dato ni la meta. No se visualizan escenarios fuera de escala. La condición de meta ya alcanzada corresponde al dato real, no al resultado hipotético del control.

Se eliminan de la presentación las fuentes, notas, bloques metodológicos y columna de fuente. La trazabilidad y referencias permanecen en los datos locales y CSV. El único rótulo de interpretación persistente es «Escenario simulado». Se reemplazan consejos tautológicos por prioridades editoriales específicas para los 31 indicadores: cerrar brechas o sostener los resultados. No se presentan como acciones suficientes, causalidad comprobada o medidas oficiales obligatorias. El control modifica el ritmo matemático; no estima el efecto de esas acciones.

## Sentido del ritmo y consulta en pantalla

Control vertical: en metas descendentes 0× arriba y 3× abajo; en ascendentes 3× arriba y 0× abajo. Las flechas de teclado siguen esa orientación y la lectura usa la dirección real del cambio, por lo que una tendencia contraria sigue siendo identificable y puede invertirse explícitamente. El cálculo permanece inalterado.

Encabezado, valores, gráfica y prioridades se compactan en escritorio. En anchos de hasta 1050 px se alternan Gráfica y Ritmo y acciones mediante controles accesibles; no se ocultan definitivamente contenidos ni se recorta texto. Se mantiene desplazamiento nativo para pantallas pequeñas, zoom o textos largos. Volver a los indicadores usa un botón sólido, de ancho completo en teléfono.
