"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { ImagePickerField } from "@/components/ImagePickerField";
import { uploadFiles } from "@/lib/uploadHelpers";
import { Plus, Trash2 } from "lucide-react";

const defaultFormData = {
  heroTitle: "",
  heroSubtitle: "",
  backgroundImage: "",
  heroBadge1: "",
  heroBadge2: "",
  heroBadge3: "",
  heroBadge4: "",
  heroBadge5: "",
  badges: [
    "1,800+ Manpower",
    "300+ Engineers",
    "100+ Professionals & Industry Experts",
    "12+ Years Average Experience",
    "10+ Countries",
  ],
};

export function LeadershipHeroCMS() {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState(defaultFormData);
  const [selectedImage, setSelectedImage] = useState<File | string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/leadership")
      .then((json) => {
        if (json.success && json.data?.LeadershipHero) {
          const sectionData = json.data.LeadershipHero;
          const initialBadges =
            sectionData.badges && sectionData.badges.length > 0
              ? sectionData.badges
              : [
                  sectionData.heroBadge1 || "1,800+ Manpower",
                  sectionData.heroBadge2 || "300+ Engineers",
                  sectionData.heroBadge3 || "100+ Professionals & Industry Experts",
                  sectionData.heroBadge4 || "12+ Years Average Experience",
                  sectionData.heroBadge5 || "10+ Countries",
                ].filter(Boolean);

          const merged = {
            ...defaultFormData,
            ...sectionData,
            badges: initialBadges,
          };
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

  const handleBadgeChange = (index: number, val: string) => {
    setFormData((prev) => {
      const list = [...prev.badges];
      list[index] = val;
      return { ...prev, badges: list };
    });
  };

  const handleAddBadge = () => {
    setFormData((prev) => ({
      ...prev,
      badges: [...prev.badges, ""],
    }));
  };

  const handleRemoveBadge = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      badges: prev.badges.filter((_, i) => i !== index),
    }));
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
        heroTitle: formData.heroTitle,
        heroSubtitle: formData.heroSubtitle,
        backgroundImage: imgUrl,
        badges: formData.badges,
      };

      const res = await fetch("/api/leadership", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "LeadershipHero", content: payload }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Hero Section saved successfully!", { id: toastId });
        setFormData((prev) => ({ ...prev, ...payload }));
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
        description="Manage the title, subtitle, background image, and dynamic badges on the page hero header."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-4 border-t border-gray-50">
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

          {/* Dynamic Badges Section */}
          <div className="flex flex-col gap-4 border border-gray-100 p-6 rounded-2xl bg-gray-50/30">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  Hero Stat Badges
                </h4>
                <p className="text-xs text-gray-500">
                  Add, edit, or remove stat badges displayed on the leadership hero header.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddBadge}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 text-brand-pink border border-pink-200 text-xs font-bold rounded-lg hover:bg-pink-100 transition-colors"
              >
                <Plus size={14} /> Add Badge
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {formData.badges.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <InputField
                    label={`Badge #${idx + 1}`}
                    value={badge}
                    onChange={(e) => handleBadgeChange(idx, e.target.value)}
                    containerClassName="flex-1"
                    placeholder="e.g. 300+ Engineers"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveBadge(idx)}
                    title="Delete Badge"
                    className="mt-6 p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
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
