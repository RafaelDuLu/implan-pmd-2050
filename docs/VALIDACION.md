# Validación de la prueba 1

## Realizado

- Lectura de las tres hojas del libro y de los formatos de sus celdas.
- Inventario de 52 indicadores por eje y 9 líderes. Selección reproducible de 31 registros, con exclusiones documentadas.
- Comparación de cada valor extraído (base, reciente, meta y años) con su celda de origen.
- Verificación de sintaxis JavaScript.
- Pruebas de avance hacia metas ascendentes y descendentes, retrocesos, metas superadas y base igual a meta.
- Pruebas con los datos reales de viviendas con agua y dotación diaria de agua.
- Pruebas de conversión de proporciones a porcentajes, cálculo de puntos porcentuales, valores faltantes y escape de comas/comillas/saltos en CSV.
- Igualdad entre `data.js` y `data.json`, claves únicas, presencia de indicadores en los siete ejes, consistencia de la selección y existencia de archivos enlazados.
- ZIP con `index.html` en raíz y sin dependencias externas, secretos, archivos de otros proyectos ni copia del Excel original.

## Verificación visual pendiente

No estuvo disponible el controlador de vista previa requerido por este entorno. Por ello no se pudo ejecutar la revisión visual del portal en un navegador, ni certificar su comportamiento real en computadora, móvil, teclado o zoom de 150%. La inspección de Gridarco se hizo en otro navegador disponible; ese navegador no sustituye la vista previa del desarrollo local.

Se implementaron reglas adaptables para móvil, tableta y escritorio, tabla con desplazamiento horizontal sin columnas fijas, controles táctiles y modo de movimiento reducido. Estas implementaciones requieren la siguiente comprobación sobre el primer despliegue:

1. En escritorio, abrir cada pestaña y elegir al menos un indicador; contrastar valores con el Excel.
2. Buscar una palabra con y sin acento, filtrar año y cambio, y comprobar el estado sin resultados.
3. Descargar un indicador y una consulta filtrada; abrir el CSV con codificación UTF-8.
4. Ocultar y mostrar la meta, probar referencias de fuente y revisar las notas.
5. En un teléfono o emulador de 390 px y tableta de 768 px, abrir todos los controles y desplazar la tabla horizontalmente.
6. En escritorio al 150%, comprobar que no se pierde información ni se superponen controles.
7. Navegar con Tab y flechas en las pestañas; verificar foco y lector de pantalla si está disponible.
8. Activar movimiento reducido: debe detener las entradas y mostrar el cierre relleno sin depender del scroll.
9. Desplazarse hacia arriba y abajo en el cierre para verificar el relleno reversible de «LEÓN 2050».

El código se entrega en el repositorio independiente `RafaelDuLu/implan-pmd-2050`, rama `main`. El despliegue en Cloudflare Pages queda a cargo del propietario. El README incluye la configuración.
