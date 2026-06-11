"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";

const defaultFormData = {
  philosophyHeading: "Leading With an Owner's Mindset",
  philosophyPara1: "At Encotec, leadership is not just about managing teams; it's about taking full accountability for the outcomes we deliver. Our leadership team brings decades of hands-on experience from the world's most complex energy projects.",
  philosophyPara2: "We believe that true engineering excellence requires a culture where every team member is empowered to think critically, act decisively, and prioritize long-term asset performance over short-term gains.",
  philosophyQuote: "We don't just manage projects — we take ownership of outcomes, treating every asset as if it were our own.",
};

export function LeadershipPhilosophyCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/leadership")
      .then((json) => {
        if (json.success && json.data?.LeadershipPhilosophy) {
          setFormData({ ...defaultFormData, ...json.data.LeadershipPhilosophy });
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
    const toastId = toast.loading("Saving Philosophy Section...");
    try {
      const res = await fetch("/api/leadership", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "LeadershipPhilosophy",
          content: formData,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Philosophy Section saved successfully!", { id: toastId });
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
        title="Philosophy Section"
        description="Manage corporate philosophy headings, text descriptions, and key quotes."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-4 border-t border-gray-50">
          <InputField
            label="Philosophy Heading"
            name="philosophyHeading"
            value={formData.philosophyHeading}
            onChange={handleChange}
            required
          />
          <TextAreaField
            label="Philosophy Paragraph 1"
            name="philosophyPara1"
            value={formData.philosophyPara1}
            onChange={handleChange}
            rows={3}
            required
          />
          <TextAreaField
            label="Philosophy Paragraph 2"
            name="philosophyPara2"
            value={formData.philosophyPara2}
            onChange={handleChange}
            rows={3}
            required
          />
          <InputField
            label="Callout Quote"
            name="philosophyQuote"
            value={formData.philosophyQuote}
            onChange={handleChange}
            required
          />
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
