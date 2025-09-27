import { useEffect, useRef } from "react";
import naviix from "naviix";
import "./App.css";
import BottomBar from "./components/feat/bottom-bar";
import FuncsBar from "./components/feat/funcs-bar";
import TopBar from "./components/feat/top-bar";
import ScrollView from "./components/kit/scroll-view";
import useSound from "./hook/useSound";
import { HomeNvxContext, FocusedContext } from "./context";

function App() {
  const unlockRef = useSound();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nvxRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const focusedRef = useRef<any>(new Map());

  useEffect(() => {
    const nvx1 = [...document.getElementsByClassName("nvx")];
    const nvx2 = [...document.getElementsByClassName("nvx2")];
    nvxRef.current = naviix({
      locs: nvx1,
      subs: {
        locs: nvx2,
        wrap: document.getElementById("gms") as HTMLElement,
      }
    }, { scroll: true });
  }, []);

  return (
    <HomeNvxContext value={nvxRef}>
      <FocusedContext value={focusedRef}>
        <div className="relative w-[1280px] h-[720px] bg-[#ebebeb]">
          <button ref={unlockRef}>unlock sound</button>
          <TopBar />
          <ScrollView />
          <FuncsBar />
          <BottomBar />
        </div>
      </FocusedContext>
    </HomeNvxContext>
  );
}

export default App;
