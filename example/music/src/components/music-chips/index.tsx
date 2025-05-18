import { Button } from "../ui/button";
import { useContext } from "react";
import { FocusContext } from "@/context";
import MDiv from "../motion-div";
import { toast } from "sonner";
import { Github } from "lucide-react";

export default function MusicChips() {
  const { register, unregister } = useContext(FocusContext) || {};
  return <div className="px-8 flex gap-3 flex-wrap">
    <MDiv><Button onClick={() => toast("点了 1 下")} variant="secondary" ref={ref}>焕活能量</Button></MDiv>
    <MDiv><Button onClick={() => toast("点了 1 下")} variant="secondary" ref={ref}>休闲放松</Button></MDiv>
    <MDiv><Button onClick={() => toast("点了 1 下")} variant="secondary" ref={ref}>轻松愉悦</Button></MDiv>
    <MDiv><Button onClick={() => toast("点了 1 下")} variant="secondary" ref={ref}>派对</Button></MDiv>
    <MDiv><Button onClick={() => toast("点了 1 下")} variant="secondary" ref={ref}>健身</Button></MDiv>
    <MDiv><Button onClick={() => toast("点了 1 下")} variant="secondary" ref={ref}>通勤</Button></MDiv>
    <MDiv><Button onClick={() => toast("点了 1 下")} variant="secondary" ref={ref}>浪漫</Button></MDiv>
    <MDiv><Button onClick={() => toast("点了 1 下")} variant="secondary" ref={ref}>伤心难过</Button></MDiv>
    <MDiv><Button onClick={() => toast("点了 1 下")} variant="secondary" ref={ref}>专注</Button></MDiv>
    <MDiv><Button onClick={() => toast("点了 1 下")} variant="secondary" ref={ref}>睡眠</Button></MDiv>
    <MDiv><Button asChild ref={ref}><a href="https://github.com/wswmsword/focux" target="_blank"><Github />GitHub</a></Button></MDiv>
    <MDiv><Button asChild ref={ref}><a href="https://wswmsword.github.io/examples/focux/" target="_blank">🎲 按钮试炼</a></Button></MDiv>
  </div>;

  function ref(e: HTMLButtonElement) {
    register?.(e);
    return () => {
      unregister?.(e)
    };
  }
}