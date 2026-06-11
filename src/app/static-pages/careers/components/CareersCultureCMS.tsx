"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";

const defaultFormData = {
  cultureHeading: "Engineering Careers That Matter",
  culturePara1: "At Encotec, we don't just build power plants; we engineer the foundation of modern society. Our team works on some of the most complex and critical energy infrastructure projects globally, from massive supercritical thermal plants to utility-scale renewable energy parks.",
  culturePara2: "We foster a culture of technical excellence, continuous learning, and collaborative problem-solving. When you join Encotec, you gain global exposure, working alongside industry veterans who are passionate about mentoring the next generation of engineering leaders.",
  cultureQuote: "We empower our engineers to take ownership, innovate, and deliver solutions that have a tangible impact on global energy security.",
};

export function CareersCultureCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/careers")
      .then((json) => {
        if (json.success && json.data?.CareersCulture) {
          setFormData({ ...defaultFormData, ...json.data.CareersCulture });
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
    const toastId = toast.loading("Saving Culture Section...");
    try {
      const res = await fetch("/api/careers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "CareersCulture",
          content: formData,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Culture Section saved successfully!", { id: toastId });
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
        title="Why Join Us & Culture"
        description="Manage corporate culture headings, descriptions, and quotes."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-4 border-t border-gray-50">
          <InputField
            label="Section Heading"
            name="cultureHeading"
            value={formData.cultureHeading}
            onChange={handleChange}
            required
          />
          <TextAreaField
            label="Culture Description Paragraph 1"
            name="culturePara1"
            value={formData.culturePara1}
            onChange={handleChange}
            rows={3}
            required
          />
          <TextAreaField
            label="Culture Description Paragraph 2"
            name="culturePara2"
            value={formData.culturePara2}
            onChange={handleChange}
            rows={3}
            required
          />
          <InputField
            label="Callout Quote"
            name="cultureQuote"
            value={formData.cultureQuote}
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
