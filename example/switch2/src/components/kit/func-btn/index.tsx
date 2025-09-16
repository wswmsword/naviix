import { cn } from "@/lib/utils"
import styles from "./index.module.css";
import { useRef, useState, type KeyboardEvent, type MouseEvent } from "react";

/** 伴随按钮动画结束执行操作，或延迟指定时间执行操作（延迟时间内忽略其它操作） */
export default function FuncBtn({ className, children, onClick: _oc }: React.ComponentProps<"button">) {

  const [animating, setA] = useState(false);
  const clickE = useRef<MouseEvent<HTMLButtonElement>>(null);

  return <button
    onKeyDown={onKeyD}
    onClick={onClick}
    onAnimationEnd={onAE}
    className={cn("relative w-[72px] h-[72px] rounded-full bg-white border border-[#dfdfdf] flex items-center justify-center",
      animating ? styles.animating : "",
      styles.btn,
      className)}>
    <span className="relative">
      { children }
    </span>
  </button>;

  function onKeyD(e: KeyboardEvent) {
    if (animating) return;
    if (e.code === "Space" || e.code === "Enter") {
      setA(true);
      e.preventDefault();
    }
  }

  function onClick(e: MouseEvent<HTMLButtonElement>) {
    if (animating) return;
    setA(true);
    clickE.current = e;
  }

  function onAE() {
    setA(false);
    if (_oc && clickE.current) _oc(clickE.current);
  }
}