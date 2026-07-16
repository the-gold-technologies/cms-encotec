"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

const defaultFormData = {
  tagline: "Who We Are",
  headingPart1: "Energy is More Than ",
  headingHighlight: "Just Infrastructure",
  paragraph1: "At Encotec, we believe that energy infrastructure is about more than just steel and circuits — it is about the responsibility of keeping the world moving. We have evolved from a traditional O&M service provider into a Global Service Provider that offers end-to-end solutions for the entire life of your project.",
  paragraph2: "We approach every plant, every substation, and every utility we manage with what we call an \"Owner's Mindset\". This means we don't just provide a service; we take total responsibility for your assets, treating them with the same care, accountability, and long-term vision as if they were our own."
};

interface WhoWeAreCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function WhoWeAreCMS({
  sectionId,
  initialData,
  saveUrl = "/api/about",
  responseKey = "WhoWeAre",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: WhoWeAreCMSProps) {
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
      const paragraphs = (initialData.paragraphs as string[]) || [];
      setFormData({
        tagline: (initialData.tagline as string) || "",
        headingPart1: (initialData.headingPart1 as string) || "",
        headingHighlight: (initialData.headingHighlight as string) || "",
        paragraph1: paragraphs[0] || "",
        paragraph2: paragraphs[1] || "",
      });
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey ? json.data?.[responseKey] : json.data;
          if (json.success && sectionData) {
            const paragraphs = (sectionData.paragraphs as string[]) || [];
            setFormData({
              tagline: (sectionData.tagline as string) || "",
              headingPart1: (sectionData.headingPart1 as string) || "",
              headingHighlight: (sectionData.headingHighlight as string) || "",
              paragraph1: paragraphs[0] || "",
              paragraph2: paragraphs[1] || "",
            });
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
    if (!formData.headingHighlight?.trim()) errs.push("Heading highlight is required");
    if (!formData.paragraph1?.trim()) errs.push("Paragraph 1 is required");
    if (!formData.paragraph2?.trim()) errs.push("Paragraph 2 is required");

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Who We Are section...");
    try {
      const payload = {
        tagline: formData.tagline,
        headingPart1: formData.headingPart1,
        headingHighlight: formData.headingHighlight,
        paragraphs: [formData.paragraph1, formData.paragraph2],
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
        toast.success("Who We Are saved successfully!", { id: toastId });
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
          title="Who We Are Section"
          description="Manage tagline, headings, and detailed mission statement paragraphs."
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
                  label="Tagline Label"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="e.g. Who We Are"
                  required
                />

                <div className="flex flex-col md:flex-row gap-6 w-full">
                  <InputField
                    label="Heading Part 1 (Normal)"
                    name="headingPart1"
                    value={formData.headingPart1}
                    onChange={handleChange}
                    placeholder="e.g. Energy is More Than "
                    required
                    containerClassName="flex-1"
                  />
                  <InputField
                    label="Heading Highlight (Pink)"
                    name="headingHighlight"
                    value={formData.headingHighlight}
                    onChange={handleChange}
                    placeholder="e.g. Just Infrastructure"
                    required
                    containerClassName="flex-1"
                  />
                </div>

                <TextAreaField
                  label="Paragraph 1"
                  name="paragraph1"
                  value={formData.paragraph1}
                  onChange={handleChange}
                  placeholder="First description paragraph..."
                  rows={3}
                  required
                />

                <TextAreaField
                  label="Paragraph 2 (Owner's Mindset highlight)"
                  name="paragraph2"
                  value={formData.paragraph2}
                  onChange={handleChange}
                  placeholder="Second description paragraph..."
                  rows={3}
                  required
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
