import { createContext, type RefObject } from "react";

export const FocusContext = createContext<{
  register: (el: HTMLElement, key?: string) => void,
  unregister: (el: HTMLElement, key?: string) => void,
  getFocusableElements: () => HTMLElement[],
  curDir: RefObject<string>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  animeFocusHandlerRef: RefObject<Map<HTMLDivElement, any>>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  groupElementsRef: RefObject<Map<string, any>>} | undefined>(undefined);