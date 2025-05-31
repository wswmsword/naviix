import { AnimatePresence, motion } from "framer-motion";
import ParallaxText from "./parallas-text";
import { FocusContext, type FocusContextType } from "@/context";
import { use, useEffect, useState } from "react";


export default function Parallaxes() {
  const fc = use(FocusContext) as FocusContextType;
  const [isPositive, setP] = useState(true);
  useEffect(() => {
    if (fc.resCurDir != null && fc.resCurDir !== "") {
      if (["l", "d"].includes(fc.resCurDir)) setP(true);
      if (["r", "u"].includes(fc.resCurDir)) setP(false);
    }
  }, [fc.resCurDir]);
  // f3c210
  return <><AnimatePresence>
    {["l", "r"].includes(fc.resCurDir) &&
      <motion.div
        className="fixed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0 }}
        exit={{ opacity: 0, transition: { duration: 2 } }}>
        <ParallaxText baseVelocity={-13} positive={isPositive} className="fixed top-1/2 -translate-y-1/2 w-full py-3 -z-1 bg-[#f3c210] text-black">Focux 由 wswmsword 强势驱动</ParallaxText></motion.div>}
  </AnimatePresence>
  <AnimatePresence>
    {["u", "d"].includes(fc.resCurDir) &&
      <motion.div
        className="fixed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0 }}
        exit={{ opacity: 0, transition: { duration: 2 } }}>
        <ParallaxText baseVelocity={19} dir="col" positive={isPositive} className="fixed top-1/2 md:-translate-x-[calc(50%-325px)] rotate-90 w-full py-3 -z-1 bg-[#f3c210] text-black">Focux ⬆️ ➡️ ⬇️ ⬅️</ParallaxText>
      </motion.div>}
  </AnimatePresence></>;
}