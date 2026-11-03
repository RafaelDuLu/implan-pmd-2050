import { useLayoutEffect, useRef } from 'react';

// Pixel interpolation only. No intermediate measurements enter the data model.
export function useChartMotion(target) {
  const ref=useRef(null),current=useRef(null);
  const key=target.join(',');
  useLayoutEffect(()=>{
    const group=ref.current;
    if (!group) return;
    const line=group.querySelector('.chart-scenario-line');
    const area=group.querySelector('.chart-scenario-area');
    const node=group.querySelector('.chart-end-node');
    const label=group.querySelector('.chart-end-label');
    const crossing=group.querySelector('.chart-crossing-node');
    const next=key.split(',').map(Number);
    const media=matchMedia('(prefers-reduced-motion: reduce)');
    let frame=0;
    const paint=values=>{
      current.current=values;
      line?.setAttribute('d',`M${values[0]},${values[1]}L${values[2]},${values[3]}L${values[4]},${values[5]}`);
      area?.setAttribute('d',`M${values[0]},${values[1]}L${values[2]},${values[3]}L${values[4]},${values[5]}L${values[4]},233L${values[0]},233Z`);
      node?.setAttribute('transform',`translate(${values[4]} ${values[5]})`);
      label?.setAttribute('transform',`translate(${values[4]} ${values[6]})`);
      crossing?.setAttribute('transform',`translate(${values[2]} ${values[3]})`);
    };
    const finish=()=>{cancelAnimationFrame(frame);paint(next);};
    if (!current.current || media.matches) finish();
    else {
      const from=current.current.slice(),start=performance.now();
      paint(from);
      const draw=time=>{
        const t=Math.min(1,(time-start)/180),ease=1-(1-t)**3;
        paint(next.map((value,i)=>from[i]+(value-from[i])*ease));
        if(t<1) frame=requestAnimationFrame(draw); else paint(next);
      };
      frame=requestAnimationFrame(draw);
    }
    const preference=()=>{if(media.matches)finish();};
    media.addEventListener('change',preference);
    return()=>{cancelAnimationFrame(frame);media.removeEventListener('change',preference);};
  },[key]);
  return ref;
}
