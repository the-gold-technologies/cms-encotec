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
import { Plus, Trash2, X, Tag } from "lucide-react";

interface GalleryCardItem {
  id: number | string;
  image: File | string | null;
  title?: string;
  category?: string;
  location?: string;
  tag?: string;
  description?: string;
}

const defaultCategories = [
  "All",
  "Thermal Power",
  "Renewables",
  "Transmission & Grid",
  "O&M & Field Engineering",
  "Global Sourcing",
];

export function GalleryGridCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [tagline, setTagline] = useState("");
  const [heading, setHeading] = useState("");
  const [sectionSubtitle, setSectionSubtitle] = useState("");
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [items, setItems] = useState<GalleryCardItem[]>([]);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleAddCategory = () => {
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("Category already exists.");
      return;
    }
    setCategories((prev) => [...prev, trimmed]);
    setNewCategoryInput("");
    toast.success(`Category "${trimmed}" added!`);
  };

  const handleRemoveCategory = (catToRemove: string) => {
    if (catToRemove === "All") return;
    setCategories((prev) => prev.filter((c) => c !== catToRemove));
    toast.success(`Category "${catToRemove}" removed.`);
  };

  useEffect(() => {
    fetchWithCache("/api/gallery")
      .then((json) => {
        if (json.success && json.data?.GalleryGrid) {
          const grid = json.data.GalleryGrid;
          if (grid.tagline !== undefined) setTagline(grid.tagline);
          if (grid.heading !== undefined) setHeading(grid.heading);
          else if (grid.sectionTitle !== undefined) setHeading(grid.sectionTitle);
          if (grid.sectionSubtitle !== undefined) setSectionSubtitle(grid.sectionSubtitle);
          if (Array.isArray(grid.categories) && grid.categories.length > 0) setCategories(grid.categories);
          if (Array.isArray(grid.items)) setItems(grid.items);
        }
      })
      .catch(console.error);
  }, []);

  const handleItemChange = (index: number, field: keyof GalleryCardItem, val: any) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        image: "",
        title: "",
        category: "",
        location: "",
        tag: "",
        description: "",
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Gallery Photos...");
    try {
      const uploadedItems = await Promise.all(
        items.map(async (item) => {
          let imgUrl = item.image;
          if (item.image instanceof File) {
            imgUrl = (await uploadFiles([item.image]))[0] || "";
          }
          return {
            id: item.id || Date.now(),
            image: String(imgUrl || ""),
            title: String(item.title || ""),
            category: String(item.category || ""),
            location: String(item.location || ""),
            tag: String(item.tag || ""),
            description: String(item.description || ""),
          };
        })
      );

      const payload = {
        tagline: String(tagline || ""),
        heading: String(heading || ""),
        sectionTitle: String(heading || tagline || ""),
        sectionSubtitle: String(sectionSubtitle || ""),
        categories,
        items: uploadedItems,
      };

      const res = await fetch("/api/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "GalleryGrid", content: payload }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Gallery Photos saved successfully!", { id: toastId });
        setItems(uploadedItems);
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
        title="Gallery Photography & Visual Portfolio"
        description="Manage the section header and photos. All text fields on images are completely optional."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-4 border-t border-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Tagline / Badge (Optional)"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. FIELD OPERATIONS & ASSET PORTFOLIO"
            />
            <InputField
              label="Main Section Title (Optional)"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder="e.g. Capturing Energy in Action"
            />
          </div>

          <InputField
            label="Section Subtitle / Description (Optional)"
            value={sectionSubtitle}
            onChange={(e) => setSectionSubtitle(e.target.value)}
            placeholder="e.g. A visual chronicle of our field engineering presence..."
          />

          {/* Categories / Filters Management */}
          <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/60 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Tag size={16} className="text-brand-pink" />
                  Filter Categories ({categories.length})
                </h4>
                <p className="text-xs text-gray-500">
                  Add or remove filter tabs shown on the website. Photos can be assigned to any of these categories.
                </p>
              </div>

              {/* Add New Category Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCategory();
                    }
                  }}
                  placeholder="New filter name..."
                  className="px-3.5 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-brand-pink w-48"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-brand-pink text-white text-xs font-bold rounded-xl hover:bg-brand-pink/90 transition-colors shadow-sm cursor-pointer shrink-0"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200/60">
              {categories.map((cat) => {
                const isAll = cat === "All";
                return (
                  <span
                    key={cat}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                      isAll
                        ? "bg-gray-200 text-gray-700 font-bold"
                        : "bg-white text-gray-800 border border-gray-200 shadow-sm"
                    }`}
                  >
                    <span>{cat}</span>
                    {!isAll && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(cat)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-0.5 rounded-full cursor-pointer"
                        title={`Delete ${cat}`}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <h4 className="text-sm font-bold text-gray-800">
                Gallery Photos ({items.length})
              </h4>
              <p className="text-xs text-gray-500">
                Upload images. Title, category, location, and description are all optional.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 text-brand-pink border border-pink-200 text-xs font-bold rounded-lg hover:bg-pink-100 transition-colors cursor-pointer"
            >
              <Plus size={14} /> Add Photo
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {items.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-6 rounded-2xl border border-gray-200 bg-gray-50/40 flex flex-col gap-4 relative"
              >
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="text-xs font-bold text-brand-pink tracking-wider uppercase">
                    Photo #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="text-red-500 hover:text-red-700 p-1 flex items-center gap-1 text-xs font-medium cursor-pointer"
                  >
                    <Trash2 size={15} /> Delete Photo
                  </button>
                </div>

                {/* Primary Image Upload Field */}
                <ImagePickerField
                  label="Photo Image (Required)"
                  value={item.image}
                  onChange={(img: File | string | null) => handleItemChange(idx, "image", img || "")}
                />

                {/* Optional Metadata Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField
                    label="Title / Caption (Optional)"
                    value={item.title || ""}
                    onChange={(e) => handleItemChange(idx, "title", e.target.value)}
                    placeholder="e.g. Supercritical Thermal Generation Unit"
                    containerClassName="md:col-span-2"
                  />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-700">Category (Optional)</label>
                    <select
                      value={item.category || ""}
                      onChange={(e) => handleItemChange(idx, "category", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-pink bg-white"
                    >
                      <option value="">(None / General)</option>
                      {categories.filter((c) => c !== "All").map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Facility / Location (Optional)"
                    value={item.location || ""}
                    onChange={(e) => handleItemChange(idx, "location", e.target.value)}
                    placeholder="e.g. Prayagraj Power Generation"
                  />
                  <InputField
                    label="Tag / Specification (Optional)"
                    value={item.tag || ""}
                    onChange={(e) => handleItemChange(idx, "tag", e.target.value)}
                    placeholder="e.g. 3x660 MW BTG"
                  />
                </div>

                <TextAreaField
                  label="Description / Details (Optional — shown in lightbox)"
                  value={item.description || ""}
                  onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                  placeholder="Optional details about this photo..."
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
