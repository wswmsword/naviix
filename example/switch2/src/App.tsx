import { use, useRef, useState } from "react";
import "./App.css";
import { BorderAnimeContext, SoundContext, PageContext } from "./context";
import SoundProvider from "./components/context/sound";
import Home from "./components/page/home";
import { AnimatePresence, motion } from "motion/react";
import Settings from "./components/page/settings";

function App() {
  const [page, setP] = useState("home");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const focusedRef = useRef<any>(new Map());

  const pageCtxVal = {
    page,
    setP,
  };

  const motionProps = {
    initial: { opacity: 0, scale: 0.6 },
    animate: {
        opacity: 1,
        scale: 1,
        ease: [0.02, 0.35, 0.25, 0.99],
    },
    exit: {
        opacity: 0,
        scale: 0.8,
        ease: [0.46, 0.04, 0.97, 0.44],
    },
    transition: { duration: 0.3 },
  }

  return (
    <PageContext value={pageCtxVal}>
      <BorderAnimeContext value={focusedRef}>
        <SoundProvider>
          <UnlockBtn />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={page} {...motionProps} className="w-full h-full">
              {page === "home" && <Home />}
              {page === "settings" && <Settings />}
            </motion.div>
          </AnimatePresence>
        </SoundProvider>
      </BorderAnimeContext>
    </PageContext>
  );
}

function UnlockBtn() {

  const soundContext = use(SoundContext);

  return <button onClick={unlockSound} className="fixed z-20">unlock sound</button>;

  function unlockSound() {
    console.log(soundContext?.unlockNLoad)
    soundContext?.unlockNLoad();
  }
}

export default App;
