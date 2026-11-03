# Simulación de ritmo y prioridades editoriales

El control escala el cambio anual medio entre las dos observaciones del insumo. La posición 0 mantiene el último dato; 1 conserva el cambio observado; 3 lo triplica. Invertir tendencia cambia su signo, sin modificar los datos. El año mostrado es el primer año entero igual o posterior al cruce de la meta pendiente, siempre que el escenario se mantenga dentro de la escala al horizonte. No se inventa un año histórico para metas ya alcanzadas. Las prioridades de sostenimiento corresponden al cumplimiento real, con advertencia dinámica si la simulación lo pone en riesgo.

Las prioridades son sugerencias editoriales para evaluación, no recomendaciones presupuestales, garantías de cumplimiento ni una cuantificación causal de efectos. Son específicas para el significado de cada indicador. Algunas son criterios de interpretación: menos llamadas no prueba menos violencia; menor dotación no debe lograrse reduciendo acceso; menor disposición final no debe deberse a recolección insuficiente; una cuota económica depende también del denominador estatal.

Referencias de contexto consultadas el 30 de octubre de 2026: proyectos estratégicos y prioritarios de https://www.leonplan2050.gob.mx/eje-1/, /eje-2/, /eje-3/, /eje-4/, /eje-5/, /eje-6/ y /eje-7/. El archivo src/lib/indicator-actions.mjs contiene redacción propia que interpreta esos temas y el indicador; no transcribe un catálogo oficial de medidas por indicador.

Por solicitud del usuario, las fuentes y metodología no se muestran como secciones de la interfaz. Permanecen las referencias originales en assets/data.json y las exportaciones CSV. Los valores de origen siguen pendientes del cotejo institucional documentado previamente, incluida la comparabilidad temporal del indicador 3.1.3.

## Lectura concreta del ritmo

`pace-context.mjs` traduce el cambio anual del mismo escenario a una frase para cada uno de los 31 indicadores. La segunda frase convierte el ritmo requerido a 2030 con el mismo criterio. Ambas parten del último año del dato. Los porcentajes de población, viviendas, vehículos y trámites se normalizan por cada 1,000 unidades de su universo; no son conteos de León ni personas identificadas. No hay denominadores poblacionales absolutos validados en el insumo.

Escolaridad: un incremento de 0.064 años promedio equivale, manteniendo constante la población de referencia, a 64 grados escolares adicionales por cada 1,000 personas de 15 años y más. Una distribución equivalente sería que 64 de ellas completaran un grado más. No implica que deban reincorporarse exactamente 64 personas: matrícula, permanencia, grados completados y cambios de composición poblacional son distintos. La frase se identifica como equivalencia.

Otras conversiones: minutos × 60 a segundos; km × 1,000 a metros; kg por persona y día × 1,000 a gramos; proporción de días × 365 a días equivalentes en un año normalizado. Se mantienen unidades originales para tasas e índices cuando no permiten traducir a personas o infraestructura. Las cifras pueden ser fracciones al tratarse de ritmos promedio, no conteos observados. Cero representa pausa; datos inválidos no generan equivalencias; un escenario fuera de escala no muestra una mejora interpretable. Las prioridades de actuación siguen siendo sugerencias, sin atribuir efectos cuantificados a una intervención.

## Escala individual y comienzo en cero · noviembre de 2026

Cada detalle inicia y se restablece en 0×: el escenario conserva el último dato hasta 2030. No se presenta como continuación del ritmo observado. El esfuerzo requerido a 2030 permanece destacado y fijo mientras se explora el ritmo, pues cambiar el control no cambia la brecha real.

`paceProfile` calcula la magnitud anual observada con los años propios de cada indicador y divide el esfuerzo requerido entre esa magnitud. El punto seleccionable necesario se redondea hacia arriba al siguiente 0.01×, para que alcanzarlo no deje el escenario por debajo de la meta. El máximo individual es el mayor entre 3× y el entero superior a 1.25 veces ese punto. Así densidad requiere 4.19× y admite 6×; economía requiere 3.16× y admite 4×. Los demás conservan un margen suficiente y su punto necesario propio. El marcador 2030 indica ese punto; la dirección vertical sigue la meta ascendente o descendente. No es una estimación del efecto de acciones públicas.

Para un histórico sin cambio, la referencia explícita de 1× es el esfuerzo necesario a 2030 (no una tasa observada inventada). Las metas ya cumplidas muestran las prioridades para sostener el resultado, sin inventar una exigencia adicional. La fecha de cruce y la gráfica usan exactamente el mismo cambio anual simulado. Los límites de escala originales siguen impidiendo interpretar escenarios imposibles.

El semáforo de la lista mantiene su criterio editorial de recuperación de hasta 3× y la alerta de retroceso de un tramo completo; es un umbral comparativo, independiente del máximo ahora individual de cada control. Ampliar el rango no reclasifica una alerta como éxito.
