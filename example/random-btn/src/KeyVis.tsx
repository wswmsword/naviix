import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function KeyVisualizer() {
  const [key, setKey] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [animationKey, setAnimationKey] = useState(0); // 强制刷新动画
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const beautifyKey = (rawKey: string) => {
    switch (rawKey) {
      case ' ':
      case 'Spacebar':
      case 'Space':
        return '␣ Space';
      case 'Enter':
        return '⏎ Enter';
      case 'ArrowUp':
        return '⬆️ Up';
      case 'ArrowDown':
        return '⬇️ Down';
      case 'ArrowLeft':
        return '⬅️ Left';
      case 'ArrowRight':
        return '➡️ Right';
      case 'Escape':
        return '⎋ Esc';
      case 'x':
        return "🌟";
      case 'X':
        return "⭐️";
      case 'Backspace':
        return '⌫ Backspace';
      case 'Tab':
        return '⇥ Tab';
      default:
        return rawKey.length === 1 ? rawKey.toUpperCase() : rawKey;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKey(e.key);
      setVisible(true);
      setAnimationKey(prev => prev + 1);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        setVisible(false);
      }, 3000);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={animationKey} // 每次按键重新触发整体动画
          className="fixed left-5 bottom-5 px-5 py-3 bg-black text-white rounded-full shadow-lg text-xl font-semibold z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          {key ? beautifyKey(key) : ''}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
