import { useState } from 'react';

/** Both local map layers use the same projection and bounds from INEGI. */
export default function LeonMap() {
  const [expanded,setExpanded]=useState(false);
  return <figure className="leon-map" data-map-expanded={expanded}>
    <div className="leon-map-canvas" role="img" aria-label="Contorno del municipio de León. La lente revela la red de vialidades de INEGI.">
      <img className="leon-map-outline" src="./maps/leon-contorno.svg" alt="" width="640" height="640" decoding="async"/>
      <div className="leon-map-detail" aria-hidden="true"><img src="./maps/leon-vialidades.webp" alt="" width="640" height="640" decoding="async"/></div>
      <span className="map-north micro" aria-hidden="true">N ↑</span>
    </div>
    <figcaption><div><span className="micro">LEÓN / GUANAJUATO</span></div><button className="map-toggle" type="button" aria-pressed={expanded} onClick={()=>setExpanded(value=>!value)}>{expanded ? 'Ocultar calles' : 'Revelar calles'} <span aria-hidden="true">{expanded ? '−' : '+'}</span></button></figcaption>
    <p className="map-credit">Cartografía: <a href="https://www.inegi.org.mx/servicios/catalogounico.html" target="_blank" rel="noreferrer">INEGI · Marco Geoestadístico</a></p>
  </figure>;
}
