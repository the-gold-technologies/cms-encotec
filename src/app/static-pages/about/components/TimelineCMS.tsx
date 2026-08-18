"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

interface TimelinePhase {
  title: string;
  description: string;
}

const emptyPhase = (): TimelinePhase => ({ title: "", description: "" });

const defaultFormData = {
  tagline: "",
  heading: "",
  description: "",
};

interface TimelineCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function TimelineCMS({
  sectionId,
  initialData,
  saveUrl = "/api/about",
  responseKey = "Timeline",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: TimelineCMSProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (val: any) => {
    if (controlledOnToggle) {
      controlledOnToggle();
    } else {
      setInternalIsOpen(typeof val === "function" ? val(internalIsOpen) : val);
    }
  };

  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [phasesList, setPhasesList] = useState<TimelinePhase[]>([emptyPhase()]);

  useEffect(() => {
    const unpackData = (data: any) => {
      setFormData({
        tagline: data.tagline || "",
        heading: data.heading || "",
        description: data.description || "",
      });

      const list = (data.phases as any[]) || [];
      if (Array.isArray(list) && list.length > 0) {
        setPhasesList(
          list.map((item: any) => ({
            title: item?.title || "",
            description: item?.description || item?.desc || "",
          }))
        );
      } else {
        // Fallback from legacy phaseTitle0..5
        const legacy: TimelinePhase[] = [];
        for (let i = 0; i < 6; i++) {
          if (data[`phaseTitle${i}`] || data[`phaseDesc${i}`]) {
            legacy.push({
              title: data[`phaseTitle${i}`] || "",
              description: data[`phaseDesc${i}`] || "",
            });
          }
        }
        setPhasesList(legacy.length > 0 ? legacy : [emptyPhase()]);
      }
    };

    if (initialData) {
      unpackData(initialData);
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey ? json.data?.[responseKey] : json.data;
          if (json.success && sectionData) {
            unpackData(sectionData);
          }
        })
        .catch(console.error);
    }
  }, [initialData, saveUrl, responseKey]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhaseChange = (index: number, field: keyof TimelinePhase, value: string) => {
    setPhasesList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addPhase = () => {
    setPhasesList((prev) => [...prev, emptyPhase()]);
    toast.success("Added new timeline phase card");
  };

  const deletePhase = (index: number) => {
    if (phasesList.length <= 1) {
      toast.error("At least 1 timeline phase card is required");
      return;
    }
    setPhasesList((prev) => prev.filter((_, i) => i !== index));
    toast.success("Removed timeline phase card");
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.tagline?.trim()) errs.push("Tagline is required");
    if (!formData.heading?.trim()) errs.push("Heading is required");
    if (!formData.description?.trim()) errs.push("Description is required");

    phasesList.forEach((phase, i) => {
      if (!phase.title?.trim()) errs.push(`Phase ${i + 1} Title is required`);
      if (!phase.description?.trim()) errs.push(`Phase ${i + 1} Description is required`);
    });

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Timeline section...");
    try {
      const payload: any = {
        tagline: formData.tagline,
        heading: formData.heading,
        description: formData.description,
        phases: phasesList,
      };

      // Keep legacy properties synced
      phasesList.forEach((phase, i) => {
        if (i < 6) {
          payload[`phaseTitle${i}`] = phase.title;
          payload[`phaseDesc${i}`] = phase.description;
        }
      });

      const body = sectionId
        ? { id: sectionId, content: payload }
        : { section: responseKey, content: payload };

      const res = await fetch(sectionId ? `/api/sections` : saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Timeline saved successfully!", { id: toastId });
        if (onSave) onSave(payload as unknown as Record<string, unknown>);
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
    <section>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="Timeline of Growth Section"
          description="Manage timeline badges, headers, and historical milestones. Add or delete phases dynamically."
          isOpen={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
        />

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-8 pt-6 animate-in fade-in duration-500">
              <div className="flex flex-col gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
                <div className="flex flex-col md:flex-row gap-6 w-full">
                  <InputField
                    label="Tagline Label"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    placeholder="e.g. Our Journey"
                    required
                    containerClassName="flex-1"
                  />
                  <InputField
                    label="Heading"
                    name="heading"
                    value={formData.heading}
                    onChange={handleChange}
                    placeholder="e.g. A Timeline of Growth"
                    required
                    containerClassName="flex-1"
                  />
                </div>

                <TextAreaField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="e.g. We have spent over a decade building..."
                  rows={2}
                  required
                />

                {/* Timeline Phases Header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mt-4">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Timeline Phases <span className="text-blue-500 font-semibold">({phasesList.length})</span>
                  </span>
                  <button
                    type="button"
                    onClick={addPhase}
                    className="flex items-center gap-1.5 text-xs font-semibold text-white bg-brand-pink hover:bg-[#a0004f] active:scale-95 transition-all px-3.5 py-2 rounded-lg shadow-sm cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Timeline Phase</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {phasesList.map((phase, i) => (
                    <div key={i} className="p-5 bg-white border border-gray-200 rounded-xl flex flex-col gap-4 shadow-sm relative group">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                          Phase {i + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => deletePhase(i)}
                          className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                          title="Delete Phase"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <InputField
                        label="Phase Title (e.g. Year & Milestone)"
                        name={`phaseTitle${i}`}
                        value={phase.title}
                        onChange={(e) => handlePhaseChange(i, "title", e.target.value)}
                        placeholder="e.g. 2011–2012: Construction Beginnings"
                        required
                      />
                      <TextAreaField
                        label="Phase Description"
                        name={`phaseDesc${i}`}
                        value={phase.description}
                        onChange={(e) => handlePhaseChange(i, "description", e.target.value)}
                        placeholder="Description of the milestone..."
                        rows={3}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <SaveButton
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-44 h-12 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
