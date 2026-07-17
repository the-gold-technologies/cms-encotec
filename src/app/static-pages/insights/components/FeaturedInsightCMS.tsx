"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";

const defaultFormData = {
  latestArticleTitle: "",
  latestArticleSummary: "",
  latestArticleDate: "",
  latestArticleLocation: "",
  latestArticleSlug: "",
  latestArticleImage: "",
  badgeLabel: "",
  btnLabel: ""
};

export function FeaturedInsightCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/insights")
      .then((json) => {
        if (json.success && json.data?.FeaturedInsight) {
          setFormData({ ...defaultFormData, ...json.data.FeaturedInsight });
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
    const toastId = toast.loading("Saving Featured Article Section...");
    try {
      const res = await fetch("/api/insights", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "FeaturedInsight",
          content: formData,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Featured Article Section saved successfully!", {
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
        title="Featured Article Section"
        description="Manage the highlights, summary, date, links, and text labels for the top featured article."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-4 border-t border-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Badge Label (e.g. Featured Case Study)"
              name="badgeLabel"
              value={formData.badgeLabel}
              onChange={handleChange}
              required
            />
            <InputField
              label="Button Text (e.g. Read Full Case Study)"
              name="btnLabel"
              value={formData.btnLabel}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Article URL Slug"
              name="latestArticleSlug"
              value={formData.latestArticleSlug}
              onChange={handleChange}
              required
            />
            <InputField
              label="Featured Image URL"
              name="latestArticleImage"
              value={formData.latestArticleImage}
              onChange={handleChange}
              required
            />
          </div>

          <InputField
            label="Featured Article Title"
            name="latestArticleTitle"
            value={formData.latestArticleTitle}
            onChange={handleChange}
            required
          />
          <TextAreaField
            label="Article Summary"
            name="latestArticleSummary"
            value={formData.latestArticleSummary}
            onChange={handleChange}
            rows={3}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Featured Date / Month"
              name="latestArticleDate"
              value={formData.latestArticleDate}
              onChange={handleChange}
            />
            <InputField
              label="Featured Location"
              name="latestArticleLocation"
              value={formData.latestArticleLocation}
              onChange={handleChange}
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
