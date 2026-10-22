import { useEffect } from 'react';
import { glyphs, viewBox } from '../assets/leonWordmark.mjs';
import { useScanner } from '../hooks/useScanner.js';
import ScannerOverlay from './ScannerOverlay.jsx';

function Lettering({className}){
  return <svg className={`footer-word-plot ${className}`} viewBox={viewBox} aria-hidden="true" focusable="false">{glyphs.map((d,index)=><path d={d} key={index} pathLength="1" style={{'--glyph-index':index}}/>)}</svg>;
}
export default function FooterWordmark(){
  const scanner=useScanner();
  useEffect(()=>{
    const word=scanner.ref.current;
    const measure=()=>word.style.setProperty('--word-stroke',(Number(viewBox.split(' ')[2])/Math.max(1,word.offsetWidth)).toFixed(3));
    const resize=new ResizeObserver(measure);resize.observe(word);measure();
    return()=>resize.disconnect();
  },[scanner.ref]);
  return <div className="footer-word scanner-surface" {...scanner} role="img" aria-label="León 2050">
    <Lettering className="footer-word-trace"/>
    <Lettering className="footer-word-fill"/>
    <Lettering className="footer-word-lens"/>
    <i className="footer-scan-line" aria-hidden="true"/>
    <ScannerOverlay/>
  </div>;
}
