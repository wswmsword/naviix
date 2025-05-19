import SideBar from "./components/side-bar";
import ReviewSongs from "./components/review-songs";
import MadeForU from "./components/made-for-u";
import MusicChips from "./components/music-chips";
import { use, useEffect, useRef } from "react";
import { FocusContext } from "./context";
import focux from "focux";
import type { KeyboardEvent } from "react";

function App() {

  const fc = use(FocusContext);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const focuXMap = useRef<any>(null);
  const curDir = fc?.curDir || { current: "" };
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    updateFocuxMap();

    setTimeout(() => {
      document.getElementById("bg")?.focus();
    }, 16);

    const ro = new ResizeObserver(() => {
      updateFocuxMap();
    });

    // 观察一个或多个元素
    ro.observe(container.current as HTMLDivElement);
  }, []);

  return (
    <div id="bg" className="flex h-full relative overflow-hidden" onKeyDown={nav} tabIndex={-1} ref={container}>
      <div aria-hidden className={`absolute text-9xl font-bold text-[#1f2f4d] -bottom-6 right-3 italic pointer-events-none h z-0`}>Focux</div>
      <h1 className={`absolute text-9xl font-bold text-[#1f2f4d] -bottom-6 right-3 italic hh z-0`}>Focux</h1>
      <SideBar updateFocuxMap={updateFocuxMap} />
      <div className="py-4 shrink min-w-0 grow overflow-y-auto z-1">
        <MusicChips />
        <ReviewSongs updateFocuxMap={updateFocuxMap} />
        <MadeForU />
      </div>
    </div>
  );

  function mapLoc(e: HTMLElement) {
    const t = (e as HTMLElement).getBoundingClientRect();
    const { x, y, width, height } = t;
    const halfW = width / 2;
    const halfH = height / 2;
    return { id: e, loc: [x + halfW, -y - halfH, halfW, halfH] };
  }

  function nav(e: KeyboardEvent<HTMLDivElement>) {
    const cur = document.activeElement;
    curDir.current = "e"; // Enter
    if (cur?.id === "bg" && ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      focuXMap.current.keys().next().value.focus();
    } else {
      const next = focuXMap.current.get(cur);
      if (next) {
        let nextE: HTMLButtonElement | null = null;
        if (e.key === "ArrowDown") {
          curDir.current = "d";
          if (next.down) nextE = next.down.id;
        } else if (e.key === "ArrowUp") {
          curDir.current = "u";
          if (next.up) nextE = next.up.id;
        } else if (e.key === "ArrowLeft") {
          curDir.current = "l";
          if (next.left) nextE = next.left.id;
        } else if (e.key === "ArrowRight") {
          curDir.current = "r";
          if (next.right) nextE = next.right.id;
        }
        if (nextE) nextE.focus();
        else {
          const animeFocusHandlerRef = fc?.animeFocusHandlerRef;
          animeFocusHandlerRef?.current.get(cur?.parentElement as HTMLDivElement)?.();
        }
      }
    }
    if (["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
    }
  }

  function updateFocuxMap() {
    const es = fc?.getFocusableElements();
    const locs = (es || []).map(mapLoc).filter(item => item.loc[2] !== 0);
    // const listEs = fc?.groupElementsRef.current.get("list") || [];
    // const listLocs = listEs.map(mapLoc);
    // const config = {
    //   locs,
    //   subs: {
    //     wrap: listLocs.slice(-1)[0],
    //     locs: listLocs.slice(0, -1),
    //   }
    // };
    // focuXMap.current = focux(config);
    focuXMap.current = focux(locs);
  }
}

export default App;
