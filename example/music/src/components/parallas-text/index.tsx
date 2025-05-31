import "./index.css";
import { useEffect, useLayoutEffect, useRef, useState, type HTMLAttributes } from "react";
import {
  motion,
  useTransform,
  useMotionValue,
  useAnimationFrame
} from "framer-motion";
import { wrap } from "@motionone/utils";

interface ParallaxProps {
  children: string;
  baseVelocity: number;
  dir?: "row" | "col";
  positive?: boolean;
}



export default function ParallaxText({ children, baseVelocity = 100, dir = "row", positive = true, ...otherP }: ParallaxProps & HTMLAttributes<HTMLDivElement>) {
  const s = useRef<HTMLSpanElement>(null);
  const baseX = useMotionValue(0);
  const [n, setN] = useState(0);
  const offsetP = useRef(0);
  const isPositive = useRef(positive);

  const x = useTransform(baseX, (v) => `${wrap(0, offsetP.current * -1, v)}%`);

  useAnimationFrame((t, delta) => {
    const moveBy = baseVelocity * (delta / 1000) * (isPositive.current ? 1 : -1);
    baseX.set(baseX.get() + moveBy);
  });

  useLayoutEffect(() => {
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const itemW = s.current?.clientWidth || 1;
    const ratio = dir === "row" ? winW / itemW : winH / itemW;
    const _ratio = Math.ceil(ratio) * 2;
    setN(_ratio - 1);
    offsetP.current = 100 / _ratio;
  }, []);

  useEffect(() => {
    isPositive.current = positive;
  }, [positive]);

  const { className, ..._otherP } = otherP;
  return (
    <div className={`parallax ${className}`} {..._otherP}>
      <motion.div className="scroller" style={{ x }}>
        <span ref={s}>{children} </span>
        {new Array(n).fill(0).map((_, i) => <span key={i}>{children} </span>)}
      </motion.div>
    </div>
  );
}

