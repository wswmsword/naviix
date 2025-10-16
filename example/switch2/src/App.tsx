import { use, useEffect, useRef } from "react";
import naviix from "naviix";
import "./App.css";
import BottomBar from "./components/feat/bottom-bar";
import FuncsBar from "./components/feat/funcs-bar";
import TopBar from "./components/feat/top-bar";
import ScrollView from "./components/kit/scroll-view";
import { HomeNvxContext, BorderAnimeContext, SoundContext } from "./context";
import SoundProvider from "./components/context/sound";
import HomeKey from "./components/feat/home-key";

function App() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nvxRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const focusedRef = useRef<any>(new Map());

  useEffect(() => {
    const nvx1 = [...document.getElementsByClassName("nvx")];
    const nvx2 = [...document.getElementsByClassName("nvx2")];
    const nvx3 = [...document.getElementsByClassName("nvx3")]; // 底部功能区
    nvxRef.current = naviix({
      locs: nvx1,
      subs: [{
        locs: nvx2,
        wrap: document.getElementById("gms") as HTMLElement,
      }, {
        locs: nvx3,
        wrap: document.getElementById("funcs") as HTMLElement,
      }]
    }, { scroll: true });
  }, []);

  return (
    <HomeNvxContext value={nvxRef}>
      <BorderAnimeContext value={focusedRef}>
        <SoundProvider>
          <HomeKey>
            <UnlockBtn />
            <TopBar />
            <ScrollView />
            <FuncsBar />
            <BottomBar />
          </HomeKey>
        </SoundProvider>
      </BorderAnimeContext>
    </HomeNvxContext>
  );
}

function UnlockBtn() {

  const soundContext = use(SoundContext);

  return <button onClick={unlockSound}>unlock sound</button>;

  function unlockSound() {
    console.log(soundContext?.unlockNLoad)
    soundContext?.unlockNLoad();
  }
}

export default App;
