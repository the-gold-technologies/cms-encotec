"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";

interface IndustryItem {
  name: string;
  subtitle: string;
  icon: string;
}

const emptyIndustry = (): IndustryItem => ({
  name: "",
  subtitle: "",
  icon: "Briefcase",
});

const defaultFormData = {
  heading: "",
  description: "",
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
  const [industriesList, setIndustriesList] = useState<IndustryItem[]>([emptyIndustry()]);

  useEffect(() => {
    const unpackData = (data: any) => {
      setFormData({
        heading: data.heading || "",
        description: data.description || "",
      });

      const list = (data.industries as any[]) || [];
      if (Array.isArray(list) && list.length > 0) {
        setIndustriesList(
          list.map((item: any) => ({
            name: item?.name || "",
            subtitle: item?.subtitle || "",
            icon: item?.icon || "Briefcase",
          }))
        );
      } else {
        const legacy: IndustryItem[] = [];
        for (let i = 0; i < 5; i++) {
          if (data[`industryName${i}`] || data[`industrySubtitle${i}`]) {
            legacy.push({
              name: data[`industryName${i}`] || "",
              subtitle: data[`industrySubtitle${i}`] || "",
              icon: data[`industryIcon${i}`] || "Briefcase",
            });
          }
        }
        setIndustriesList(legacy.length > 0 ? legacy : [emptyIndustry()]);
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

  const handleIndustryChange = (index: number, field: keyof IndustryItem, value: string) => {
    setIndustriesList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addIndustry = () => {
    setIndustriesList((prev) => [...prev, emptyIndustry()]);
    toast.success("Added new industry card");
  };

  const deleteIndustry = (index: number) => {
    if (industriesList.length <= 1) {
      toast.error("At least 1 industry card is required");
      return;
    }
    setIndustriesList((prev) => prev.filter((_, i) => i !== index));
    toast.success("Removed industry card");
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.heading?.trim()) errs.push("Heading is required");
    if (!formData.description?.trim()) errs.push("Description is required");

    industriesList.forEach((ind, i) => {
      if (!ind.name?.trim()) errs.push(`Industry Card ${i + 1} Name is required`);
      if (!ind.subtitle?.trim()) errs.push(`Industry Card ${i + 1} Subtitle is required`);
      if (!ind.icon?.trim()) errs.push(`Industry Card ${i + 1} Icon is required`);
    });

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Industries section...");
    try {
      const payload: any = {
        heading: formData.heading,
        description: formData.description,
        industries: industriesList,
      };

      industriesList.forEach((ind, i) => {
        if (i < 5) {
          payload[`industryName${i}`] = ind.name;
          payload[`industrySubtitle${i}`] = ind.subtitle;
          payload[`industryIcon${i}`] = ind.icon;
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
          description="Manage industries header, general descriptions, and sector highlight cards. Add or delete cards dynamically."
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

                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mt-4">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Industry Cards <span className="text-blue-500 font-semibold">({industriesList.length})</span>
                  </span>
                  <button
                    type="button"
                    onClick={addIndustry}
                    className="flex items-center gap-1.5 text-xs font-semibold text-white bg-brand-pink hover:bg-[#a0004f] active:scale-95 transition-all px-3.5 py-2 rounded-lg shadow-sm cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Industry Card</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {industriesList.map((ind, i) => (
                    <div key={i} className="p-5 bg-white border border-gray-200 rounded-xl flex flex-col gap-4 shadow-sm relative group">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                          Industry Card {i + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteIndustry(i)}
                          className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                          title="Delete Industry Card"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <InputField
                        label="Industry Name"
                        name={`industryName${i}`}
                        value={ind.name}
                        onChange={(e) => handleIndustryChange(i, "name", e.target.value)}
                        placeholder="e.g. Thermal Power"
                        required
                      />
                      <InputField
                        label="Subtitle / Summary"
                        name={`industrySubtitle${i}`}
                        value={ind.subtitle}
                        onChange={(e) => handleIndustryChange(i, "subtitle", e.target.value)}
                        placeholder="e.g. Coal & Gas fired assets"
                        required
                      />
                      <InputField
                        label="Lucide Icon Name"
                        name={`industryIcon${i}`}
                        value={ind.icon}
                        onChange={(e) => handleIndustryChange(i, "icon", e.target.value)}
                        placeholder="e.g. Flame, Zap, Wind, Sun..."
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
