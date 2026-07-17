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
  headingPart1: "",
  headingHighlight: "",
  description: "",
  areaTitle0: "",
  areaDesc0: "",
  areaTitle1: "",
  areaDesc1: "",
  areaTitle2: "",
  areaDesc2: "",
  areaTitle3: "",
  areaDesc3: "",
  calloutTitle: "",
  calloutDesc: ""
};

interface GlobalPresenceCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function GlobalPresenceCMS({
  sectionId,
  initialData,
  saveUrl = "/api/about",
  responseKey = "GlobalPresence",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: GlobalPresenceCMSProps) {
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
      const list = (data.areas as any[]) || [];
      const updated: any = {
        tagline: data.tagline || "",
        headingPart1: data.headingPart1 || "",
        headingHighlight: data.headingHighlight || "",
        description: data.description || "",
        calloutTitle: data.calloutTitle || "",
        calloutDesc: data.calloutDesc || "",
      };
      for (let i = 0; i < 4; i++) {
        updated[`areaTitle${i}`] = list[i]?.title || "";
        updated[`areaDesc${i}`] = list[i]?.desc || "";
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
    if (!formData.headingPart1?.trim()) errs.push("Heading Part 1 is required");
    if (!formData.headingHighlight?.trim()) errs.push("Heading Highlight is required");
    if (!formData.description?.trim()) errs.push("Description is required");
    if (!formData.calloutTitle?.trim()) errs.push("Callout Title is required");
    if (!formData.calloutDesc?.trim()) errs.push("Callout Description is required");

    for (let i = 0; i < 4; i++) {
      if (!(formData as any)[`areaTitle${i}`]?.trim()) errs.push(`Area Card ${i + 1} Title is required`);
      if (!(formData as any)[`areaDesc${i}`]?.trim()) errs.push(`Area Card ${i + 1} Description is required`);
    }

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Global Presence section...");
    try {
      const areas = Array.from({ length: 4 }).map((_, i) => ({
        title: (formData as any)[`areaTitle${i}`],
        desc: (formData as any)[`areaDesc${i}`],
      }));

      const payload = {
        tagline: formData.tagline,
        headingPart1: formData.headingPart1,
        headingHighlight: formData.headingHighlight,
        description: formData.description,
        areas,
        calloutTitle: formData.calloutTitle,
        calloutDesc: formData.calloutDesc,
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
        toast.success("Global Presence saved successfully!", { id: toastId });
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
          title="Global Presence Section"
          description="Manage corporate reach, headers, descriptions, geographic region cards, and bottom highlights."
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
                    placeholder="e.g. Our Reach"
                    required
                    containerClassName="flex-1"
                  />
                  <InputField
                    label="Heading Part 1 (Normal)"
                    name="headingPart1"
                    value={formData.headingPart1}
                    onChange={handleChange}
                    placeholder="e.g. A Global Presence"
                    required
                    containerClassName="flex-1"
                  />
                  <InputField
                    label="Heading Part 2 (Highlight)"
                    name="headingHighlight"
                    value={formData.headingHighlight}
                    onChange={handleChange}
                    placeholder="e.g. with a Local Touch"
                    required
                    containerClassName="flex-1"
                  />
                </div>

                <TextAreaField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Main geographic narrative text..."
                  rows={3}
                  required
                />

                {/* Area Cards */}
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mt-4">
                  Edit 4 Region Area Cards
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="p-5 bg-white border border-gray-200 rounded-xl flex flex-col gap-4 shadow-sm">
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                        Region Card {i + 1}
                      </span>
                      <InputField
                        label="Region Title"
                        name={`areaTitle${i}`}
                        value={(formData as any)[`areaTitle${i}`]}
                        onChange={handleChange}
                        placeholder="e.g. Headquarters"
                        required
                      />
                      <InputField
                        label="Region Description"
                        name={`areaDesc${i}`}
                        value={(formData as any)[`areaDesc${i}`]}
                        onChange={handleChange}
                        placeholder="e.g. Noida, India"
                        required
                      />
                    </div>
                  ))}
                </div>

                {/* Bottom Callout Block */}
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mt-6">
                  Bottom Callout Box
                </span>
                <div className="flex flex-col md:flex-row gap-6 w-full mt-2">
                  <InputField
                    label="Callout Title"
                    name="calloutTitle"
                    value={formData.calloutTitle}
                    onChange={handleChange}
                    placeholder="e.g. Wherever Energy is Needed"
                    required
                    containerClassName="flex-1"
                  />
                  <InputField
                    label="Callout Description"
                    name="calloutDesc"
                    value={formData.calloutDesc}
                    onChange={handleChange}
                    placeholder="We combine local execution strength..."
                    required
                    containerClassName="flex-1"
                  />
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
