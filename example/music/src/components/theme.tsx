import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"
import { useContext, type KeyboardEvent } from "react"
import { FocusContext } from "@/context"
import MDiv from "./motion-div"

export function ModeToggle() {
  const { setTheme } = useTheme()
  const { register, unregister } = useContext(FocusContext) || {};

  return (
    <DropdownMenu>
      <MDiv className="relative">
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" ref={ref} onKeyDown={disableDownKey}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
      </MDiv>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  function ref(e: HTMLButtonElement) {
    register?.(e);
    return () => {
      unregister?.(e)
    };
  }

  function disableDownKey(e: KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
    }
  }
}
