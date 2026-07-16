"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";

const defaultFormData = {
  ctaHeading: "Have a Project in Mind?",
  ctaSubtitle: "Let's discuss how our engineering expertise can bring value to your next energy infrastructure project.",
  primaryBtnLabel: "Start Your Project",
  primaryBtnUrl: "/contact",
  secondaryBtnLabel: "View Our Services",
  secondaryBtnUrl: "/services"
};

export function InsightsCTACMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/insights")
      .then((json) => {
        if (json.success && json.data?.InsightsCTA) {
          setFormData({ ...defaultFormData, ...json.data.InsightsCTA });
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
    const toastId = toast.loading("Saving CTA Banner Section...");
    try {
      const res = await fetch("/api/insights", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "InsightsCTA",
          content: formData,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("CTA Banner Section saved successfully!", {
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
        title="CTA Section"
        description="Manage headers and description on the bottom banner invitation."
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Primary Button Label"
              name="primaryBtnLabel"
              value={formData.primaryBtnLabel}
              onChange={handleChange}
              required
            />
            <InputField
              label="Primary Button Link URL"
              name="primaryBtnUrl"
              value={formData.primaryBtnUrl}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Secondary Button Label"
              name="secondaryBtnLabel"
              value={formData.secondaryBtnLabel}
              onChange={handleChange}
              required
            />
            <InputField
              label="Secondary Button Link URL"
              name="secondaryBtnUrl"
              value={formData.secondaryBtnUrl}
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
