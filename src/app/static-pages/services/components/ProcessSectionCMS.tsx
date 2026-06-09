"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

const defaultFormData = {
  heading: "",
  description: "",
  stepTitle0: "", stepDesc0: "", stepNumber0: "",
  stepTitle1: "", stepDesc1: "", stepNumber1: "",
  stepTitle2: "", stepDesc2: "", stepNumber2: "",
  stepTitle3: "", stepDesc3: "", stepNumber3: "",
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

  useEffect(() => {
    const unpackData = (data: any) => {
      const list = (data.steps as any[]) || [];
      const updated: any = {
        heading: data.heading || "",
        description: data.description || "",
      };
      for (let i = 0; i < 4; i++) {
        updated[`stepTitle${i}`] = list[i]?.title || "";
        updated[`stepDesc${i}`] = list[i]?.description || "";
        updated[`stepNumber${i}`] = list[i]?.number || "";
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
    if (!formData.heading?.trim()) errs.push("Heading is required");
    if (!formData.description?.trim()) errs.push("Description is required");

    for (let i = 0; i < 4; i++) {
      if (!(formData as any)[`stepTitle${i}`]?.trim()) errs.push(`Step Card ${i + 1} Title is required`);
      if (!(formData as any)[`stepDesc${i}`]?.trim()) errs.push(`Step Card ${i + 1} Description is required`);
      if (!(formData as any)[`stepNumber${i}`]?.trim()) errs.push(`Step Card ${i + 1} Badge Number is required`);
    }

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Process section...");
    try {
      const steps = Array.from({ length: 4 }).map((_, i) => ({
        title: (formData as any)[`stepTitle${i}`],
        description: (formData as any)[`stepDesc${i}`],
        number: (formData as any)[`stepNumber${i}`],
      }));

      const payload = {
        heading: formData.heading,
        description: formData.description,
        steps,
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
          description="Manage delivery workflow steps, headings, descriptions, and sequencing."
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

                {/* Steps Cards */}
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mt-4">
                  Edit 4 Workflow Steps
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="p-5 bg-white border border-gray-200 rounded-xl flex flex-col gap-4 shadow-sm">
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                        Step Card {i + 1}
                      </span>
                      <InputField
                        label="Step Title"
                        name={`stepTitle${i}`}
                        value={(formData as any)[`stepTitle${i}`]}
                        onChange={handleChange}
                        placeholder="e.g. Assess"
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
