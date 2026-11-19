import {clamp,ease,lerp,storyBallRadius,trajectory} from './choreography';
import {GROUND_LAND,GROUND_LAUNCH} from './ground-impact';
import {createLetterSequence,LETTERS_TAKEOFF} from './leon-letters';
import contact from './arch-contact.json';
export function arrivalGeometry(w, h) {
  const r = storyBallRadius(w), planeScale = Math.min(1.5, w / 800 + .45);
  const plane = (p) => ({ x: w * (-.32 + p * 3.6 + Math.max(0,p-.18)**2*50), y: h * (.64 - Math.sin(p*Math.PI)*.07) });
  const hit = { x: plane(.18).x, y: plane(.18).y - 3*planeScale - r };
  const portrait=w/h<.9;
  const archW = Math.min(w * (portrait ? 1.25 : .75), h * 1.05, 960), archH = archW * .75;
  const archX = w * 1.45, base = h*(portrait?.87:.91), archY = base - archH;
  const crown = { x: archX-archW/2+archW*contact.x, y: archY+archH*contact.y-r };
  // The visible plinth ends before the transparent margin of the source image.
  const groundY = archY + archH * (1057 / contact.height);
  const ground = { x: archX - archW / 2 - w * (portrait ? .25 : .24), y: groundY - r };
  const letters = createLetterSequence(w, h, ground, r);
  const floorCamera = ground.x - w * (portrait ? .33 : .36);
  const unit = Math.min(w / (w<700?750:1400), h / 720), cityX = w*2;
  const roofA = { x: cityX+65*unit, y:base-205*unit-r }, roofB = {x:cityX+234*unit,y:base-295*unit-r};
  const end = {x:w*2.64,y:h*.46};
  const sections = [
    {a:0,b:.18,path:trajectory(`M${w*.76},0 C${w*.8},${h*.41} ${hit.x},${hit.y-h*.35} ${hit.x},${hit.y}`)},
    {a:.18,b:GROUND_LAND,path:trajectory(`M${hit.x},${hit.y} C${hit.x+w*.19},${hit.y-h*.43} ${ground.x},${base-h*.53} ${ground.x},${ground.y}`)},
    {a:LETTERS_TAKEOFF,b:.48,path:trajectory(`M${letters.takeoff.x},${letters.takeoff.y} C${letters.takeoff.x},${crown.y-h*.40} ${crown.x-w*.20},${crown.y-h*.31} ${crown.x},${crown.y}`)},
    {a:.48,b:.60,path:trajectory(`M${crown.x},${crown.y} C${crown.x+w*.17},${crown.y-h*.3} ${roofA.x-80},${roofA.y-h*.3} ${roofA.x},${roofA.y}`)},
    {a:.60,b:.67,path:trajectory(`M${roofA.x},${roofA.y} C${roofA.x+90},${roofA.y-h*.28} ${roofB.x-60},${roofB.y-h*.24} ${roofB.x},${roofB.y}`)},
    {a:.67,b:.74,path:trajectory(`M${roofB.x},${roofB.y} C${roofB.x+w*.1},${roofB.y-h*.5} ${end.x-w*.12},${h*.22} ${end.x},${end.y}`)},
  ];
  const point = (p) => {
    if (p > GROUND_LAND && p < GROUND_LAUNCH) return ground;
    if (p >= GROUND_LAUNCH && p < LETTERS_TAKEOFF) return letters.ball(p);
    const section = sections.find(s => p <= s.b) || sections[sections.length - 1];
    return section.path((p-section.a)/(section.b-section.a));
  };
  const camera = (p) => {
    if (p <= GROUND_LAND) return ease((p-.22)/(GROUND_LAND-.22)) * floorCamera;
    if (p < LETTERS_TAKEOFF) return floorCamera;
    if (p <= .48) return lerp(floorCamera, archX-w*.5, ease((p-LETTERS_TAKEOFF)/(.48-LETTERS_TAKEOFF)));
    return lerp(archX-w*.5,w*2,ease((p-.48)/.26));
  };
  return {portrait,r,plane,planeScale,hit,crown,ground,groundY,letters,point,camera,archW,archH,archX,archY,base,unit,cityX,end};
}

