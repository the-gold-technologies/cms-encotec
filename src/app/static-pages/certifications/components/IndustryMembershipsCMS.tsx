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
  heading: "",
  description: "",
  membershipsList: [
    {
      name: "",
      year: ""
    },
    {
      name: "",
      year: ""
    },
    {
      name: "",
      year: ""
    },
    {
      name: "",
      year: ""
    },
    {
      name: "",
      year: ""
    },
    {
      name: "",
      year: ""
    }
  ]
};

export function IndustryMembershipsCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/certifications")
      .then((json) => {
        if (json.success && json.data?.IndustryMemberships) {
          setFormData({ ...defaultFormData, ...json.data.IndustryMemberships });
        }
      })
      .catch(console.error);
  }, []);

  const handleMembershipChange = (index: number, field: "name" | "year", value: string) => {
    setFormData((prev) => {
      const updatedList = [...prev.membershipsList];
      updatedList[index] = { ...updatedList[index], [field]: value };
      return { ...prev, membershipsList: updatedList };
    });
  };

  const addMembership = () => {
    setFormData((prev) => ({
      ...prev,
      membershipsList: [...prev.membershipsList, { name: "", year: "" }]
    }));
    toast.success("Added new membership slot");
  };

  const removeMembership = (index: number) => {
    if (formData.membershipsList.length <= 1) {
      toast.error("At least one membership is required");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      membershipsList: prev.membershipsList.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Industry Memberships...");
    try {
      const res = await fetch("/api/certifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "IndustryMemberships",
          content: formData,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Industry Memberships saved successfully!", { id: toastId });
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

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4">
      <SectionHeader
        title="Industry Memberships Section"
        description="Manage the industry affiliations, headings, and memberships shown on the certifications page."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-4 border-t border-gray-50">
          <InputField
            label="Section Heading"
            name="heading"
            value={formData.heading}
            onChange={handleFieldChange}
            required
          />
          <TextAreaField
            label="Section Description"
            name="description"
            value={formData.description}
            onChange={handleFieldChange}
            rows={2}
            required
          />

          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">Memberships ({formData.membershipsList.length})</span>
            <button
              onClick={addMembership}
              className="flex items-center gap-2 px-3 py-1.5 bg-brand-pink text-white rounded text-xs font-semibold hover:bg-[#a0004f] transition-all"
            >
              <Plus size={14} /> Add Membership
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formData.membershipsList.map((item, idx) => (
              <div key={idx} className="p-4 border border-gray-100 rounded-xl flex flex-col gap-4 relative">
                <button
                  onClick={() => removeMembership(idx)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove Membership"
                >
                  <Trash2 size={16} />
                </button>

                <InputField
                  label={`Membership #${idx + 1} Name`}
                  name={`name-${idx}`}
                  value={item.name}
                  onChange={(e) => handleMembershipChange(idx, "name", e.target.value)}
                  required
                />

                <InputField
                  label="Joining Year (e.g. 2010)"
                  name={`year-${idx}`}
                  value={item.year}
                  onChange={(e) => handleMembershipChange(idx, "year", e.target.value)}
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
