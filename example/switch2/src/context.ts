import { createContext, type RefObject } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const HomeNvxContext = createContext<RefObject<any> | null>(null);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const BorderAnimeContext = createContext<RefObject<any> | null>(null);

export const SoundContext = createContext<{
    playSound: (name: string, when?: number) => void;
    unlockNLoad: () => Promise<void>;
} | null>(null);

export const PageContext = createContext<{
    page: string;
    setP: React.Dispatch<React.SetStateAction<string>>;
} | null>(null);