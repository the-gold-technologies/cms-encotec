"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";

const defaultFormData = {
  tagline: "",
  heading: "",
  description: "",
  privacyNote: ""
};

export function NewsletterSectionCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/insights")
      .then((json) => {
        if (json.success && json.data?.NewsletterSection) {
          setFormData({ ...defaultFormData, ...json.data.NewsletterSection });
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
    const toastId = toast.loading("Saving Newsletter Section...");
    try {
      const res = await fetch("/api/insights", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "NewsletterSection",
          content: formData,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Newsletter Section saved successfully!", {
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
        title="Newsletter Signup Banner"
        description="Manage the tagline, heading, and description for the newsletter subscribe card."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-4 border-t border-gray-50">
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
          <TextAreaField
            label="Section Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={2}
            required
          />
          <InputField
            label="Privacy / Unsubscribe Note"
            name="privacyNote"
            value={formData.privacyNote}
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
