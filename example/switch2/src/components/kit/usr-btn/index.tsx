import { use, useEffect, useState, type AnimationEvent, type KeyboardEvent } from "react";
import styles from "./index.module.css";
import clsx from "clsx";
import { cn } from "@/lib/utils";
import { BorderAnimeContext, SoundContext } from "@/context";
import useButtomBar from "@/store/useBBar";

export default function UsrBtn({ src, name, className }: { src: string, name: string } & React.ComponentProps<"button">) {

  const focusedRef = use(BorderAnimeContext);
  const { setTopBarContext } = useButtomBar();
  const soundCtx = use(SoundContext);

  const [a1, setA] = useState(false);
  const [a2, setA2] = useState(false);

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

  return <div className="relative text-[0px] w-[60px] h-[60px]">
    <div className={cn("w-full h-full", a1 ? styles.a : "")} onAnimationEndCapture={onAE}>
      <button
        className={cn("nvx absolute border-[3px] border-white rounded-full outline-0 inset-0",
          styles.btn,
          focused ? "-inset-0.5" : "",
          className,
        )}
        onKeyDown={onKeyD}
        onClick={onClick}
        onFocus={onFocus}
        onBlur={onBlur}
        ref={e => {
          focusedRef?.current.set(e, {
            left: setNL,
            right: setNR,
            up: setNU,
            down: setND,
          });
        }}>
        <img src={src} alt={name} className="rounded-full" />
        <span
          className={`inline-block absolute top-0 left-0 w-full h-full bg-cover rounded-full ${className} ${styles.animeP} ${a2 ? styles.a2 : ""}`} style={{ backgroundImage: `url(${src})` }}
          onAnimationEnd={onAE2}></span>
      </button>
      {(loadedFocus || focused) && <>
        <span
          className={`absolute -inset-1.5 text-[0px] pointer-events-none ${clsx({ [styles.l]: noL, [styles.r]: noR, [styles.u]: noU, [styles.d]: noD })}`}
          onAnimationEndCapture={onFocusAnimeEnd}>
          <span
            className={`block w-full h-full ${styles.fb} ${fadeout ? styles.op : ""}`}
            onTransitionEnd={unloadFocus}></span>
        </span>
      </>}
    </div>
    {name && <div className={`absolute left-0 bottom-0 flex flex-nowrap justify-center w-full whitespace-nowrap ${styles.funcName} ${focused ? "opacity-100" : "opacity-0"}`}>{name}</div>}
  </div>;

  function onFocusAnimeEnd(e: AnimationEvent) {
    if ([styles.reboundR, styles.reboundL, styles.reboundU, styles.reboundD].includes(e.animationName)) {
      setNL(false);
      setNR(false);
      setNU(false);
      setND(false);
    }
  }

  function onKeyD(e: KeyboardEvent) {
    if (a1) return;
    if (src == null) return;
    if (e.code === "Space" || e.code === "Enter") {
      setA(true);
      e.preventDefault();
    }
  }

  function onClick() {
    if (a1) return;
    if (src == null) return;
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
    soundCtx?.playSound("select");
    setF(true);
    setTopBarContext();
  }

  function onBlur() {
    setF(false);
  }
}