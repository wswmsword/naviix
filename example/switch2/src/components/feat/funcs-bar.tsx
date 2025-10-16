import FuncBtn from "../kit/func-btn/index";

export default function FuncsBar() {

  return <div className="absolute w-full flex justify-center gap-[18px] bottom-[140px]" id="funcs">
    <FuncBtn className="bg-[#e60012] border-0" name="Nintendo Switch Online"></FuncBtn>
    <FuncBtn name="游戏新闻">1</FuncBtn>
    <FuncBtn name="Nintendo eShop"></FuncBtn>
    <FuncBtn name="相册"></FuncBtn>
    <FuncBtn name="游戏分享"></FuncBtn>
    <FuncBtn name="手柄"></FuncBtn>
    <FuncBtn name="虚拟游戏卡"></FuncBtn>
    <FuncBtn name="设置"></FuncBtn>
    <FuncBtn name="休眠模式">123</FuncBtn>
  </div>;
}