import { useState, useRef, useEffect, useLayoutEffect, use } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { FocusContext, type FocusContextType } from '@/context';

const DraggableModal = ({ opened }: { opened: boolean }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState({ left: 0, top: 0, right: 0, bottom: 0 });
  const constraintsOK = useRef(false);

  // 用于记录并还原位置
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const lastPosition = useRef({ x: 0, y: 0 });

  const fc = use(FocusContext) as FocusContextType;
  const focuXMap = fc.focuXMap;
  const curDir = fc?.curDir || { current: "" };
  const { resCurDir } = fc;
  // 计算边界（限制浮窗不出屏幕）
  useEffect(() => {
    if (opened && !constraintsOK.current) {
      constraintsOK.current = true;
      updateConstraints()
      function updateConstraints() {
        const modal = modalRef.current;
        const modalRect = modal?.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        if (modalRect) {
          setConstraints({
            left: -modalRect.left,
            top: -modalRect.top,
            right: vw - modalRect.right,
            bottom: vh - modalRect.bottom
          });
        }
      } 
    };

  }, [opened]);

  useLayoutEffect(() => {
    if (!opened) {
      // 保存关闭前的位置
      lastPosition.current = { x: x.get(), y: y.get() };
    } else {
      // 重新设置位置
      x.set(lastPosition.current.x);
      y.set(lastPosition.current.y);
    }
  }, [opened, x, y]);

  return (
    <AnimatePresence>
      {opened && (
        <motion.div
          ref={modalRef}
          className="fixed bg-[#ececec] border-2 border-[#414141] dark:bg-black dark:border-white shadow-md rounded-xl p-1 pt-5 w-64 h-40 z-50 left-6 bottom-6"
          drag
          dragConstraints={constraints}
          dragElastic={0.2}
          style={{ x, y }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 600, damping: 30 }}
          dragMomentum={false}
        >
          <div className="flex flex-col h-full gap-1 text-2xl">
            <div className="flex h-full gap-1">
              <div className="w-full"></div>
              <div className={`w-full rounded-md border-3 flex items-center justify-center dark:bg-[#141414] hover:bg-[#ccc] hover:border-[#676767] dark:hover:bg-[#373737] dark:hover:border-white active:bg-[#808080] active:border-[#353535] dark:active:bg-[#454545] dark:active:border-white ${resCurDir === "u" ? "bg-[#808080] border-[#353535] dark:bg-[#454545] dark:border-white" : "border-[#ccc] dark:border-[#444]"}`} onClick={up}>⬆️</div>
              <div className="w-full"></div>
            </div>
            <div className="flex h-full gap-1">
              <div className={`w-full rounded-md border-3 flex items-center justify-center dark:bg-[#141414] hover:bg-[#ccc] hover:border-[#676767] dark:hover:bg-[#373737] dark:hover:border-white active:bg-[#808080] active:border-[#353535] dark:active:bg-[#454545] dark:active:border-white ${resCurDir === "l" ? "bg-[#808080] border-[#353535] dark:bg-[#454545] dark:border-white" : "border-[#ccc] dark:border-[#444]"}`} onClick={left}>⬅️</div>
              <div className={`w-full rounded-md border-3 flex items-center justify-center dark:bg-[#141414] hover:bg-[#ccc] hover:border-[#676767] dark:hover:bg-[#373737] dark:hover:border-white active:bg-[#808080] active:border-[#353535] dark:active:bg-[#454545] dark:active:border-white ${resCurDir === "d" ? "bg-[#808080] border-[#353535] dark:bg-[#454545] dark:border-white" : "border-[#ccc] dark:border-[#444]"}`} onClick={down}>⬇️</div>
              <div className={`w-full rounded-md border-3 flex items-center justify-center dark:bg-[#141414] hover:bg-[#ccc] hover:border-[#676767] dark:hover:bg-[#373737] dark:hover:border-white active:bg-[#808080] active:border-[#353535] dark:active:bg-[#454545] dark:active:border-white ${resCurDir === "r" ? "bg-[#808080] border-[#353535] dark:bg-[#454545] dark:border-white" : "border-[#ccc] dark:border-[#444]"}`} onClick={right}>➡️</div>
            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );

  function up() {
    const cur = fc.lastFocusedE.current;
    curDir.current = "u";
    if (cur == null) {
      const next = focuXMap.current.keys().next().value;
      next.focus();
      fc.lastFocusedE.current = next;
    } else {
      const next = focuXMap.current.get(cur);
      let nextE: HTMLButtonElement | null = null;
      if (next.up) {
        nextE = next.up.id;
      }
      if (nextE) {
        nextE.focus();
        fc.lastFocusedE.current = nextE;
      } else {
        const animeFocusHandlerRef = fc?.animeFocusHandlerRef;
        animeFocusHandlerRef?.current.get(cur?.parentElement as HTMLDivElement)?.();
      }
    }
  }
  function down() {
    const cur = fc.lastFocusedE.current;
    curDir.current = "d";
    if (cur == null) {
      const next = focuXMap.current.keys().next().value;
      next.focus();
      fc.lastFocusedE.current = next;
    } else {
      const next = focuXMap.current.get(cur);
      let nextE: HTMLButtonElement | null = null;
      if (next.down) {
        nextE = next.down.id;
      }
      if (nextE) {
        nextE.focus();
        fc.lastFocusedE.current = nextE;
      } else {
        const animeFocusHandlerRef = fc?.animeFocusHandlerRef;
        animeFocusHandlerRef?.current.get(cur?.parentElement as HTMLDivElement)?.();
      }
    }
  }
  function left() {
    const cur = fc.lastFocusedE.current;
    curDir.current = "l";
    if (cur == null) {
      const next = focuXMap.current.keys().next().value;
      next.focus();
      fc.lastFocusedE.current = next;
    } else {
      const next = focuXMap.current.get(cur);
      let nextE: HTMLButtonElement | null = null;
      if (next.left) {
        nextE = next.left.id;
      }
      if (nextE) {
        nextE.focus();
        fc.lastFocusedE.current = nextE;
      } else {
        const animeFocusHandlerRef = fc?.animeFocusHandlerRef;
        animeFocusHandlerRef?.current.get(cur?.parentElement as HTMLDivElement)?.();
      }
    }
  }
  function right() {
    const cur = fc.lastFocusedE.current;
    curDir.current = "r";
    if (cur == null) {
      const next = focuXMap.current.keys().next().value;
      next.focus();
      fc.lastFocusedE.current = next;
    } else {
      const next = focuXMap.current.get(cur);
      let nextE: HTMLButtonElement | null = null;
      if (next.right) {
        nextE = next.right.id;
      }
      if (nextE) {
        nextE.focus();
        fc.lastFocusedE.current = nextE;
      } else {
        const animeFocusHandlerRef = fc?.animeFocusHandlerRef;
        animeFocusHandlerRef?.current.get(cur?.parentElement as HTMLDivElement)?.();
      }
    }
  }
};

export default DraggableModal;
