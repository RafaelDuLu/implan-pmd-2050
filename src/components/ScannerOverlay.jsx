/** Only the optical instrument; no lattice or decorative construction vectors. */
export default function ScannerOverlay(){
  return <span className="scanner-instrument" aria-hidden="true">
    <span className="scan-guide scan-guide-x"/><span className="scan-guide scan-guide-y"/>
    <span className="scan-lens-ring"/><span className="scan-cursor-cross"/>
    <span className="scan-readout micro">X <b data-scan-x>0000</b><i/>Y <b data-scan-y>0000</b></span>
    <span className="scan-axis-mark scan-axis-x micro">X</span><span className="scan-axis-mark scan-axis-y micro">Y</span>
  </span>;
}
