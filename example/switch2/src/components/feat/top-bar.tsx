import { useEffect, useState } from "react";


export default function TopBar() {

  const [clock, setC] = useState("00:00");

  useEffect(() => {
    updateClock();
    setInterval(updateClock, 1000);
  }, []);


  return <div className="absolute w-full flex justify-between px-[60px] top-[35px]">
    <div className="flex gap-[10px]">
      <div className="w-[60px] h-[60px] border-[3px] border-white rounded-full"></div>
      <div className="w-[60px] h-[60px] border-[3px] border-white rounded-full"></div>
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