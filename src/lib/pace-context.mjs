import { isNumber, number } from './indicators.mjs';

// Normalized equivalents, never municipal headcounts or estimates of policy effects.
// Fractions are retained: rounding a small annual change to zero hides its meaning.
const n = value => {
  const v = Math.abs(value);
  return v > 0 && v < .01 ? 'menos de 0.01' : number(v,2);
};
const perThousand = (change, subject) => `${n(change*1000)} ${subject} por cada 1,000, al año`;
export const paceContexts = {
 '1.1.2': x => perThousand(x,'viviendas adicionales con agua entubada'),
 '1.3.2': x => `Equivale a ${n(x*1000)} personas de cada 1,000 de 15 años y más completando un grado escolar adicional al año`,
 '1.5.1': x => perThousand(x,'personas adicionales afiliadas a servicios de salud'),
 '1.5.2': x => `Reducir cada año en ${n(x)} los nacimientos por cada 1,000 adolescentes de 15 a 19 años`,
 '2.1.2': x => `Recortar ${n(x*60)} segundos al tiempo de atención a emergencias cada año`,
 '2.2.1': x => `${n(x*1000)} llamadas menos por violencia familiar por cada 1,000 llamadas procedentes al 911, al año`,
 '2.3.2': x => `${n(x*1000)} llamadas procedentes adicionales por cada 1,000 llamadas al 911, al año`,
 '2.3.3': x => perThousand(x,'personas adultas más que se sienten seguras en sus calles'),
 '2.4.1': x => `${n(x*1000)} víctimas menos sin denunciar por cada 1,000 víctimas, al año`,
 '3.1.3': x => `Ganar $${n(x*100)} de aportación de León por cada $100 de valor agregado estatal, al año`,
 '4.1.1': x => `Sumar ${n(x)} puntos al índice de biodiversidad urbana cada año`,
 '4.1.2': x => `${n(x*1000)} hectáreas ocupadas adicionales por cada 1,000 hectáreas urbanas, al año`,
 '4.1.3': x => `Elevar la densidad en ${n(x)} habitantes por hectárea urbana cada año`,
 '4.2.1': x => `Mejorar ${n(x)} puntos al año la evaluación de parques y jardines, en su escala de 10`,
 '4.3.1': x => perThousand(x,'personas adultas más que se sienten seguras en espacios públicos'),
 '4.3.2': x => perThousand(x,'vehículos adicionales verificados'),
 '4.3.4': x => `Ganar el equivalente a ${n(x*365)} días con buena calidad del aire cada año`,
 '4.4.1': x => `Recuperar ${n(x)} toneladas adicionales de residuos para valorización cada año`,
 '4.4.2': x => `Reducir en ${n(x)} toneladas el volumen de residuos enviado a tratamiento y disposición final cada año`,
 '4.5.2': x => `Reducir en ${n(x*1000)} gramos la basura diaria por persona cada año`,
 '5.3.1': x => `Reducir en ${n(x)} litros la dotación diaria por habitante cada año, preservando el acceso al agua`,
 '6.1.1': x => `Cerrar ${n(x*1000)} metros del déficit de banquetas cada año`,
 '6.1.2': x => `Sumar ${n(x*100)} puntos porcentuales a la conectividad de las ciclovías cada año`,
 '6.2.1': x => `Sumar ${n(x)} personas usuarias a la demanda diaria del transporte público cada año`,
 '6.2.2': x => perThousand(x,'personas adultas más que se sienten seguras en el transporte público'),
 '6.3.1': x => `Agregar ${n(x)} ciclo-parqueaderos en estaciones de transporte cada año`,
 '6.5.1': x => `Reducir en ${n(x)} las víctimas fatales de tránsito cada año`,
 '6.5.2': x => `Reducir cada año en ${n(x)} los siniestros por cada 10,000 vehículos`,
 '7.1.1': x => perThousand(x,'trámites y servicios adicionales disponibles en línea'),
 '7.2.1': x => perThousand(x,'personas adultas más que confían en los servidores públicos municipales'),
 '7.3.1': x => perThousand(x,'personas adultas adicionales que participan en el Presupuesto Participativo'),
};

export function paceContext(d, annual) {
  if (!isNumber(annual) || !paceContexts[d.id]) return null;
  if (annual === 0) return 'Ritmo en pausa: el escenario conserva el último valor registrado';
  // Wording describes improvement only; never label a contrary scenario as a benefit.
  if (annual * (d.direction === 'D' ? -1 : 1) < 0) return 'Este ritmo aleja al indicador de su meta';
  return paceContexts[d.id](Math.abs(annual));
}
