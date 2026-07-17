"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";

const defaultFormData = {
  tagline: "",
  heading: "",
  description: "",
  partnersList: [
    {
      name: "",
      monogram: "",
      role: ""
    },
    {
      name: "",
      monogram: "",
      role: ""
    },
    {
      name: "",
      monogram: "",
      role: ""
    },
    {
      name: "",
      monogram: "",
      role: ""
    },
    {
      name: "",
      monogram: "",
      role: ""
    },
    {
      name: "",
      monogram: "",
      role: ""
    },
    {
      name: "",
      monogram: "",
      role: ""
    },
    {
      name: "",
      monogram: "",
      role: ""
    }
  ]
};

export function StrategicPartnersCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/certifications")
      .then((json) => {
        if (json.success && json.data?.StrategicPartners) {
          setFormData({ ...defaultFormData, ...json.data.StrategicPartners });
        }
      })
      .catch(console.error);
  }, []);

  const handlePartnerChange = (
    index: number,
    field: "name" | "monogram" | "role",
    value: string,
  ) => {
    setFormData((prev) => {
      const updatedList = [...prev.partnersList];
      updatedList[index] = { ...updatedList[index], [field]: value };
      return { ...prev, partnersList: updatedList };
    });
  };

  const addPartner = () => {
    setFormData((prev) => ({
      ...prev,
      partnersList: [
        ...prev.partnersList,
        { name: "", monogram: "", role: "" },
      ],
    }));
    toast.success("Added new partner slot");
  };

  const removePartner = (index: number) => {
    if (formData.partnersList.length <= 1) {
      toast.error("At least one partner is required");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      partnersList: prev.partnersList.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Strategic Partners...");
    try {
      const res = await fetch("/api/certifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "StrategicPartners",
          content: formData,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Strategic Partners saved successfully!", {
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

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4">
      <SectionHeader
        title="Strategic Partners Section"
        description="Manage the alliances, headings, and strategic partners shown on the certifications page."
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
              onChange={handleFieldChange}
              required
            />
            <InputField
              label="Section Heading"
              name="heading"
              value={formData.heading}
              onChange={handleFieldChange}
              required
            />
          </div>
          <TextAreaField
            label="Section Description"
            name="description"
            value={formData.description}
            onChange={handleFieldChange}
            rows={2}
            required
          />

          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">
              Partners list ({formData.partnersList.length})
            </span>
            <button
              onClick={addPartner}
              className="flex items-center gap-2 px-3 py-1.5 bg-brand-pink text-white rounded text-xs font-semibold hover:bg-[#a0004f] transition-all"
            >
              <Plus size={14} /> Add Partner
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formData.partnersList.map((partner, idx) => (
              <div
                key={idx}
                className="p-4 border border-gray-100 rounded-xl flex flex-col gap-4 relative"
              >
                <button
                  onClick={() => removePartner(idx)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove Partner"
                >
                  <Trash2 size={16} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <InputField
                      label={`Partner #${idx + 1} Name`}
                      name={`name-${idx}`}
                      value={partner.name}
                      onChange={(e) =>
                        handlePartnerChange(idx, "name", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <InputField
                      label="Monogram"
                      name={`monogram-${idx}`}
                      value={partner.monogram}
                      onChange={(e) =>
                        handlePartnerChange(idx, "monogram", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <InputField
                  label="Role / Capability (e.g. Gas Turbine Technology)"
                  name={`role-${idx}`}
                  value={partner.role}
                  onChange={(e) =>
                    handlePartnerChange(idx, "role", e.target.value)
                  }
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
