import { useEffect, useRef, useState, KeyboardEvent } from "react";
import focux from "focux";
import styles from "./index.module.css";

interface RandomButtonsProps {
  maxCount: number;
}

interface ButtonData {
  id: number;
  top: number;
  left: number;
}

export default function RandomButtons({ maxCount }: RandomButtonsProps) {
  const [buttons, setButtons] = useState<ButtonData[]>([]);
  const btnsRef = useRef<(HTMLElement|null)[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const focuXMap = useRef<any>(null);

  const generateButtons = () => {
    const count = Math.floor(Math.random() * maxCount) + 1;
    const newButtons: ButtonData[] = Array.from({ length: count }, (_, index) => ({
      id: index,
      top: Math.random() * 90,
      left: Math.random() * 90,
    }));
    setButtons(newButtons);
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
      return { id: e, loc: [x + halfW, -y - halfH, halfW, halfH] };
    });
    if (squares.length === 0) return;
    focuXMap.current = focux(squares);
  }, [buttons])

  return (
    <div id="bg" className="relative w-full h-screen bg-[#0b162c] overflow-hidden" onKeyDown={nav} tabIndex={0}>
      <h1 className="absolute text-9xl font-bold text-[#1f2f4d] -bottom-6 right-3 italic">Focux</h1>
      <p className="absolute text-8xl font-semibold text-[#1f2f4d]">请使用键盘的上、下、左、右键完成导航</p>
      {buttons.map((button, i) => (
        <button
          ref={e => { btnsRef.current[i] = e }}
          key={button.id}
          onClick={generateButtons}
          style={{
            position: "absolute",
            top: `${button.top}%`,
            left: `${button.left}%`,
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            background: "rgba(255, 255, 255, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
          className={`${styles.rb} px-4 py-2 text-white rounded-full shadow-sm transition transform hover:scale-110 focus:scale-110 active:scale-95 hover:bg-white hover:bg-opacity-30 focus:outline-none`}
        >
          Button {button.id + 1}
          <span className={styles.s}>🌟</span>
          <span className={styles.s2}>🌟</span>
        </button>
      ))}
    </div>
  );

  function nav(e: KeyboardEvent<HTMLDivElement>) {
    const cur = document.activeElement;
    if (cur?.id === "bg") {
      btnsRef.current[0]?.focus();
    } else {
      const next = focuXMap.current.get(cur);
      if (next) {
        if (e.key === "ArrowDown") {
          if (next.down) next.down.id.focus();
        } else if (e.key === "ArrowUp") {
          if (next.up) next.up.id.focus();
        } else if (e.key === "ArrowLeft") {
          if (next.left) next.left.id.focus();
        } else if (e.key === "ArrowRight") {
          if (next.right) next.right.id.focus();
        }
      }
    }
  }
}