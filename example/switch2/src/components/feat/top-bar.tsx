import { useEffect, useState } from "react";
import UsrBtn from "../kit/usr-btn";


export default function TopBar() {

  const [clock, setC] = useState("00:00");

  useEffect(() => {
    updateClock();
    setInterval(updateClock, 1000);
  }, []);


  return <div className="absolute w-full flex justify-between px-[60px] top-[35px]">
    <div className="flex gap-[10px]">
      <UsrBtn src="/src/assets/usr/u1.png" name="wsWmsword 的页面" className="bg-pink-300" />
      <UsrBtn src="/src/assets/usr/u2.png" name="Wind 的页面" className="bg-blue-500" />
    </div>
    <div className="flex items-center gap-[22px]">
      <div className="text-[#2c2c2c] text-base">{clock}</div>
      <div>wifi</div>
      <div>battery</div>
    </div>
  </div>;

  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setC(`${hours}:${minutes}`);
  }
}