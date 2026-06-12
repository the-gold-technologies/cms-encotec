"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

const defaultFormData = {
  headingPart1: "",
  headingHighlight: "",
  headingPart2: "",
  description: "",
  ctaLabel: "",
  ctaUrl: "",
};

interface ClosingStatementCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function ClosingStatementCMS({
  sectionId,
  initialData,
  saveUrl = "/api/about",
  responseKey = "ClosingStatement",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: ClosingStatementCMSProps) {
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
    if (initialData) {
      setFormData({ ...defaultFormData, ...initialData });
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey ? json.data?.[responseKey] : json.data;
          if (json.success && sectionData) {
            setFormData({ ...defaultFormData, ...sectionData });
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
    if (!formData.headingPart1?.trim()) errs.push("Heading Part 1 is required");
    if (!formData.headingHighlight?.trim()) errs.push("Heading Highlight is required");
    if (!formData.headingPart2?.trim()) errs.push("Heading Part 2 is required");
    if (!formData.description?.trim()) errs.push("Description tagline is required");
    if (!formData.ctaLabel?.trim()) errs.push("CTA label is required");
    if (!formData.ctaUrl?.trim()) errs.push("CTA redirect URL is required");

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Closing Statement section...");
    try {
      const payload = {
        ...formData,
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
        toast.success("Closing Statement saved successfully!", { id: toastId });
        setFormData(payload);
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
          title="Closing Statement & CTA Section"
          description="Manage closing summary callout text, partner CTA action labels, and link redirection."
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
                  label="Heading Part 1 (Normal)"
                  name="headingPart1"
                  value={formData.headingPart1}
                  onChange={handleChange}
                  placeholder="e.g. Encotec integrates "
                  required
                />

                <InputField
                  label="Heading Part 2 (Highlight Accent)"
                  name="headingHighlight"
                  value={formData.headingHighlight}
                  onChange={handleChange}
                  placeholder="e.g. engineering expertise..."
                  required
                />

                <InputField
                  label="Heading Part 3 (Normal Trailing)"
                  name="headingPart2"
                  value={formData.headingPart2}
                  onChange={handleChange}
                  placeholder="e.g. to deliver solutions..."
                  required
                />

                <InputField
                  label="Description Line / Subtitle"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="e.g. — not just at commissioning, but throughout..."
                  required
                />

                <div className="flex flex-col md:flex-row gap-6 w-full border-t border-gray-100 pt-6">
                  <InputField
                    label="CTA Button Label"
                    name="ctaLabel"
                    value={formData.ctaLabel}
                    onChange={handleChange}
                    placeholder="e.g. Partner With Us"
                    required
                    containerClassName="flex-1"
                  />
                  <InputField
                    label="CTA Action Redirect URL"
                    name="ctaUrl"
                    value={formData.ctaUrl}
                    onChange={handleChange}
                    placeholder="e.g. /contact"
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
