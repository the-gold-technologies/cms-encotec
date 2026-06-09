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
  description: "",
  missionTitle: "",
  missionDesc: "",
  visionTitle: "",
  visionDesc: "",
  valuesTitle: "",
  valuesDesc: "",
  // Values cards
  valueTitle0: "", valueDesc0: "", valueIcon0: "",
  valueTitle1: "", valueDesc1: "", valueIcon1: "",
  valueTitle2: "", valueDesc2: "", valueIcon2: "",
  valueTitle3: "", valueDesc3: "", valueIcon3: "",
  valueTitle4: "", valueDesc4: "", valueIcon4: "",
  valueTitle5: "", valueDesc5: "", valueIcon5: "",
};

interface MissionVisionValuesCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function MissionVisionValuesCMS({
  sectionId,
  initialData,
  saveUrl = "/api/about",
  responseKey = "MissionVisionValues",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: MissionVisionValuesCMSProps) {
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
      const list = (data.valuesList as any[]) || [];
      const updated: any = {
        tagline: data.tagline || "",
        description: data.description || "",
        missionTitle: data.missionTitle || "",
        missionDesc: data.missionDesc || "",
        visionTitle: data.visionTitle || "",
        visionDesc: data.visionDesc || "",
        valuesTitle: data.valuesTitle || "",
        valuesDesc: data.valuesDesc || "",
      };
      for (let i = 0; i < 6; i++) {
        updated[`valueTitle${i}`] = list[i]?.title || "";
        updated[`valueDesc${i}`] = list[i]?.description || "";
        updated[`valueIcon${i}`] = list[i]?.icon || "";
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
    if (!formData.description?.trim()) errs.push("Description is required");
    if (!formData.missionTitle?.trim()) errs.push("Mission title is required");
    if (!formData.missionDesc?.trim()) errs.push("Mission description is required");
    if (!formData.visionTitle?.trim()) errs.push("Vision title is required");
    if (!formData.visionDesc?.trim()) errs.push("Vision description is required");
    if (!formData.valuesTitle?.trim()) errs.push("Values title is required");
    if (!formData.valuesDesc?.trim()) errs.push("Values description is required");

    for (let i = 0; i < 6; i++) {
      if (!(formData as any)[`valueTitle${i}`]?.trim()) errs.push(`Value Card ${i + 1} Title is required`);
      if (!(formData as any)[`valueDesc${i}`]?.trim()) errs.push(`Value Card ${i + 1} Description is required`);
      if (!(formData as any)[`valueIcon${i}`]?.trim()) errs.push(`Value Card ${i + 1} Icon is required`);
    }

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Mission, Vision & Values section...");
    try {
      const valuesList = Array.from({ length: 6 }).map((_, i) => ({
        title: (formData as any)[`valueTitle${i}`],
        description: (formData as any)[`valueDesc${i}`],
        icon: (formData as any)[`valueIcon${i}`],
      }));

      const payload = {
        tagline: formData.tagline,
        description: formData.description,
        missionTitle: formData.missionTitle,
        missionDesc: formData.missionDesc,
        visionTitle: formData.visionTitle,
        visionDesc: formData.visionDesc,
        valuesTitle: formData.valuesTitle,
        valuesDesc: formData.valuesDesc,
        valuesList,
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
        toast.success("Mission, Vision & Values saved successfully!", { id: toastId });
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
          title="Mission, Vision & Values Section"
          description="Manage corporate mission, vision statements, and 6 core value cards."
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
                    label="Section Tag Label"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    placeholder="e.g. Our Heart and Soul"
                    required
                    containerClassName="flex-1"
                  />
                  <InputField
                    label="Description Subtitle"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="e.g. Our purpose is to bridge..."
                    required
                    containerClassName="flex-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full border-t border-gray-100 pt-6">
                  {/* Mission */}
                  <div className="flex flex-col gap-4">
                    <InputField
                      label="Mission Title"
                      name="missionTitle"
                      value={formData.missionTitle}
                      onChange={handleChange}
                      placeholder="e.g. Mission"
                      required
                    />
                    <TextAreaField
                      label="Mission Description"
                      name="missionDesc"
                      value={formData.missionDesc}
                      onChange={handleChange}
                      placeholder="Description of the mission..."
                      rows={3}
                      required
                    />
                  </div>

                  {/* Vision */}
                  <div className="flex flex-col gap-4">
                    <InputField
                      label="Vision Title"
                      name="visionTitle"
                      value={formData.visionTitle}
                      onChange={handleChange}
                      placeholder="e.g. Vision"
                      required
                    />
                    <TextAreaField
                      label="Vision Description"
                      name="visionDesc"
                      value={formData.visionDesc}
                      onChange={handleChange}
                      placeholder="Description of the vision..."
                      rows={3}
                      required
                    />
                  </div>
                </div>

                {/* Core Values General */}
                <div className="border-t border-gray-100 pt-6 flex flex-col gap-4">
                  <InputField
                    label="Values Section Title"
                    name="valuesTitle"
                    value={formData.valuesTitle}
                    onChange={handleChange}
                    placeholder="e.g. Core Values"
                    required
                  />
                  <TextAreaField
                    label="Values Section Description"
                    name="valuesDesc"
                    value={formData.valuesDesc}
                    onChange={handleChange}
                    placeholder="General description of core values..."
                    rows={2}
                    required
                  />
                </div>

                {/* Core Values Cards */}
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mt-4">
                  Edit 6 Core Value Cards
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="p-5 bg-white border border-gray-200 rounded-xl flex flex-col gap-4 shadow-sm">
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                        Card {i + 1}
                      </span>
                      <InputField
                        label="Title"
                        name={`valueTitle${i}`}
                        value={(formData as any)[`valueTitle${i}`]}
                        onChange={handleChange}
                        placeholder="e.g. Accountability"
                        required
                      />
                      <TextAreaField
                        label="Description"
                        name={`valueDesc${i}`}
                        value={(formData as any)[`valueDesc${i}`]}
                        onChange={handleChange}
                        placeholder="Description of value..."
                        rows={3}
                        required
                      />
                      <InputField
                        label="Lucide Icon Name"
                        name={`valueIcon${i}`}
                        value={(formData as any)[`valueIcon${i}`]}
                        onChange={handleChange}
                        placeholder="e.g. HeartHandshake, Award, ShieldCheck..."
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
