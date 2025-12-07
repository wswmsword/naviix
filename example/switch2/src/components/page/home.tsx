import { use, useEffect, useRef } from "react";
import naviix from "naviix";
import BottomBar from "../feat/bottom-bar";
import FuncsBar from "../feat/funcs-bar";
import TopBar from "../feat/top-bar";
import ScrollView from "../kit/scroll-view";
import { BorderAnimeContext, HomeNvxContext, SoundContext } from "@/context";
import HomeKey from "../feat/home-key";
import GameBtn from "../kit/game-btn";

function Home() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nvxRef = useRef<any>(null);
  const focusRef = use(BorderAnimeContext);
  const soundCtx = use(SoundContext);
  const games = [{
      src: "/src/assets/game/tok.avif",
      name: "塞尔达传说 王国之泪",
    }, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

  useEffect(() => {
    const nvx1 = [...document.getElementsByClassName("nvx")];
    const nvx2 = [...document.getElementsByClassName("nvx2")];
    const nvx3 = [...document.getElementsByClassName("nvx3")]; // 底部功能区
    nvxRef.current = naviix([{
        locs: nvx1,
        wrap: document.getElementById("usr-bar") as HTMLElement,
      }, {
        locs: nvx2,
        wrap: document.getElementById("gms") as HTMLElement,
      }, {
        locs: nvx3,
        wrap: document.getElementById("funcs") as HTMLElement,
      }], { scroll: true });
  }, []);

  return (
    <HomeNvxContext value={nvxRef}>
      <HomeKey>
        <TopBar />
        <ScrollView next={getNextE} onEdge={onEdge}>
          {games.map((g, i) => <GameBtn
            src={g.src}
            name={g.name}
            key={i} />)}
        </ScrollView>
        <FuncsBar />
        <BottomBar />
      </HomeKey>
    </HomeNvxContext>
  );

  function getNextE(cur: Element|null, dir: string) {
    return nvxRef?.current[dir](cur)?.id;
  }

  function onEdge(cur: Element|null, dir: string) {
    soundCtx?.playSound("border");
    focusRef?.current.get(cur)[dir](true);
  }
}

export default Home;
