"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

interface StatItem {
  value: string;
  label: string;
  description: string;
  icon: string;
}

const emptyStat = (): StatItem => ({
  value: "",
  label: "",
  description: "",
  icon: "Briefcase",
});

const defaultFormData = {
  heading: "",
  description: "",
  footerNote: "",
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
  const [statsList, setStatsList] = useState<StatItem[]>([emptyStat()]);

  useEffect(() => {
    const unpackData = (data: any) => {
      setFormData({
        heading: data.heading || "",
        description: data.description || "",
        footerNote: data.footerNote || "",
      });

      const list = (data.stats as any[]) || [];
      if (Array.isArray(list) && list.length > 0) {
        setStatsList(
          list.map((item: any) => ({
            value: item?.value || "",
            label: item?.label || "",
            description: item?.description || item?.desc || "",
            icon: item?.icon || "Briefcase",
          }))
        );
      } else {
        // Fallback from legacy statValue0..4
        const legacy: StatItem[] = [];
        for (let i = 0; i < 5; i++) {
          if (data[`statValue${i}`] || data[`statLabel${i}`]) {
            legacy.push({
              value: data[`statValue${i}`] || "",
              label: data[`statLabel${i}`] || "",
              description: data[`statDesc${i}`] || "",
              icon: data[`statIcon${i}`] || "Briefcase",
            });
          }
        }
        setStatsList(legacy.length > 0 ? legacy : [emptyStat()]);
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

  const handleStatChange = (index: number, field: keyof StatItem, value: string) => {
    setStatsList((prev) =>
      prev.map((stat, i) => (i === index ? { ...stat, [field]: value } : stat))
    );
  };

  const addStat = () => {
    setStatsList((prev) => [...prev, emptyStat()]);
    toast.success("Added new KPI stat card");
  };

  const deleteStat = (index: number) => {
    if (statsList.length <= 1) {
      toast.error("At least 1 KPI stat card is required");
      return;
    }
    setStatsList((prev) => prev.filter((_, i) => i !== index));
    toast.success("Removed KPI stat card");
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.heading?.trim()) errs.push("Heading is required");
    if (!formData.description?.trim()) errs.push("Description is required");
    if (!formData.footerNote?.trim()) errs.push("Footer note is required");

    statsList.forEach((stat, i) => {
      if (!stat.value?.trim()) errs.push(`Stat Card ${i + 1} Value is required`);
      if (!stat.label?.trim()) errs.push(`Stat Card ${i + 1} Label is required`);
    });

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Scale & Impact section...");
    try {
      const payload: any = {
        heading: formData.heading,
        description: formData.description,
        footerNote: formData.footerNote,
        stats: statsList,
      };

      // Keep legacy properties synced for first 5 stats
      statsList.forEach((stat, i) => {
        if (i < 5) {
          payload[`statValue${i}`] = stat.value;
          payload[`statLabel${i}`] = stat.label;
          payload[`statDesc${i}`] = stat.description;
          payload[`statIcon${i}`] = stat.icon;
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
          description="Manage Encotec by the numbers KPIs, descriptions, and callouts. Add or delete stat cards dynamically."
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

                {/* Dynamic Stats Cards Header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mt-4">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    KPI Stat Cards <span className="text-blue-500 font-semibold">({statsList.length})</span>
                  </span>
                  <button
                    type="button"
                    onClick={addStat}
                    className="flex items-center gap-1.5 text-xs font-semibold text-white bg-brand-pink hover:bg-[#a0004f] active:scale-95 transition-all px-3 py-1.5 rounded-lg shadow-sm cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add KPI Stat Card</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {statsList.map((stat, i) => (
                    <div key={i} className="p-5 bg-white border border-gray-200 rounded-xl flex flex-col gap-4 shadow-sm relative group">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                          Stat Card {i + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteStat(i)}
                          className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                          title="Delete Stat Card"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <InputField
                        label="Metric Value"
                        name={`statValue${i}`}
                        value={stat.value}
                        onChange={(e) => handleStatChange(i, "value", e.target.value)}
                        placeholder="e.g. 1,800+"
                        required
                      />
                      <InputField
                        label="Label"
                        name={`statLabel${i}`}
                        value={stat.label}
                        onChange={(e) => handleStatChange(i, "label", e.target.value)}
                        placeholder="e.g. Dedicated Staff"
                        required
                      />
                      <TextAreaField
                        label="Description"
                        name={`statDesc${i}`}
                        value={stat.description}
                        onChange={(e) => handleStatChange(i, "description", e.target.value)}
                        placeholder="Description..."
                        rows={2}
                      />
                      <InputField
                        label="Lucide Icon Name"
                        name={`statIcon${i}`}
                        value={stat.icon}
                        onChange={(e) => handleStatChange(i, "icon", e.target.value)}
                        placeholder="e.g. Users, Zap, Briefcase, ShieldCheck, Globe..."
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
