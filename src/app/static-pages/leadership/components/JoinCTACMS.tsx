"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";

const defaultFormData = {
  joinHeading: "Join Our Team of Experts",
  joinSubtitle: "We're always looking for talented engineers and energy professionals who share our passion for excellence.",
  ctaLabel1: "View Open Positions",
  ctaUrl1: "/careers",
  ctaLabel2: "Contact Us",
  ctaUrl2: "/contact"
};

export function JoinCTACMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/leadership")
      .then((json) => {
        if (json.success && json.data?.JoinCTA) {
          setFormData({ ...defaultFormData, ...json.data.JoinCTA });
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
    const toastId = toast.loading("Saving Join CTA Banner Section...");
    try {
      const res = await fetch("/api/leadership", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "JoinCTA",
          content: formData,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Join CTA Banner Section saved successfully!", {
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
        title="Join CTA Banner"
        description="Manage headings, subtitles, button labels and URLs on the bottom recruits call-to-action banner."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-4 border-t border-gray-50">
          <InputField
            label="Join Banner Heading"
            name="joinHeading"
            value={formData.joinHeading}
            onChange={handleChange}
            required
          />
          <TextAreaField
            label="Join Banner Subtitle"
            name="joinSubtitle"
            value={formData.joinSubtitle}
            onChange={handleChange}
            rows={2}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Primary CTA Button Label"
              name="ctaLabel1"
              value={formData.ctaLabel1}
              onChange={handleChange}
              required
            />
            <InputField
              label="Primary CTA Button URL"
              name="ctaUrl1"
              value={formData.ctaUrl1}
              onChange={handleChange}
              required
            />
            <InputField
              label="Secondary CTA Button Label"
              name="ctaLabel2"
              value={formData.ctaLabel2}
              onChange={handleChange}
              required
            />
            <InputField
              label="Secondary CTA Button URL"
              name="ctaUrl2"
              value={formData.ctaUrl2}
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
