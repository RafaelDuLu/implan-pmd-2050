# Históricos y cotejo de fuentes · 22 de octubre de 2026

Las gráficas iniciales usan exclusivamente las dos observaciones del Excel y su meta. El tramo al 2030 es un escenario explícito, vinculado al control de ritmo. No se generaron observaciones anuales, ni se unieron periodos de ámbitos distintos.

## Búsqueda oficial realizada

| Fuente consultada | Resultado | Decisión |
| --- | --- | --- |
| INEGI, Censos Económicos 2024, resultados definitivos, reporte 22/25, 24 de julio de 2025, p. 2 | Ficha metodológica: levantamiento 2024; referencia económica 2023. La página del programa se identifica correctamente, pero no expuso sus tabulados al lector de esta sesión. | Mantener intacto el Excel y señalar en la gráfica de 3.1.3 que los años 2019/2024 requieren cotejo antes de ampliar la serie. No reinterpretar automáticamente esos años como observaciones económicas. |
| INEGI, ENSU, página del programa | Se localizó la página oficial, pero no se obtuvo una serie descargable y cotejada con la definición exacta de los indicadores 2.3.3 y 4.3.1. | No mezclar inseguridad general con seguridad en calles o espacios públicos, ni ciudades con municipios. |
| SAPAL, sitio oficial | La consulta no pudo completarse. Búsquedas encontraron también SEAPAL de Puerto Vallarta, que no corresponde a León. | No incorporar datos de otro organismo ni confundir dotación con consumo. |
| Municipio de León, acta de 12 de agosto de 2021 | El índice de búsqueda refiere escolaridad 9.2 en 2015 y 9.75 en 2020. La apertura del PDF falló; la descarga directa devolvió 503. | Referencia candidata solamente. No agregar cifras a la serie hasta revisar el documento completo y su ámbito. |

Referencias:

- https://www.inegi.org.mx/programas/ce/2024/
- https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2025/ce/CE2024_def_RR.pdf
- https://www.inegi.org.mx/programas/ensu/
- https://www.sapal.gob.mx/
- https://apps.leon.gob.mx/transparencia/sistemas/archivos/actas/2021-08-12.pdf

## Incorporación posterior

`assets/histories.json` separa los históricos del Excel original. `series` se indexa por clave de indicador. Actualmente está vacío: no hay una serie adicional presentada como validada.

Cada entrada debe contener `validated: true` tras cotejo institucional, `unit` exactamente igual al indicador original, `geography` con el ámbito preciso, `source: {name, url}` con URL HTTPS y `observations: [{year, value}]`. Los porcentajes se almacenan como fracción, igual que en el archivo original. Deben coincidir definición, universo, desagregación, cobertura temporal y geográfica. Las cifras publicadas se transcriben, sin recalcularlas si ya están disponibles.

El validador rechaza la serie adicional completa si hay unidades distintas, años repetidos, valores no finitos, años posteriores al último dato, porcentajes fuera de 0–1 o conflictos con los valores base/reciente del Excel. Conserva siempre esas dos observaciones originales. Los puntos aceptados se ordenan por año; su fuente y ámbito se muestran bajo la gráfica. No se interpola ni rellena un año sin observación.

La incorporación de históricos no cambia automáticamente el modelo del control de ritmo, que sigue siendo la extrapolación de los dos puntos base y reciente y se explica en pantalla. Un futuro modelo de tendencia con más observaciones requiere definición y validación específicas.
