"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";

export default function CareersCMSPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    heroTitle: "Careers at Encotec",
    heroSubtitle: "Shape the future of energy and infrastructure engineering with our exceptional team",
    hrEmail: "hr@encotec.mx",
    cultureStatement: "We foster an inclusive environment centered around technical innovation, professional development, and integrity."
  });

  useEffect(() => {
    fetchWithCache("/api/careers")
      .then((json) => {
        if (json.success && json.data?.CareersContent) {
          setFormData((prev) => ({ ...prev, ...json.data.CareersContent }));
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
    const toastId = toast.loading("Saving careers content...");
    try {
      const res = await fetch("/api/careers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "CareersContent",
          content: formData
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Careers content saved successfully!", { id: toastId });
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
        title="Careers Page Content"
        description="Manage job application settings, HR contact channels, and the culture values section."
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
            placeholder="e.g. Careers at Encotec"
            required
          />
          <InputField
            label="Hero Subtitle"
            name="heroSubtitle"
            value={formData.heroSubtitle}
            onChange={handleChange}
            placeholder="e.g. Join our professional engineering team"
            required
          />
        </div>

        <h3 className="font-bold text-lg text-[#0B0F29] border-b border-gray-100 pb-3 mt-4">
          Contact & Culture Details
        </h3>
        <div className="flex flex-col gap-6">
          <InputField
            label="HR Contact Email Address"
            name="hrEmail"
            value={formData.hrEmail}
            onChange={handleChange}
            placeholder="e.g. hr@encotech.com"
            required
          />
          <TextAreaField
            label="Company Culture Statement"
            name="cultureStatement"
            value={formData.cultureStatement}
            onChange={handleChange}
            placeholder="Describe corporate values and environmental culture..."
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
