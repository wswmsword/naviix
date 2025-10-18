import { useEffect, useState, type AnimationEvent } from "react";
import styles from "./index.module.css";
import clsx from "clsx";

export default function UsrBtn({ src, name, className }: { src: string, name: string } & React.ComponentProps<"button">) {

  const [focused, setF] = useState(false);
  const [loadedFocus, setL] = useState(false);

  const [noL, setNL] = useState(false);
  const [noR, setNR] = useState(false);
  const [noU, setNU] = useState(false);
  const [noD, setND] = useState(false);

  const fadeout = loadedFocus === true && focused === false;

  useEffect(() => {
    if (focused) setL(true);
  }, [focused]);

  return <div className="relative text-[0px]">
    <button
      className={`nvx w-[60px] h-[60px] border-[3px] border-white rounded-full overflow-hidden outline-0 ${className}`}
      onFocus={onFocus}
      onBlur={onBlur}>
      <img src={src} alt={name} />
    </button>
    {(loadedFocus || focused) && <>
      <span
        className={`absolute -inset-1 text-[0px] pointer-events-none ${clsx({ [styles.l]: noL, [styles.r]: noR, [styles.u]: noU, [styles.d]: noD })}`}
        onAnimationEndCapture={onFocusAnimeEnd}>
        <span
          className={`block w-full h-full ${styles.fb} ${fadeout ? styles.op : ""}`}
          onTransitionEnd={unloadFocus}></span>
      </span>
    </>}
    {name && <div className={`absolute left-0 bottom-0 flex flex-nowrap justify-center w-full whitespace-nowrap ${styles.funcName} ${focused ? "opacity-100" : "opacity-0"}`}>{name}</div>}
  </div>;

  function onFocusAnimeEnd(e: AnimationEvent) {
    // if ([styles.reboundR, styles.reboundL, styles.reboundU, styles.reboundD].includes(e.animationName)) {
    //   setNL(false);
    //   setNR(false);
    //   setNU(false);
    //   setND(false);
    // }
  }

  function unloadFocus() {
    setL(false);
  }

  function onFocus() {
    setF(true);
  }

  function onBlur() {
    setF(false);
  }
}