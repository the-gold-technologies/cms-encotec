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
  tagline: "Global Standards",
  heading: "Accreditations That Define Our Quality",
  certificationsList: [
    {
      title: "ISO 9001:2015",
      category: "Quality Management",
      desc: "Ensuring consistent quality in our engineering, procurement, and construction services.",
    },
    {
      title: "ISO 14001:2015",
      category: "Environmental Management",
      desc: "Commitment to minimizing our environmental footprint across all project sites.",
    },
    {
      title: "ISO 45001:2018",
      category: "Occupational Health & Safety",
      desc: "Maintaining the highest standards of workplace safety for our employees and contractors.",
    },
    {
      title: "ASME 'U' & 'S' Stamps",
      category: "Boiler & Pressure Vessel",
      desc: "Authorized to manufacture and assemble power boilers and pressure vessels.",
    },
    {
      title: "NABL Accreditation",
      category: "Testing & Calibration",
      desc: "Recognized competence of our testing and calibration laboratories.",
    },
    {
      title: "IBR Certification",
      category: "Indian Boiler Regulations",
      desc: "Certified as a special class boiler repairer and erector under IBR 1950.",
    },
  ],
};

export function CertificationsGridCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/certifications")
      .then((json) => {
        if (json.success && json.data?.CertificationsGrid) {
          setFormData({ ...defaultFormData, ...json.data.CertificationsGrid });
        }
      })
      .catch(console.error);
  }, []);

  const handleCertChange = (
    index: number,
    field: "title" | "category" | "desc",
    value: string,
  ) => {
    setFormData((prev) => {
      const updatedList = [...prev.certificationsList];
      updatedList[index] = { ...updatedList[index], [field]: value };
      return { ...prev, certificationsList: updatedList };
    });
  };

  const addCert = () => {
    setFormData((prev) => ({
      ...prev,
      certificationsList: [
        ...prev.certificationsList,
        { title: "", category: "", desc: "" },
      ],
    }));
    toast.success("Added new credential");
  };

  const removeCert = (index: number) => {
    if (formData.certificationsList.length <= 1) {
      toast.error("At least one accreditation is required");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      certificationsList: prev.certificationsList.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Accreditations Section...");
    try {
      const res = await fetch("/api/certifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "CertificationsGrid",
          content: formData,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Accreditations Section saved successfully!", {
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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4">
      <SectionHeader
        title="Accreditations & Certificates Section"
        description="Manage the tagline, heading, and ISO/ASME/IBR certificates displayed on the page."
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
              Certificates list ({formData.certificationsList.length})
            </span>
            <button
              onClick={addCert}
              className="flex items-center gap-2 px-3 py-1.5 bg-brand-pink text-white rounded text-xs font-semibold hover:bg-[#a0004f] transition-all"
            >
              <Plus size={14} /> Add Certificate
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formData.certificationsList.map((cert, idx) => (
              <div
                key={idx}
                className="p-4 border border-gray-100 rounded-xl flex flex-col gap-4 relative"
              >
                <button
                  onClick={() => removeCert(idx)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove Certificate"
                >
                  <Trash2 size={16} />
                </button>

                <InputField
                  label={`Certificate #${idx + 1} Title (e.g. ISO 9001:2015)`}
                  name={`title-${idx}`}
                  value={cert.title}
                  onChange={(e) =>
                    handleCertChange(idx, "title", e.target.value)
                  }
                  required
                />

                <InputField
                  label={`Category (e.g. Quality Management)`}
                  name={`category-${idx}`}
                  value={cert.category}
                  onChange={(e) =>
                    handleCertChange(idx, "category", e.target.value)
                  }
                  required
                />

                <TextAreaField
                  label={`Description`}
                  name={`desc-${idx}`}
                  value={cert.desc}
                  onChange={(e) =>
                    handleCertChange(idx, "desc", e.target.value)
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
