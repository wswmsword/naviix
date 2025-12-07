import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";

interface Props {
  children: ReactNode
  next: (cur: Element|null, dir: string) => HTMLElement|null
  onEdge?: (cur: Element|null, dir: string) => void
}

/** 长按则滚动，滚动速度由焦点聚焦导航的速度一致，点按有独立的滚动速度，raf 实现 */
export default function ScrollView({ children, next, onEdge }: Props) {
  
  const wrapE = useRef<HTMLDivElement>(null);

  let isKeyPressed = false;
  let isKeyLongPressed = false;
  const longPressTime = 300;
  const scrollSpeed = 2660;
  const dynamicSpeed = useRef(-1);
  const focusInterval = 56; // 1000 / 60 * 5
  const safeWidth = 93; // 矩形的最右侧要在安全宽度左侧，矩形的最左侧要在安全宽度右侧
  /** 按下方向键后首次聚焦 */
  const focusedFirst = useRef(false);
  const moveRRafId = useRef<number>(-1);
  const safeScrollRafId = useRef<number>(-1);
  const dirKeys = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"];

  useEffect(() => {
    detectRefreshRate(rate => {
      dynamicSpeed.current = Math.round(scrollSpeed / rate); // scrollSpeed / Math.round(focusInterval / spf.current)
    });
    function detectRefreshRate(callback: (rate: number) => void, sampleCount = 60) {
      let times: number[] = [];
      let last = performance.now();

      function frame(now: number) {
        const delta = now - last;
        last = now;

        times.push(delta);

        if (times.length < sampleCount) {
          requestAnimationFrame(frame);
        } else {
          // 去掉第一个不准的帧差
          times = times.slice(1);
          // 平均帧间隔（毫秒）
          const avg = times.reduce((a, b) => a + b, 0) / times.length;
          // 刷新率 = 每秒帧数
          const refreshRate = Math.round(1000 / avg);
          callback(refreshRate);
        }
      }

      requestAnimationFrame(frame);
    }
  }, []);

  return <div id="gms"
    className="w-full max-w-[1280px] overflow-x-auto flex gap-[14px] items-center px-[107px] py-[64px] scrollbar-hide absolute top-[130px]"
    ref={wrapE}
    onKeyDown={keyNav}
    onKeyUp={keyUp}>
    {children}
  </div>;

  function keyUp(e: KeyboardEvent) {
    if (dirKeys.includes(e.key)) {
      isKeyPressed = false;
      isKeyLongPressed = false;
      cancelAnimationFrame(moveRRafId.current);
    }
  }

  function keyNav(e: KeyboardEvent) {
    const dirMap = new Map([
      [dirKeys[0], "right"],
      [dirKeys[1], "left"],
      [dirKeys[2], "up"],
      [dirKeys[3], "down"],
    ]);
    const dir: string|undefined = dirMap.get(e.key);
    if (dir !== undefined) e.preventDefault();
    if (dir !== undefined && !isKeyPressed) {
      isKeyPressed = true;
      isKeyLongPressed = false;
      focusedFirst.current = false;
      e.preventDefault();
      cancelAnimationFrame(safeScrollRafId.current);
      moveRRafId.current = requestAnimationFrame(move)
      
    }

    // 聚焦
    // 控制滚动，滚动到安全区域
    let lastFocusTime = -Infinity;

    function move() {
      const cur = Date.now();
      const nextE = next(document.activeElement, dir as string);
      if (nextE) {
        const _wrapE = wrapE.current as HTMLDivElement;
        const outViewFunc = ["left", "right"].includes(dir || "") ? isElementOutOfHorizontalView : isElementOutOfVerticalView;
        const isOutOfView = outViewFunc(nextE.parentElement as HTMLElement, _wrapE);

        if (isOutOfView) {
          _wrapE.scrollLeft += dynamicSpeed.current;
          moveRRafId.current = requestAnimationFrame(move);
          return ;
        }

        if (!focusedFirst.current) {
          focusedFirst.current = true;
          lastFocusTime = cur;
          focusNext(nextE);
          scrollToSafeArea();
          return ;
        } else if (!isKeyLongPressed) {
          if (cur - lastFocusTime > longPressTime) {
            isKeyLongPressed = true;
            lastFocusTime = cur;
            focusNext(nextE);
            scrollToSafeArea();
          } else moveRRafId.current = requestAnimationFrame(move);
        } else {
          if (cur - lastFocusTime > focusInterval) {
            lastFocusTime = cur;
            focusNext(nextE);
            scrollToSafeArea();
          } else moveRRafId.current = requestAnimationFrame(move);
        }

        function scrollToSafeArea() {
          if (nextE == null || nextE.parentElement == null) return ;
          switch (dir) {
            case "right": {
              const elRight = nextE.parentElement.offsetLeft + nextE.offsetWidth;
              const wrapRight = _wrapE.scrollLeft + _wrapE.clientWidth;
              if (wrapRight - elRight > safeWidth) {
                if (isKeyPressed) move();
                return ;
              }
              _wrapE.scrollLeft += dynamicSpeed.current;
              safeScrollRafId.current = requestAnimationFrame(scrollToSafeArea);
              break;
            }
            case "left": {
              const elRight = nextE.parentElement.offsetLeft;
              const wrapRight = _wrapE.scrollLeft;
              if (elRight - wrapRight > safeWidth) {
                if (isKeyPressed) move();
                return ;
              }
              _wrapE.scrollLeft -= dynamicSpeed.current;
              safeScrollRafId.current = requestAnimationFrame(scrollToSafeArea);
              break;
            }
            case "up": {
              const elRight = nextE.parentElement.offsetTop;
              const wrapRight = _wrapE.scrollTop;
              if (elRight - wrapRight > safeWidth) {
                if (isKeyPressed) move();
                return ;
              }
              _wrapE.scrollTop -= dynamicSpeed.current;
              safeScrollRafId.current = requestAnimationFrame(scrollToSafeArea);
              break;
            }
            case "down": {
              const elRight = nextE.parentElement.offsetTop + nextE.offsetHeight;
              const wrapRight = _wrapE.scrollTop + _wrapE.clientHeight;
              if (wrapRight - elRight > safeWidth) {
                if (isKeyPressed) move();
                return ;
              }
              _wrapE.scrollTop += dynamicSpeed.current;
              safeScrollRafId.current = requestAnimationFrame(scrollToSafeArea);
              break;
            }
            default:
              break;
          }
        }
        return ;
      } else {
        if (!isKeyLongPressed) {
          if (cur - lastFocusTime > longPressTime) {
            isKeyLongPressed = true;
            if (onEdge) onEdge(document.activeElement, dir as string);
          } else moveRRafId.current = requestAnimationFrame(move);
        } else {
          if (onEdge) onEdge(document.activeElement, dir as string);
        }
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function focusNext(nextE: any) {
    nextE.focus({ preventScroll: true });
  }

  /** 元素部分进入视图 */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function isElementPartiallyVisibleInHorizontalView(el: HTMLElement, container: HTMLElement) {
    const elLeft = el.offsetLeft;
    const elRight = elLeft + el.offsetWidth;
    
    const viewLeft = container.scrollLeft;
    const viewRight = viewLeft + container.clientWidth;

    return (elLeft < viewRight && elRight > viewRight) || (elLeft < viewLeft && elRight > viewLeft);
  }

  /** 元素完全没有进入视图 */
  function isElementOutOfHorizontalView(el: HTMLElement, container: HTMLElement) {
    const elLeft = el.offsetLeft;
    const elRight = elLeft + el.offsetWidth;
    
    const viewLeft = container.scrollLeft;
    const viewRight = viewLeft + container.clientWidth;

    return elLeft > viewRight || elRight < viewLeft;
  }

  /** 元素完全没有进入纵向视图 */
  function isElementOutOfVerticalView(el: HTMLElement, container: HTMLElement) {
    const elTop = el.offsetTop;
    const elBottom = elTop + el.offsetHeight;
    
    const viewTop = container.scrollTop;
    const viewBottom = viewTop + container.clientHeight;

    return elTop > viewBottom || elBottom < viewTop;
  }

  /** 元素完全进入视图 */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function isElementInHorizontalView(el: HTMLElement, container: HTMLElement) {
    const elLeft = el.offsetLeft;
    const elRight = elLeft + el.offsetWidth;
    
    const viewLeft = container.scrollLeft;
    const viewRight = viewLeft + container.clientWidth;

    return elRight < viewRight && elLeft > viewLeft;
  }

}