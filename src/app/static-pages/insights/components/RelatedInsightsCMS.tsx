"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";

export function RelatedInsightsCMS({ saveUrl = "/api/insights" }: { saveUrl?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    heading: "",
    viewAllLabel: "",
    readMoreLabel: ""
  });

  useEffect(() => {
    fetchWithCache(saveUrl)
      .then((json) => {
        const sectionData = json.data?.["RelatedInsights"];
        if (json.success && sectionData) {
          setFormData({
            heading: sectionData.heading || "",
            viewAllLabel: sectionData.viewAllLabel || "",
            readMoreLabel: sectionData.readMoreLabel || ""
          });
        }
      })
      .catch(console.error);
  }, [saveUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Related Insights labels...");
    try {
      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "RelatedInsights", content: formData })
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Related Insights labels saved!", { id: toastId });
      } else {
        toast.error(json.error || "Save failed.", { id: toastId });
      }
    } catch (e) {
      console.error(e);
      toast.error("Error saving.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4">
      <SectionHeader
        title="Related Insights Widget Labels"
        description="Manage the related widget headings and button labels in the detailed post view."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-6">
          <InputField label="Widget Title Heading" name="heading" value={formData.heading} onChange={handleChange} required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="View All Button Label" name="viewAllLabel" value={formData.viewAllLabel} onChange={handleChange} required />
            <InputField label="Read More Link Label" name="readMoreLabel" value={formData.readMoreLabel} onChange={handleChange} required />
          </div>
          
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <SaveButton onClick={handleSave} disabled={isSaving} className="w-44 h-12" />
          </div>
        </div>
      )}
    </div>
  );
}
