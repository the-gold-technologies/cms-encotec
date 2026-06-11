"use client";

import { useState, useRef, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import {
  CloudUpload,
  X,
  Trash2,
  Tag,
  BarChart3,
  Award,
} from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { TextAreaField } from "@/components/TextAreaField";
import { uploadFiles } from "@/lib/uploadHelpers";
import { SectionHeader } from "@/components/SectionHeader";

const defaultFormData = {
  tagline: "Global Energy Stewardship",
  headlineLine1: "Your Assets. Our Stewardship. End-to-End Solutions for a Global Future",
  headlineHighlight: "Stewardship.",
  description: 'We are more than consultants; we are your partners in progress. By adopting an "Owner\'s Mindset," we take total responsibility for your infrastructure — from the first feasibility study to long-term operational excellence.',
  primaryBtnLabel: "Our Services",
  primaryBtnUrl: "/services",
  secondaryBtnLabel: "View Case Studies",
  secondaryBtnUrl: "/insights",
  serviceTags: ["STEWARDSHIP", "COMMISSIONING", "ADVISORY", "GLOBAL SOURCING"] as string[],
  projectsBadgeNumber: "150+",
  projectsBadgeLabel: "Projects Delivered",
  stat1Value: "2011",
  stat1Label: "FOUNDED YEAR",
  stat2Value: "13+",
  stat2Label: "CITIES IN INDIA",
  stat3Value: "300+",
  stat3Label: "SPECIALIZED ENGINEERS",
  stat4Value: "8000+",
  stat4Label: "MW UNDER STEWARDSHIP",
  backgroundImage: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1200",
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
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (val: any) => {
    if (controlledOnToggle) {
      controlledOnToggle();
    } else {
      setInternalIsOpen(typeof val === "function" ? val(internalIsOpen) : val);
    }
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [selectedImage, setSelectedImage] = useState<File | string>("");
  const [newTagText, setNewTagText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      const merged = { ...defaultFormData, ...initialData };
      setFormData(merged);
      if (merged.backgroundImage) setSelectedImage(merged.backgroundImage);
    } else if (saveUrl === "/api/home") {
      fetchWithCache("/api/home")
        .then((json) => {
          if (json.success && json.data?.HeroSection) {
            const data = { ...defaultFormData, ...json.data.HeroSection };
            setFormData(data);
            if (data.backgroundImage) setSelectedImage(data.backgroundImage);
          } else {
            setSelectedImage(defaultFormData.backgroundImage);
          }
        })
        .catch(console.error);
    }
  }, [initialData, saveUrl]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setSelectedImage("");
  };

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

    if (errs.length > 0) {
      errs.forEach((m) => toast.error(m));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Home Hero section...");
    try {
      const uploadedUrls = await uploadFiles([selectedImage]);
      const imgUrl = selectedImage instanceof File ? uploadedUrls[0] || "" : selectedImage;

      const payload = {
        ...formData,
        backgroundImage: imgUrl,
      };

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

  const preview = selectedImage instanceof File ? URL.createObjectURL(selectedImage) : selectedImage;
  const imageName = typeof selectedImage === "string" ? selectedImage.split("/").pop() || "Background Image" : selectedImage?.name;

  return (
    <section>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="Home Hero Section"
          description="Manage Encotec's hero banner tagline, headline, description, primary and secondary CTA links, projects delivery badge, and foundation year stats."
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
                />

                <InputField
                  label="Heading Highlight (renders in brand pink)"
                  name="headlineHighlight"
                  value={formData.headlineHighlight || ""}
                  onChange={handleChange}
                  placeholder="e.g. Stewardship."
                  required
                />

                <TextAreaField
                  label="Main Headline Title"
                  name="headlineLine1"
                  value={formData.headlineLine1 || ""}
                  onChange={handleChange}
                  placeholder="e.g. Your Assets. Our Stewardship. End-to-End Solutions..."
                  containerClassName="col-span-2"
                  rows={2}
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

              {/* Projects Badge & Background Image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    Projects Delivered Badge
                  </h3>
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

                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2 flex items-center gap-2">
                    Hero Background Image
                  </h3>
                  {preview ? (
                    <div className="flex items-center justify-between p-3.5 px-5 bg-white border border-gray-200 rounded-2xl transition-all hover:bg-gray-50/50 mt-1">
                      <div className="flex items-center gap-3.5 text-gray-700">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-200 border border-gray-300/40 relative flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={preview} alt="Hero Background" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-gray-900 truncate max-w-[200px]">
                            {imageName}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-1.5 rounded-xl text-[10px] font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="text-red-500 hover:text-red-600 p-2 bg-red-50 hover:bg-red-100 rounded-xl transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-gray-200 hover:border-blue-500 bg-white hover:bg-blue-50/10 rounded-2xl flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all group mt-1"
                    >
                      <CloudUpload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors mb-2" />
                      <p className="text-xs text-gray-500 font-semibold group-hover:text-blue-600">
                        Drag and drop image here, or <span className="text-blue-500 hover:underline">browse</span>
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-500" />
                  Hero Stats Row (4 Items)
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Stat 1 */}
                  <div className="border border-gray-100 p-4 rounded-2xl bg-gray-50/20 flex flex-col gap-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stat 1</span>
                    <InputField label="Value" name="stat1Value" value={formData.stat1Value} onChange={handleChange} placeholder="e.g. 2011" />
                    <InputField label="Label" name="stat1Label" value={formData.stat1Label} onChange={handleChange} placeholder="e.g. FOUNDED YEAR" />
                  </div>
                  {/* Stat 2 */}
                  <div className="border border-gray-100 p-4 rounded-2xl bg-gray-50/20 flex flex-col gap-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stat 2</span>
                    <InputField label="Value" name="stat2Value" value={formData.stat2Value} onChange={handleChange} placeholder="e.g. 13+" />
                    <InputField label="Label" name="stat2Label" value={formData.stat2Label} onChange={handleChange} placeholder="e.g. CITIES IN INDIA" />
                  </div>
                  {/* Stat 3 */}
                  <div className="border border-gray-100 p-4 rounded-2xl bg-gray-50/20 flex flex-col gap-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stat 3</span>
                    <InputField label="Value" name="stat3Value" value={formData.stat3Value} onChange={handleChange} placeholder="e.g. 300+" />
                    <InputField label="Label" name="stat3Label" value={formData.stat3Label} onChange={handleChange} placeholder="e.g. SPECIALIZED ENGINEERS" />
                  </div>
                  {/* Stat 4 */}
                  <div className="border border-gray-100 p-4 rounded-2xl bg-gray-50/20 flex flex-col gap-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stat 4</span>
                    <InputField label="Value" name="stat4Value" value={formData.stat4Value} onChange={handleChange} placeholder="e.g. 8000+" />
                    <InputField label="Label" name="stat4Label" value={formData.stat4Label} onChange={handleChange} placeholder="e.g. MW UNDER STEWARDSHIP" />
                  </div>
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
