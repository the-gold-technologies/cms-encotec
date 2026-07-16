"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";

const defaultFormData = {
  stats1Value: "1800",
  stats1Label: "Total Professionals",
  stats2Value: "300",
  stats2Label: "Industry specialists",
  stats3Value: "10",
  stats3Label: "Countries of Operation",
  stats4Value: "12",
  stats4Label: "Years Avg Experience"
};

export function TeamByNumbersCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/leadership")
      .then((json) => {
        if (json.success && json.data?.TeamByNumbers) {
          setFormData({ ...defaultFormData, ...json.data.TeamByNumbers });
        }
      })
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Team By Numbers Section...");
    try {
      const res = await fetch("/api/leadership", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "TeamByNumbers",
          content: formData,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Team By Numbers Section saved successfully!", { id: toastId });
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
        title="Team by Numbers"
        description="Manage numeric thresholds and stat labels shown on counters."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-4 border-t border-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => {
              const num = i + 1;
              return (
                <div key={i} className="p-4 bg-gray-50/20 border border-gray-100 rounded-xl flex flex-col gap-4">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Stat counter {num}</span>
                  <InputField
                    label="Target Value (number)"
                    name={`stats${num}Value`}
                    value={(formData as any)[`stats${num}Value`]}
                    onChange={handleChange}
                    required
                  />
                  <InputField
                    label="Counter Label"
                    name={`stats${num}Label`}
                    value={(formData as any)[`stats${num}Label`]}
                    onChange={handleChange}
                    required
                  />
                </div>
              );
            })}
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
