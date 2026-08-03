"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { X, Tag, BarChart3, Award, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { TextAreaField } from "@/components/TextAreaField";
import { uploadFiles } from "@/lib/uploadHelpers";
import { SectionHeader } from "@/components/SectionHeader";
import { ImagePickerField } from "@/components/ImagePickerField";

interface StatItem {
  value: string;
  label: string;
}

const defaultFormData = {
  tagline: "",
  headlineLine1: "",
  headlineHighlight: "",
  headlineLine2: "",
  description: "",
  primaryBtnLabel: "",
  primaryBtnUrl: "",
  secondaryBtnLabel: "",
  secondaryBtnUrl: "",
  serviceTags: [
    "STEWARDSHIP",
    "COMMISSIONING",
    "ADVISORY",
    "GLOBAL SOURCING"
  ],
  projectsBadgeNumber: "",
  projectsBadgeLabel: "",
  backgroundImage: ""
};

interface HeroSectionProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function HeroSection({
  sectionId,
  initialData,
  saveUrl = "/api/home",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: HeroSectionProps) {
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

  const [formData, setFormData] = useState(defaultFormData);
  const [selectedImage, setSelectedImage] = useState<File | string | null>(null);
  const [statsList, setStatsList] = useState<StatItem[]>([
    { value: "", label: "" }
  ]);

  const unpackStats = (data: any) => {
    const rawList = (data.stats || data.statsList) as any[];
    if (Array.isArray(rawList) && rawList.length > 0) {
      setStatsList(rawList.map((s: any) => ({ value: s.value || "", label: s.label || "" })));
    } else {
      // Fallback from stat1Value..stat5Value
      const legacy: StatItem[] = [];
      for (let i = 1; i <= 5; i++) {
        if (data[`stat${i}Value`] || data[`stat${i}Label`]) {
          legacy.push({
            value: data[`stat${i}Value`] || "",
            label: data[`stat${i}Label`] || "",
          });
        }
      }
      setStatsList(legacy.length > 0 ? legacy : [
        { value: "", label: "" },
        { value: "", label: "" },
        { value: "", label: "" },
        { value: "", label: "" },
      ]);
    }
  };

  useEffect(() => {
    if (initialData) {
      const merged = { ...defaultFormData, ...initialData };
      setFormData(merged);
      if (merged.backgroundImage) setSelectedImage(merged.backgroundImage as string);
      unpackStats(initialData);
    } else if (saveUrl === "/api/home") {
      fetchWithCache("/api/home")
        .then((json) => {
          if (json.success && json.data?.HeroSection) {
            const data = { ...defaultFormData, ...json.data.HeroSection };
            setFormData(data);
            if (data.backgroundImage) setSelectedImage(data.backgroundImage);
            unpackStats(json.data.HeroSection);
          } else {
            setSelectedImage(defaultFormData.backgroundImage);
          }
        })
        .catch(console.error);
    }
  }, [initialData, saveUrl]);

  const handleStatChange = (index: number, field: keyof StatItem, value: string) => {
    setStatsList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addStatCard = () => {
    setStatsList((prev) => [...prev, { value: "", label: "" }]);
    toast.success("Added new hero stat card");
  };

  const deleteStatCard = (index: number) => {
    if (statsList.length <= 1) {
      toast.error("At least 1 hero stat card is required");
      return;
    }
    setStatsList((prev) => prev.filter((_, i) => i !== index));
    toast.success("Removed hero stat card");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [newTagText, setNewTagText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Service Tags
  const addTag = () => {
    if (newTagText.trim()) {
      if (formData.serviceTags.includes(newTagText.trim().toUpperCase())) {
        toast.error("Tag already exists");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        serviceTags: [...prev.serviceTags, newTagText.trim().toUpperCase()],
      }));
      setNewTagText("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceTags: prev.serviceTags.filter((t) => t !== tagToRemove),
    }));
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.tagline?.trim()) errs.push("Tagline is required");
    if (!formData.headlineLine1?.trim()) errs.push("Headline is required");
    if (!formData.description?.trim()) errs.push("Description is required");
    if (!selectedImage) errs.push("Hero background image is required");

    statsList.forEach((stat, i) => {
      if (!stat.value?.trim()) errs.push(`Stat Card ${i + 1} Value is required`);
      if (!stat.label?.trim()) errs.push(`Stat Card ${i + 1} Label is required`);
    });

    if (errs.length > 0) {
      errs.forEach((m) => toast.error(m));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Home Hero section...");
    try {
      const imgUrl =
        selectedImage instanceof File
          ? (await uploadFiles([selectedImage]))[0] || ""
          : selectedImage || "";

      const payload: any = {
        ...formData,
        stats: statsList,
        statsList,
        backgroundImage: imgUrl,
      };

      // Keep legacy properties synced
      statsList.forEach((s, idx) => {
        if (idx < 5) {
          payload[`stat${idx + 1}Value`] = s.value;
          payload[`stat${idx + 1}Label`] = s.label;
        }
      });

      const body = sectionId
        ? { id: sectionId, content: payload }
        : { section: "HeroSection", content: payload };

      const res = await fetch(sectionId ? `/api/sections` : saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Home Hero section saved successfully!", { id: toastId });
        setSelectedImage(imgUrl);
        if (onSave) onSave(payload as unknown as Record<string, unknown>);
      } else {
        toast.error(json.error || "Save failed.", { id: toastId });
      }
    } catch (err: any) {
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
          title="Home Hero Section"
          description="Manage Encotec's hero banner tagline, headline, description, primary and secondary CTA links, projects delivery badge, and stat cards. Add or remove stats dynamically."
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
              {/* Tagline & Headline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                <div className="col-span-2">
                  <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2 mb-2 flex items-center gap-2">
                    Hero Text Content
                  </h3>
                </div>

                <InputField
                  label="Tagline Label"
                  name="tagline"
                  value={formData.tagline || ""}
                  onChange={handleChange}
                  placeholder="e.g. Global Energy Stewardship"
                  required
                  containerClassName="col-span-2"
                />

                <InputField
                  label="Headline Title 1"
                  name="headlineLine1"
                  value={formData.headlineLine1 || ""}
                  onChange={handleChange}
                  placeholder="e.g. A passion for excellence"
                  required
                />
                <InputField
                  label="Heading Highlight (renders in brand pink)"
                  name="headlineHighlight"
                  value={formData.headlineHighlight || ""}
                  onChange={handleChange}
                  placeholder="Your Assets. Our"
                  required
                />

                <InputField
                  label="Main Headline Title"
                  name="headlineLine2"
                  value={formData.headlineLine2 || ""}
                  onChange={handleChange}
                  placeholder="End-to-End Solutions for a Global Future"
                  containerClassName="col-span-2"
                  required
                />

                <TextAreaField
                  label="Hero Description Subtitle"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  placeholder="Describe Encotec's corporate owner mindset..."
                  containerClassName="col-span-2"
                  rows={3}
                  required
                />
              </div>

              {/* Call to Actions (Buttons) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2">
                    Call to Action Buttons
                  </h3>
                </div>

                <div className="border border-gray-50 bg-gray-50/20 rounded-2xl p-5 flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Primary CTA (Pink Filled Style)
                  </h4>
                  <InputField
                    label="Button Label"
                    name="primaryBtnLabel"
                    value={formData.primaryBtnLabel || ""}
                    onChange={handleChange}
                    placeholder="e.g. Our Services"
                  />
                  <InputField
                    label="Destination URL / Route"
                    name="primaryBtnUrl"
                    value={formData.primaryBtnUrl || ""}
                    onChange={handleChange}
                    placeholder="e.g. /services"
                  />
                </div>

                <div className="border border-gray-50 bg-gray-50/20 rounded-2xl p-5 flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Secondary CTA (Outline Style)
                  </h4>
                  <InputField
                    label="Button Label"
                    name="secondaryBtnLabel"
                    value={formData.secondaryBtnLabel || ""}
                    onChange={handleChange}
                    placeholder="e.g. View Case Studies"
                  />
                  <InputField
                    label="Destination URL / Route"
                    name="secondaryBtnUrl"
                    value={formData.secondaryBtnUrl || ""}
                    onChange={handleChange}
                    placeholder="e.g. /insights"
                  />
                </div>
              </div>

              {/* Service Tags */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#a0004f]" />
                  Service Tags
                </h3>

                <div className="flex flex-wrap gap-2.5 bg-gray-50/50 p-4 border border-gray-100 rounded-2xl min-h-[50px] items-center">
                  {formData.serviceTags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-white border border-gray-200 text-gray-700 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-gray-400 hover:text-red-500 p-0.5 rounded-full hover:bg-gray-50 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  {formData.serviceTags.length === 0 && (
                    <p className="text-xs text-gray-400 font-medium italic">
                      No service tags added yet.
                    </p>
                  )}
                </div>

                <div className="flex gap-3 w-full mt-1">
                  <input
                    type="text"
                    value={newTagText}
                    onChange={(e) => setNewTagText(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    placeholder="Add tag (e.g. COMMISSIONING)"
                    className="flex-1 px-6 py-4 bg-white border border-gray-200 text-sm rounded-2xl focus:ring-2 focus:outline-none focus:border-[#a0004f] focus:ring-1 focus:ring-[#a0004f] outline-none text-gray-800 transition-all"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs px-6 rounded-2xl transition-colors flex items-center gap-2 shadow-md active:scale-95 cursor-pointer"
                  >
                    Add Tag
                  </button>
                </div>
              </div>

              {/* Projects Badge */}
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  Projects Delivered Badge
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Badge Value"
                    name="projectsBadgeNumber"
                    value={formData.projectsBadgeNumber || ""}
                    onChange={handleChange}
                    placeholder="e.g. 150+"
                  />
                  <InputField
                    label="Badge Label"
                    name="projectsBadgeLabel"
                    value={formData.projectsBadgeLabel || ""}
                    onChange={handleChange}
                    placeholder="e.g. Projects Delivered"
                  />
                </div>
              </div>

              <ImagePickerField
                label="Hero Background Image"
                sublabel="Selected Image Asset"
                value={selectedImage}
                onChange={setSelectedImage}
              />

              {/* Stats Row — Dynamic Array */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-500" />
                    Hero Stat Cards <span className="text-emerald-600 font-semibold">({statsList.length})</span>
                  </h3>
                  <button
                    type="button"
                    onClick={addStatCard}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold active:scale-95 transition-all shadow-sm cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Stat Card</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {statsList.map((stat, idx) => (
                    <div key={idx} className="border border-gray-200 p-4 rounded-2xl bg-gray-50/20 flex flex-col gap-3 relative shadow-sm group">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                          Stat Card {idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteStatCard(idx)}
                          className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                          title="Delete Stat Card"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <InputField
                        label="Value"
                        name={`statValue-${idx}`}
                        value={stat.value}
                        onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                        placeholder="e.g. 2011"
                        required
                      />
                      <InputField
                        label="Label"
                        name={`statLabel-${idx}`}
                        value={stat.label}
                        onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                        placeholder="e.g. FOUNDED YEAR"
                        required
                      />
                    </div>
                  ))}
                </div>
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
