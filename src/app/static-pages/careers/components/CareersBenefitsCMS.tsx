"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

const defaultFormData = {
  tagline: "What We Offer",
  heading: "Benefits & Perks",
  benefitsList: [
    {
      title: "Global Exposure",
      description: "Work on critical energy infrastructure projects across 10+ countries with diverse international teams."
    },
    {
      title: "Technical Growth",
      description: "Access to cutting-edge technologies, specialized training, and continuous learning programs."
    },
    {
      title: "Competitive Compensation",
      description: "Industry-leading salary packages with performance-based bonuses and comprehensive benefits."
    },
    {
      title: "Health & Wellness",
      description: "Comprehensive medical insurance, wellness programs, and support for physical and mental health."
    },
    {
      title: "Work-Life Balance",
      description: "Flexible working arrangements, generous leave policies, and a supportive team environment."
    },
    {
      title: "Career Progression",
      description: "Clear growth paths, leadership development, and mentorship from seasoned industry veterans."
    }
  ]
};

export function CareersBenefitsCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/careers")
      .then((json) => {
        if (json.success && json.data?.CareersBenefits) {
          setFormData({ ...defaultFormData, ...json.data.CareersBenefits });
        }
      })
      .catch(console.error);
  }, []);

  const handleBenefitChange = (
    index: number,
    field: "title" | "description",
    value: string,
  ) => {
    setFormData((prev) => {
      const updatedList = [...prev.benefitsList];
      updatedList[index] = { ...updatedList[index], [field]: value };
      return { ...prev, benefitsList: updatedList };
    });
  };

  const addBenefit = () => {
    setFormData((prev) => ({
      ...prev,
      benefitsList: [...prev.benefitsList, { title: "", description: "" }],
    }));
    toast.success("Added new benefit card");
  };

  const removeBenefit = (index: number) => {
    if (formData.benefitsList.length <= 1) {
      toast.error("At least one benefit is required");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      benefitsList: prev.benefitsList.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Benefits Section...");
    try {
      const res = await fetch("/api/careers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "CareersBenefits",
          content: formData,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Benefits Section saved successfully!", { id: toastId });
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
        title="Benefits & Perks Section"
        description="Manage the tagline, heading, and benefits cards displayed on the careers page."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-4 border-t border-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Section Tagline"
              name="tagline"
              value={formData.tagline}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, tagline: e.target.value }))
              }
              required
            />
            <InputField
              label="Section Heading"
              name="heading"
              value={formData.heading}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, heading: e.target.value }))
              }
              required
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">
              Benefits cards list ({formData.benefitsList.length})
            </span>
            <button
              onClick={addBenefit}
              className="flex items-center gap-2 px-3 py-1.5 bg-brand-pink text-white rounded text-xs font-semibold hover:bg-[#a0004f] transition-all"
            >
              <Plus size={14} /> Add Benefit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formData.benefitsList.map((benefit, idx) => (
              <div
                key={idx}
                className="p-4 border border-gray-100 rounded-xl flex flex-col gap-4 relative"
              >
                <button
                  onClick={() => removeBenefit(idx)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove Benefit"
                >
                  <Trash2 size={16} />
                </button>

                <InputField
                  label={`Benefit #${idx + 1} Title`}
                  name={`title-${idx}`}
                  value={benefit.title}
                  onChange={(e) =>
                    handleBenefitChange(idx, "title", e.target.value)
                  }
                  required
                />

                <TextAreaField
                  label={`Benefit #${idx + 1} Description`}
                  name={`desc-${idx}`}
                  value={benefit.description}
                  onChange={(e) =>
                    handleBenefitChange(idx, "description", e.target.value)
                  }
                  rows={2}
                  required
                />
              </div>
            ))}
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
