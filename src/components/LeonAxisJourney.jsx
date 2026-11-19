import { useLayoutEffect, useRef } from 'react';
import { Atmosphere, paintAtmosphere } from '../arrival/Atmosphere';
import { AircraftSculpture } from '../arrival/Architecture';
import { arrivalGeometry } from '../arrival/geometry';
import { GROUND_LAND, GROUND_LAUNCH, groundImpact, groundDropletCount, liquidContour } from '../arrival/ground-impact';
import { leonGlyphs, LETTERS_TAKEOFF } from '../arrival/leon-letters';
import { liquidBirth } from '../arrival/liquid-geometry';
import { clamp, ease, lerp, trajectory } from '../arrival/choreography';

// Preserve the source's slower time allotted to the falling letters.
const phases=[0,.18,GROUND_LAND,GROUND_LAUNCH,LETTERS_TAKEOFF,.48,.74,1];
const marks=[0,.14,.28,.38,.65,.73,.91,1];
function phaseAt(scroll){const i=Math.max(1,marks.findIndex(mark=>scroll<=mark));return lerp(phases[i-1],phases[i],clamp((scroll-marks[i-1])/(marks[i]-marks[i-1])));}

/** One native-scroll clock owns sky, impacts, typography, camera, and exit to the axes. */
export default function LeonAxisJourney(){
 const ref=useRef(null);
 useLayoutEffect(()=>{
  const track=ref.current,stage=track.querySelector('.axis-journey-stage'),svg=track.querySelector('svg'),title=track.querySelector('h2');
  const world=svg.querySelector('[data-world]'),plane=svg.querySelector('[data-aircraft]'),arch=svg.querySelector('[data-arch]'),floor=svg.querySelector('[data-floor]');
  const ball=svg.querySelector('[data-ball]'),birth=svg.querySelector('[data-birth]'),liquid=svg.querySelector('[data-ground-impact]'),pool=liquid.querySelector('path'),drops=[...liquid.querySelectorAll('circle')],letters=[...svg.querySelectorAll('[data-leon-glyph]')];
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');let raf=0,g,w,h,exit,quiet,top,travel,titleW;
  const paint=()=>{
   raf=0;const scroll=quiet?1:clamp((window.scrollY-top)/travel),p=quiet?.48:phaseAt(scroll);
   const camera=p<=.48?g.camera(p):g.archX-w*.5;
   const point=p<=.48?g.point(p):exit(ease((p-.48)/.26));
   const x=point.x-camera,y=point.y,flight=g.plane(Math.min(p,.32));
   world.setAttribute('transform',`translate(${-camera} 0)`);paintAtmosphere(svg,w,h,p);
   const recoil=p>.18&&p<.29?Math.sin((p-.18)/.11*Math.PI*2)*Math.exp(-(p-.18)*30):0;
   plane.setAttribute('transform',`translate(${flight.x} ${flight.y+recoil*7}) rotate(${recoil*1.8}) scale(${g.planeScale})`);
   plane.style.visibility=p>.32?'hidden':'visible';
   const acting=p>=GROUND_LAUNCH&&p<LETTERS_TAKEOFF?g.letters.ball(p):null;
   g.letters.glyphs(p).forEach((glyph,i)=>{letters[i].setAttribute('opacity',String(glyph.visible?(1-ease((p-.50)/.055)):0));letters[i].setAttribute('transform',`translate(${glyph.x} ${glyph.y}) rotate(${glyph.angle}) scale(1 ${glyph.squash})`);});
   const collision=Math.max(0,1-Math.abs(p-.18)/.014)*.3+Math.max(0,1-Math.abs(p-.48)/.012)*.24;
   const sx=acting?1+acting.squash+acting.stretch-acting.press:1+collision,sy=acting?1-acting.squash+acting.stretch*.32+acting.press*.70:1/(1+collision);
   ball.setAttribute('cx',String(x));ball.setAttribute('cy',String(y));ball.setAttribute('r',String(g.r));ball.style.transformOrigin=`${x}px ${y}px`;ball.style.transform=`translateY(${g.r*(1-sy)*(1-(acting?.press??0))}px) scale(${sx},${sy})`;
   const splash=p>=GROUND_LAND&&p<=GROUND_LAUNCH?groundImpact(p,x,g.groundY,g.r):null,nerves=acting?.nerves??0,wet=(splash&&splash.spread>.0001)||nerves>.0001;
   liquid.setAttribute('visibility',wet?'visible':'hidden');ball.setAttribute('visibility',wet||p<.04||p>.745?'hidden':'visible');
   if(wet){pool.setAttribute('d',splash?splash.path:liquidContour(x,g.groundY,g.r,nerves*.78,w<700?1.25:1.9));drops.forEach((drop,i)=>{const d=splash?.drops[i]??{x,y:g.groundY,r:0};drop.setAttribute('cx',d.x);drop.setAttribute('cy',d.y);drop.setAttribute('r',d.r);});}
   const birthEnd=g.point(.04),b=liquidBirth(w,h,clamp(p/.04)*.22,g.r,birthEnd.y,lerp(w*.76,birthEnd.x,ease(p/.04)));
   birth.setAttribute('d',b.path);birth.setAttribute('visibility',p<.04?'visible':'hidden');
   floor.setAttribute('opacity',String(.35*ease((p-.245)/.065)));
   const move=ease((p-.355)/.06),margin=w<700?22:48;
   title.style.transform=`translateX(${move*Math.max(0,w-titleW-margin*2)}px)`;
   track.dataset.phase=p<.04?'birth':p<.18?'sky':p<GROUND_LAND?'aircraft':p<GROUND_LAUNCH?'ground':p<LETTERS_TAKEOFF?'letters':p<.49?'arch':'axes';
   track.dataset.progress=p.toFixed(5);
  };
  const request=()=>{if(!raf)raf=requestAnimationFrame(paint);};
  const build=()=>{w=track.clientWidth;h=window.innerHeight;quiet=reduce.matches||h<480;track.dataset.quiet=String(quiet);stage.style.height=`${quiet?Math.max(420,h*.75):h}px`;track.style.height=quiet?'auto':`${h*(w<700?4.8:5.6)}px`;g=arrivalGeometry(w,h);svg.setAttribute('viewBox',`0 0 ${w} ${h}`);top=track.getBoundingClientRect().top+window.scrollY;travel=Math.max(1,track.offsetHeight-h);titleW=title.offsetWidth;
   floor.setAttribute('d',`M${-w} ${g.groundY}H${w*3.5}`);arch.setAttribute('x',g.archX-g.archW/2);arch.setAttribute('y',g.archY);arch.setAttribute('width',g.archW);arch.setAttribute('height',g.archH);letters.forEach(l=>l.setAttribute('font-size',g.letters.fontSize));
   exit=trajectory(`M${g.crown.x},${g.crown.y} C${g.crown.x+w*.4},${g.crown.y-h*.58} ${g.archX+w*.3},${h*.18} ${g.archX+w*.26},${h*1.15}`);paint();};
  build();window.addEventListener('scroll',request,{passive:true});window.addEventListener('resize',build);reduce.addEventListener('change',build);let disposed=false;document.fonts.ready.then(()=>{if(!disposed)build();});
  return()=>{disposed=true;cancelAnimationFrame(raf);window.removeEventListener('scroll',request);window.removeEventListener('resize',build);reduce.removeEventListener('change',build);};
 },[]);
 return <section className="axis-journey" ref={ref} aria-labelledby="axes-banner-title"><div className="axis-journey-stage">
  <h2 id="axes-banner-title">¿Cómo está<br/>cambiando León?</h2>
  <svg className="axis-journey-art" aria-hidden="true"><Atmosphere/><g data-world><path data-floor fill="none" stroke="#829ca2" strokeWidth="1"/><g fill="#e8eeeb" fontFamily="Mona Sans" fontWeight="700" textAnchor="middle">{leonGlyphs.map(char=><text data-leon-glyph key={char} opacity="0">{char}</text>)}</g><g data-aircraft><AircraftSculpture/></g><image data-arch href="./arrival/calzada.webp" preserveAspectRatio="xMidYMid meet"/></g><circle data-ball fill="#e5f6f2"/><path data-birth fill="#e5f6f2"/><g data-ground-impact fill="#e5f6f2" visibility="hidden"><path/>{Array.from({length:groundDropletCount},(_,i)=><circle key={i}/>)}</g><Atmosphere front/></svg>
 </div></section>;
}
