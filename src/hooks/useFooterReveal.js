import { useEffect, useRef } from 'react';

/** The preceding banner uncovers a stationary footer; progress follows that edge. */
export function useFooterReveal() {
  const ref=useRef(null);
  useEffect(()=>{
    const footer=ref.current;
    if(!footer)return;
    const media=matchMedia('(prefers-reduced-motion: reduce)');
    let frame=0,drawn=-1,target=0,previous=0;
    const measure=()=>{
      const height=footer.offsetHeight;
      const pinned=height<=innerHeight && !media.matches;
      footer.dataset.pinned=String(pinned);
      const end=scrollY+innerHeight>=document.documentElement.scrollHeight-2;
      if(media.matches || end)target=1;
      else if(pinned){
        const edge=footer.previousElementSibling?.getBoundingClientRect().bottom??innerHeight;
        target=Math.max(0,Math.min(1,(innerHeight-edge)/Math.max(1,height)));
      } else {
        const word=footer.querySelector('.footer-drawing').getBoundingClientRect();
        target=Math.max(0,Math.min(1,(innerHeight-word.top)/Math.max(1,word.height)));
      }
    };
    const paint=time=>{
      frame=0;
      const dt=previous?Math.min(50,time-previous):16;
      previous=time;
      drawn=media.matches || drawn<0 ? target : drawn+(target-drawn)*(1-Math.exp(-dt/70));
      if(Math.abs(drawn-target)<.0005)drawn=target;
      footer.style.setProperty('--scene',drawn.toFixed(4));
      const counter=footer.querySelector('[data-fill-progress]');
      if(counter)counter.textContent=`${String(Math.round(drawn*100)).padStart(3,'0')}%`;
      if(drawn!==target)frame=requestAnimationFrame(paint);else previous=0;
    };
    const update=()=>{measure();if(!frame)frame=requestAnimationFrame(paint);};
    const resize=new ResizeObserver(update);resize.observe(footer);
    window.addEventListener('scroll',update,{passive:true});
    window.addEventListener('resize',update,{passive:true});
    media.addEventListener('change',update);update();
    return()=>{cancelAnimationFrame(frame);resize.disconnect();window.removeEventListener('scroll',update);window.removeEventListener('resize',update);media.removeEventListener('change',update);};
  },[]);
  return ref;
}
