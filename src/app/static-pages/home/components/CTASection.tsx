"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { Link } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { TextAreaField } from "@/components/TextAreaField";
import { SectionHeader } from "@/components/SectionHeader";

const defaultFormData = {
  tagline: "Partner With Us",
  headingPart1: "Experience Global",
  headingHighlight: "Engineering Excellence.",
  description: "From India to Global, see how we are setting new standards in power infrastructure. Join the 13+ Projects that rely on Encotec for their critical power needs.",
  primaryBtnLabel: "Start Your Project",
  primaryBtnUrl: "/contact",
  secondaryBtnLabel: "Talk to an Expert",
  secondaryBtnUrl: "/contact",
  footerNote: "Looking for precision and reliability? Get in touch to learn more about our certified quality and safety-first approach.",
  copyright: "© 2026 Encotec Engineering."
};

const mergeDefaults = (data: any) => {
  return { ...defaultFormData, ...data };
};

interface CTASectionProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function CTASection({
  sectionId,
  initialData,
  saveUrl = "/api/home",
  responseKey = "CTASection",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: CTASectionProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
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
      setFormData(mergeDefaults(initialData));
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey
            ? json.data?.[responseKey]
            : json.data;
          if (json.success && sectionData) {
            setFormData(mergeDefaults(sectionData));
          }
        })
        .catch(console.error);
    }
  }, [initialData, saveUrl, responseKey]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.tagline?.trim()) errs.push("Tagline is required");
    if (!formData.headingPart1?.trim()) errs.push("Heading Part 1 is required");

    if (errs.length > 0) {
      errs.forEach((m) => toast.error(m));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Bottom CTA section...");
    try {
      const body = sectionId
        ? { id: sectionId, content: formData }
        : { section: responseKey ?? "CTASection", content: formData };

      const res = await fetch(sectionId ? `/api/sections` : saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("CTA Section saved successfully!", { id: toastId });
        if (onSave) onSave(formData as unknown as Record<string, unknown>);
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
          title="Bottom CTA & Footer Section"
          description="Manage Encotec's bottom call-to-action text, custom redirect buttons, note, and copyright footer text."
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
              {/* Copy Headers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl">
                <InputField
                  label="Tagline Label"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="e.g. Partner With Us"
                  required
                />
                <InputField
                  label="Heading Part 1 (Regular)"
                  name="headingPart1"
                  value={formData.headingPart1}
                  onChange={handleChange}
                  placeholder="e.g. Experience Global"
                  required
                />
                <InputField
                  label="Heading Highlight (Gradient)"
                  name="headingHighlight"
                  value={formData.headingHighlight}
                  onChange={handleChange}
                  placeholder="e.g. Engineering Excellence."
                  required
                  containerClassName="col-span-2"
                />
                <TextAreaField
                  label="Description Paragraph"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="e.g. From India to Turkey..."
                  containerClassName="col-span-2"
                  rows={2}
                />
              </div>

              {/* Action Buttons Link */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-50 bg-gray-50/20 rounded-2xl p-5 flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                    <Link className="w-3.5 h-3.5 text-[#a0004f]" />
                    Primary Action Button (Pink Filled)
                  </h4>
                  <InputField
                    label="Button Label"
                    name="primaryBtnLabel"
                    value={formData.primaryBtnLabel}
                    onChange={handleChange}
                    placeholder="e.g. Start Your Project"
                  />
                  <InputField
                    label="Button Redirect Route"
                    name="primaryBtnUrl"
                    value={formData.primaryBtnUrl}
                    onChange={handleChange}
                    placeholder="e.g. /contact"
                  />
                </div>

                <div className="border border-gray-50 bg-gray-50/20 rounded-2xl p-5 flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                    <Link className="w-3.5 h-3.5 text-[#a0004f]" />
                    Secondary Action Button (Outline)
                  </h4>
                  <InputField
                    label="Button Label"
                    name="secondaryBtnLabel"
                    value={formData.secondaryBtnLabel}
                    onChange={handleChange}
                    placeholder="e.g. Talk to an Expert"
                  />
                  <InputField
                    label="Button Redirect Route"
                    name="secondaryBtnUrl"
                    value={formData.secondaryBtnUrl}
                    onChange={handleChange}
                    placeholder="e.g. /contact"
                  />
                </div>
              </div>

              {/* Footer configurations */}
              <div className="grid grid-cols-1 gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl">
                <TextAreaField
                  label="Footer Disclaimer / Note"
                  name="footerNote"
                  value={formData.footerNote}
                  onChange={handleChange}
                  placeholder="e.g. Looking for precision and reliability?..."
                  rows={2}
                />
                <InputField
                  label="Copyright Text"
                  name="copyright"
                  value={formData.copyright}
                  onChange={handleChange}
                  placeholder="e.g. © 2026 Encotec Engineering."
                />
              </div>

              {/* Action Save Button */}
              <div className="flex justify-end pt-4 border-t border-gray-50">
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
