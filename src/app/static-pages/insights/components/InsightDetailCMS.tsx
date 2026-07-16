"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";

const defaultFormData = {
  backLabel: "Back to Insights",
  loadingText: "Loading insight details...",
  notFoundTitle: "Article Not Found",
  notFoundText: "The insight you are looking for doesn't exist or has been moved.",
  notFoundBtnLabel: "Back to Insights",
  shareLabel: "Share this article"
};

export function InsightDetailCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/insights")
      .then((json) => {
        if (json.success && json.data?.InsightDetail) {
          setFormData({ ...defaultFormData, ...json.data.InsightDetail });
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
    const toastId = toast.loading("Saving Insight Detail Section...");
    try {
      const res = await fetch("/api/insights", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "InsightDetail",
          content: formData,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Insight Detail Section saved successfully!", {
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
        title="Single Insight Detail View Labels"
        description="Manage the labels, loaders, share headers, and 'Not Found' messaging for the detailed single article view."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-4 border-t border-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Back Button Label"
              name="backLabel"
              value={formData.backLabel}
              onChange={handleChange}
              required
            />
            <InputField
              label="Share Banner Header"
              name="shareLabel"
              value={formData.shareLabel}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Loading State Text"
              name="loadingText"
              value={formData.loadingText}
              onChange={handleChange}
              required
            />
            <InputField
              label="Not Found Title"
              name="notFoundTitle"
              value={formData.notFoundTitle}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Not Found Back Button Label"
              name="notFoundBtnLabel"
              value={formData.notFoundBtnLabel}
              onChange={handleChange}
              required
            />
            <TextAreaField
              label="Not Found Description"
              name="notFoundText"
              value={formData.notFoundText}
              onChange={handleChange}
              rows={2}
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
