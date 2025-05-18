import { Separator } from "../ui/separator";
import p1 from "../../assets/p1.jpg";
import p2 from "../../assets/p2.jpg";
import p3 from "../../assets/p3.jpg";
import p4 from "../../assets/p4.jpg";
import p5 from "../../assets/p5.jpg";
import p6 from "../../assets/p6.jpg";
import p7 from "../../assets/p7.jpg";
import { FocusContext } from "@/context";
import { useContext } from "react";
import MDiv from "../motion-div";
import { toast } from "sonner";

export default function MadeForU() {
  return <>
    <div className="px-8 mt-6 space-y-1">
      <h2 className="text-2xl font-semibold tracking-tight">精选推荐</h2>
      <p className="text-sm text-muted-foreground">根据您的音乐口味推荐，每天 25:00 更新（<span className="decoration-wavy underline">请使用键盘的上、下、左、右键完成导航。</span>）</p>
      <Separator className="my-4" />
    </div>
    <div className="px-8 flex gap-3 w-full flex-wrap">
      <CoverInfo src={p1} title="无法长大" artist="赵雷" />
      <CoverInfo src={p2} title="生如夏花" artist="朴树" />
      <CoverInfo src={p3} title="Let It Be" artist="The Beatles" />
      <CoverInfo src={p4} title="About Time" artist="Various Artists" />
      <CoverInfo src={p5} title="生命中的精灵" artist="李宗盛" />
      <CoverInfo src={p6} title="Good Time" artist="Owl City，Carly Rae Jepsen" />
      <CoverInfo src={p7} title="Milk And Honey" artist="John Lennon，Yoko Ono" />
    </div>
  </>;
}

function CoverInfo({ title, artist, src }: { title: string, artist: string, src: string }) {
  const { register, unregister } = useContext(FocusContext) || {};
  return <div className="space-y-3 shrink-0 w-[150px]">
    <MDiv className="w-[150px] h-[150px]">
      <button className="rounded-md overflow-hidden w-[150px] h-[150px]" ref={ref} onClick={() => toast("点了 1 下")}>
        <img src={src} className="w-auto h-auto object-cover transition-all hover:scale-105" width={150} height={150} />
      </button>
    </MDiv>
    <div className="space-y-1 text-sm">
      <MDiv className="text-[0px] w-full"><button onClick={() => toast("点了 1 下")} ref={ref} className="text-sm font-medium leading-none truncate w-full text-left">{title}</button></MDiv>
      <MDiv className="text-[0px] w-full"><button onClick={() => toast("点了 1 下")} ref={ref} className="text-xs text-muted-foreground truncate w-full text-left">{artist}</button></MDiv>
    </div>
  </div>;

  function ref(e: HTMLButtonElement) {
    register?.(e);
    return () => {
      unregister?.(e)
    };
  }
}