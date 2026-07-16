"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import {
  Search,
  PenTool,
  HardHat,
  CheckCircle2,
  Activity,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { TextAreaField } from "@/components/TextAreaField";
import { SectionHeader } from "@/components/SectionHeader";

interface StepItem {
  id: number;
  title: string;
  description: string;
  icon: string;
}

const defaultFormData = {
  tagline: "Our Workflow",
  heading: "Workflow Followed for Each Project",
  steps: [
    {
      id: 1,
      title: "Logical Foundation",
      description: "We start by conceptualizing the project through rigorous feasibility studies and Detailed Project Reports (DPRs).",
      icon: "Search"
    },
    {
      id: 2,
      title: "Strategic Alignment",
      description: "Our team develops technical specifications and assists in the selection of the right partners to ensure a solid start.",
      icon: "PenTool"
    },
    {
      id: 3,
      title: "Technical Realization",
      description: "We manage the precision erection and commissioning of assets, whether they are new builds or relocated plants.",
      icon: "HardHat"
    },
    {
      id: 4,
      title: "Operations / Optimization",
      description: "We transition into long-term stewardship, providing operation and maintenance with the same care as the asset owner.",
      icon: "CheckCircle2"
    },
    {
      id: 5,
      title: "Continuous Improvement",
      description: "Through regular performance diagnostics and energy audits, we ensure your asset remains efficient and reliable for its entire lifecycle.",
      icon: "Activity"
    }
  ] as StepItem[]
};

const mergeDefaults = (data: any) => {
  const merged = { ...defaultFormData, ...data };
  if (!merged.steps || !Array.isArray(merged.steps)) {
    merged.steps = defaultFormData.steps.map((s) => ({ ...s }));
  } else {
    const arr = [...merged.steps];
    while (arr.length < 5) {
      const def = defaultFormData.steps[arr.length] || { id: arr.length + 1, title: "", description: "", icon: "Search" };
      arr.push({ ...def });
    }
    merged.steps = arr.slice(0, 5);
  }
  return merged;
};

interface ProcessSectionProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function ProcessSection({
  sectionId,
  initialData,
  saveUrl = "/api/home",
  responseKey = "ProcessSection",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: ProcessSectionProps) {
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
  const [openSteps, setOpenSteps] = useState<Record<number, boolean>>({ 0: true });

  const toggleStep = (idx: number) => {
    setOpenSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  useEffect(() => {
    if (initialData) {
      setFormData(mergeDefaults(initialData));
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey ? json.data?.[responseKey] : json.data;
          if (json.success && sectionData) {
            setFormData(mergeDefaults(sectionData));
          }
        })
        .catch(console.error);
    }
  }, [initialData, saveUrl, responseKey]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStepChange = (index: number, key: keyof StepItem, value: any) => {
    setFormData((prev) => {
      const updated = prev.steps.map((s, idx) =>
        idx === index ? { ...s, [key]: value } : s
      );
      return { ...prev, steps: updated };
    });
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.tagline?.trim()) errs.push("Tagline is required");
    if (!formData.heading?.trim()) errs.push("Heading is required");
    if (formData.steps.some((s) => !s.title?.trim() || !s.description?.trim())) {
      errs.push("All step titles and descriptions must be filled");
    }

    if (errs.length > 0) {
      errs.forEach((m) => toast.error(m));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Process workflow section...");
    try {
      const body = sectionId
        ? { id: sectionId, content: formData }
        : { section: responseKey ?? "ProcessSection", content: formData };

      const res = await fetch(sectionId ? `/api/sections` : saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Process section saved successfully!", { id: toastId });
        if (onSave) onSave(formData as unknown as Record<string, unknown>);
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

  const renderIcon = (name: string) => {
    switch (name) {
      case "Search": return <Search className="w-4 h-4 text-[#a0004f]" />;
      case "PenTool": return <PenTool className="w-4 h-4 text-[#a0004f]" />;
      case "HardHat": return <HardHat className="w-4 h-4 text-[#a0004f]" />;
      case "CheckCircle2": return <CheckCircle2 className="w-4 h-4 text-[#a0004f]" />;
      case "Activity": return <Activity className="w-4 h-4 text-[#a0004f]" />;
      default: return <Search className="w-4 h-4 text-[#a0004f]" />;
    }
  };

  return (
    <section>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="Process Workflow Section"
          description="Manage Encotec's workflow steps layout (exactly 5 items)."
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
              
              {/* Header Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl">
                <InputField
                  label="Tagline Label"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="e.g. Our Workflow"
                  required
                />
                <InputField
                  label="Workflow Title Headline"
                  name="heading"
                  value={formData.heading}
                  onChange={handleChange}
                  placeholder="e.g. Workflow Followed for Each Project"
                  required
                />
              </div>

              {/* Step Items */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
                  Workflow Step Cards (5 Items)
                </h4>
                <div className="grid grid-cols-1 gap-6">
                  {formData.steps.map((step, i) => (
                    <div
                      key={i}
                      className="border border-gray-100 p-6 rounded-2xl bg-gray-50/20 flex flex-col gap-4 relative group"
                    >
                      {/* Step Header */}
                      <div
                        onClick={() => toggleStep(i)}
                        className="flex items-center justify-between border-b border-gray-100 pb-2 cursor-pointer select-none group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] font-bold text-[#a0004f] bg-[#a0004f]/5 px-2.5 py-1 rounded-full uppercase tracking-wider">
                            Step 0{step.id}
                          </span>
                          <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                            {step.title || `Untitled Step 0${step.id}`}
                          </span>
                        </div>
                        <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                          {openSteps[i] ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </div>
 
                      {/* Card Content Grid */}
                      {openSteps[i] && (
                        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
                          {/* Top row: Title and Icon (rest two) */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                              label="Step Title"
                              value={step.title}
                              onChange={(e) => handleStepChange(i, "title", e.target.value)}
                              placeholder="e.g. Logical Foundation"
                            />
                            <div className="flex flex-col gap-1.5 px-0.5">
                              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-4">
                                Step Icon
                              </label>
                              <div className="relative w-full">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                  {renderIcon(step.icon)}
                                </div>
                                <select
                                  value={step.icon}
                                  onChange={(e) => handleStepChange(i, "icon", e.target.value)}
                                  className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:outline-none focus:border-[#a0004f] focus:ring-1 focus:ring-[#a0004f] outline-none text-gray-800 appearance-none cursor-pointer"
                                >
                                  <option value="Search">Search Icon</option>
                                  <option value="PenTool">PenTool Icon</option>
                                  <option value="HardHat">HardHat Icon</option>
                                  <option value="CheckCircle2">CheckCircle2 Icon</option>
                                  <option value="Activity">Activity Icon</option>
                                </select>
                              </div>
                            </div>
                          </div>
 
                          {/* Bottom: Description (full width) */}
                          <TextAreaField
                            label="Step Description"
                            value={step.description}
                            onChange={(e) => handleStepChange(i, "description", e.target.value)}
                            placeholder="Step subtext details..."
                            rows={3}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Save Button */}
              <div className="flex justify-end pt-4 border-t border-gray-50">
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
