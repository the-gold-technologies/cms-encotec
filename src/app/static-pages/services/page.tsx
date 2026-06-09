"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";

export default function ServicesCMSPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    heroTitle: "Our Services",
    heroSubtitle: "High-quality engineering & consulting services",
    engineeringDesc: "Providing structural, civil, mechanical, and electrical engineering expertise.",
    projectMgmtDesc: "Ensuring projects are delivered on-schedule, on-budget, and safely.",
    powerGenDesc: "Decades of experience in construction and operations of power systems."
  });

  useEffect(() => {
    fetchWithCache("/api/services")
      .then((json) => {
        if (json.success && json.data?.ServicesContent) {
          setFormData((prev) => ({ ...prev, ...json.data.ServicesContent }));
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
    const toastId = toast.loading("Saving services content...");
    try {
      const res = await fetch("/api/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "ServicesContent",
          content: formData
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Services content saved successfully!", { id: toastId });
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
        title="Services Page Content"
        description="Manage the titles and descriptions of the core engineering and consultancy services offered by Encotec."
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
            placeholder="e.g. Our Services"
            required
          />
          <InputField
            label="Hero Subtitle"
            name="heroSubtitle"
            value={formData.heroSubtitle}
            onChange={handleChange}
            placeholder="e.g. Premium engineering solutions"
            required
          />
        </div>

        <h3 className="font-bold text-lg text-[#0B0F29] border-b border-gray-100 pb-3 mt-4">
          Core Focus Areas
        </h3>
        <div className="flex flex-col gap-6">
          <TextAreaField
            label="Engineering Services Description"
            name="engineeringDesc"
            value={formData.engineeringDesc}
            onChange={handleChange}
            placeholder="Describe engineering services..."
            rows={3}
            required
          />
          <TextAreaField
            label="Project Management Description"
            name="projectMgmtDesc"
            value={formData.projectMgmtDesc}
            onChange={handleChange}
            placeholder="Describe project management..."
            rows={3}
            required
          />
          <TextAreaField
            label="Power Generation & Transmission"
            name="powerGenDesc"
            value={formData.powerGenDesc}
            onChange={handleChange}
            placeholder="Describe power generation services..."
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
