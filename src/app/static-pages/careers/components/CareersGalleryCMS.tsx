"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";

const defaultFormData = {
  tagline: "Inside Encotec",
  heading: "Life at Encotec",
  galleryList: [
    {
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
      caption: "Team Collaboration",
    },
    {
      image:
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800",
      caption: "On-Site Engineering",
    },
    {
      image:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
      caption: "Strategic Planning",
    },
    {
      image:
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800",
      caption: "Field Operations",
    },
    {
      image:
        "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800",
      caption: "Team Celebrations",
    },
    {
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
      caption: "Project Reviews",
    },
  ],
};

export function CareersGalleryCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/careers")
      .then((json) => {
        if (json.success && json.data?.CareersGallery) {
          setFormData({ ...defaultFormData, ...json.data.CareersGallery });
        }
      })
      .catch(console.error);
  }, []);

  const handleImageChange = (
    index: number,
    field: "image" | "caption",
    value: string,
  ) => {
    setFormData((prev) => {
      const updatedList = [...prev.galleryList];
      updatedList[index] = { ...updatedList[index], [field]: value };
      return { ...prev, galleryList: updatedList };
    });
  };

  const addImage = () => {
    setFormData((prev) => ({
      ...prev,
      galleryList: [...prev.galleryList, { image: "", caption: "" }],
    }));
    toast.success("Added new gallery slot");
  };

  const removeImage = (index: number) => {
    if (formData.galleryList.length <= 1) {
      toast.error("At least one gallery image is required");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      galleryList: prev.galleryList.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Gallery Section...");
    try {
      const res = await fetch("/api/careers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "CareersGallery",
          content: formData,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Gallery Section saved successfully!", { id: toastId });
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
        title="Life at Encotec Gallery Section"
        description="Manage corporate tagline, heading, and photos/activities in the gallery strip."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-4 border-t border-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Section Tagline"
              name="tagline"
              value={formData.tagline}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, tagline: e.target.value }))
              }
              required
            />
            <InputField
              label="Section Heading"
              name="heading"
              value={formData.heading}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, heading: e.target.value }))
              }
              required
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">
              Gallery Items ({formData.galleryList.length})
            </span>
            <button
              onClick={addImage}
              className="flex items-center gap-2 px-3 py-1.5 bg-brand-pink text-white rounded text-xs font-semibold hover:bg-[#a0004f] transition-all"
            >
              <Plus size={14} /> Add Image
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formData.galleryList.map((item, idx) => (
              <div
                key={idx}
                className="p-4 border border-gray-100 rounded-xl flex flex-col gap-4 relative"
              >
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove Image"
                >
                  <Trash2 size={16} />
                </button>

                {item.image && (
                  <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                    <img
                      src={item.image}
                      alt={item.caption}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <InputField
                  label={`Image URL #${idx + 1}`}
                  name={`image-${idx}`}
                  value={item.image}
                  onChange={(e) =>
                    handleImageChange(idx, "image", e.target.value)
                  }
                  required
                />

                <InputField
                  label={`Caption #${idx + 1}`}
                  name={`caption-${idx}`}
                  value={item.caption}
                  onChange={(e) =>
                    handleImageChange(idx, "caption", e.target.value)
                  }
                  required
                />
              </div>
            ))}
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
