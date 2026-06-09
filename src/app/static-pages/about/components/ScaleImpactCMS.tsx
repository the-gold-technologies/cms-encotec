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
  footerNote: "",
  // Stat cards
  statValue0: "", statLabel0: "", statDesc0: "", statIcon0: "",
  statValue1: "", statLabel1: "", statDesc1: "", statIcon1: "",
  statValue2: "", statLabel2: "", statDesc2: "", statIcon2: "",
  statValue3: "", statLabel3: "", statDesc3: "", statIcon3: "",
  statValue4: "", statLabel4: "", statDesc4: "", statIcon4: "",
};

interface ScaleImpactCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function ScaleImpactCMS({
  sectionId,
  initialData,
  saveUrl = "/api/about",
  responseKey = "ScaleImpact",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: ScaleImpactCMSProps) {
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
      const list = (data.stats as any[]) || [];
      const updated: any = {
        heading: data.heading || "",
        description: data.description || "",
        footerNote: data.footerNote || "",
      };
      for (let i = 0; i < 5; i++) {
        updated[`statValue${i}`] = list[i]?.value || "";
        updated[`statLabel${i}`] = list[i]?.label || "";
        updated[`statDesc${i}`] = list[i]?.description || "";
        updated[`statIcon${i}`] = list[i]?.icon || "";
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
    if (!formData.footerNote?.trim()) errs.push("Footer note is required");

    for (let i = 0; i < 5; i++) {
      if (!(formData as any)[`statValue${i}`]?.trim()) errs.push(`Stat ${i + 1} Value is required`);
      if (!(formData as any)[`statLabel${i}`]?.trim()) errs.push(`Stat ${i + 1} Label is required`);
      if (!(formData as any)[`statDesc${i}`]?.trim()) errs.push(`Stat ${i + 1} Description is required`);
      if (!(formData as any)[`statIcon${i}`]?.trim()) errs.push(`Stat ${i + 1} Icon is required`);
    }

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Scale & Impact section...");
    try {
      const stats = Array.from({ length: 5 }).map((_, i) => ({
        value: (formData as any)[`statValue${i}`],
        label: (formData as any)[`statLabel${i}`],
        description: (formData as any)[`statDesc${i}`],
        icon: (formData as any)[`statIcon${i}`],
      }));

      const payload = {
        heading: formData.heading,
        description: formData.description,
        footerNote: formData.footerNote,
        stats,
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
        toast.success("Scale & Impact saved successfully!", { id: toastId });
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
          title="Scale & Impact Section"
          description="Manage Encotec by the numbers KPIs, descriptions, and callouts."
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
                <InputField
                  label="Heading"
                  name="heading"
                  value={formData.heading}
                  onChange={handleChange}
                  placeholder="e.g. Encotec by the Numbers"
                  required
                />

                <TextAreaField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="General description of numbers..."
                  rows={2}
                  required
                />

                <InputField
                  label="Footer Note Statement"
                  name="footerNote"
                  value={formData.footerNote}
                  onChange={handleChange}
                  placeholder="e.g. Our scale is not just a measure of size..."
                  required
                />

                {/* Stats Cards */}
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mt-4">
                  Edit 5 KPI Stat Cards
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="p-5 bg-white border border-gray-200 rounded-xl flex flex-col gap-4 shadow-sm">
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                        Stat Card {i + 1}
                      </span>
                      <InputField
                        label="Metric Value"
                        name={`statValue${i}`}
                        value={(formData as any)[`statValue${i}`]}
                        onChange={handleChange}
                        placeholder="e.g. 1,800+"
                        required
                      />
                      <InputField
                        label="Label"
                        name={`statLabel${i}`}
                        value={(formData as any)[`statLabel${i}`]}
                        onChange={handleChange}
                        placeholder="e.g. Dedicated Staff"
                        required
                      />
                      <TextAreaField
                        label="Description"
                        name={`statDesc${i}`}
                        value={(formData as any)[`statDesc${i}`]}
                        onChange={handleChange}
                        placeholder="Description..."
                        rows={2}
                        required
                      />
                      <InputField
                        label="Lucide Icon Name"
                        name={`statIcon${i}`}
                        value={(formData as any)[`statIcon${i}`]}
                        onChange={handleChange}
                        placeholder="e.g. Users, Zap, Briefcase, ShieldCheck, Globe..."
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
