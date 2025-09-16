import naviix from "naviix";
import { useEffect, useRef, type KeyboardEvent } from "react";
import GameBtn from "./game-btn";

/** 长按则滚动，滚动速度由焦点聚焦导航的速度一致，点按有独立的滚动速度，raf 实现 */
export default function ScrollView() {
  const games = new Array(50).fill(null);
  games[0] = "/src/assets/game/tok.avif";
  const gamesE = useRef<(HTMLButtonElement)[]>([]);
  const wrapE = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const x = useRef<any>(null);

  useEffect(() => {
    x.current = naviix(gamesE.current);
  }, []);

  let isKeyPressed = false;
  let isKeyLongPressed = false;
  const longPressTime = 300;
  const scrollSpeed = 160;
  const dynamicSpeed = useRef(-1);
  const focusInterval = 84; // 1000 / 60 * 5
  const safeWidth = 93; // 矩形的最右侧要在安全宽度左侧，矩形的最左侧要在安全宽度右侧
  /** 按下方向键后首次聚焦 */
  const focusedFirst = useRef(false);
  const moveRRafId = useRef<number>(-1);
  const safeScrollRafId = useRef<number>(-1);
  const spf = useRef<number>(-1);

  useEffect(() => {
    detectRefreshRate(rate => {
      spf.current = 1000 / rate;
      dynamicSpeed.current = Math.round(scrollSpeed * 1000 / rate / focusInterval); // scrollSpeed / Math.round(focusInterval / spf.current)
      // console.log(Math.round(focusInterval / spf.current), spf.current, dynamicSpeed.current)
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

  return <div id="gms" className="w-full max-w-7xl overflow-x-auto flex gap-[14px] items-center px-[107px] py-16 scrollbar-hide absolute top-[130px]" ref={wrapE}
    onKeyDown={keyNav}
    onKeyUp={keyUp}>
    {games.map((g, i) => <GameBtn
      src={g}
      ref={e => { if(e) gamesE.current[i] = e }} key={i} />)}
  </div>;

  function keyUp(e: KeyboardEvent) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      isKeyPressed = false;
      isKeyLongPressed = false;
      cancelAnimationFrame(moveRRafId.current);
    }
  }

  function keyNav(e: KeyboardEvent) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") e.preventDefault();
    if (e.key === "ArrowRight" && !isKeyPressed) {
      isKeyPressed = true;
      isKeyLongPressed = false;
      focusedFirst.current = false;
      e.preventDefault();
      cancelAnimationFrame(safeScrollRafId.current);
      moveRRafId.current = requestAnimationFrame(moveR)

      // 聚焦
      // 控制滚动，滚动到安全区域
      let lastFocusTime = -Infinity;

      function moveR() {
        const cur = Date.now();
        const nextInfo = x.current.get(document.activeElement);
        if (nextInfo.right) {
          const nextE = nextInfo.right.id;
          const _wrapE = wrapE.current as HTMLDivElement;

          const isOutOfView = isElementOutOfHorizontalView(nextE, _wrapE);

          if (isOutOfView) {
            _wrapE.scrollLeft += dynamicSpeed.current;
            moveRRafId.current = requestAnimationFrame(moveR);
            return ;
          }

          if (!focusedFirst.current) {
            focusedFirst.current = true;
            lastFocusTime = cur;
            nextE.focus({ preventScroll: true });
            scrollToSafeArea();
            return ;
          } else if (!isKeyLongPressed) {
            if (cur - lastFocusTime > longPressTime) {
              isKeyLongPressed = true;
              lastFocusTime = cur;
              nextE.focus({ preventScroll: true });
              scrollToSafeArea();
            } else moveRRafId.current = requestAnimationFrame(moveR);
          } else {
            if (cur - lastFocusTime > focusInterval) {
              lastFocusTime = cur;
              nextE.focus({ preventScroll: true });
              scrollToSafeArea();
            } else moveRRafId.current = requestAnimationFrame(moveR);
          }

          function scrollToSafeArea() {
            const elRight = nextE.offsetLeft + nextE.offsetWidth;
            const wrapRight = _wrapE.scrollLeft + _wrapE.clientWidth;
            if (wrapRight - elRight > safeWidth) {
              if (isKeyPressed) moveR();
              return ;
            }
            _wrapE.scrollLeft += dynamicSpeed.current;
            safeScrollRafId.current = requestAnimationFrame(scrollToSafeArea);
          }
          return ;
        }
      }
      
    } else if (e.key === "ArrowLeft" && !isKeyPressed) {
      isKeyPressed = true;
      isKeyLongPressed = false;
      focusedFirst.current = false;
      e.preventDefault();
      cancelAnimationFrame(safeScrollRafId.current);
      moveRRafId.current = requestAnimationFrame(moveR)

      // 聚焦
      // 控制滚动，滚动到安全区域
      let lastFocusTime = -Infinity;

      function moveR() {
        const cur = Date.now();
        const nextInfo = x.current.get(document.activeElement);
        if (nextInfo.left) {
          const nextE = nextInfo.left.id;
          const _wrapE = wrapE.current as HTMLDivElement;

          const isOutOfView = isElementOutOfHorizontalView(nextE, _wrapE);

          if (isOutOfView) {
            _wrapE.scrollLeft -= dynamicSpeed.current;
            moveRRafId.current = requestAnimationFrame(moveR);
            return ;
          }

          if (!focusedFirst.current) {
            focusedFirst.current = true;
            lastFocusTime = cur;
            nextE.focus({ preventScroll: true });
            scrollToSafeArea();
            return ;
          } else if (!isKeyLongPressed) {
            if (cur - lastFocusTime > longPressTime) {
              isKeyLongPressed = true;
              lastFocusTime = cur;
              nextE.focus({ preventScroll: true });
              scrollToSafeArea();
            } else moveRRafId.current = requestAnimationFrame(moveR);
          } else {
            if (cur - lastFocusTime > focusInterval) {
              lastFocusTime = cur;
              nextE.focus({ preventScroll: true });
              scrollToSafeArea();
            } else moveRRafId.current = requestAnimationFrame(moveR);
          }

          function scrollToSafeArea() {
            const elRight = nextE.offsetLeft;
            const wrapRight = _wrapE.scrollLeft;
            if (elRight - wrapRight > safeWidth) {
              if (isKeyPressed) moveR();
              return ;
            }
            _wrapE.scrollLeft -= dynamicSpeed.current;
            safeScrollRafId.current = requestAnimationFrame(scrollToSafeArea);
          }
          return ;
        }
      }
    }
  }

  /** 元素部分进入视图 */
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

  /** 元素完全进入视图 */
  function isElementInHorizontalView(el: HTMLElement, container: HTMLElement) {
    const elLeft = el.offsetLeft;
    const elRight = elLeft + el.offsetWidth;
    
    const viewLeft = container.scrollLeft;
    const viewRight = viewLeft + container.clientWidth;

    return elRight < viewRight && elLeft > viewLeft;
  }

}