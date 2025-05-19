import { FocusContext } from "@/context";
import { useAnimation, motion } from "framer-motion";
import { useContext, type HTMLAttributes, type ReactNode } from "react";


export default function MDiv({ children, ...otherProps }: { children: ReactNode } & HTMLAttributes<HTMLDivElement>) {
  const { curDir, animeFocusHandlerRef } = useContext(FocusContext) || {};
  const controls = useAnimation();

  const handleFocus = () => {
    const xy = curDir?.current === "u" ? { y: [-9, 0] } : curDir?.current === "d" ? { y: [9, 0] } : curDir?.current === "l" ? { x: [-9, 0] } : curDir?.current === "r" ? { x: [9, 0] } : { scale: [0.94, 1] }
    if (curDir) curDir.current = "e";
    controls.start({
      ...xy,
      transition: { duration: 0.5 },
    });
  };

  return <motion.div
    ref={e => {
      animeFocusHandlerRef?.current.set(e as HTMLDivElement, handleFocus);
    }}
    onFocus={handleFocus}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    animate={controls} {...otherProps as any}>
    {children}
  </motion.div>;
}