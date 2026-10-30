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
