/** Code-native instrument overlay: measurements are written by useScanner without rerendering React. */
export default function ScannerOverlay() {
  return <span className="scanner-instrument" aria-hidden="true">
    <span className="scan-window"><span className="scan-lattice"/><svg className="scan-construction" viewBox="0 0 1000 320" preserveAspectRatio="none"><path d="M0 320 320 0M160 320 480 0M500 320 820 0M720 320 1000 40M0 160H1000M250 0V320M500 0V320M750 0V320"/><ellipse cx="500" cy="160" rx="310" ry="155"/><path d="M100 300V20H900V300Z"/></svg></span>
    <span className="scan-guide scan-guide-x"/><span className="scan-guide scan-guide-y"/>
    <span className="scan-ruler scan-ruler-x"/><span className="scan-ruler scan-ruler-y"/>
    <span className="scan-lens-ring"/><span className="scan-cursor-cross"/>
    <span className="scan-readout micro">X <b data-scan-x>0000</b><i/>Y <b data-scan-y>0000</b></span>
    <span className="scan-axis-mark scan-axis-x micro">X</span><span className="scan-axis-mark scan-axis-y micro">Y</span>
  </span>;
}
