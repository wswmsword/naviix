import { useState, type AnimationEvent, type KeyboardEvent, type Ref } from "react";
import styles from "./index.module.css";

export default function GameBtn({ ref, src }: { ref: Ref<HTMLButtonElement>, src?: string }) {

  const [a1, setA] = useState(false);
  const [a2, setA2] = useState(false);

  return <button
    className={`nvx2 relative w-64 h-64 shrink-0 bg-[#ececec] inset-ring-3 inset-ring-white ${styles.btn} ${a1 ? styles.a : ""}`}
    ref={ref}
    onKeyDown={onKeyD}
    onClick={onClick}
    onAnimationEndCapture={onAE}>
    <img src={src} />
    <span
      className={`inline-block absolute top-0 left-0 w-full h-full bg-cover ${styles.animeP} ${a2 ? styles.a2 : ""}`} style={{ backgroundImage: `url(${src})` }}
      onAnimationEnd={onAE2}></span>
  </button>;


  function onKeyD(e: KeyboardEvent) {
    if (a1) return;
    if (e.code === "Space" || e.code === "Enter") {
      setA(true);
      e.preventDefault();
    }
  }

  function onClick() {
    if (a1) return;
    setA(true);
  }

  function onAE(e: AnimationEvent) {
    if (e.animationName === styles.anime0) {
      setA2(true);
    }
  }

  function onAE2() {
    setA2(false);
    setA(false);
  }
}