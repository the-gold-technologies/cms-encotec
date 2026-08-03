"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { ImagePickerField } from "@/components/ImagePickerField";
import { uploadFiles } from "@/app/lib/uploadHelpers";

export interface GalleryItem {
  image: File | string | null;
  caption: string;
}

const defaultFormData = {
  tagline: "",
  heading: "",
  galleryList: [
    { image: null, caption: "" },
    { image: null, caption: "" },
    { image: null, caption: "" },
    { image: null, caption: "" },
    { image: null, caption: "" },
    { image: null, caption: "" },
  ] as GalleryItem[],
};

export function CareersGalleryCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/careers")
      .then((json) => {
        if (json.success && json.data?.CareersGallery) {
          const data = json.data.CareersGallery;
          setFormData({
            tagline: data.tagline || "",
            heading: data.heading || "",
            galleryList:
              Array.isArray(data.galleryList) && data.galleryList.length > 0
                ? data.galleryList.map((item: any) => ({
                    image: item.image || null,
                    caption: item.caption || "",
                  }))
                : defaultFormData.galleryList,
          });
        }
      })
      .catch(console.error);
  }, []);

  const handleImageChange = (
    index: number,
    field: "image" | "caption",
    value: File | string | null,
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
      galleryList: [...prev.galleryList, { image: null, caption: "" }],
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
    toast.success("Removed gallery slot");
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Gallery Section...");
    try {
      // 1. Upload any File objects in galleryList
      const imageSources = formData.galleryList.map((item) => item.image);
      const uploadedUrls = await uploadFiles(imageSources);

      const processedGallery = formData.galleryList.map((item, idx) => ({
        image: uploadedUrls[idx] || "",
        caption: item.caption,
      }));

      const payload = {
        tagline: formData.tagline,
        heading: formData.heading,
        galleryList: processedGallery,
      };

      const res = await fetch("/api/careers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "CareersGallery",
          content: payload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Gallery Section saved successfully!", { id: toastId });
        setFormData((prev) => ({ ...prev, galleryList: processedGallery }));
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
        description="Manage corporate tagline, heading, and upload photos/activities in the gallery strip."
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

          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <span className="text-sm font-bold text-gray-700">
              Gallery Items <span className="text-[#a0004f] font-semibold">({formData.galleryList.length})</span>
            </span>
            <button
              type="button"
              onClick={addImage}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#a0004f] hover:bg-[#8c0045] text-white rounded-lg text-xs font-semibold active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <Plus size={15} /> Add Image
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formData.galleryList.map((item, idx) => (
              <div
                key={idx}
                className="p-5 border border-gray-200 rounded-xl flex flex-col gap-4 relative bg-gray-50/20 group shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#a0004f] uppercase tracking-wider">
                    Gallery Slot #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                    title="Remove Image Slot"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <ImagePickerField
                  label={`Gallery Image #${idx + 1}`}
                  value={item.image}
                  onChange={(file) => handleImageChange(idx, "image", file)}
                  sublabel="Drag and drop or browse photo file"
                />

                <InputField
                  label={`Caption #${idx + 1}`}
                  name={`caption-${idx}`}
                  value={item.caption}
                  onChange={(e) =>
                    handleImageChange(idx, "caption", e.target.value)
                  }
                  placeholder="e.g. Team Celebration / Site Visit"
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
