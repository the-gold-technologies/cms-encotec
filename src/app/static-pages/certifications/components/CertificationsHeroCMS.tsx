"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { ImagePickerField } from "@/components/ImagePickerField";
import { uploadFiles } from "@/lib/uploadHelpers";

const defaultFormData = {
  heroTitle: "CERTIFICATIONS & PARTNERS",
  heroSubtitle:
    "Our commitment to global standards of quality, safety, and environmental management, backed by strategic alliances with industry leaders.",
  tagline: "Trust & Excellence",
  backgroundImage:
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=2400",
  badge1Text: "ISO Certified",
  badge2Text: "ASME Compliant",
  badge3Text: "15+ Years Excellence",
};

export function CertificationsHeroCMS() {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState(defaultFormData);
  const [selectedImage, setSelectedImage] = useState<File | string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/certifications")
      .then((json) => {
        if (json.success && json.data?.CertificationsHero) {
          const merged = { ...defaultFormData, ...json.data.CertificationsHero };
          setFormData(merged);
          if (merged.backgroundImage) setSelectedImage(merged.backgroundImage);
        } else {
          if (defaultFormData.backgroundImage)
            setSelectedImage(defaultFormData.backgroundImage);
        }
      })
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Certifications Hero...");
    try {
      const imgUrl =
        selectedImage instanceof File
          ? (await uploadFiles([selectedImage]))[0] || ""
          : selectedImage || "";

      const payload = { ...formData, backgroundImage: imgUrl };

      const res = await fetch("/api/certifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "CertificationsHero",
          content: payload,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Certifications Hero saved successfully!", { id: toastId });
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
        description="Manage the title, subtitle, background image and badges on the page hero header."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-4 border-t border-gray-50">
          <InputField
            label="Tagline"
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            required
          />
          <InputField
            label="Hero Title"
            name="heroTitle"
            value={formData.heroTitle}
            onChange={handleChange}
            required
          />
          <InputField
            label="Hero Subtitle"
            name="heroSubtitle"
            value={formData.heroSubtitle}
            onChange={handleChange}
            required
          />
          <ImagePickerField
            label="Hero Background Image"
            sublabel="Parallax Background Layer"
            value={selectedImage}
            onChange={setSelectedImage}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField
              label="Badge 1 Text"
              name="badge1Text"
              value={formData.badge1Text}
              onChange={handleChange}
              required
            />
            <InputField
              label="Badge 2 Text"
              name="badge2Text"
              value={formData.badge2Text}
              onChange={handleChange}
              required
            />
            <InputField
              label="Badge 3 Text"
              name="badge3Text"
              value={formData.badge3Text}
              onChange={handleChange}
              required
            />
          </div>
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
