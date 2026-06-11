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
  jobsList: [
    { title: "Senior Power Plant Engineer", dept: "Engineering", location: "Mumbai, India", type: "Full-time", desc: "Lead engineering design and technical reviews for supercritical thermal power projects." },
    { title: "Renewable Energy Analyst", dept: "Engineering", location: "Dubai, UAE", type: "Full-time", desc: "Conduct energy yield analysis and feasibility studies for solar and wind projects." },
    { title: "Project Manager — EPC", dept: "Project Management", location: "Riyadh, KSA", type: "Full-time", desc: "Manage end-to-end execution of large-scale EPC projects in the Middle East." },
    { title: "Commissioning Engineer", dept: "Engineering", location: "Houston, USA", type: "Contract", desc: "Oversee testing and commissioning of power generation equipment and systems." },
    { title: "O&M Site Manager", dept: "Operations", location: "Rajpura, India", type: "Full-time", desc: "Lead day-to-day operations and maintenance of a 2x700 MW supercritical plant." },
    { title: "Electrical Design Engineer", dept: "Engineering", location: "Mumbai, India", type: "Full-time", desc: "Design transmission lines (33kV-765kV) and substation systems (AIS/GIS)." },
    { title: "Business Development Manager", dept: "Corporate", location: "Singapore", type: "Full-time", desc: "Drive business growth across the Asia-Pacific region for energy services." },
    { title: "Quality Assurance Lead", dept: "Operations", location: "Frankfurt, Germany", type: "Full-time", desc: "Implement and oversee quality management systems across European projects." }
  ]
};

export function CareersOpenPositionsCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/careers")
      .then((json) => {
        if (json.success && json.data?.CareersOpenPositions) {
          setFormData({ ...defaultFormData, ...json.data.CareersOpenPositions });
        }
      })
      .catch(console.error);
  }, []);

  const handleJobChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const updatedList = [...prev.jobsList];
      updatedList[index] = { ...updatedList[index], [field]: value };
      return { ...prev, jobsList: updatedList };
    });
  };

  const addJob = () => {
    setFormData((prev) => ({
      ...prev,
      jobsList: [...prev.jobsList, { title: "", dept: "Engineering", location: "", type: "Full-time", desc: "" }]
    }));
    toast.success("Added new vacancy");
  };

  const removeJob = (index: number) => {
    if (formData.jobsList.length <= 1) {
      toast.error("At least one job opening is required");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      jobsList: prev.jobsList.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Open Positions...");
    try {
      const res = await fetch("/api/careers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "CareersOpenPositions",
          content: formData,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Open Positions saved successfully!", { id: toastId });
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
        title="Current Openings Section"
        description="Manage the job listings and opportunities displayed on the careers page."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-4 border-t border-gray-50">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">Open Vacancies ({formData.jobsList.length})</span>
            <button
              onClick={addJob}
              className="flex items-center gap-2 px-3 py-1.5 bg-brand-pink text-white rounded text-xs font-semibold hover:bg-[#a0004f] transition-all"
            >
              <Plus size={14} /> Add Position
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {formData.jobsList.map((job, idx) => (
              <div key={idx} className="p-6 border border-gray-100 rounded-xl flex flex-col gap-4 relative bg-gray-50/30">
                <button
                  onClick={() => removeJob(idx)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove Position"
                >
                  <Trash2 size={18} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Job Title"
                    name={`title-${idx}`}
                    value={job.title}
                    onChange={(e) => handleJobChange(idx, "title", e.target.value)}
                    required
                  />

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Department</label>
                    <select
                      value={job.dept}
                      onChange={(e) => handleJobChange(idx, "dept", e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 focus:outline-none focus:border-brand-pink transition-colors text-sm"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Project Management">Project Management</option>
                      <option value="Operations">Operations</option>
                      <option value="Corporate">Corporate</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Location (City, Country)"
                    name={`location-${idx}`}
                    value={job.location}
                    onChange={(e) => handleJobChange(idx, "location", e.target.value)}
                    required
                  />

                  <InputField
                    label="Employment Type (e.g. Full-time, Contract)"
                    name={`type-${idx}`}
                    value={job.type}
                    onChange={(e) => handleJobChange(idx, "type", e.target.value)}
                    required
                  />
                </div>

                <TextAreaField
                  label="Job Description Summary"
                  name={`desc-${idx}`}
                  value={job.desc}
                  onChange={(e) => handleJobChange(idx, "desc", e.target.value)}
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
