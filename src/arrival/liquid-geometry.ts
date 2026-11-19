import { clamp, ease } from './choreography';
/** A single silhouette: reservoir → thinning ligament → detached circular droplet. */
export function liquidBirth(w:number,h:number,p:number,r:number,releaseY=h*.18, originX=w*(w<700?.4:.83)){
 const u=clamp(p/.22),x=originX,y=releaseY*(u*u),radius=r*ease(u/.6),k=.55228475*radius;
 if(u>=1)return {x,y:releaseY,r,path:`M${x},${y-radius}C${x+k},${y-radius} ${x+radius},${y-k} ${x+radius},${y}C${x+radius},${y+k} ${x+k},${y+radius} ${x},${y+radius}C${x-k},${y+radius} ${x-radius},${y+k} ${x-radius},${y}C${x-radius},${y-k} ${x-k},${y-radius} ${x},${y-radius}Z`};
 const tension=ease((u-.35)/.65),neck=radius*.55*(1-tension),shoulder=(w<700?45:80)*(1-tension),top=Math.max(0,y-radius);
 return {x,y,r:radius,path:`M${x-shoulder},-1 C${x-shoulder*.3},0 ${x-neck},${top*.45} ${x-neck},${top} C${x-k},${top} ${x-radius},${y-k} ${x-radius},${y} C${x-radius},${y+k} ${x-k},${y+radius} ${x},${y+radius} C${x+k},${y+radius} ${x+radius},${y+k} ${x+radius},${y} C${x+radius},${y-k} ${x+k},${top} ${x+neck},${top} C${x+neck},${top*.45} ${x+shoulder*.3},0 ${x+shoulder},-1Z`};
}
export function spherePath(x:number,y:number,r:number){return `M${x-r},${y}a${r},${r} 0 1,0 ${r*2},0a${r},${r} 0 1,0 ${-r*2},0Z`}

