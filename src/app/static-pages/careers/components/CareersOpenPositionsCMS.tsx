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
  jobsList: [
    {
      title: "",
      dept: "Engineering",
      location: "",
      type: "Full-time",
      desc: ""
    }
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
          const list = json.data.CareersOpenPositions.jobsList;
          setFormData({
            heading: json.data.CareersOpenPositions.heading || "",
            jobsList: Array.isArray(list) && list.length > 0 ? list : defaultFormData.jobsList,
          });
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
      jobsList: [
        ...prev.jobsList,
        {
          title: "",
          dept: "Engineering",
          location: "",
          type: "Full-time",
          desc: "",
        },
      ],
    }));
    toast.success("Added new vacancy card");
  };

  const removeJob = (index: number) => {
    if (formData.jobsList.length <= 1) {
      toast.error("At least one job opening card is required");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      jobsList: prev.jobsList.filter((_, i) => i !== index),
    }));
    toast.success("Removed vacancy card");
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
        description="Manage the heading and job listings displayed on the careers page. Add or delete openings dynamically."
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

          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <span className="text-sm font-bold text-gray-700">
              Open Vacancies Cards <span className="text-[#a0004f] font-semibold">({formData.jobsList.length})</span>
            </span>
            <button
              type="button"
              onClick={addJob}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#a0004f] hover:bg-[#8c0045] text-white rounded-lg text-xs font-semibold active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <Plus size={15} /> Add Position Card
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {formData.jobsList.map((job, idx) => (
              <div
                key={idx}
                className="p-6 border border-gray-200 rounded-xl flex flex-col gap-4 relative bg-gray-50/30 group shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#a0004f] uppercase tracking-wider">
                    Position Vacancy #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeJob(idx)}
                    className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-red-600 bg-white border border-gray-200 hover:border-red-200 hover:bg-red-50/50 px-2.5 py-1 rounded-md transition-all cursor-pointer"
                    title="Delete Position"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Job Title"
                    name={`title-${idx}`}
                    value={job.title}
                    onChange={(e) =>
                      handleJobChange(idx, "title", e.target.value)
                    }
                    required
                  />

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Department
                    </label>
                    <select
                      value={job.dept}
                      onChange={(e) =>
                        handleJobChange(idx, "dept", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white border border-gray-200 focus:outline-none focus:border-[#a0004f] transition-colors text-sm rounded-lg"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Project Management">
                        Project Management
                      </option>
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
                    onChange={(e) =>
                      handleJobChange(idx, "location", e.target.value)
                    }
                    required
                  />

                  <InputField
                    label="Employment Type (e.g. Full-time, Contract)"
                    name={`type-${idx}`}
                    value={job.type}
                    onChange={(e) =>
                      handleJobChange(idx, "type", e.target.value)
                    }
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
