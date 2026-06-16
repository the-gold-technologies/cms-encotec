"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";

const defaultFormData = {
  tagline: "Our Culture",
  heading: "What Defines Us",
  value1Title: "Technical Mastery",
  value1Desc: "Deep domain expertise across every discipline",
  value2Title: "Collaborative Spirit",
  value2Desc: "Cross-functional teams solving complex challenges",
  value3Title: "Global Perspective",
  value3Desc: "Diverse experiences from 23+ countries",
  value4Title: "Continuous Growth",
  value4Desc: "Investment in learning and professional development",
};

export function CultureValuesCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/leadership")
      .then((json) => {
        if (json.success && json.data?.CultureValues) {
          setFormData({ ...defaultFormData, ...json.data.CultureValues });
        }
      })
      .catch(console.error);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Culture & Values Section...");
    try {
      const res = await fetch("/api/leadership", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "CultureValues",
          content: formData,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Culture & Values Section saved successfully!", {
          id: toastId,
        });
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
        title="Culture & Core Values"
        description="Manage the tagline, heading, titles and description snippets of the 4 culture pillars."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-4 border-t border-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <InputField
              label="Section Tagline"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              required
            />
            <InputField
              label="Section Heading"
              name="heading"
              value={formData.heading}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => {
              const num = i + 1;
              return (
                <div
                  key={i}
                  className="p-5 bg-gray-50/20 border border-gray-100 rounded-xl flex flex-col gap-4"
                >
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Value pillar {num}
                  </span>
                  <InputField
                    label="Pillar Title"
                    name={`value${num}Title`}
                    value={(formData as any)[`value${num}Title`]}
                    onChange={handleChange}
                    required
                  />
                  <TextAreaField
                    label="Pillar Description"
                    name={`value${num}Desc`}
                    value={(formData as any)[`value${num}Desc`]}
                    onChange={handleChange}
                    rows={2}
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
