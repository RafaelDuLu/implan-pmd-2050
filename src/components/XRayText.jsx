import { useScanner } from '../hooks/useScanner.js';
import ScannerOverlay from './ScannerOverlay.jsx';

export default function XRayText({ children, className='' }) {
  const scanner=useScanner();
  return <span className={`xray-text scanner-surface ${className}`} {...scanner} aria-hidden="true"><span className="xray-outline">{children}</span><span className="xray-fill">{children}</span><ScannerOverlay/></span>;
}
