import { use, useEffect, useState, type AnimationEvent, type KeyboardEvent } from "react";
import styles from "./index.module.css";
import { FocusedContext } from "@/context";
import clsx from "clsx";

export default function GameBtn({ ref, src }: { ref: (e: HTMLButtonElement | null) => void, src?: string }) {

  const focusedRef = use(FocusedContext);

  const [a1, setA] = useState(false);
  const [a2, setA2] = useState(false);

  const [focused, setF] = useState(false);
  const [loadedFocus, setL] = useState(false);

  const [noL, setNL] = useState(false);
  const [noR, setNR] = useState(false);

  const fadeout = loadedFocus === true && focused === false;

  useEffect(() => {
    if (focused) setL(true);
  }, [focused]);

  return <div className="relative text-[0px]">
    <button
      className={`nvx2 relative w-64 h-64 shrink-0 bg-[#ececec] inset-ring-3 inset-ring-white outline-0 ${styles.btn} ${clsx({ [styles.a]: a1 })}`}
      ref={e => {
        ref(e);
        focusedRef?.current.set(e, {
          setNL,
          setNR
        });
      }}
      onKeyDown={onKeyD}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      onAnimationEndCapture={onAE}>
      <img src={src} />
      <span
        className={`inline-block absolute top-0 left-0 w-full h-full bg-cover ${styles.animeP} ${a2 ? styles.a2 : ""}`} style={{ backgroundImage: `url(${src})` }}
        onAnimationEnd={onAE2}></span>
    </button>
    {(loadedFocus || focused) &&
      <span className={`absolute -inset-2 text-[0px] pointer-events-none ${clsx({ [styles.l]: noL, [styles.r]: noR })}`}>
        <span
          className={`block w-full h-full ${styles.fb} ${fadeout ? styles.op : ""}`}
          onTransitionEnd={unloadFocus}></span>
      </span>}
  </div>;


  function onKeyD(e: KeyboardEvent) {
    if (a1) return;
    if (e.code === "Space" || e.code === "Enter") {
      setA(true);
      e.preventDefault();
    }
  }

  function onClick() {
    if (a1) return;
    setA(true);
  }

  function onAE(e: AnimationEvent) {
    if (e.animationName === styles.anime0) {
      setA2(true);
    }
  }

  function onAE2() {
    setA2(false);
    setA(false);
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