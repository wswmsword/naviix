import naviix from "naviix";
import { useEffect, useRef, type KeyboardEvent } from "react";

/** 长按则滚动，滚动速度由焦点聚焦导航的速度一致，点按有独立的滚动速度，raf 实现 */
export default function ScrollView() {
  const games = new Array(50).fill(0);
  const gamesE = useRef<(HTMLButtonElement)[]>([]);
  const wrapE = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const x = useRef<any>(null);

  useEffect(() => {
    x.current = naviix(gamesE.current);
  }, []);

  return <div id="gms" className="border w-full max-w-7xl h-30 overflow-x-auto flex gap-3 items-center px-3" ref={wrapE} onKeyDown={keyNav}>
    {games.map((g, i) => <button className="w-20 h-20 border shrink-0 rounded-sm" key={i} ref={e => { if(e) gamesE.current[i] = e }}>1</button>)}
  </div>;

  function keyNav(e: KeyboardEvent) {
    const nextInfo = x.current.get(e.target);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      if (nextInfo.right) {
        const nextE = nextInfo.right.id;
        const _wrapE = wrapE.current as HTMLDivElement;
        const isInView = isElementInHorizontalView(nextE, _wrapE);
        if (!isInView) {
          // gap 12px, w/3 30px
          const elRight = nextE.offsetLeft + nextE.offsetWidth;
          const wrapRight = _wrapE.scrollLeft + _wrapE.clientWidth;
          const extraW = elRight - wrapRight;
          _wrapE.scrollTo({ left: _wrapE.scrollLeft + extraW + 42, behavior: "smooth" });
        }
        nextE.focus({ preventScroll: true });
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (nextInfo.left) {
        const _wrapE = wrapE.current as HTMLDivElement;
        const nextE = nextInfo.left.id;
        const isInView = isElementInHorizontalView(nextE, wrapE.current as HTMLDivElement);
        if (!isInView) {
          const elRight = nextE.offsetLeft + nextE.offsetWidth;
          const wrapLeft = _wrapE.scrollLeft;
          const extraW = nextE.offsetWidth - (elRight - wrapLeft);
          _wrapE.scrollTo({ left: _wrapE.scrollLeft - extraW - 42, behavior: "smooth" });
        }
        nextE.focus({ preventScroll: true });
      }
    }
  }

  function isElementInHorizontalView(el: HTMLElement, container: HTMLElement) {
    const elLeft = el.offsetLeft;
    const elRight = elLeft + el.offsetWidth;
    
    const viewLeft = container.scrollLeft;
    const viewRight = viewLeft + container.clientWidth;

    return elRight < viewRight && elLeft > viewLeft;
  }

}