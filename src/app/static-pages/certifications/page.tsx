"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";

export default function CertificationsCMSPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    heroTitle: "Certifications",
    heroSubtitle: "We hold ourselves to the highest standards of safety, quality, and environmental responsibility",
    standardsList: "ISO 9001:2015 (Quality), ISO 14001:2015 (Environment), ISO 45001:2018 (Occupational Health & Safety)"
  });

  useEffect(() => {
    fetchWithCache("/api/certifications")
      .then((json) => {
        if (json.success && json.data?.CertificationsContent) {
          setFormData((prev) => ({ ...prev, ...json.data.CertificationsContent }));
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
    const toastId = toast.loading("Saving certifications...");
    try {
      const res = await fetch("/api/certifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "CertificationsContent",
          content: formData
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Certifications saved successfully!", { id: toastId });
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
        title="Certifications Content"
        description="Manage the ISO compliance credentials and quality control standards list."
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
            placeholder="e.g. Certifications"
            required
          />
          <InputField
            label="Hero Subtitle"
            name="heroSubtitle"
            value={formData.heroSubtitle}
            onChange={handleChange}
            placeholder="e.g. Compliant with international standards"
            required
          />
        </div>

        <h3 className="font-bold text-lg text-[#0B0F29] border-b border-gray-100 pb-3 mt-4">
          Standards & Compliance
        </h3>
        <div className="flex flex-col gap-6">
          <TextAreaField
            label="List of ISO Certifications"
            name="standardsList"
            value={formData.standardsList}
            onChange={handleChange}
            placeholder="e.g. ISO 9001, ISO 14001..."
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
