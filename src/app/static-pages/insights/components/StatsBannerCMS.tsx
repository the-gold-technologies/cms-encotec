"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";

interface StatItem {
  value: string;
  suffix: string;
  label: string;
}

export function StatsBannerCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statsList, setStatsList] = useState<StatItem[]>([
    { value: "", suffix: "", label: "" },
    { value: "", suffix: "", label: "" },
    { value: "", suffix: "", label: "" },
    { value: "", suffix: "", label: "" }
  ]);

  useEffect(() => {
    fetchWithCache("/api/insights")
      .then((json) => {
        if (json.success && json.data?.StatsBanner) {
          const data = json.data.StatsBanner;
          const raw = (data.stats || data.statsList) as any[];
          if (Array.isArray(raw) && raw.length > 0) {
            setStatsList(raw.map((s: any) => ({
              value: s.value || "",
              suffix: s.suffix || "",
              label: s.label || "",
            })));
          } else {
            const legacy: StatItem[] = [];
            for (let i = 1; i <= 4; i++) {
              if (data[`stats${i}Value`] || data[`stats${i}Label`]) {
                legacy.push({
                  value: data[`stats${i}Value`] || "",
                  suffix: data[`stats${i}Suffix`] || "",
                  label: data[`stats${i}Label`] || "",
                });
              }
            }
            if (legacy.length > 0) setStatsList(legacy);
          }
        }
      })
      .catch(console.error);
  }, []);

  const handleStatChange = (index: number, field: keyof StatItem, value: string) => {
    setStatsList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addStat = () => {
    setStatsList((prev) => [...prev, { value: "", suffix: "", label: "" }]);
    toast.success("Added new counter stat card");
  };

  const deleteStat = (index: number) => {
    if (statsList.length <= 1) {
      toast.error("At least 1 counter stat card is required");
      return;
    }
    setStatsList((prev) => prev.filter((_, i) => i !== index));
    toast.success("Removed counter stat card");
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Stats Banner counters...");
    try {
      const payload: any = {
        stats: statsList,
        statsList,
      };

      statsList.forEach((s, idx) => {
        if (idx < 4) {
          payload[`stats${idx + 1}Value`] = s.value;
          payload[`stats${idx + 1}Suffix`] = s.suffix;
          payload[`stats${idx + 1}Label`] = s.label;
        }
      });

      const res = await fetch("/api/insights", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "StatsBanner",
          content: payload,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Stats Banner saved successfully!", { id: toastId });
      } else {
        toast.error(json.error || "Save failed.", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4">
      <SectionHeader
        title="Stats Banner Counters"
        description="Manage the numeric values, suffixes, and descriptions shown on the stats grid. Add or remove counter stats dynamically."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-4 border-t border-gray-50">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Stat Counter Cards <span className="text-neutral-500 font-semibold">({statsList.length})</span>
            </span>
            <button
              type="button"
              onClick={addStat}
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-900 active:scale-95 transition-all px-3 py-1.5 rounded-lg shadow-sm cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Counter Stat</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsList.map((stat, i) => (
              <div key={i} className="p-4 bg-gray-50/20 border border-gray-200 rounded-xl flex flex-col gap-4 relative group shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                    Stat counter {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteStat(i)}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                    title="Delete counter stat"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <InputField
                  label="Counter Value (number)"
                  name={`statsVal-${i}`}
                  value={stat.value}
                  onChange={(e) => handleStatChange(i, "value", e.target.value)}
                  required
                />
                <InputField
                  label="Suffix (e.g. +, K+)"
                  name={`statsSuf-${i}`}
                  value={stat.suffix}
                  onChange={(e) => handleStatChange(i, "suffix", e.target.value)}
                />
                <InputField
                  label="Counter Label"
                  name={`statsLbl-${i}`}
                  value={stat.label}
                  onChange={(e) => handleStatChange(i, "label", e.target.value)}
                  required
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-50">
            <SaveButton
              onClick={handleSave}
              disabled={isSaving}
              className="w-44 h-12 text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}
