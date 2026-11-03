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

## Protección de lectura al abrir indicadores

AxisSheet y Datos abiertos quedan fuera del sistema de hojas sticky. Ambas secciones conservan flujo normal y altura de contenido: la tabla siempre comienza después del análisis completo. Las capas se mantienen en portada, directorio y cierre. Se evita el desplazamiento duplicado desde la tabla al detalle; la navegación central de App realiza el único scroll. Se desactiva el anclaje automático en las dos superficies variables y se reserva margen superior al abrir el indicador.

## Orientación automática del escenario

Se retira el botón de inversión. La dirección de cada meta (A/D) define automáticamente el control y el signo del escenario. Cuando la variación observada va en sentido contrario, solo se invierte la proyección hipotética, manteniendo intactos base, dato reciente, meta y línea histórica. La interfaz identifica ese caso como «Escenario de mejora · el cambio observado va en sentido contrario». 0× mantiene el último dato, y una serie inmóvil no adquiere un ritmo inventado. Restablecer vuelve a 1× en la orientación automática.

## Lista completa y semáforo de avance · noviembre de 2026

La consulta inicial reúne los 31 indicadores, agrupados por eje en el orden oficial. Cada grupo comienza con su nombre completo y una línea del color institucional. El directorio ya no abre una transición: desplaza y enfoca el encabezado correspondiente dentro de la lista. Elegir cualquier fila o barra abre el ritmo del indicador y su eje correcto; volver restaura el foco en esa fila. Se conserva Datos abiertos para consulta y exportación.

Las filas muestran nombre, un único porcentaje de avance y semáforo, sin repetir base, valor actual ni meta. Barra divergente con escala compartida −100…100, base al centro y proporción lineal idéntica a ambos lados. Los valores fuera de escala conservan su cifra real y utilizan trama con flecha de continuación, nunca se normalizan por fila ni desbordan la pantalla. Tintes sobrios en toda la fila, texto de estado y señal de advertencia complementan el color.

Semáforo editorial, no oficial: verde si ya se cumple la meta o el ritmo observado permite llegar a 2030; rojo si el retroceso alcanza o supera el tramo completo base–meta (avance ≤−100 %) o si no basta el escenario de mejora máximo de 3×; amarillo en el resto cuando el escenario de mejora de hasta 3× llega a 2030. Este último puede requerir invertir la tendencia observada. No equivale a viabilidad técnica o presupuestaria. Gris cuando no se calcula el avance. Los límites y sentido del indicador, el último año disponible y los cálculos de origen se conservan. La clasificación no cambia al manipular el simulador del detalle.

La apertura del detalle se limita al botón con borde «Ver detalles». El nombre, la barra y el resto de la fila son informativos y no interactivos. El botón conserva el foco al volver y permanece visible en móvil.
