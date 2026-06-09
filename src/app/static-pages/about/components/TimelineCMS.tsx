"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

const defaultFormData = {
  tagline: "",
  heading: "",
  description: "",
  // Timeline phases
  phaseTitle0: "", phaseDesc0: "",
  phaseTitle1: "", phaseDesc1: "",
  phaseTitle2: "", phaseDesc2: "",
  phaseTitle3: "", phaseDesc3: "",
  phaseTitle4: "", phaseDesc4: "",
  phaseTitle5: "", phaseDesc5: "",
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

  useEffect(() => {
    const unpackData = (data: any) => {
      const list = (data.phases as any[]) || [];
      const updated: any = {
        tagline: data.tagline || "",
        heading: data.heading || "",
        description: data.description || "",
      };
      for (let i = 0; i < 6; i++) {
        updated[`phaseTitle${i}`] = list[i]?.title || "";
        updated[`phaseDesc${i}`] = list[i]?.description || "";
      }
      setFormData(updated);
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

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.tagline?.trim()) errs.push("Tagline is required");
    if (!formData.heading?.trim()) errs.push("Heading is required");
    if (!formData.description?.trim()) errs.push("Description is required");

    for (let i = 0; i < 6; i++) {
      if (!(formData as any)[`phaseTitle${i}`]?.trim()) errs.push(`Phase ${i + 1} Title is required`);
      if (!(formData as any)[`phaseDesc${i}`]?.trim()) errs.push(`Phase ${i + 1} Description is required`);
    }

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Timeline section...");
    try {
      const phases = Array.from({ length: 6 }).map((_, i) => ({
        title: (formData as any)[`phaseTitle${i}`],
        description: (formData as any)[`phaseDesc${i}`],
      }));

      const payload = {
        tagline: formData.tagline,
        heading: formData.heading,
        description: formData.description,
        phases,
      };

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
          description="Manage timeline badges, headers, and historical milestones."
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

                {/* Timeline Phases */}
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mt-4">
                  Edit 6 Timeline Phases
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="p-5 bg-white border border-gray-200 rounded-xl flex flex-col gap-4 shadow-sm">
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                        Phase {i + 1}
                      </span>
                      <InputField
                        label="Phase Title (e.g. Year & Milestone)"
                        name={`phaseTitle${i}`}
                        value={(formData as any)[`phaseTitle${i}`]}
                        onChange={handleChange}
                        placeholder="e.g. 2011–2012: Construction Beginnings"
                        required
                      />
                      <TextAreaField
                        label="Phase Description"
                        name={`phaseDesc${i}`}
                        value={(formData as any)[`phaseDesc${i}`]}
                        onChange={handleChange}
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
