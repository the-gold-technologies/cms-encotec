"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";

const defaultFormData = {
  heading: "",
  description: "",
  industryName0: "", industrySubtitle0: "", industryIcon0: "",
  industryName1: "", industrySubtitle1: "", industryIcon1: "",
  industryName2: "", industrySubtitle2: "", industryIcon2: "",
  industryName3: "", industrySubtitle3: "", industryIcon3: "",
  industryName4: "", industrySubtitle4: "", industryIcon4: "",
};

interface IndustriesSectionCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function IndustriesSectionCMS({
  sectionId,
  initialData,
  saveUrl = "/api/services",
  responseKey = "IndustriesSection",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: IndustriesSectionCMSProps) {
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
      const list = (data.industries as any[]) || [];
      const updated: any = {
        heading: data.heading || "",
        description: data.description || "",
      };
      for (let i = 0; i < 5; i++) {
        updated[`industryName${i}`] = list[i]?.name || "";
        updated[`industrySubtitle${i}`] = list[i]?.subtitle || "";
        updated[`industryIcon${i}`] = list[i]?.icon || "";
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

    for (let i = 0; i < 5; i++) {
      if (!(formData as any)[`industryName${i}`]?.trim()) errs.push(`Industry Card ${i + 1} Name is required`);
      if (!(formData as any)[`industrySubtitle${i}`]?.trim()) errs.push(`Industry Card ${i + 1} Subtitle is required`);
      if (!(formData as any)[`industryIcon${i}`]?.trim()) errs.push(`Industry Card ${i + 1} Icon is required`);
    }

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Industries section...");
    try {
      const industries = Array.from({ length: 5 }).map((_, i) => ({
        name: (formData as any)[`industryName${i}`],
        subtitle: (formData as any)[`industrySubtitle${i}`],
        icon: (formData as any)[`industryIcon${i}`],
      }));

      const payload = {
        heading: formData.heading,
        description: formData.description,
        industries,
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
        toast.success("Industries saved successfully!", { id: toastId });
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
          title="Industries We Serve Section"
          description="Manage industries header, general descriptions, and 5 sector highlight cards."
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
                    placeholder="e.g. Industries We Serve"
                    required
                    containerClassName="flex-1"
                  />
                  <InputField
                    label="Description Note"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="e.g. We deliver solutions across a wide range of sectors"
                    required
                    containerClassName="flex-1"
                  />
                </div>

                {/* Industry Cards */}
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mt-4 animate-in">
                  Edit 5 Industry Cards
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="p-5 bg-white border border-gray-200 rounded-xl flex flex-col gap-4 shadow-sm">
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                        Industry Card {i + 1}
                      </span>
                      <InputField
                        label="Industry Name"
                        name={`industryName${i}`}
                        value={(formData as any)[`industryName${i}`]}
                        onChange={handleChange}
                        placeholder="e.g. Power Generation"
                        required
                      />
                      <InputField
                        label="Subtitle"
                        name={`industrySubtitle${i}`}
                        value={(formData as any)[`industrySubtitle${i}`]}
                        onChange={handleChange}
                        placeholder="e.g. Thermal & Renewable"
                        required
                      />
                      <InputField
                        label="Lucide Icon (e.g. Flame, Network, Building, Plane, Zap...)"
                        name={`industryIcon${i}`}
                        value={(formData as any)[`industryIcon${i}`]}
                        onChange={handleChange}
                        placeholder="e.g. Flame"
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
