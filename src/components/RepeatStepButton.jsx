import { useLayoutEffect, useRef } from 'react';

/** A pointer click is one step; holding repeats until release or cancellation. */
export default function RepeatStepButton({onStep,disabled,children,...props}) {
  const action=useRef(onStep),timer=useRef(null);
  const stop=()=>{clearTimeout(timer.current);timer.current=null;};
  useLayoutEffect(()=>{action.current=onStep;});
  useLayoutEffect(()=>{if(disabled)stop();},[disabled]);
  useLayoutEffect(()=>{
    const hidden=()=>{if(document.hidden)stop();};
    window.addEventListener('blur',stop);
    document.addEventListener('visibilitychange',hidden);
    return()=>{stop();window.removeEventListener('blur',stop);document.removeEventListener('visibilitychange',hidden);};
  },[]);
  const start=event=>{
    if(disabled || !event.isPrimary || event.button!==0)return;
    stop();
    event.currentTarget.setPointerCapture(event.pointerId);
    action.current();
    const repeat=()=>{action.current();timer.current=setTimeout(repeat,70);};
    timer.current=setTimeout(repeat,350);
  };
  return <button {...props} disabled={disabled} onPointerDown={start} onPointerUp={stop} onPointerCancel={stop} onLostPointerCapture={stop} onBlur={stop} onContextMenu={event=>event.preventDefault()} onClick={event=>{if(event.detail===0 && !disabled)action.current();}}>{children}</button>;
}
