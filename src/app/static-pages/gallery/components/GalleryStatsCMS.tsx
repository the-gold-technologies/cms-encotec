"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { Plus, Trash2 } from "lucide-react";

interface StatItem {
  label: string;
  value: string;
  suffix: string;
}

export function GalleryStatsCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/gallery")
      .then((json) => {
        if (json.success && json.data?.GalleryStats?.stats) {
          setStats(json.data.GalleryStats.stats);
        }
      })
      .catch(console.error);
  }, []);

  const handleStatChange = (
    index: number,
    field: keyof StatItem,
    val: string,
  ) => {
    setStats((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  const handleAddStat = () => {
    setStats((prev) => [...prev, { label: "", value: "", suffix: "" }]);
  };

  const handleRemoveStat = (index: number) => {
    setStats((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Stats Section...");
    try {
      const sanitizedStats = stats.map((s) => ({
        label: String(s.label || ""),
        value: String(s.value || ""),
        suffix: String(s.suffix || ""),
      }));

      const res = await fetch("/api/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "GalleryStats",
          content: { stats: sanitizedStats },
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Stats Section saved successfully!", { id: toastId });
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
        title="Stats Banner Strip"
        description="Manage the key operational metrics displayed in the stats section (matching Insights stats design)."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-4 border-t border-gray-50">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-gray-800">
              Operational Stats
            </h4>
            <button
              type="button"
              onClick={handleAddStat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 text-brand-pink border border-pink-200 text-xs font-bold rounded-lg hover:bg-pink-100 transition-colors"
            >
              <Plus size={14} /> Add Metric
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col gap-3 relative"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveStat(idx)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1"
                  title="Remove Stat"
                >
                  <Trash2 size={15} />
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <InputField
                    label="Value (Number)"
                    value={stat.value}
                    onChange={(e) =>
                      handleStatChange(idx, "value", e.target.value)
                    }
                    placeholder="e.g. 3500"
                  />
                  <InputField
                    label="Suffix"
                    value={stat.suffix}
                    onChange={(e) =>
                      handleStatChange(idx, "suffix", e.target.value)
                    }
                    placeholder="e.g. + MW"
                  />
                </div>
                <InputField
                  label="Label"
                  value={stat.label}
                  onChange={(e) =>
                    handleStatChange(idx, "label", e.target.value)
                  }
                  placeholder="e.g. Installed Capacity Managed"
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
