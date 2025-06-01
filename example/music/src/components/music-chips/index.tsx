import { Button } from "../ui/button";
import { useContext, useState } from "react";
import { FocusContext } from "@/context";
import MDiv from "../motion-div";
import { toast } from "sonner";
import { Github } from "lucide-react";
import DraggableModal from "./dragable-modal";
import { ModeToggle } from "../theme";
import { RainbowButton } from "../magicui/rainbow-button";
import { Pointer } from "../magicui/pointer";
import GuideModal from "./guide-modal";

export default function MusicChips() {
  const { register, unregister } = useContext(FocusContext) || {};
  const [openedKey, setK] = useState(false);
  return <div className="px-8 flex gap-3 flex-wrap">
    <MDiv><Button ref={ref} onClick={() => setK(v => !v)}>🎹 切换键盘</Button></MDiv>
    <MDiv><Button onClick={() => toast("点了 1 下")} variant="secondary" ref={ref}>休闲放松</Button></MDiv>
    <MDiv><Button onClick={() => toast("点了 1 下")} variant="secondary" ref={ref}>轻松愉悦</Button></MDiv>
    <MDiv><Button onClick={() => toast("点了 1 下")} variant="secondary" ref={ref}>健身</Button></MDiv>
    <MDiv><Button onClick={() => toast("点了 1 下")} variant="secondary" ref={ref}>通勤</Button></MDiv>
    <MDiv><Button onClick={() => toast("点了 1 下")} variant="secondary" ref={ref}>浪漫</Button></MDiv>
    <MDiv><Button onClick={() => toast("点了 1 下")} variant="secondary" ref={ref}>伤心难过</Button></MDiv>
    <MDiv><Button onClick={() => toast("点了 1 下")} variant="secondary" ref={ref}>专注</Button></MDiv>
    <MDiv><Button onClick={() => toast("点了 1 下")} variant="secondary" ref={ref}>睡眠</Button></MDiv>
    <MDiv><RainbowButton variant="outline" asChild ref={ref}><a href="https://github.com/wswmsword/navix" target="_blank"><Pointer><span className="text-2xl relative -top-3 -left-3">⭐️</span></Pointer><Github />GitHub</a></RainbowButton></MDiv>
    <MDiv><Button asChild ref={ref}><a href="https://wswmsword.github.io/examples/navix-btns/" target="_blank">🎲 按钮试炼</a></Button></MDiv>
    <ModeToggle />
    <DraggableModal opened={openedKey} />
    <GuideModal setK={setK} />
  </div>;

  function ref(e: HTMLButtonElement) {
    register?.(e);
    return () => {
      unregister?.(e)
    };
  }
}