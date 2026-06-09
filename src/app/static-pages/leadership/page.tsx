"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";

export default function LeadershipCMSPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    heroTitle: "Our Leadership",
    heroSubtitle: "Meet the executive team guiding Encotec's engineering and project management operations",
    execDirector: "Dr.-Ing. Bernhard Kutz (Executive Director)",
    directorBio: "Dr. Bernhard Kutz has over 25 years of global engineering experience leading power infrastructure projects."
  });

  useEffect(() => {
    fetchWithCache("/api/leadership")
      .then((json) => {
        if (json.success && json.data?.LeadershipContent) {
          setFormData((prev) => ({ ...prev, ...json.data.LeadershipContent }));
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
    const toastId = toast.loading("Saving leadership content...");
    try {
      const res = await fetch("/api/leadership", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "LeadershipContent",
          content: formData
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Leadership content saved successfully!", { id: toastId });
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
        title="Leadership Page Content"
        description="Manage details and summary profiles of the executive management team."
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
            placeholder="e.g. Our Leadership"
            required
          />
          <InputField
            label="Hero Subtitle"
            name="heroSubtitle"
            value={formData.heroSubtitle}
            onChange={handleChange}
            placeholder="e.g. Meet the executive team"
            required
          />
        </div>

        <h3 className="font-bold text-lg text-[#0B0F29] border-b border-gray-100 pb-3 mt-4">
          Executive Director Profile
        </h3>
        <div className="flex flex-col gap-6">
          <InputField
            label="Director Name & Title"
            name="execDirector"
            value={formData.execDirector}
            onChange={handleChange}
            placeholder="e.g. Dr.-Ing. Bernhard Kutz..."
            required
          />
          <TextAreaField
            label="Director Biography / Summary"
            name="directorBio"
            value={formData.directorBio}
            onChange={handleChange}
            placeholder="Introduce the biography..."
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
