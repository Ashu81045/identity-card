import React from "react";
import { useNavigate } from "react-router-dom";

const ElectionButtons = () => {
  const navigate = useNavigate();
  const buttons = [
    { label: "Vidhan Sabha", path: "/vidhan-sabha" },
    { label: "Lok Sabha", path: "/lok-sabha" },
  ];

  return (
    <div className="flex flex-wrap gap-4 justify-center mt-6">
      {buttons.map((btn) => (
        <button
          key={btn.path}
          onClick={() =>navigate(btn.path)}
          className="
            px-6 py-3 
            rounded-xl 
            font-semibold 
            text-white 
            bg-gradient-to-r from-blue-500 to-purple-600
            shadow-md
            transition-all duration-300 
            hover:scale-105 hover:shadow-xl 
            hover:from-purple-500 hover:to-pink-600
            active:scale-95
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400
          "
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
};

export default ElectionButtons;
