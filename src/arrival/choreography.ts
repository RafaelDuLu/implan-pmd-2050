export const clamp=(p:number)=>Math.min(1,Math.max(0,p));
export const ease=(p:number)=>{p=clamp(p);return p*p*(3-2*p);};
export const lerp=(a:number,b:number,p:number)=>a+(b-a)*p;
export const storyBallRadius=(w:number)=>w<700?14:23;
/** Native SVG arc-length sampling replaces the source's MotionPath dependency. */
export function trajectory(d:string){
 const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',d);
 const length=path.getTotalLength();return(p:number)=>path.getPointAtLength(clamp(p)*length);
}
