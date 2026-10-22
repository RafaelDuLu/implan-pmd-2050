# Reconstrucción editorial · 22 de octubre de 2026

## Fuente revisada

Se analizó el archivo aportado `source-gridarco_com.zip`: HTML `es`, hoja `styles-CY01B2He.css` y bundle `index-BN0zwVSs.js`. Se leyeron el sistema de tokens, las reglas de tipografía y contenedor, la estructura de los banners, los revelados y el controlador del cierre. No se ejecutaron el bundle ni los archivos de analítica incluidos en la captura.

Hallazgos concretos:

- El sitio usa Mona Sans variable y una fuente monoespaciada para metadatos. El tamaño de un título depende de su función y del viewport; no todos los títulos son carteles gigantes.
- El contenedor define un margen compartido y una retícula adaptable de 4/8/12 columnas. Los banners distribuyen pregunta y contexto en columnas distintas y terminan en un enlace de gran formato entre dos líneas.
- Las listas de servicios usan filas con divisores y jerarquías consistentes; la calidad de composición no depende de sumar tarjetas, sombras o gradientes.
- Los revelados se activan al entrar al viewport y contemplan movimiento reducido. El cierre mide si cabe en la ventana para fijarse al borde inferior.
- El relleno del cierre se calcula respecto del borde del contenido anterior y se interpola con requestAnimationFrame; la última posición de la página garantiza el relleno completo.

## Aplicación al portal

Se reconstruyeron portada, encabezado, banners, directorio de ejes, cierre y sistema completo de estilos. Se conservaron los datos y la lógica de consulta que funcionan.

1. Portada clara con cartel en tres líneas, información lateral y geometría técnica original. Escáner de retícula limitado al área del puntero.
2. Banner verde «¿Cómo está cambiando León?» con pregunta, explicación, enlace al visor y llamada grande «Explorar». El banner final «¿Hacia dónde va nuestra ciudad?» termina en «Avancemos».
3. Directorio editorial de siete filas con nombres grandes, descriptores y conteos reales. El hover no cambia sus dimensiones; no produce reflujo por animar padding.
4. Visor oscuro con título de tema, navegación subrayada, índice de indicadores y cifras jerarquizadas. Las gráficas descansan en papel claro, con colores de suficiente contraste para sus trazos.
5. El control de ritmo inicia abierto. La tabla conserva una presentación tranquila, sin animación de filas ni columnas fijas.
6. El banner final descubre un pie estacionario cuando este cabe en el viewport. El rótulo «LEÓN 2050» se adapta al ancho del contenedor, pasa de contorno a relleno, se revierte al subir y completa su relleno al final del documento. Si el pie no cabe, se usa flujo normal.
7. Revelados de portada, preguntas, filas del directorio y encabezados mediante transform/opacity. Filtros, cifras y filas estadísticas permanecen estables. Movimiento reducido desactiva entradas, escáner y fijación del pie.

El CSS se reescribió en módulos: foundation, editorial, explorer, data y responsive. Se retiraron los cuatro separadores intermedios repetidos. Los cambios de tema dentro del visor conservan la posición; desde el directorio se lleva al usuario al visor.

## Tipografía y archivos

Mona Sans es una familia abierta publicada bajo SIL OFL 1.1. Se identificó y recuperó el webfont latino utilizado en la referencia, sin modificarlo, para evitar sustituir su métrica por Arial. Mona Sans Mono proviene del repositorio oficial. Ambos archivos, su licencia y procedencia están en `public/fonts/`. Se sirven desde el mismo sitio; no requieren CDN ni llamadas externas durante el uso del portal.

No se incorporan el logotipo, los textos comerciales, las rutas, los componentes de comunicación ni la analítica de Gridarco. La retícula técnica y los textos corresponden al portal de León. La marca de navegación sigue siendo una propuesta hasta recibir los archivos institucionales autorizados.

## Despliegue

No hay cambios de infraestructura: GitHub independiente, rama main, Cloudflare Pages, `npm run build` y salida `dist`. Los cálculos se realizan en el navegador. `assets/data.json` se conserva sin cambios; el inventario y la investigación de históricos mantienen su alcance previo.


## Ampliación por capas y lente técnica

Las capturas facilitadas muestran un banner que cubre la superficie siguiente y una lente circular que retira el relleno de letras conservando sus trazos de construcción. Se adapta ese principio a las superficies crema, negro y verde del portal.

`useLayerStack` mide las hojas con ResizeObserver. Su posición sticky usa `min(0px, 100svh − altura)`; una hoja larga debe mostrar su parte inferior antes de quedar retenida. Las superficies siguientes tienen un nivel de apilamiento mayor. El banner final termina el conjunto de capas; el pie permanece fuera para descubrirse sin quedar oculto.

`XRayText` separa contorno y relleno con idéntica composición. Una máscara radial sustractiva retira el relleno local; otra revela el contorno y la retícula. `ScannerOverlay` dibuja cruz, guías de ejes, círculo y construcción vectorial. Las coordenadas muestran píxeles locales de la superficie, sin sugerir mediciones estadísticas. `useScanner` interpola con rAF sin estado React por movimiento y detiene el bucle al estabilizarse.

No se usan imágenes para las letras ni vídeos de fondo. El contenido conserva semántica accesible y los controles de datos mantienen su funcionamiento.


## Revisión: cartografía con propósito

Por solicitud del usuario se retiran todas las líneas instrumentales del escáner. El componente ScannerOverlay deja de formar parte del proyecto. En vez de construcción geométrica decorativa, la portada presenta el contorno real de León y revela la capa vial oficial de INEGI dentro de la lente. El encabezado y la portada vuelven a negro con verde fosforescente. Los banners, las tablas y las transiciones por capas conservan su estructura.

LeonMap usa dos recursos locales alineados. La lente hereda las coordenadas del puntero de la portada y resta el desplazamiento del mapa, medido con ResizeObserver. El botón de revelado permite consultar todas las vialidades sin ratón; el estado no afecta datos ni filtros. El código de preparación cartográfica está separado de la compilación de Cloudflare.
