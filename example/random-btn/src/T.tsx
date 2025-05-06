import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

export default function App() {
  const controls = useAnimation();
  const [count, setCount] = useState(0);
  const container = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const handleFocus = () => {
    const nextRotation = 360;
    controls.start({
      rotate: nextRotation,
      transition: { duration: 0.4 },
    });
  };
  
  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1 }
  }

  useEffect(() => {
    setCount(9)
  }, []);

  const has = count > 0;

  const variants = {
    hover: { x: 12 },
  };
  
  const Example = () => {
    return (<motion.section whileHover="hover">
        <motion.h2 variants={variants}>Title...</motion.h2>
        <motion.div>Lorem ipsum dolor sit amet</motion.div>
    </motion.section>);
  };
  
  if (!has) return null;

  return (<>
    <motion.ol
      variants={container}
      initial="hidden"
      animate="show"
    >
      {Array.from({ length: count }).map((_, i) =>
        <motion.li
          tabIndex={0}
          key={i}
          variants={item}
          onFocus={handleFocus}>{i}</motion.li>)}
    </motion.ol>
    <Example />
  </>);
}

