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
