export function AircraftSculpture() {
  return <g className="aircraft-sculpture">
    <defs>
      <linearGradient id="aircraft-metal" x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#fffdf4"/>
        <stop offset=".52" stopColor="#dddcd5"/>
        <stop offset="1" stopColor="#858983"/>
      </linearGradient>
      <linearGradient id="aircraft-wing" x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#dadcd5"/>
        <stop offset="1" stopColor="#666b65"/>
      </linearGradient>
    </defs>
    <path d="M-4 11L-67 40L-91 39L-36 9Z" fill="#676e67"/>
    <path d="M-142 4L-157 -41L-140 -41L-103 -3H111C132 -3 149 7 157 16C148 26 130 29 105 29H-80C-115 28 -140 23 -154 15Z"
      fill="url(#aircraft-metal)" stroke="#eeeee4" strokeWidth=".7"/>
    <path d="M-149 11L-116 4L-86 5L-116 14Z" fill="#c0c3ba" stroke="#e5e6dc" strokeWidth=".55"/>
    <path d="M30 17L-50 55L-79 55L-24 19Z" fill="url(#aircraft-wing)" stroke="#c7cbc1" strokeWidth=".65"/>
    <path d="M-11 27H24Q34 27 34 34V40Q31 47 14 47H-11Q-24 46-24 37Q-24 28-11 27Z" fill="url(#aircraft-metal)" stroke="#d1d4c9" strokeWidth=".6"/>
    <ellipse cx="27" cy="37" rx="4" ry="8" fill="#515951"/>
    <path d="M115 3Q133 5 142 12H123Z" fill="#3b4541"/>
    <path d="M-96 17H149" fill="none" stroke="#7f877f" strokeWidth=".7"/>
    {[-77,-64,-51,-38,-25,-12,1,14,27,40,53,66,79,92,105].map(x=>
      <rect key={x} x={x} y="7" width="3.5" height="3" rx="1.15" fill="#515b56"/>)}
  </g>;
}
export function CityArchitecture({ x, base, unit }: { x: number; base: number; unit: number }) {
  const blocks = [{ x: 0, w: 130, h: 205 }, { x: 178, w: 112, h: 295 }, { x: 338, w: 180, h: 240 }, { x: 575, w: 140, h: 365 }, { x: 775, w: 210, h: 270 }];
  return <g transform={`translate(${x} ${base}) scale(${unit})`} className="arrival-city">
    <path d="M-70 8H1100M-70 18H1100" stroke="#51534c" strokeWidth=".7"/>
    {blocks.map((b,i)=><g key={i}><path d={`M${b.x} 0v-${b.h}h${b.w}V0Z`} fill={i%2?'#d5d4cb':'#a6aaa1'}/><path d={`M${b.x+b.w} 0l28-17V-${b.h+17}l-28 17Z`} fill="#62695e"/><path d={`M${b.x}-${b.h}l28-17h${b.w}l-28 17Z`} fill="#eeeae0"/>{Array.from({length:Math.floor(b.h/40)-1},(_,j)=><g key={j}>{Array.from({length:Math.max(2,Math.floor(b.w/38))},(_,k)=><rect key={k} x={b.x+14+k*34} y={-b.h+22+j*36} width="17" height="17" fill="#565e53"/>)}</g>)}<path d={`M${b.x+22} 0v-45h34V0`} fill="#353d33"/></g>)}
  </g>;
}

