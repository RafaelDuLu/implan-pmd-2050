import { clamp, ease, lerp } from './choreography';
import { GROUND_LAUNCH } from './ground-impact';

export const LETTERS_TAKEOFF = .467;

const cues = [
  { char: 'L', width: .46, offset: -.268, start: .56, land: .73, tilt: -13 },
  { char: 'E', width: .46, offset: -.158, start: .32, land: .56, tilt: 10 },
  { char: 'Ó', width: .71, offset: .114, start: .16, land: .43, tilt: -17 },
  { char: 'N', width: .65, offset: .226, start: .47, land: .68, tilt: 13 },
] as const;

export const leonGlyphs = cues.map(cue => cue.char);

const closeStart = .83;
const closeEnd = .945;

export function createLetterSequence(width: number, height: number, ground: {x: number; y: number}, radius: number) {
  const fontSize = Math.min(width * .145, height * .165, 188);
  const floor = ground.y + radius;
  const seam = ground.x - width * .038;
  const gap = Math.max(3, fontSize * .034);
  const compactO = seam + (fontSize * cues[2].width + gap) / 2;
  const compactE = seam - (fontSize * cues[1].width + gap) / 2;
  const finalCenters = [
    compactE - (cues[0].width + cues[1].width) * fontSize / 2 - gap,
    compactE,
    compactO,
    compactO + (cues[2].width + cues[3].width) * fontSize / 2 + gap,
  ];
  const takeoff = { x: seam, y: floor - fontSize * .93 - radius * 1.22 };
  const time = (p: number) => clamp((p - GROUND_LAUNCH) / (LETTERS_TAKEOFF - GROUND_LAUNCH));

  function ball(p: number) {
    const t = time(p);
    let x = ground.x;
    let y = ground.y;
    let squash = 0;
    let stretch = 0;

    if (t <= .26) {
      const first = t < .145;
      const arc = clamp(first ? t / .145 : (t - .145) / .115);
      y -= radius * (first ? 1.05 : .54) * 4 * arc * (1 - arc);
      squash = .22 * (1 - ease(Math.abs(t - .145) / .038));
      stretch = Math.sin(Math.PI * arc) * .11;
    } else {
      const dodgeO = ease((t - .27) / .145);
      const dodgeE = ease((t - .44) / .14);
      const lean = Math.min(width * .025, radius);
      x = ground.x + (seam - ground.x - lean) * dodgeO + lean * dodgeE;
      y -= radius * (.69 * Math.sin(Math.PI * dodgeO) + .31 * Math.sin(Math.PI * dodgeE));
      squash = .20 * (1 - ease(Math.abs(t - .42) / .035));
      stretch = .24 * Math.sin(Math.PI * dodgeO) + .13 * Math.sin(Math.PI * dodgeE);
    }
    squash += .14 * (1 - ease(Math.abs(t - .26) / .032));
    const nerves = ease((t - closeStart) / .038) * (1 - ease((t - .875) / .023));
    const pinch = ease((t - .889) / (closeEnd - .889));
    const lift = clamp((t - .933) / .067);
    const press = (1 - Math.min(.86, gap / (2 * radius))) * pinch * (1 - ease((lift - .88) / .12));
    y = lerp(y - radius * press * .43, takeoff.y, lift * lift);
    return { x, y, squash, stretch, nerves, press };
  }

  function glyphs(p: number) {
    const t = time(p);
    const close = ease((t - closeStart) / (closeEnd - closeStart));
    return cues.map(({ offset, start, land, tilt }, index) => {
      const fall = clamp((t - start) / (land - start));
      const settle = clamp((t - land) / .11);
      const tremor = Math.sin(settle * Math.PI * 3) * (1 - settle) ** 2;
      const initial = ground.x + offset * width;
      const slide = close * ease((t - land) / .09);
      return {
        x: lerp(initial, finalCenters[index], slide) + fontSize * .28 * (1 - fall) * Math.sign(tilt),
        y: lerp(-fontSize * .5, floor, fall ** 2.35) - fontSize * .075 * Math.max(0, tremor),
        angle: tilt * (1 - fall) + tremor * tilt * .38,
        squash: 1 - .10 * Math.sin(Math.PI * settle) * (1 - settle),
        shadow: ease(fall) * (1 - ease(settle)),
        visible: p >= GROUND_LAUNCH && t > start,
      };
    });
  }

  return { ball, glyphs, floor, fontSize, takeoff, gap };
}

