import useButtomBar from "@/store/useBBar";
import type { ReactNode } from "react";


export default function BottomBar() {
  const { context } = useButtomBar();
  return <div className="absolute bottom-0 h-[72px] w-full px-[30px]">
    <div className="w-full h-full border-t border-[#2e2e2e] flex items-center justify-end pr-[12px]">
      <div className="flex">
        {context === "main" && <>
          <KeyClickBtn kk={<span className="text-[16px] leading-none">+</span>} txt="选项" />
          <KeyClickBtn kk="A" txt="开始" />
        </>}
        {["bbar", "tbar"].includes(context) && <KeyClickBtn kk="A" txt="开始" />}
      </div>
    </div>
  </div>;
}


function KeyClickBtn({ kk, txt }: { kk: string|ReactNode, txt: string }) {

  return <div className="flex items-center px-[16px] py-[10px] gap-[10px] rounded-[3px] hover:bg-[#f0fcff]">
    <div className="bg-[rgb(45,45,45)] w-[24px] h-[24px] text-[#ebebeb] flex items-center justify-center rounded-full text-[13px]">{kk}</div>
    <div>{txt}</div>
  </div>;
}