import { Button } from "../ui/button";
import { useEffect, useState, type Dispatch, type KeyboardEvent, type SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SparklesText } from "../magicui/sparkles-text";

export default function GuideModal({ setK }: { setK: Dispatch<SetStateAction<boolean>> }) {
  const [openedGuide, setG] = useState(false);

  useEffect(() => {
    const k = localStorage.getItem("naviix:k");
    if (k == null) {
      setG(true);
    } else {
      if (k === "true") {
        setK(true);
      }
    }
  }, []);
  
  return (
    <Dialog open={openedGuide} onOpenChange={(e) => setG(e)}>
      <DialogContent className="sm:max-w-[425px]" onKeyDown={handleArrowKey}>
        <DialogHeader>
          <DialogTitle><SparklesText sparklesCount={4} className="text-2xl font-semibold tracking-tight"><i>Navii<span className="text-[#f3c210]">x</span></i> 使用指南</SparklesText></DialogTitle>
          <DialogDescription>
            Naviix 是一个 JavaScript 空间导航库，给 naviix 投喂元素们的坐标和尺寸后，naviix 会告诉你每个元素的邻居是谁。
          </DialogDescription>
          <DialogDescription>
            这是一个音乐主题的 naviix 范例页面，访问页面的时候，您可以通过键盘的上、下、左、右按键进行导航。
          </DialogDescription>
          <DialogDescription>
            接下来，您可以按下键盘的方向键直接进入页面，或者选择虚拟键盘来模拟真实键盘体验。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => {
            setG(false);
            localStorage.setItem("naviix:k", "false");
          }}>进入页面</Button>
          <Button onClick={() => {
            setTimeout(() => {
              setK(true);
            }, 200);
            setG(false);
            localStorage.setItem("naviix:k", "true");
          }}>🎹 虚拟键盘</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  function handleArrowKey(e: KeyboardEvent) {
    if (["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"].includes(e.key)) {
      setG(false);
      localStorage.setItem("naviix:k", "false");
    }
  }
}
