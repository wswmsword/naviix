import { create } from 'zustand'

interface State {
  context: "main" | "bbar" | "tbar",
  setMainContext: () => void,
  setBottomBarContext: () => void,
  setTopBarContext: () => void,
}

const useButtomBar = create<State>((set) => ({
  context: "main",
  setMainContext: () => set(() => ({ context: "main" })),
  setBottomBarContext: () => set(() => ({ context: "bbar" })),
  setTopBarContext: () => set(() => ({ context: "tbar" })),
}))

export default useButtomBar;