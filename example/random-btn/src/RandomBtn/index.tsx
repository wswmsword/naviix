import { useEffect, useRef, useState, KeyboardEvent, useImperativeHandle } from "react";
import naviix from "naviix";
import styles from "./index.module.css";
import { motion, useAnimation } from "framer-motion";

interface RandomButtonsProps {
  maxCount: number;
}

interface ButtonData {
  id: number;
  top: number;
  left: number;
  width: number;
  height: number;
}

export default function RandomButtons({ maxCount }: RandomButtonsProps) {
  const [buttons, setButtons] = useState<ButtonData[]>([]);
  const btnsRef = useRef<(HTMLElement|null)[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const focuXMap = useRef<any>(null);
  const curDir = useRef<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const btnsAnime = useRef<any>(new Map());

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15, // 每个子按钮间隔动画时间
      },
    },
  };
  

  const generateButtons = () => {
    const count = Math.floor(Math.random() * maxCount) + 1;
    const newButtons: ButtonData[] = Array.from({ length: count }, (_, index) => ({
      id: index,
      top: Math.random() * 60 + 20,
      left: Math.random() * 80 + 10,
      width: 80 + Math.random() * 70,
      height: 80 + Math.random() * 70,
    }));
    setButtons(newButtons);
    setTimeout(() => {
      document.getElementById("bg")?.focus();
    }, 16);
  };

  useEffect(() => {
    generateButtons();
  }, [maxCount]);

  useEffect(() => {
    const squares = btnsRef.current.filter(b => b != null).map((e) => {
      const t = (e as HTMLElement).getBoundingClientRect();
      const { x, y, width, height } = t;
      const halfW = width / 2;
      const halfH = height / 2;
      return { id: e, loc: [x + halfW, -y - halfH, halfW, halfH] as [number, number, number, number] };
    });
    if (squares.length === 0) return;
    focuXMap.current = naviix(squares);
  }, [buttons])

  useEffect(() => {
    setTimeout(() => {
      document.getElementById("bg")?.focus();
    }, 16);
  }, []);

  return (
    <motion.div
      key={buttons.length}
      variants={containerVariants}
      initial="hidden"
      animate="visible" id="bg" className="relative w-full h-screen overflow-hidden" onKeyDown={nav} tabIndex={-1}>
      <h1 aria-hidden className={`absolute text-9xl font-bold text-[#1f2f4d] -bottom-6 right-3 italic pointer-events-none ${styles.h}`}>Naviix</h1>
      <h1 className={`absolute text-9xl font-bold text-[#1f2f4d] -bottom-6 right-3 italic ${styles.hh}`}>Naviix</h1>
      <p className="absolute text-8xl font-semibold text-[#1f2f4d]">请使用键盘的上、下、左、右键完成导航</p>
      {buttons.map((button, i) => <Btn key={i} bInfo={button} ref={e => { btnsRef.current[i] = e }} clickCb={generateButtons} curDir={curDir} animeRef={e => { btnsAnime.current.set(btnsRef.current[i], e) }} />)}
    </motion.div>
  );

  function nav(e: KeyboardEvent<HTMLDivElement>) {
    const cur = document.activeElement;
    curDir.current = "e"; // Enter
    if (cur?.id === "bg" && ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      btnsRef.current[0]?.focus();
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
          btnsAnime.current.get(cur)?.handleFocus();
        }
      }
    }
  }
}

function Btn({ clickCb, bInfo, ref, curDir, animeRef }) {

  const controls = useAnimation();
  const [f, setF] = useState(false);

  const handleFocus = () => {
    const xy = curDir.current === "u" ? { y: [-25, 0] } : curDir.current === "d" ? { y: [25, 0] } : curDir.current === "l" ? { x: [-25, 0] } : curDir.current === "r" ? { x: [25, 0] } : { scale: [0.8, 1] }
    controls.start({
      ...xy,
      transition: { duration: 0.5 },
    });
    setF(true);
  };

  const btnVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
  };

  useImperativeHandle(animeRef, () => ({
    handleFocus,
  }));

  return <motion.span
    style={{
      position: "absolute",
      top: `${bInfo.top}%`,
      left: `${bInfo.left}%`,
      width: `${bInfo.width}px`,
      height: `${bInfo.height}px`,
      zIndex: f ? 2 : undefined,
    }}
    variants={btnVariants}>
    <motion.button
      onFocus={handleFocus}
      onBlur={() => setF(false)}
      animate={controls}
      whileHover={{ scale: 1.2, transition: { duration: 0.1 } }}
      ref={ref}
      onClick={clickCb}
      className={`${styles.rb} px-4 py-2 rounded-xl shadow-sm active:scale-95 focus:z-10`}>
      <span className={`${styles.rbt2} pointer-events-none`} aria-hidden="true">B{bInfo.id + 1}</span>
      <span className={styles.rbt}>B{bInfo.id + 1}</span>
    </motion.button>
  </motion.span>;
}