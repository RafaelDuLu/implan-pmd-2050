/** Original large contour banks, drawn as masses rather than repeated cloud icons. */
const contour="M-180 220C-120 125-8 85 95 125C131-19 343-49 426 108C546 63 655 130 668 237C794 207 898 282 910 388C1020 397 1094 500 1057 640C1135 838 900 1020 704 902C544 1120 239 1060 140 820C-101 974-414 735-310 510C-543 418-474 172-180 220Z";
export function CloudBank(){return <path d={contour} fill="#0b0c0b" stroke="#e4e3db" strokeWidth="1.15" vectorEffect="non-scaling-stroke"/>}
export const skyBanks=[
 {x:-.77,y:.1,scale:1.0,depth:.7,front:false,flip:false},
 {x:.75,y:.29,scale:.92,depth:.86,front:false,flip:false},
 {x:-.12,y:.68,scale:1.15,depth:1.25,front:true,flip:true},
 {x:-.59,y:.76,scale:1.05,depth:1.35,front:true,flip:false},
 {x:.65,y:1.05,scale:1.15,depth:1.65,front:true,flip:false},
];
export function Atmosphere({front=false}:{front?:boolean}){return <g className="flight-clouds">{skyBanks.map((b,i)=>b.front===front?<g key={i} data-cloud={i}><CloudBank/></g>:null)}</g>}
import { ease } from './choreography';

export function paintAtmosphere(svg:SVGSVGElement,w:number,h:number,p:number){
 const unit=w<700?w/1000:Math.max(w/1250,h/1100);
 svg.querySelectorAll<SVGGElement>('[data-cloud]').forEach(el=>{const i=Number(el.dataset.cloud),b=skyBanks[i];
  // Near banks travel faster; all leave by the architectural scene, without fading.
  const build=1-ease(p/.15);
  const spread=Math.max(0,p-.04);const exit=Math.max(0,(p-.23)/.12);const x=w*b.x+(b.x<0?-1:1)*w*spread*b.depth*(w<700?1.6:.55),y=h*b.y-p*h*b.depth*1.8-exit*h*2+build*h*(b.flip?-.48:.57);
  el.setAttribute('transform',`translate(${x} ${y}) scale(${unit*b.scale} ${unit*b.scale*(b.flip?-1:1)})`);
 });
}

