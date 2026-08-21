import { ChevronDown, Plus } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  description: string;
  isOpen: boolean;
  onToggle: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function SectionHeader({
  title,
  description,
  isOpen,
  onToggle,
  action,
}: SectionHeaderProps) {
  return (
    <header
      className={`flex items-center justify-between gap-4 transition-all ${
        isOpen ? "border-b border-gray-100 pb-4" : ""
      }`}
    >
      <div
        className="flex flex-col gap-1.5 cursor-pointer flex-1 group"
        onClick={onToggle}
      >
        <h1 className="text-gray-900 text-lg font-bold group-hover:text-[#0A0F29] transition-colors flex items-center gap-2">
          {title}
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
      </div>
      {!action && (
        <button
          type="button"
          onClick={onToggle}
          aria-label="Toggle Section"
          className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-all shrink-0 cursor-pointer"
        >
          <ChevronDown
            className={`h-5 w-5 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      )}

      {action && (
        <button
          onClick={action.onClick}
          className="bg-[#0B0F29] w-max text-white ml-auto px-6 py-2.5 rounded-full font-semibold tracking-wide hover:bg-black transition-all duration-300 border border-transparent hover:border-[#a0004f] hover:shadow-[0_0_25px_rgba(71, 93, 177,0.4)] flex items-center justify-center gap-2 group whitespace-nowrap"
        >
          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />{" "}
          {action.label}
        </button>
      )}
    </header>
  );
}
