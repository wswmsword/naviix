import { createContext, type RefObject } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const HomeNvxContext = createContext<RefObject<any> | null>(null);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FocusedContext = createContext<RefObject<any> | null>(null);