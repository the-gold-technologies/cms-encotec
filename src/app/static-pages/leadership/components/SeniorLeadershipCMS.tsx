"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";

const defaultFormData = {
  leader1Name: "Dr. Anita Desai", leader1Role: "VP Engineering", leader1Bio: "PhD in Thermal Engineering. 18+ years leading complex engineering design for power generation and transmission projects.",
  leader2Name: "Sanjay Mehta", leader2Role: "VP Business Development", leader2Bio: "15+ years driving strategic growth across India, Middle East, and Southeast Asia.",
  leader3Name: "Priya Krishnan", leader3Role: "Head of Renewable Energy", leader3Bio: "12+ years in solar and wind energy project development and execution.",
  leader4Name: "Arjun Reddy", leader4Role: "Head of Project Management", leader4Bio: "16+ years managing large-scale EPC projects across diverse geographies.",
  leader5Name: "Dr. Klaus Werner", leader5Role: "Head of Quality & Safety", leader5Bio: "20+ years in quality management systems and international safety standards.",
  leader6Name: "Meera Iyer", leader6Role: "Chief Financial Officer", leader6Bio: "14+ years in financial strategy and corporate governance for engineering firms.",
};

export function SeniorLeadershipCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/leadership")
      .then((json) => {
        if (json.success && json.data?.SeniorLeadership) {
          setFormData({ ...defaultFormData, ...json.data.SeniorLeadership });
        }
      })
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Senior Leadership Section...");
    try {
      const res = await fetch("/api/leadership", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "SeniorLeadership",
          content: formData,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Senior Leadership Section saved successfully!", { id: toastId });
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
        title="Department Heads"
        description="Manage profiles and roles of VP leaders and department engineers."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-4 border-t border-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => {
              const num = i + 1;
              return (
                <div key={i} className="p-5 bg-gray-50/30 border border-gray-100 rounded-xl flex flex-col gap-4">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Head profile {num}</span>
                  <InputField
                    label="Name"
                    name={`leader${num}Name`}
                    value={(formData as any)[`leader${num}Name`]}
                    onChange={handleChange}
                    required
                  />
                  <InputField
                    label="Role"
                    name={`leader${num}Role`}
                    value={(formData as any)[`leader${num}Role`]}
                    onChange={handleChange}
                    required
                  />
                  <TextAreaField
                    label="Short Bio"
                    name={`leader${num}Bio`}
                    value={(formData as any)[`leader${num}Bio`]}
                    onChange={handleChange}
                    rows={3}
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
