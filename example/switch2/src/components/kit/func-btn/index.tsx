import { cn } from "@/lib/utils"
import styles from "./index.module.css";
import { useRef, useState, type KeyboardEvent, type MouseEvent, type AnimationEvent, useEffect, use } from "react";
import clsx from "clsx";
import { BorderAnimeContext } from "@/context";

/** 伴随按钮动画结束执行操作，或延迟指定时间执行操作（延迟时间内忽略其它操作） */
export default function FuncBtn({ className, children, onClick: _oc, name }: React.ComponentProps<"button">) {

  const [animating, setA] = useState(false);
  const clickE = useRef<MouseEvent<HTMLButtonElement>>(null);

  const focusedRef = use(BorderAnimeContext);

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

  return <div className="relative text-[0px] w-[72px] h-[72px]">
    <button
      onKeyDown={onKeyD}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      onAnimationEnd={onAE}
      className={cn("nvx3 absolute inset-0 rounded-full bg-white border border-[#dfdfdf] flex items-center justify-center outline-0",
        animating ? styles.animating : "",
        focused ? styles.focused : "",
        styles.btn,
        className)}
      ref={e => {
        focusedRef?.current.set(e, {
          left: setNL,
          right: setNR,
          up: setNU,
          down: setND,
        });
      }}>
      <span className="relative text-base">
        { children }
      </span>
    </button>
    {(loadedFocus || focused) &&
      <span
        className={`absolute -inset-2 text-[0px] pointer-events-none z-10 ${clsx({ [styles.l]: noL, [styles.r]: noR, [styles.u]: noU, [styles.d]: noD })}`}
        onAnimationEndCapture={onFocusAnimeEnd}>
        <span
          className={`block w-full h-full ${styles.fb} ${fadeout ? styles.op : ""}`}
          onTransitionEnd={unloadFocus}></span>
      </span>}
    {/* 标题 */}
    {name && <div className={`absolute text-2xl left-0 bottom-0 flex flex-nowrap justify-center w-full whitespace-nowrap ${styles.funcName} ${focused ? "opacity-100" : "opacity-0"}`}>{name}</div>}
  </div>;

  function onKeyD(e: KeyboardEvent) {
    if (animating) return;
    if (e.code === "Space" || e.code === "Enter") {
      setA(true);
      e.preventDefault();
    }
  }

  function onClick(e: MouseEvent<HTMLButtonElement>) {
    if (animating) return;
    setA(true);
    clickE.current = e;
  }

  function onAE() {
    setA(false);
    if (_oc && clickE.current) _oc(clickE.current);
  }

  function onFocusAnimeEnd(e: AnimationEvent) {
    if ([styles.reboundR, styles.reboundL, styles.reboundU, styles.reboundD].includes(e.animationName)) {
      setNL(false);
      setNR(false);
      setNU(false);
      setND(false);
    }
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