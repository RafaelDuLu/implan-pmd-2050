export function Arrow({ diagonal = false, ...props }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...props}>
    {diagonal ? <path d="M5 19 19 5M5 5h14v14" /> : <path d="M4 12h16m-7-7 7 7-7 7" />}
  </svg>;
}
export function Mark() {
  return <svg className="brand-mark" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M5 34V6h29M12 28 31 9M23 34h11V23" stroke="currentColor" strokeWidth="2" /></svg>;
}
export function AxisGlyph({ axis }) {
  const paths = {
    1: <><circle cx="32" cy="20" r="10"/><path d="M10 58c0-26 44-26 44 0M18 20h28M32 10v20"/></>,
    2: <><path d="m32 5 24 9v19c0 13-24 26-24 26S8 46 8 33V14L32 5Z"/><path d="m21 30 8 8 15-17"/></>,
    3: <><path d="M6 56h52M12 48V33h9v15M28 48V22h9v26M44 48V8h9v40"/><path d="m8 20 17-9 13 3 16-10"/></>,
    4: <><path d="m5 53 17-30 11 17 12-28 15 41H5Z"/><circle cx="22" cy="11" r="6"/></>,
    5: <><path d="M32 5S11 30 11 42a21 21 0 0 0 42 0C53 30 32 5 32 5Z"/><path d="M20 44c0 7 5 12 12 12M19 35h26"/></>,
    6: <><circle cx="15" cy="45" r="12"/><circle cx="50" cy="45" r="12"/><path d="m15 45 13-24 22 24H15l17-32h11M22 21h14"/></>,
    7: <><path d="M7 58h50M12 52V24h40v28M7 24 32 6l25 18H7ZM21 32v13m11-13v13m11-13v13"/></>,
  };
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true">{paths[axis]}</svg>;
}
