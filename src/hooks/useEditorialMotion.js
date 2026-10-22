import { useEffect } from 'react';

/** Reveal only editorial elements. Tables, filters and statistical values stay still. */
export function useEditorialMotion(token) {
  useEffect(()=>{
    const nodes=[...document.querySelectorAll('[data-reveal]')];
    const media=matchMedia('(prefers-reduced-motion: reduce)');
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries)entry.target.dataset.revealed=String(media.matches || entry.isIntersecting || entry.boundingClientRect.top<0);
    },{threshold:.08,rootMargin:'0px 0px -25px 0px'});
    for(const node of nodes){node.dataset.revealReady='true';if(media.matches)node.dataset.revealed='true';observer.observe(node);}
    const preference=()=>{if(media.matches)for(const node of nodes)node.dataset.revealed='true';};
    media.addEventListener('change',preference);
    return()=>{observer.disconnect();media.removeEventListener('change',preference);};
  },[token]);
}
