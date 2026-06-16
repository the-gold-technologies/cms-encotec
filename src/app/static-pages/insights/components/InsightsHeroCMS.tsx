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
  tagline: "Insights & Resources",
  heroTitle: "INSIGHTS, CASE STUDIES & INDUSTRY PERSPECTIVES",
  heroSubtitle:
    "Explore our thought leadership, project successes, and the latest updates from the forefront of global energy engineering.",
  backgroundImage:
    "https://images.unsplash.com/photo-1497435334941-8c899a9bd6a2?auto=format&fit=crop&q=80&w=2400",
  tab1Label: "Case Studies",
  tab2Label: "News & Updates",
  tab3Label: "Blog & Articles",
};

export function InsightsHeroCMS() {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState(defaultFormData);
  const [selectedImage, setSelectedImage] = useState<File | string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/insights")
      .then((json) => {
        if (json.success && json.data?.InsightsHero) {
          const merged = { ...defaultFormData, ...json.data.InsightsHero };
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
    const toastId = toast.loading("Saving Hero Section...");
    try {
      const imgUrl =
        selectedImage instanceof File
          ? (await uploadFiles([selectedImage]))[0] || ""
          : selectedImage || "";

      const payload = { ...formData, backgroundImage: imgUrl };

      const res = await fetch("/api/insights", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "InsightsHero", content: payload }),
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
        description="Manage the tagline, titles, background image, and filter tabs on the page hero header."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-4 border-t border-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Hero Tagline"
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
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Tab 1 Label (Case Studies)"
              name="tab1Label"
              value={formData.tab1Label}
              onChange={handleChange}
              required
            />
            <InputField
              label="Tab 2 Label (News)"
              name="tab2Label"
              value={formData.tab2Label}
              onChange={handleChange}
              required
            />
            <InputField
              label="Tab 3 Label (Blogs)"
              name="tab3Label"
              value={formData.tab3Label}
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
