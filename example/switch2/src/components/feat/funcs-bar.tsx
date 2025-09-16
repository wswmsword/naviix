import FuncBtn from "../kit/func-btn/index";

export default function FuncsBar() {
  return <div className="absolute w-full flex justify-center gap-[18px] bottom-[140px]">
    <FuncBtn className="bg-[#e60012] border-0"></FuncBtn>
    <FuncBtn>1</FuncBtn>
    <FuncBtn></FuncBtn>
    <FuncBtn></FuncBtn>
    <FuncBtn></FuncBtn>
    <FuncBtn></FuncBtn>
    <FuncBtn></FuncBtn>
    <FuncBtn></FuncBtn>
    <FuncBtn></FuncBtn>
  </div>;
}