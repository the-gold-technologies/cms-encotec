"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";

const defaultFormData = {
  ctaHeading: "",
  ctaSubtitle: "",
  hrEmail: "",
};

export function CareersCTACMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/careers")
      .then((json) => {
        if (json.success && json.data?.CareersCTA) {
          setFormData({ ...defaultFormData, ...json.data.CareersCTA });
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
    const toastId = toast.loading("Saving CTA Section...");
    try {
      const res = await fetch("/api/careers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "CareersCTA",
          content: formData,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("CTA Section saved successfully!", { id: toastId });
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
        title="CTA & Application Details"
        description="Manage the CTA banner headline, subtitle, and candidate application email."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-4 border-t border-gray-50">
          <InputField
            label="CTA Heading"
            name="ctaHeading"
            value={formData.ctaHeading}
            onChange={handleChange}
            required
          />
          <TextAreaField
            label="CTA Subtitle"
            name="ctaSubtitle"
            value={formData.ctaSubtitle}
            onChange={handleChange}
            rows={3}
            required
          />
          <InputField
            label="HR Candidate Email Address"
            name="hrEmail"
            value={formData.hrEmail}
            onChange={handleChange}
            placeholder="e.g. hr@encotecenergy.com"
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
