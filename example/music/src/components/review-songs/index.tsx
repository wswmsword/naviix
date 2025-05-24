import { Separator } from "../ui/separator";
import p1 from "../../assets/p1.jpg";
import p2 from "../../assets/p2.jpg";
import p3 from "../../assets/p3.jpg";
import p8 from "../../assets/p8.jpg";
import { FocusContext } from "@/context";
import { useContext } from "react";
import MDiv from "../motion-div";
import { toast } from "sonner"

export default function ReviewSongs({ updateFocuxMap }: { updateFocuxMap: () => void }) {
  return <><div className="px-8 flex items-start gap-1 flex-col mt-5">
    <h2 className="text-2xl font-semibold tracking-tight">老歌重温</h2>
    <p className="text-sm text-muted-foreground">唤起难忘的回忆，重温美好的时光。（<strong><i>focu<span className="text-[#f3c210]">x</span></i> 会找到元素的上、下、左、右方向的元素。</strong>）</p>
    <Separator className="mt-4" />
    </div>
    <div className="px-8 pt-4 pb-6 flex gap-4 overflow-x-auto w-full" onScroll={updateFocuxMap}>
      <CoverInfo src={p1} title="朵（Dorr）" artist="赵雷" />
      <CoverInfo src={p2} title="生如夏花" artist="朴树" />
      <CoverInfo src={p3} title="Across The Universe" artist="The Beatles" />
      <CoverInfo src={p8} title="Hero" artist="Family of the Year" />
    </div>
  </>;
}

function CoverInfo({ title, artist, src }: { title: string, artist: string, src: string }) {
  const { register, unregister } = useContext(FocusContext) || {};
  return <div className="space-y-3 shrink-0 w-[150px] lg:w-[200px] xl:w-[250px]">
    <MDiv className="w-full h-[198px] lg:h-[264px] xl:h-[330px]"><button onClick={() => toast("点了 1 下")} className="rounded-md overflow-hidden w-full h-full" ref={ref}>
      <img src={src} className="w-auto h-auto object-cover transition-all hover:scale-105 aspect-[3/4]" />
    </button></MDiv>
    <div className="space-y-1 text-sm">
      <MDiv className="text-[0px] w-full"><button ref={ref} className="text-sm font-medium leading-none w-full text-left truncate" onClick={() => toast("点了 1 下")}>{title}</button></MDiv>
      <MDiv className="text-[0px] w-full"><button ref={ref} className="text-xs text-muted-foreground w-full text-left truncate" onClick={() => toast("点了 1 下")}>{artist}</button></MDiv>
    </div>
  </div>;
  

  function ref(e: HTMLButtonElement) {
    register?.(e);
    return () => {
      unregister?.(e)
    };
  }
}