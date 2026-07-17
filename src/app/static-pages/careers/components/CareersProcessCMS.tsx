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
  heading: "",
  processSteps: [
    {
      title: "",
      description: ""
    },
    {
      title: "",
      description: ""
    },
    {
      title: "",
      description: ""
    },
    {
      title: "",
      description: ""
    }
  ]
};

export function CareersProcessCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/careers")
      .then((json) => {
        if (json.success && json.data?.CareersProcess) {
          setFormData({ ...defaultFormData, ...json.data.CareersProcess });
        }
      })
      .catch(console.error);
  }, []);

  const handleStepChange = (
    index: number,
    field: "title" | "description",
    value: string,
  ) => {
    setFormData((prev) => {
      const updatedList = [...prev.processSteps];
      updatedList[index] = { ...updatedList[index], [field]: value };
      return { ...prev, processSteps: updatedList };
    });
  };

  const addStep = () => {
    setFormData((prev) => ({
      ...prev,
      processSteps: [...prev.processSteps, { title: "", description: "" }],
    }));
    toast.success("Added new step");
  };

  const removeStep = (index: number) => {
    if (formData.processSteps.length <= 1) {
      toast.error("At least one process step is required");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      processSteps: prev.processSteps.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Recruitment Steps...");
    try {
      const res = await fetch("/api/careers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "CareersProcess",
          content: formData,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Recruitment Steps saved successfully!", { id: toastId });
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
        title="Application Process Section"
        description="Manage the heading and step-by-step recruitment roadmap shown on the careers page."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-4 border-t border-gray-50">
          <InputField
            label="Section Heading"
            name="heading"
            value={formData.heading}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, heading: e.target.value }))
            }
            required
          />

          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">
              Roadmap Steps ({formData.processSteps.length})
            </span>
            <button
              onClick={addStep}
              className="flex items-center gap-2 px-3 py-1.5 bg-brand-pink text-white rounded text-xs font-semibold hover:bg-[#a0004f] transition-all"
            >
              <Plus size={14} /> Add Step
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formData.processSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-4 border border-gray-100 rounded-xl flex flex-col gap-4 relative"
              >
                <button
                  onClick={() => removeStep(idx)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove Step"
                >
                  <Trash2 size={16} />
                </button>

                <InputField
                  label={`Step #${idx + 1} Title`}
                  name={`title-${idx}`}
                  value={step.title}
                  onChange={(e) =>
                    handleStepChange(idx, "title", e.target.value)
                  }
                  required
                />

                <TextAreaField
                  label={`Step #${idx + 1} Description`}
                  name={`desc-${idx}`}
                  value={step.description}
                  onChange={(e) =>
                    handleStepChange(idx, "description", e.target.value)
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
