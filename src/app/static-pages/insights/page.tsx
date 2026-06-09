"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";

export default function InsightsCMSPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    heroTitle: "Encotech Insights",
    heroSubtitle: "Stay updated with our latest project features, white papers, and corporate achievements",
    latestArticleTitle: "Advancing Clean Energy Infrastructure",
    latestArticleSummary: "A comprehensive look at our recent initiatives in supporting utility-scale solar integration."
  });

  useEffect(() => {
    fetchWithCache("/api/insights")
      .then((json) => {
        if (json.success && json.data?.InsightsContent) {
          setFormData((prev) => ({ ...prev, ...json.data.InsightsContent }));
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
    const toastId = toast.loading("Saving insights content...");
    try {
      const res = await fetch("/api/insights", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "InsightsContent",
          content: formData
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Insights content saved successfully!", { id: toastId });
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
    <section className="flex flex-col gap-6">
      <PageHeader
        title="Insights Page Content"
        description="Manage the title header and highlights of the Insights and Corporate Blog page."
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-6">
        <h3 className="font-bold text-lg text-[#0B0F29] border-b border-gray-100 pb-3">
          Hero Section
        </h3>
        <div className="flex flex-col gap-6">
          <InputField
            label="Hero Title"
            name="heroTitle"
            value={formData.heroTitle}
            onChange={handleChange}
            placeholder="e.g. Encotec Insights"
            required
          />
          <InputField
            label="Hero Subtitle"
            name="heroSubtitle"
            value={formData.heroSubtitle}
            onChange={handleChange}
            placeholder="e.g. Latest news and reports"
            required
          />
        </div>

        <h3 className="font-bold text-lg text-[#0B0F29] border-b border-gray-100 pb-3 mt-4">
          Featured Article Summary
        </h3>
        <div className="flex flex-col gap-6">
          <InputField
            label="Featured Article Title"
            name="latestArticleTitle"
            value={formData.latestArticleTitle}
            onChange={handleChange}
            placeholder="e.g. Clean Energy Development"
            required
          />
          <TextAreaField
            label="Article Summary"
            name="latestArticleSummary"
            value={formData.latestArticleSummary}
            onChange={handleChange}
            placeholder="Write a brief article hook..."
            rows={3}
            required
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100 mt-4">
          <SaveButton
            onClick={handleSave}
            disabled={isSaving}
            className="w-44 h-12 text-sm"
          />
        </div>
      </div>
    </section>
  );
}
