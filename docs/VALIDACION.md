# Validación de la reescritura React

## Comprobaciones realizadas

- `npm run build`: preparación de datos, 11 pruebas matemáticas e integridad, compilación Vite a `dist`.
- Pruebas de metas ascendentes y descendentes, igualdad exacta, avance negativo y mayor a 100 %, porcentaje frente a puntos porcentuales, periodos incomparables y límites de escenarios porcentuales.
- Casos reales: Economía 3.1.3 proyecta 19.696 % frente a meta de 33.5 % y queda en alerta. Agua 5.3.1 proyecta 119.375 litros con el ritmo observado frente a meta de 115; al duplicar la reducción anual proyecta 112.05 y cambia a verde. Fecundidad 1.5.2 evalúa correctamente una reducción como favorable.
- Verificación de que el explorador de escenarios no modifica el registro original.
- Renderizado React en Node de los 31 detalles de indicador, los siete ejes con sus tablas, la portada y el cierre, sin excepciones.
- Comparación de base, año, último valor, meta, unidad y fuentes con la versión anterior: sin cambios numéricos.
- Recursos publicables locales, sin trackers, CDN ni llamadas de servidor. El único fetch de la aplicación es el JSON del propio sitio.
- Retirada de la interfaz anterior y de los marcadores de desarrollo en los textos visibles.

## Límites de comprobación

No estuvo disponible el controlador de vista previa exigido por este entorno. No se inició un navegador alternativo de pruebas ni se simuló una validación visual. El renderizado en Node y la compilación comprueban estructura y ejecución inicial, pero no sustituyen la revisión real de layout, interacción, teclado y movimiento en navegador.

No se ha medido un perfil de FPS en hardware de destino. La implementación usa rAF, eventos pasivos, actualizaciones CSS sin rerenders por movimiento y detención del bucle cuando no hay movimiento. El coste de una máscara depende de GPU, resolución y navegador: 60 FPS estables se deben medir, no dar por garantizados.

## Revisión sobre el despliegue

1. Mover el ratón en portada: la retícula debe seguir el movimiento y desaparecer al salir; no debe moverse por sí sola.
2. Elegir los siete ejes por clic/toque y abrir sus indicadores. Confirmar que no hay cifras cortadas a 390 px, 768 px y escritorio con zoom al 150 %.
3. Abrir Agua, activar escenario y mover el factor de 1 a 2: el aviso debe pasar de alerta a verde sin cambiar el último valor publicado.
4. Seleccionar los nodos con ratón y teclado. Verificar que se actualiza su explicación.
5. Probar búsqueda, filtros, estado sin resultados, ordenamiento, descarga individual y consulta CSV.
6. Desplazar la tabla en móvil: no debe existir ninguna columna fija que tape datos.
7. Subir y bajar en el cierre: el rótulo debe llenarse y vaciarse; al mover el ratón debe revelar su retícula.
8. Activar movimiento reducido: sin entrada animada, sin escáner y cierre relleno.

La configuración sigue siendo Cloudflare Pages: `npm run build`, salida `dist`, rama `main`, framework None. El despliegue requiere el nuevo commit de la reescritura.


## Transiciones por capítulo · 22 de octubre de 2026

- Compilación de producción y las 11 pruebas de integridad y cálculos: aprobadas.
- Revisión visual en Chrome, viewport 1363 × 936: portada, barrido diagonal con relleno de tipografía y continuidad hacia categorías.
- Reversibilidad comprobada mediante desplazamiento real: progreso 1 → 0.8148 → 0.5074, con captura del contorno parcialmente relleno.
- Cambio de Agua a Territorio: un único encabezado y visor montado, cortina finalizada y foco en el título correcto. Se corrigieron claves React compartidas entre visor y tabla durante esta comprobación.
- Búsqueda «biodiversidad» en Territorio: una fila, clave 4.1.1, conservando base 67, dato 79 y meta 85. Sin desbordamiento horizontal del documento en este viewport.
- Las superficies decorativas duplicadas se ocultan de accesibilidad; un solo texto alternativo describe cada paso.
- Sin dependencias nuevas ni cambios en datos, cálculos o CSV.
- Pendiente verificar físicamente en teléfonos, Safari y zoom 150 %; los controles de esta sesión no permitieron cambiar el viewport o confirmar ese zoom. Se incorporaron reglas para pantallas pequeñas y movimiento reducido, sin presentarlas como una medición en esos dispositivos.


## Negro y verde, navegación y gráficas · 22 de octubre de 2026

- Compilación y 14 pruebas aprobadas, incluidas la separación de dirección/favorabilidad y la admisión segura de históricos.
- Chrome escritorio (1363 px): siete temas visibles, un solo visor, tres barras al elegir Barras y tres nodos al elegir Hitos.
- Agua: flecha ↓ verde para −2.93 litros/persona. Factor 1: escenario 119.38 y alerta; factor 2: escenario 112.05 y estado favorable. El dato reciente permanece 126.7 en resumen y gráfica.
- Revisión responsive con un marco de navegación real de 390 × 844 px (375 px de contenido tras la barra del navegador): se activan los media queries móviles, sin desbordamiento horizontal del documento. No equivale a una prueba física de teléfono.
- En ese ancho: menú Cambiar indicador → búsqueda «densidad» → indicador 4.1.3; el menú se cierra, aparece ↓ y la gráfica queda dentro de su región desplazable (302 px, SVG de 520 px). Se verificó la vista Barras visualmente.
- El arnés responsive se retiró después de la revisión; no forma parte del código entregado.
- Las cifras históricas adicionales siguen pendientes del cotejo descrito en HISTORICOS.md. No se hicieron mediciones de FPS en hardware móvil ni prueba física en Safari.

- Se respetan también los límites explícitos de unidades «Escala 0 - 112» y «Escala 0 - 10»: un escenario que sale de ellos queda no evaluable.

## Reconstrucción editorial completa · 22 de octubre de 2026

- Nueva portada clara, banners con pregunta/contexto/llamada grande, directorio de filas y cierre estacionario. El CSS anterior se reemplazó por cinco módulos, sin acumular overrides. Los separadores repetidos se retiraron.
- Se recuperó el webfont Mona Sans identificado en la fuente de referencia y se agregó Mona Sans Mono, con licencia OFL y procedencia en public/fonts. Carga verificada en Chrome. Producción reescribe sus URLs a ../fonts/; no hay CDN de tipografía.
- Escritorio de 1363 px: portada, banner de entrada, visor de Agua y cierre revisados visualmente. Sin desbordamiento horizontal. El cierre completo llegó a --scene=1; al subir se observó --scene=0.348 y retorno al contorno mientras el banner lo cubre.
- Se revisó la adaptación mediante marcos reales de navegación de 390, 768 y 1024 px, no mediante recortes de una captura de escritorio. En 390 px (375 px de contenido tras scrollbar): portada sin recortes y menú Cambiar indicador → búsqueda «densidad» → indicador 4.1.3, con cierre del menú, flecha ↓ y un solo visor.
- Se verificaron individualmente los siete cambios de tema en el ancho de tableta: Sociedad, Seguridad, Economía, Territorio, Agua, Movilidad y Gobierno. Al cambiar de tema desde el menú ya no se fuerza un desplazamiento hacia la cabecera. Desde el directorio sí se lleva al visor.
- En 1024 px: documento sin desbordamiento, cierre fijado al borde inferior, relleno completo al terminar la página. Se redujo la escala del rótulo para conservar todas las letras; ancho de texto 873.23 px dentro de 888 px disponibles.
- Agua, factor 2: escenario 112.05, estado favorable, dato reciente 126.7 sin cambios y flecha ↓. El control inicia abierto en la nueva interfaz.
- Compilación de producción y las 14 pruebas de integridad y cálculos aprobadas después de retirar el arnés responsive. El arnés no se entrega ni forma parte del repositorio.
- Los valores de assets/data.json se conservan. Los históricos siguen sujetos al cotejo documentado en HISTORICOS.md. No se afirma prueba física en teléfonos/Safari, zoom real del navegador al 150 % ni una medición de FPS en hardware de destino.


## Capas y escáner de construcción · 22 de octubre de 2026

- Escritorio 1363 × 936: el banner verde cubre progresivamente la portada; las hojas largas del visor y directorio conservan su recorrido antes de superponerse. El cierre queda fuera del conjunto de capas para poder descubrirse al final.
- Territorio → búsqueda «residuos»: tres registros, incluido el último 4.5.2, accesibles sin capas que tapen renglones. Documento sin desbordamiento horizontal.
- Marco real de 390 × 844 (375 px útiles): misma búsqueda con tres registros, tabla con desplazamiento horizontal propio y documento sin desbordamiento. Cierre accesible al final. El marco no equivale a una prueba física táctil.
- Escáner comprobado mediante interacción real en portada y cierre: máscara circular sustractiva sobre relleno, contorno conservado, cruz, retícula, diagonales y coordenadas locales actualizadas. El cursor nativo se oculta únicamente sobre superficies activas con puntero preciso.
- Sin cambios en cifras, históricos, cálculos o CSV. Sin dependencias adicionales. Movimiento reducido elimina las capas fijas y el escáner. Sin medición de FPS ni validación física en Safari.


## Corrección del instrumento en portada

- El escáner pertenece ahora a toda la sección hero, no solo al texto. Las guías horizontal y vertical abarcan 1348 px de ancho y toda la altura de la portada en el viewport de revisión.
- Interacción en (450, 360) de pantalla: coordenadas locales X0450 / Y0260; máscara del título alineada mediante sus desplazamientos X80.41 / Y96 respecto al hero. El relleno desaparece localmente y el contorno permanece visible.
- Movimiento fuera del título a (900, 170): lectura X0900 / Y0070 sin perder la cruz. Al salir al encabezado, data-scanning vuelve a false.
- Se añaden marcas de regla en los ejes, cruz de mayor tamaño y coordenadas con fondo contrastado. Sin halo verde sobre las letras. ResizeObserver mantiene el origen del título alineado al ajustar ancho o cargar fuentes.
- Compilación y las 14 pruebas aprobadas. Datos, filtros, cálculos y exportaciones sin cambios. Esta revisión visual corresponde a Chrome de escritorio; no se realizó una medición de FPS.


## Portada negra y mapa municipal de León · 22 de octubre de 2026

- Se retiró el componente ScannerOverlay y las guías X/Y, reglas, coordenadas, retículas, vectores decorativos y cuadrículas de banners y cierre. El efecto de letras conserva únicamente la transición de relleno a contorno.
- Portada y encabezado en negro y verde fosforescente. El mapa del municipio 11020 se muestra a la derecha en escritorio y debajo del título en móvil.
- Cartografía descargada del servicio oficial INEGI: límite municipal y 58,522 segmentos de vialidad; metadatos del insumo indican Marco Geoestadístico diciembre de 2025. Origen y hashes registrados en public/maps/fuentes.json. Se incluyen las vialidades disponibles en ese servicio, sin afirmar cobertura exhaustiva.
- Ambas capas usan idéntica proyección y extensión; las calles se recortan al contorno municipal. El SVG del contorno pesa 51.9 KB; la capa de calles WebP transparente a 1280 × 1280 pesa 272.7 KB. No hay solicitudes a servicios cartográficos externos al navegar ni librería de mapas.
- Chrome de escritorio: contorno visible sin interacción; al situar puntero sobre la trama urbana aparece una máscara radial local de 112 px. Cero elementos de guías o rejillas en el DOM; documento sin desbordamiento horizontal.
- Marco real de 390 × 844 (375 px útiles): mapa de 331 px, documento sin desbordamiento; activar «Revelar calles» con Enter cambia aria-pressed a true y muestra toda la capa (opacity 1, mask none). Las dos imágenes cargan correctamente. Este marco no equivale a una prueba física de teléfono.
- Movimiento reducido y puntero táctil conservan el botón explícito, sin necesitar hover ni animación. No se modificaron datos estadísticos ni cálculos.
- El arnés temporal de revisión móvil se retiró del archivo main.jsx antes de compilar y entregar. No se midió FPS en hardware de destino.
