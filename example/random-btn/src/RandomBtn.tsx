import { useEffect, useState } from "react";

interface RandomButtonsProps {
  maxCount: number;
}

interface ButtonData {
  id: number;
  top: number;
  left: number;
}

export default function RandomButtons({ maxCount }: RandomButtonsProps) {
  const [buttons, setButtons] = useState<ButtonData[]>([]);
  const generateButtons = () => {
    const count = Math.floor(Math.random() * maxCount) + 1;
    const newButtons: ButtonData[] = Array.from({ length: count }, (_, index) => ({
      id: index,
      top: Math.random() * 90,
      left: Math.random() * 90,
    }));
    setButtons(newButtons);
  };

  useEffect(() => {
    generateButtons();
  }, [maxCount]);

  return (
    <div className="relative w-full h-screen bg-neutral-500 overflow-hidden">
      {buttons.map((button) => (
        <button
          key={button.id}
          onClick={generateButtons}
          style={{
            position: "absolute",
            top: `${button.top}%`,
            left: `${button.left}%`,
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            background: "rgba(255, 255, 255, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
          className="px-4 py-2 text-white rounded-full shadow-sm transition transform hover:scale-110 focus:scale-110 active:scale-95 hover:bg-white hover:bg-opacity-30 focus:outline-none"
        >
          Button {button.id + 1}
        </button>
      ))}
    </div>
  );
}