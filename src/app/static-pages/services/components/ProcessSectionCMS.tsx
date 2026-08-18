"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

interface ProcessStep {
  title: string;
  description: string;
  number: string;
}

const emptyStep = (idx: number): ProcessStep => ({
  title: "",
  description: "",
  number: `0${idx + 1}`,
});

const defaultFormData = {
  heading: "",
  description: "",
};

interface ProcessSectionCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function ProcessSectionCMS({
  sectionId,
  initialData,
  saveUrl = "/api/services",
  responseKey = "ProcessSection",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: ProcessSectionCMSProps) {
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
  const [stepsList, setStepsList] = useState<ProcessStep[]>([emptyStep(0)]);

  useEffect(() => {
    const unpackData = (data: any) => {
      setFormData({
        heading: data.heading || "",
        description: data.description || "",
      });

      const list = (data.steps as any[]) || [];
      if (Array.isArray(list) && list.length > 0) {
        setStepsList(
          list.map((item: any, i: number) => ({
            title: item?.title || "",
            description: item?.description || item?.desc || "",
            number: item?.number || `0${i + 1}`,
          }))
        );
      } else {
        const legacy: ProcessStep[] = [];
        for (let i = 0; i < 4; i++) {
          if (data[`stepTitle${i}`] || data[`stepDesc${i}`]) {
            legacy.push({
              title: data[`stepTitle${i}`] || "",
              description: data[`stepDesc${i}`] || "",
              number: data[`stepNumber${i}`] || `0${i + 1}`,
            });
          }
        }
        setStepsList(legacy.length > 0 ? legacy : [emptyStep(0)]);
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

  const handleStepChange = (index: number, field: keyof ProcessStep, value: string) => {
    setStepsList((prev) =>
      prev.map((step, i) => (i === index ? { ...step, [field]: value } : step))
    );
  };

  const addStep = () => {
    setStepsList((prev) => [...prev, emptyStep(prev.length)]);
    toast.success("Added new process step card");
  };

  const deleteStep = (index: number) => {
    if (stepsList.length <= 1) {
      toast.error("At least 1 process step card is required");
      return;
    }
    setStepsList((prev) => prev.filter((_, i) => i !== index));
    toast.success("Removed process step card");
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.heading?.trim()) errs.push("Heading is required");
    if (!formData.description?.trim()) errs.push("Description is required");

    stepsList.forEach((step, i) => {
      if (!step.title?.trim()) errs.push(`Step Card ${i + 1} Title is required`);
      if (!step.description?.trim()) errs.push(`Step Card ${i + 1} Description is required`);
      if (!step.number?.trim()) errs.push(`Step Card ${i + 1} Badge Number is required`);
    });

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Process section...");
    try {
      const payload: any = {
        heading: formData.heading,
        description: formData.description,
        steps: stepsList,
      };

      stepsList.forEach((step, i) => {
        if (i < 4) {
          payload[`stepTitle${i}`] = step.title;
          payload[`stepDesc${i}`] = step.description;
          payload[`stepNumber${i}`] = step.number;
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
        toast.success("Process saved successfully!", { id: toastId });
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
          title="How We Deliver Section"
          description="Manage delivery workflow steps, headings, descriptions, and sequencing. Add or delete step cards dynamically."
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
                    label="Heading"
                    name="heading"
                    value={formData.heading}
                    onChange={handleChange}
                    placeholder="e.g. How We Deliver"
                    required
                    containerClassName="flex-1"
                  />
                  <InputField
                    label="Description Note"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="e.g. Our structured approach ensures precision..."
                    required
                    containerClassName="flex-1"
                  />
                </div>

                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mt-4">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Workflow Step Cards <span className="text-blue-500 font-semibold">({stepsList.length})</span>
                  </span>
                  <button
                    type="button"
                    onClick={addStep}
                    className="flex items-center gap-1.5 text-xs font-semibold text-white bg-brand-pink hover:bg-[#a0004f] active:scale-95 transition-all px-3.5 py-2 rounded-lg shadow-sm cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Step Card</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stepsList.map((step, i) => (
                    <div key={i} className="p-5 bg-white border border-gray-200 rounded-xl flex flex-col gap-4 shadow-sm relative group">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                          Step Card {i + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteStep(i)}
                          className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                          title="Delete Step Card"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <InputField
                        label="Step Number Badge"
                        name={`stepNumber${i}`}
                        value={step.number}
                        onChange={(e) => handleStepChange(i, "number", e.target.value)}
                        placeholder="e.g. 01"
                        required
                      />
                      <InputField
                        label="Step Title"
                        name={`stepTitle${i}`}
                        value={step.title}
                        onChange={(e) => handleStepChange(i, "title", e.target.value)}
                        placeholder="e.g. Audit & Assessment"
                        required
                      />
                      <TextAreaField
                        label="Description"
                        name={`stepDesc${i}`}
                        value={(formData as any)[`stepDesc${i}`]}
                        onChange={handleChange}
                        placeholder="e.g. Technical and commercial..."
                        rows={2}
                        required
                      />
                      <InputField
                        label="Sequence Number (e.g. 01)"
                        name={`stepNumber${i}`}
                        value={(formData as any)[`stepNumber${i}`]}
                        onChange={handleChange}
                        placeholder="e.g. 01"
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
