import "./App.css";
import BottomBar from "./components/feat/bottom-bar";
import FuncsBar from "./components/feat/funcs-bar";
import TopBar from "./components/feat/top-bar";
import ScrollView from "./components/kit/scroll-view";
import useSound from "./hook/useSound";

function App() {
  const unlockRef = useSound();
  return (
    <div className="relative w-[1280px] h-[720px] bg-[#ebebeb]">
      <button ref={unlockRef}>unlock sound</button>
      <TopBar />
      <ScrollView />
      <FuncsBar />
      <BottomBar />
    </div>
  );
}

export default App;
