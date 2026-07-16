"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { uploadFiles } from "@/lib/uploadHelpers";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";

const defaultFormData = {
  tagline: "About Encotec Energy",
  headingPart1: "Engineering Excellence,",
  headingItalicHighlight: "Delivered with Ownership",
  description: "A full-spectrum engineering and services company operating across power generation, transmission & distribution, and renewable energy sectors.",
  backgroundImage: "https://images.unsplash.com/photo-1497435334941-8c899a9bd6a2?auto=format&fit=crop&q=80&w=2400"
};

interface AboutHeroCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function AboutHeroCMS({
  sectionId,
  initialData,
  saveUrl = "/api/about",
  responseKey = "AboutHero",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: AboutHeroCMSProps) {
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
  const [selectedImage, setSelectedImage] = useState<File | string | null>(
    null,
  );

  useEffect(() => {
    if (initialData) {
      const data = { ...defaultFormData, ...initialData };
      setFormData(data);
      if (data.backgroundImage) setSelectedImage(data.backgroundImage);
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey
            ? json.data?.[responseKey]
            : json.data;
          if (json.success && sectionData) {
            const data = { ...defaultFormData, ...sectionData };
            setFormData(data);
            if (data.backgroundImage) setSelectedImage(data.backgroundImage);
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
    if (!formData.tagline?.trim()) errs.push("Tagline label is required");
    if (!formData.headingPart1?.trim()) errs.push("Heading Part 1 is required");
    if (!formData.headingItalicHighlight?.trim())
      errs.push("Heading Italic Highlight is required");
    if (!formData.description?.trim()) errs.push("Description is required");
    if (!selectedImage) errs.push("Background image is required");

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving About Hero section...");
    try {
      const imgUrl =
        selectedImage instanceof File
          ? (await uploadFiles([selectedImage]))[0] || ""
          : selectedImage || "";

      const payload = {
        ...formData,
        backgroundImage: imgUrl,
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
        toast.success("About Hero saved successfully!", { id: toastId });
        setFormData(payload);
        setSelectedImage(imgUrl);
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
          title="About Hero Section"
          description="Manage background parallax imagery, tagline badge, heading and intro description."
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
              {/* Header Editor Block */}
              <div className="flex flex-col gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
                <InputField
                  label="Tagline Label"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="e.g. About Encotec Energy"
                  required
                  containerClassName="w-full"
                />

                <div className="flex flex-col md:flex-row gap-6 w-full">
                  <InputField
                    label="Heading Part 1 (Normal)"
                    name="headingPart1"
                    value={formData.headingPart1}
                    onChange={handleChange}
                    placeholder="e.g. Engineering Excellence,"
                    required
                    containerClassName="flex-1"
                  />
                  <InputField
                    label="Heading Part 2 (Italic Highlight)"
                    name="headingItalicHighlight"
                    value={formData.headingItalicHighlight}
                    onChange={handleChange}
                    placeholder="e.g. Delivered with Ownership"
                    required
                    containerClassName="flex-1"
                  />
                </div>

                <TextAreaField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="A full-spectrum engineering and services company..."
                  containerClassName="w-full"
                  rows={3}
                  required
                />
              </div>

              <ImagePickerField
                label="Hero Background Image"
                sublabel="Parallax Background Layer"
                value={selectedImage}
                onChange={setSelectedImage}
              />

              {/* Save Action */}
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
