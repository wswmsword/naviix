import { createContext, type Dispatch, type RefObject, type SetStateAction } from "react";

export type FocusContextType = {
  register: (el: HTMLElement, key?: string) => void,
  unregister: (el: HTMLElement, key?: string) => void,
  getFocusableElements: () => HTMLElement[],
  curDir: RefObject<string>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  animeFocusHandlerRef: RefObject<Map<HTMLDivElement, any>>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  groupElementsRef: RefObject<Map<string, any>>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  focuXMap: RefObject<any>,
  lastFocusedE: RefObject<HTMLElement | null>,
  resCurDir: string,
  setCurDir: Dispatch<SetStateAction<string>>,
}

export const FocusContext = createContext<FocusContextType | undefined>(undefined);

export const VirKbdContext = createContext<{
  opened: boolean;
  x: number;
  y: number;
} | undefined>(undefined);