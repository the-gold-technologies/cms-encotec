"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";

const defaultFormData = {
  heroTitle: "Our Leadership",
  heroSubtitle: "Meet the executive team guiding Encotec's engineering and project management operations",
  heroBadge1: "200+ Professionals",
  heroBadge2: "15+ Years Average Experience",
  heroBadge3: "23+ Countries",
};

export function LeadershipHeroCMS() {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/leadership")
      .then((json) => {
        if (json.success && json.data?.LeadershipHero) {
          setFormData({ ...defaultFormData, ...json.data.LeadershipHero });
        }
      })
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Hero Section...");
    try {
      const res = await fetch("/api/leadership", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "LeadershipHero",
          content: formData,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Hero Section saved successfully!", { id: toastId });
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
        title="Hero Section"
        description="Manage the title, subtitle, and badges on the page hero header."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-4 border-t border-gray-50">
          <InputField
            label="Hero Title"
            name="heroTitle"
            value={formData.heroTitle}
            onChange={handleChange}
            required
          />
          <InputField
            label="Hero Subtitle"
            name="heroSubtitle"
            value={formData.heroSubtitle}
            onChange={handleChange}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField
              label="Badge 1 Label"
              name="heroBadge1"
              value={formData.heroBadge1}
              onChange={handleChange}
            />
            <InputField
              label="Badge 2 Label"
              name="heroBadge2"
              value={formData.heroBadge2}
              onChange={handleChange}
            />
            <InputField
              label="Badge 3 Label"
              name="heroBadge3"
              value={formData.heroBadge3}
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
