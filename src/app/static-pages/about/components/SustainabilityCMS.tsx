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
  paragraph1: "",
  paragraph2: "",
  focus0: "",
  focus1: "",
  focus2: "",
  focus3: "",
  footerNote: ""
};

interface SustainabilityCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function SustainabilityCMS({
  sectionId,
  initialData,
  saveUrl = "/api/about",
  responseKey = "Sustainability",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: SustainabilityCMSProps) {
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
      const paragraphs = (data.paragraphs as string[]) || [];
      const focuses = (data.focuses as string[]) || [];
      setFormData({
        tagline: data.tagline || "",
        heading: data.heading || "",
        paragraph1: paragraphs[0] || "",
        paragraph2: paragraphs[1] || "",
        focus0: focuses[0] || "",
        focus1: focuses[1] || "",
        focus2: focuses[2] || "",
        focus3: focuses[3] || "",
        footerNote: data.footerNote || "",
      });
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
    if (!formData.paragraph1?.trim()) errs.push("Paragraph 1 is required");
    if (!formData.paragraph2?.trim()) errs.push("Paragraph 2 is required");
    if (!formData.focus0?.trim()) errs.push("Focus 1 is required");
    if (!formData.focus1?.trim()) errs.push("Focus 2 is required");
    if (!formData.focus2?.trim()) errs.push("Focus 3 is required");
    if (!formData.focus3?.trim()) errs.push("Focus 4 is required");
    if (!formData.footerNote?.trim()) errs.push("Footer note is required");

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Sustainability section...");
    try {
      const payload = {
        tagline: formData.tagline,
        heading: formData.heading,
        paragraphs: [formData.paragraph1, formData.paragraph2],
        focuses: [formData.focus0, formData.focus1, formData.focus2, formData.focus3],
        footerNote: formData.footerNote,
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
        toast.success("Sustainability saved successfully!", { id: toastId });
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
          title="Sustainability Commitment Section"
          description="Manage ESG headers, commitment statements, key focus items, and summary notes."
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
                    placeholder="e.g. ESG Commitment"
                    required
                    containerClassName="flex-1"
                  />
                  <InputField
                    label="Heading"
                    name="heading"
                    value={formData.heading}
                    onChange={handleChange}
                    placeholder="e.g. Committed to a Greener Tomorrow"
                    required
                    containerClassName="flex-1"
                  />
                </div>

                <TextAreaField
                  label="Sustainability Paragraph 1"
                  name="paragraph1"
                  value={formData.paragraph1}
                  onChange={handleChange}
                  placeholder="First paragraph..."
                  rows={3}
                  required
                />

                <TextAreaField
                  label="Sustainability Paragraph 2"
                  name="paragraph2"
                  value={formData.paragraph2}
                  onChange={handleChange}
                  placeholder="Second paragraph..."
                  rows={3}
                  required
                />

                {/* Focus Areas */}
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mt-4">
                  Key Focus Areas (4 bullet points)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Focus 1"
                    name="focus0"
                    value={formData.focus0}
                    onChange={handleChange}
                    placeholder="e.g. Specialized energy audits..."
                    required
                  />
                  <InputField
                    label="Focus 2"
                    name="focus1"
                    value={formData.focus1}
                    onChange={handleChange}
                    placeholder="e.g. Residual Life Assessments..."
                    required
                  />
                  <InputField
                    label="Focus 3"
                    name="focus2"
                    value={formData.focus2}
                    onChange={handleChange}
                    placeholder="e.g. ISO 14001 environmental..."
                    required
                  />
                  <InputField
                    label="Focus 4"
                    name="focus3"
                    value={formData.focus3}
                    onChange={handleChange}
                    placeholder="e.g. Supporting the transition..."
                    required
                  />
                </div>

                <InputField
                  label="Footer Note"
                  name="footerNote"
                  value={formData.footerNote}
                  onChange={handleChange}
                  placeholder="e.g. Our approach ensures that sustainability is not..."
                  required
                  containerClassName="mt-4"
                />
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
