import { useEffect, useRef } from "react";
import naviix from "naviix";
import BottomBar from "../feat/bottom-bar";
import FuncsBar from "../feat/funcs-bar";
import TopBar from "../feat/top-bar";
import ScrollView from "../kit/scroll-view";
import { HomeNvxContext } from "@/context";
import HomeKey from "../feat/home-key";

function Home() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nvxRef = useRef<any>(null);

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
        <ScrollView />
        <FuncsBar />
        <BottomBar />
      </HomeKey>
    </HomeNvxContext>
  );
}

export default Home;
