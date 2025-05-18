import { useRef, useCallback, type ReactNode } from 'react';
import { FocusContext } from '@/context';

export const FocusProvider = ({ children }: { children: ReactNode }) => {
  const curDir = useRef<string>("");
  const focusableElementsRef = useRef<HTMLElement[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupElementsRef = useRef<Map<string, any>>(new Map());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const animeFocusHandlerRef = useRef<Map<HTMLDivElement, any>>(new Map());

  const register = useCallback((el: HTMLElement, key?: string) => {
    if (key) {
      if (el) {
        const focusableElements = groupElementsRef.current.get(key);
        if (focusableElements) {
          if (!focusableElements.includes(el)) {
            focusableElements.push(el);
          }
        } else {
          groupElementsRef.current.set(key, [el]);
        }
      }
    }
    else if (el && !focusableElementsRef.current.includes(el)) {
      focusableElementsRef.current.push(el);
    }
  }, []);

  const unregister = useCallback((el: HTMLElement, key?: string) => {
    if (key) {
      const focusableElements = groupElementsRef.current.get(key);
      groupElementsRef.current.set(key, focusableElements.filter((e: HTMLElement) => e !== el));
    } else {
      focusableElementsRef.current = focusableElementsRef.current.filter((e) => e !== el);
    }
  }, []);

  const getFocusableElements = useCallback(() => focusableElementsRef.current, []);

  return (
    <FocusContext.Provider value={{ register, unregister, getFocusableElements, curDir, animeFocusHandlerRef, groupElementsRef }}>
      {children}
    </FocusContext.Provider>
  );
};