import { useContext, type ReactNode } from "react";
import { Button } from "../ui/button";
import { CirclePlay, Grip, AudioLines, Guitar, SquareLibrary, ListMusic, Music2, Heart, Clock7 } from "lucide-react";
import { FocusContext } from "@/context";
import MDiv from "../motion-div";
import { toast } from "sonner";



export default function SideBar({ updateFocuxMap }: { updateFocuxMap: () => void }) {
  // const { register, unregister } = useContext(FocusContext) || {};
  return <div className="w-2xs border-r h-full py-4 flex flex-col gap-4">
    <div className="px-3 py-2">
      <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">发现 <i>focu<span className="text-[#f3c210]">x</span></i></h2>
      <div className="space-y-1">
        <SiderBtn><CirclePlay />开始听歌（支持键盘导航）</SiderBtn>
        <SiderBtn><Grip />随便看看（上下左右键导航）</SiderBtn>
        <SiderBtn><AudioLines />播客</SiderBtn>
      </div>
    </div>
    <div className="px-3 py-2">
      <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">音乐馆</h2>
      <div className="space-y-1">
        <SiderBtn><ListMusic />歌单</SiderBtn>
        <SiderBtn><Music2 />歌</SiderBtn>
        <SiderBtn><Guitar />艺人</SiderBtn>
        <SiderBtn><SquareLibrary />专辑</SiderBtn>
      </div>
    </div>
    <div className="pt-2 shrink min-h-0 flex flex-col">
      <h2 className="px-7 text-lg font-semibold tracking-tight">歌单</h2>
      <div onScroll={updateFocuxMap} className="px-3 py-2 space-y-1 overflow-y-auto min-h-0">
        <SiderBtn><Heart />已点赞的歌曲</SiderBtn>
        <SiderBtn><Clock7 />最近播放</SiderBtn>
        <SiderBtn><ListMusic />夜晚、雷雨和月亮的尘埃</SiderBtn>
        <SiderBtn><ListMusic />看得见“海”的站</SiderBtn>
        <SiderBtn><ListMusic />北京西 -&gt; 成都西</SiderBtn>
        <SiderBtn><ListMusic />约翰写给洋子的歌</SiderBtn>
        <SiderBtn><ListMusic />家人朋友</SiderBtn>
        <SiderBtn><ListMusic />Coding</SiderBtn>
        <SiderBtn><ListMusic />她她她</SiderBtn>
      </div>
    </div>
    {/* <div className="pt-2 shrink min-h-0 flex flex-col">
      <h2 className="px-7 text-lg font-semibold tracking-tight">歌单</h2>
      <div onScroll={updateFocuxMap} ref={(e: HTMLDivElement) => {
          register?.(e, "list");
          return () => {
            unregister?.(e, "list");
          };
        }} className="px-3 py-2 space-y-1 overflow-y-auto min-h-0">
        <SiderBtn k="list"><Heart />已点赞的歌曲</SiderBtn>
        <SiderBtn k="list"><Clock7 />最近播放</SiderBtn>
        <SiderBtn k="list"><ListMusic />夜晚、雷雨和月亮的尘埃</SiderBtn>
        <SiderBtn k="list"><ListMusic />看得见“海”的站</SiderBtn>
        <SiderBtn k="list"><ListMusic />北京西 -&gt; 成都西</SiderBtn>
        <SiderBtn k="list"><ListMusic />约翰写给洋子的歌</SiderBtn>
        <SiderBtn k="list"><ListMusic />家人朋友</SiderBtn>
        <SiderBtn k="list"><ListMusic />Coding</SiderBtn>
        <SiderBtn k="list"><ListMusic />她她她</SiderBtn>
      </div>
    </div> */}
  </div>;
}

function SiderBtn({ children, k }: { children: ReactNode, k?: string }) {
  const { register, unregister } = useContext(FocusContext) || {};

  return <MDiv><Button
    onClick={() => toast("点了 1 下")}
    className="w-full text-left flex justify-start"
    variant="ghost"
    ref={(e: HTMLButtonElement) => {
      register?.(e, k);
      return () => {
        unregister?.(e, k)
      };
    }}>{children}</Button></MDiv>;
}