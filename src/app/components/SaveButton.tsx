import React from "react";
import { Save } from "lucide-react";

interface SaveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  icon?: React.ReactNode;
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  label = "Save Changes",
  icon,
  className = "",
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={disabled}
      className={`bg-[#a0004f] col-span-2 cursor-pointer w-full text-white px-8 py-3 rounded-full font-semibold tracking-wide hover:bg-[#8c0045] transition-all duration-300 border border-transparent hover:border-[#a0004f] hover:shadow-[0_0_25px_rgba(160,0,79,0.4)] flex items-center justify-center gap-3 group ${disabled ? "opacity-75 cursor-not-allowed" : ""} ${className}`}
      {...props}
    >
      {icon ? icon : <Save className="w-4 h-4" />}
      {disabled ? "Saving..." : label}
    </button>
  );
};
