import { ease, lerp } from './choreography';

export const GROUND_LAND = .324;
export const GROUND_LAUNCH = .416;

const droplets = [
  [-4.3, 1.4, .13], [-3.1, 2.4, .15], [-2, 3.25, .17], [-.95, 2.05, .10],
  [.78, 2.8, .16], [1.75, 3.65, .12], [3.1, 1.95, .17], [4.5, 1.12, .12],
] as const;

export function groundImpact(p: number, x: number, floor: number, radius: number) {
  const time = (p - GROUND_LAND) / (GROUND_LAUNCH - GROUND_LAND);
  const spread = ease(time / .23) * (1 - ease((time - .24) / .76));
  const path = liquidContour(x, floor, radius, spread);
  return {
    path,
    spread,
    drops: droplets.map(([dx, dy, size], i) => {
      const arc = ease((time - i * .009) / .21) * (1 - ease((time - .26) / .62));
      return { x: x + dx * radius * arc, y: floor - dy * radius * arc, r: size * radius * arc };
    }),
  };
}

export function liquidContour(x: number, floor: number, radius: number, spread: number, widthGain = 3.8) {
  const half = radius * (1 + widthGain * spread);
  const height = radius * lerp(2, .49, spread);
  const top = floor - height;
  const middle = floor - height / 2;
  const k = .55228475;
  const left = x - half;
  const right = x + half;
  const ripple = radius * spread;
  return `M${left} ${middle}
    C${left} ${middle-height*k/2-ripple*.12} ${x-half*k} ${top+ripple*.14} ${x} ${top}
    C${x+half*k} ${top-ripple*.20} ${right} ${middle-height*k/2} ${right} ${middle}
    C${right} ${middle+height*k/2} ${x+half*k} ${floor+ripple*.09} ${x} ${floor}
    C${x-half*k} ${floor+ripple*.06} ${left} ${middle+height*k/2} ${left} ${middle}Z`;
}

export const groundDropletCount = droplets.length;

