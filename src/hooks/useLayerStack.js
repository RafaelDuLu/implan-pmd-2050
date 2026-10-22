import { useEffect, useRef } from 'react';

/** Native sticky layers: a long sheet scrolls fully before its final viewport is covered. */
export function useLayerStack(token) {
  const ref=useRef(null);
  useEffect(()=>{
    const root=ref.current;
    if(!root)return;
    const media=matchMedia('(prefers-reduced-motion: reduce)');
    const nodes=[...root.querySelectorAll('[data-page-layer]')];
    const measure=node=>node.style.setProperty('--layer-height',`${node.offsetHeight}px`);
    const resize=new ResizeObserver(entries=>{for(const entry of entries)measure(entry.target);});
    for(const node of nodes){measure(node);resize.observe(node);}
    const preference=()=>{root.dataset.layered=String(!media.matches);};
    preference();media.addEventListener('change',preference);
    return()=>{resize.disconnect();media.removeEventListener('change',preference);};
  },[token]);
  return ref;
}
