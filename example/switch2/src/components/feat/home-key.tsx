import { use, useRef, type KeyboardEvent, type ReactNode } from "react";
import { HomeNvxContext, BorderAnimeContext, SoundContext } from "@/context";

const keyDirMap = new Map([
  ["ArrowLeft", "left"],
  ["ArrowRight", "right"],
  ["ArrowUp", "up"],
  ["ArrowDown", "down"],
])

export default function HomeKey({ children }: { children: ReactNode }) {

  const focusInterval = 56; // 1000 / 60 * 5
  const longPressTime = 300;
  const isKeyPressed = useRef(false);
  const intervalTimer = useRef(-1);
  const timeoutTimer = useRef(-1);

  const nvx = use(HomeNvxContext);
  const focusRef = use(BorderAnimeContext);
  const soundCtx = use(SoundContext);

  return <div
    className="relative w-full h-full bg-[#ebebeb]"
    onKeyDown={onKeydown}
    onKeyUp={onKeyup}>
    { children }
  </div>;

  function onKeydown(e: KeyboardEvent) {

    const scrollViewWrap = document.getElementById("gms");
    const dir = keyDirMap.get(e.key);

    if (dir == null) return; // 只监测方向键
    if (scrollViewWrap?.contains(e.target as Node)
      && ["left", "right"].includes(dir)) return; // 不监测滚动区域的左右导航

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
      const nextInfo = nvx?.current[dir as string](curE, true);
      if (nextInfo) {
        nextInfo.id.focus({ preventScroll: true });
        if (callback) callback();
      } else {
        soundCtx?.playSound("border");
        focusRef?.current.get(document.activeElement)?.[dir as string](true);
      }
    }

  }

  function onKeyup() {
    clearInterval(intervalTimer.current);
    clearTimeout(timeoutTimer.current);
    isKeyPressed.current = false;
  }
}