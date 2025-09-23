import { create } from 'zustand'

interface State {
  context: "main" | "bbar" | "tbar"
}

const useButtomBar = create<State>((set) => ({
  context: "main",
  setMainContext: () => set(() => ({ context: "main" })),
  setBottomBarContext: () => set(() => ({ context: "bbar" })),
  setTopBarContext: () => set(() => ({ context: "tbar" })),
}))

export default useButtomBar;