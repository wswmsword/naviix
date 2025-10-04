import { use, useRef, type KeyboardEvent } from "react";
import FuncBtn from "../kit/func-btn/index";
import { HomeNvxContext, FocusedContext } from "@/context";

export default function FuncsBar() {

  const focusInterval = 56; // 1000 / 60 * 5
  const longPressTime = 300;
  const isKeyPressed = useRef(false);
  const isKeyLongPressed = useRef(false);
  const intervalTimer = useRef(-1);
  const timeoutTimer = useRef(-1);

  const nvx = use(HomeNvxContext);
  const focusRef = use(FocusedContext);

  return <div className="absolute w-full flex justify-center gap-[18px] bottom-[140px]" id="funcs" onKeyDown={onKeyDown} onKeyUp={onKeyUp}>
    <FuncBtn className="bg-[#e60012] border-0"></FuncBtn>
    <FuncBtn>1</FuncBtn>
    <FuncBtn></FuncBtn>
    <FuncBtn></FuncBtn>
    <FuncBtn></FuncBtn>
    <FuncBtn></FuncBtn>
    <FuncBtn></FuncBtn>
    <FuncBtn></FuncBtn>
    <FuncBtn></FuncBtn>
  </div>;

  function onKeyDown(e: KeyboardEvent) {

    const dir = e.key === "ArrowLeft" ? "left" : e.key === "ArrowRight" ? "right" : null;

    if (dir == null) return;

    if (!isKeyPressed.current) {

      focusNextWithCallback(() => {
        isKeyPressed.current = true;
        timeoutTimer.current = window.setTimeout(() => {
          focusNextWithCallback(() => {
            intervalTimer.current = window.setInterval(() => {
              focusNextWithCallback();
            }, focusInterval);
          });
        }, longPressTime);
      });
    }

    function focusNextWithCallback(callback?: () => void) {
      const curE = document.activeElement;
      const nextInfo = nvx?.current[dir as "left" | "right"](curE);
      if (nextInfo) {
        nextInfo.id.focus({ preventScroll: true });
        if (callback) callback();
      } else {
        focusRef?.current.get(document.activeElement).setNR(true);
      }
    }
  }

  function onKeyUp(e: KeyboardEvent) {
    clearInterval(intervalTimer.current);
    clearTimeout(timeoutTimer.current);
    isKeyPressed.current = false;
    isKeyLongPressed.current = false;
  }
}