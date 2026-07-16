"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";

const defaultFormData = {
  ctaHeading: "Partner With Excellence",
  ctaSubtitle: "Experience engineering services backed by global certifications and a commitment to uncompromising quality.",
  ctaLabel: "Discuss Your Project",
  ctaUrl: "/contact"
};

export function CertificationsCTACMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/certifications")
      .then((json) => {
        if (json.success && json.data?.CertificationsCTA) {
          setFormData({ ...defaultFormData, ...json.data.CertificationsCTA });
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
    const toastId = toast.loading("Saving Certifications CTA...");
    try {
      const res = await fetch("/api/certifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "CertificationsCTA",
          content: formData,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Certifications CTA saved successfully!", {
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
        title="CTA Banner Section"
        description="Manage the CTA banner heading and description."
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
            rows={2}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="CTA Button Label"
              name="ctaLabel"
              value={formData.ctaLabel}
              onChange={handleChange}
              required
            />
            <InputField
              label="CTA Button URL"
              name="ctaUrl"
              value={formData.ctaUrl}
              onChange={handleChange}
              required
            />
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
