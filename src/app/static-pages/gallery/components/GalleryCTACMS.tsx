"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";

const defaultFormData = {
  heading: "",
  description: "",
  buttonText: "",
  buttonLink: "",
};

export function GalleryCTACMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/gallery")
      .then((json) => {
        if (json.success && json.data?.GalleryCTA) {
          setFormData({ ...defaultFormData, ...json.data.GalleryCTA });
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
      const payload = {
        heading: String(formData.heading || ""),
        description: String(formData.description || ""),
        buttonText: String(formData.buttonText || ""),
        buttonLink: String(formData.buttonLink || ""),
      };

      const res = await fetch("/api/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "GalleryCTA", content: payload }),
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
        title="Call to Action (CTA) Section"
        description="Manage the heading, description, and button details on the bottom CTA banner of the Gallery page."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-4 border-t border-gray-50">
          <InputField
            label="Heading"
            name="heading"
            value={formData.heading}
            onChange={handleChange}
            placeholder="e.g. Ready to Elevate Your Energy Asset Performance?"
          />

          <TextAreaField
            label="Description Text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g. Partner with 350+ specialized engineers..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Button Label"
              name="buttonText"
              value={formData.buttonText}
              onChange={handleChange}
              placeholder="e.g. Discuss Your Project"
            />
            <InputField
              label="Button Target Link"
              name="buttonLink"
              value={formData.buttonLink}
              onChange={handleChange}
              placeholder="e.g. /contact"
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
