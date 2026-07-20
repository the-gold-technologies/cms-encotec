"use client";

import { useState, useRef, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import { Search, X, ChevronDown } from "lucide-react";

// Only the icons hardcoded in the frontend About.tsx mvvIconMap.
// These are the ONLY icons that will render correctly on the website.
const ICON_LIST = [
  "HeartHandshake",
  "Award",
  "ShieldCheck",
  "TrendingUp",
  "Users",
  "Leaf",
];

interface IconPickerFieldProps {
  label?: string;
  value: string;
  onChange: (iconName: string) => void;
  required?: boolean;
}

export function IconPickerField({ label, value, onChange, required }: IconPickerFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = ICON_LIST.filter((name) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  // Render the selected or any icon dynamically
  const renderIcon = (name: string, className = "w-4 h-4") => {
    const Icon = (LucideIcons as any)[name];
    if (!Icon) return null;
    return <Icon className={className} />;
  };

  return (
    <div ref={containerRef} className="flex flex-col gap-1.5 px-0.5 relative">
      {label && (
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-4">
          {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => { setIsOpen((v) => !v); setSearch(""); }}
        className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm flex items-center gap-3 text-left transition-all focus:outline-none focus:border-[#a0004f] focus:ring-1 focus:ring-[#a0004f] hover:border-gray-300"
      >
        {value ? (
          <>
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 text-blue-500 shrink-0">
              {renderIcon(value, "w-4 h-4")}
            </span>
            <span className="text-gray-800 font-medium flex-1">{value}</span>
          </>
        ) : (
          <>
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 text-gray-300 shrink-0">
              <Search className="w-4 h-4" />
            </span>
            <span className="text-gray-400 flex-1">Choose an icon...</span>
          </>
        )}
        <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
          {/* Search bar */}
          <div className="p-3 border-b border-gray-100 flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search icons..."
              className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} className="text-gray-300 hover:text-gray-500">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Icon grid */}
          <div className="p-3 grid grid-cols-6 gap-1.5 max-h-64 overflow-y-auto">
            {filtered.length === 0 && (
              <div className="col-span-6 text-center text-xs text-gray-400 py-6">No icons found</div>
            )}
            {filtered.map((name) => (
              <button
                key={name}
                type="button"
                title={name}
                onClick={() => { onChange(name); setIsOpen(false); setSearch(""); }}
                className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl text-[9px] font-medium transition-all group ${
                  value === name
                    ? "bg-blue-500 text-white"
                    : "hover:bg-blue-50 text-gray-500 hover:text-blue-500"
                }`}
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  {renderIcon(name, "w-4 h-4")}
                </span>
                <span className="truncate w-full text-center leading-tight">{name}</span>
              </button>
            ))}
          </div>

          {/* Clear */}
          {value && (
            <div className="border-t border-gray-100 p-2">
              <button
                type="button"
                onClick={() => { onChange(""); setIsOpen(false); }}
                className="w-full text-xs text-red-400 hover:text-red-600 py-1.5 rounded-lg hover:bg-red-50 transition-all"
              >
                Clear selection
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
