"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { ImagePickerField } from "@/components/ImagePickerField";
import { uploadFiles } from "@/lib/uploadHelpers";

const defaultFormData = {
  tagline: "",
  heroTitle: "",
  heroSubtitle: "",
  backgroundImage: "",
  tab1Label: "",
  tab2Label: "",
  tab3Label: "",
};

export function GalleryHeroCMS() {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState(defaultFormData);
  const [selectedImage, setSelectedImage] = useState<File | string | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/gallery")
      .then((json) => {
        if (json.success && json.data?.GalleryHero) {
          const merged = { ...defaultFormData, ...json.data.GalleryHero };
          setFormData(merged);
          if (merged.backgroundImage) setSelectedImage(merged.backgroundImage);
        }
      })
      .catch(console.error);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Hero Section...");
    try {
      const imgUrl =
        selectedImage instanceof File
          ? (await uploadFiles([selectedImage]))[0] || ""
          : selectedImage || "";

      const payload = {
        tagline: String(formData.tagline || ""),
        heroTitle: String(formData.heroTitle || ""),
        heroSubtitle: String(formData.heroSubtitle || ""),
        backgroundImage: String(imgUrl || ""),
        tab1Label: String(formData.tab1Label || ""),
        tab2Label: String(formData.tab2Label || ""),
        tab3Label: String(formData.tab3Label || ""),
      };

      const res = await fetch("/api/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "GalleryHero", content: payload }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Hero Section saved successfully!", { id: toastId });
        setFormData(payload);
        setSelectedImage(imgUrl);
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4">
      <SectionHeader
        title="Hero Section"
        description="Manage the tagline, title, subtitle, category pills, and background image (matching Insights hero design)."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-4 border-t border-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Tagline / Label"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="e.g. VISUAL SHOWCASE"
            />
            <InputField
              label="Hero Title"
              name="heroTitle"
              value={formData.heroTitle}
              onChange={handleChange}
              placeholder="e.g. POWER, PRECISION & FIELD MASTERY"
            />
          </div>

          <TextAreaField
            label="Hero Subtitle"
            name="heroSubtitle"
            value={formData.heroSubtitle}
            onChange={handleChange}
            placeholder="Subtitle description..."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Pill 1 Label (Pink)"
              name="tab1Label"
              value={formData.tab1Label}
              onChange={handleChange}
              placeholder="e.g. 3500+ MW Managed"
            />
            <InputField
              label="Pill 2 Label (Blue)"
              name="tab2Label"
              value={formData.tab2Label}
              onChange={handleChange}
              placeholder="e.g. 350+ Engineers"
            />
            <InputField
              label="Pill 3 Label (Green)"
              name="tab3Label"
              value={formData.tab3Label}
              onChange={handleChange}
              placeholder="e.g. Global Footprint"
            />
          </div>

          <ImagePickerField
            label="Hero Background Image"
            sublabel="Parallax Background Layer"
            value={selectedImage}
            onChange={setSelectedImage}
          />

          <div className="flex justify-end pt-4 border-t border-gray-50">
            <SaveButton
              onClick={handleSave}
              disabled={isSaving}
              className="w-44 h-12 text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}
