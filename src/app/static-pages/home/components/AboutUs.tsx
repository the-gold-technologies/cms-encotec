"use client";

import { useState, useRef, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import {
  CloudUpload,
  Trash2,
  Link,
  Image as ImageIcon,
  Plus,
  X,
  Calendar,
  Globe,
  Users,
  Zap,
  Sparkles,
  Award,
} from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { TextAreaField } from "@/components/TextAreaField";
import { uploadFiles } from "@/lib/uploadHelpers";
import { SectionHeader } from "@/components/SectionHeader";

interface StatItem {
  value: string;
  label: string;
  icon: string;
}

const defaultFormData = {
  sectionNumber: "02",
  upperTag: "About Us",
  headingLabel: "Human-Centric Engineering",
  headingItalicHighlight: "Since 2011",
  paragraphs: [
    "Encotec Energy brings an owner's mindset to every project. Founded in 2011, we have grown into a 600+ industry specialist operating across 13+ key locations.",
    "From thermal power plants to cutting-edge solar installations, our engineering DNA drives precision, reliability, and sustainable outcomes for clients worldwide.",
  ] as string[],
  ctaLabel: "Learn More",
  ctaUrl: "#",
  image:
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000",
  imageAlt: "Engineer working on advanced equipment",
  badgeValue: "Est. 2011",
  badgeLabel: "Pioneering Energy",
  badgeIcon: "Zap",
  stats: [
    { value: "2011", label: "FOUNDED YEAR", icon: "Calendar" },
    { value: "13+", label: "KEY LOCATIONS", icon: "Globe" },
    { value: "1800+", label: "MANPOWER", icon: "Users" },
    { value: "20+ GW", label: "POWER CAPACITY O&M EXECUTED", icon: "Zap" },
  ] as StatItem[],
  bannerHeading: "Experience Global Engineering Excellence.",
  bannerDescription:
    "From India to Global, see how we are setting new standards in power infrastructure.",
  bannerButtonLabel: "View Our Global Reach",
  bannerButtonUrl: "/contact",
};

const mergeDefaults = (data: any) => {
  const merged = { ...defaultFormData, ...data };
  if (!merged.paragraphs || !Array.isArray(merged.paragraphs)) {
    merged.paragraphs = [...defaultFormData.paragraphs];
  }
  if (!merged.stats || !Array.isArray(merged.stats)) {
    merged.stats = defaultFormData.stats.map((s) => ({ ...s }));
  } else {
    const statsArray = [...merged.stats];
    while (statsArray.length < 4) {
      const def = defaultFormData.stats[statsArray.length] || {
        value: "",
        label: "",
        icon: "Zap",
      };
      statsArray.push({ ...def });
    }
    merged.stats = statsArray;
  }
  return merged;
};

interface AboutUsProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function AboutUs({
  sectionId,
  initialData,
  saveUrl = "/api/home",
  responseKey = "AboutUs",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: AboutUsProps) {
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
  const [selectedImage, setSelectedImage] = useState<File | string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      const data = mergeDefaults(initialData);
      setFormData(data);
      if (data.image) {
        setSelectedImage(data.image);
      }
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey
            ? json.data?.[responseKey]
            : json.data;
          if (json.success && sectionData) {
            const data = mergeDefaults(sectionData);
            setFormData(data);
            if (data.image) {
              setSelectedImage(data.image);
            }
          } else {
            setSelectedImage(defaultFormData.image);
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

  const handleParagraphChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newParas = [...prev.paragraphs];
      newParas[index] = value;
      return { ...prev, paragraphs: newParas };
    });
  };

  const addParagraph = () => {
    setFormData((prev) => ({
      ...prev,
      paragraphs: [...prev.paragraphs, ""],
    }));
  };

  const removeParagraph = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      paragraphs: prev.paragraphs.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleStatChange = (
    index: number,
    key: keyof StatItem,
    val: string,
  ) => {
    setFormData((prev) => {
      const newStats = prev.stats.map((s, idx) =>
        idx === index ? { ...s, [key]: val } : s,
      );
      return { ...prev, stats: newStats };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.headingLabel?.trim()) errs.push("Heading is required");
    if (!formData.upperTag?.trim()) errs.push("Tag label is required");
    if (formData.paragraphs.some((p) => !p.trim()))
      errs.push("Paragraphs cannot be empty");

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving About section...");
    try {
      let finalImageUrl = formData.image;
      if (selectedImage instanceof File) {
        const uploaded = await uploadFiles([selectedImage]);
        if (uploaded[0]) {
          finalImageUrl = uploaded[0];
        }
      } else if (typeof selectedImage === "string") {
        finalImageUrl = selectedImage;
      }

      const payload = {
        ...formData,
        image: finalImageUrl,
      };

      const body = sectionId
        ? { id: sectionId, content: payload }
        : { section: responseKey ?? "AboutUs", content: payload };

      const res = await fetch(sectionId ? `/api/sections` : saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("About Us section saved successfully!", { id: toastId });
        setSelectedImage(finalImageUrl);
        setFormData(payload);
        if (onSave) onSave(payload as unknown as Record<string, unknown>);
      } else {
        toast.error(json.error || "Save failed. Please try again.", {
          id: toastId,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const previewSrc =
    selectedImage instanceof File
      ? URL.createObjectURL(selectedImage)
      : selectedImage;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Calendar":
        return <Calendar className="w-4 h-4 text-[#a0004f]/60" />;
      case "Globe":
        return <Globe className="w-4 h-4 text-[#a0004f]/60" />;
      case "Users":
        return <Users className="w-4 h-4 text-[#a0004f]/60" />;
      case "Zap":
        return <Zap className="w-4 h-4 text-[#a0004f]/60" />;
      default:
        return <Zap className="w-4 h-4 text-[#a0004f]/60" />;
    }
  };

  return (
    <section>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="About Us Section"
          description="Manage Encotec's featured story, key stats (values and icons), the Est. 2011 badge overlay, and the Global Footprint CTA banner."
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
              <div className="flex flex-col gap-8 w-full">
                {/* 1. Header Copy & Titles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl">
                  <div className="col-span-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100/60 pb-2 mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#a0004f]" />
                      About Us Header Copy
                    </h4>
                  </div>
                  <InputField
                    label="Section Order Code"
                    name="sectionNumber"
                    value={formData.sectionNumber || ""}
                    onChange={handleChange}
                    placeholder="e.g. 02"
                    tooltip="The sequence step number printed at the top header (e.g. 01, 02)"
                  />
                  <InputField
                    label="Upper Tag Label"
                    name="upperTag"
                    value={formData.upperTag || ""}
                    onChange={handleChange}
                    placeholder="e.g. About Us"
                    required
                  />
                  <InputField
                    label="Heading Regular Title"
                    name="headingLabel"
                    value={formData.headingLabel || ""}
                    onChange={handleChange}
                    placeholder="e.g. Human-Centric Engineering"
                    required
                  />
                  <InputField
                    label="Heading Pink Highlighted Title"
                    name="headingItalicHighlight"
                    value={formData.headingItalicHighlight || ""}
                    onChange={handleChange}
                    placeholder="e.g. Since 2011"
                    required
                  />
                </div>

                {/* 2. Story Paragraphs Editor */}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Story Paragraphs
                    </h4>
                    <button
                      type="button"
                      onClick={addParagraph}
                      className="text-xs text-[#a0004f] hover:text-[#80003f] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Paragraph
                    </button>
                  </div>

                  <div className="flex flex-col gap-4">
                    {formData.paragraphs.map((para, i) => (
                      <div
                        key={i}
                        className="relative flex flex-col gap-1.5 bg-gray-50/30 border border-gray-50 p-4 rounded-2xl group"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Paragraph {i + 1}
                          </span>
                          {formData.paragraphs.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeParagraph(i)}
                              className="text-gray-400 hover:text-red-500 p-1 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                              title="Delete Paragraph"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <TextAreaField
                          name={`paragraph-${i}`}
                          value={para}
                          onChange={(e) =>
                            handleParagraphChange(i, e.target.value)
                          }
                          placeholder={`Type paragraph ${i + 1} content here...`}
                          rows={3}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Learn More CTA Link */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/20 border border-gray-105 rounded-2xl p-5">
                  <div className="col-span-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100/60 pb-2">
                      <Link className="w-3.5 h-3.5 text-[#a0004f]" />
                      Learn More CTA Button Link
                    </h4>
                  </div>
                  <InputField
                    label="Link Button Label"
                    name="ctaLabel"
                    value={formData.ctaLabel || ""}
                    onChange={handleChange}
                    placeholder="e.g. Learn More"
                  />
                  <InputField
                    label="Link Button Destination URL"
                    name="ctaUrl"
                    value={formData.ctaUrl || ""}
                    onChange={handleChange}
                    placeholder="e.g. /about"
                  />
                </div>

                {/* 4. Showcase Image — Full Width */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#a0004f]" />
                    Showcase Right Image
                  </h4>

                  {selectedImage ? (
                    <div className="w-full flex items-center justify-between p-4 px-5 bg-gray-50 border border-gray-200 rounded-2xl mt-1 group hover:bg-gray-100/60 transition-all">
                      <div className="flex items-center gap-4 min-w-0">
                        <img
                          src={previewSrc}
                          alt="images"
                          className="w-10 h-10 rounded-xl text-[#a0004f]"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate max-w-xs">
                            {typeof selectedImage === "string"
                              ? selectedImage.split("/").pop() ||
                                "About Showcase Image"
                              : selectedImage.name}
                          </p>
                          <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                            {typeof selectedImage === "string"
                              ? "Cloudinary · Remote"
                              : selectedImage.size
                                ? `Local · ${(selectedImage.size / 1024 / 1024).toFixed(2)} MB`
                                : "Local file"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-[11px] font-bold rounded-xl shadow-sm transition-all cursor-pointer hover:bg-gray-50"
                        >
                          <CloudUpload className="w-3.5 h-3.5" />
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedImage("")}
                          className="p-2 bg-white border border-gray-200 hover:border-red-200 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                          title="Remove Image"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-gray-200 hover:border-[#a0004f]/50 bg-gray-50/50 hover:bg-gray-100/50 rounded-2xl flex flex-col items-center justify-center p-10 text-center cursor-pointer transition-all group mt-1"
                      style={{ minHeight: 160 }}
                    >
                      <div className="p-3 rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 mb-3 group-hover:scale-105 transition-transform">
                        <CloudUpload className="w-7 h-7 text-gray-400 group-hover:text-[#a0004f] transition-colors" />
                      </div>
                      <p className="text-sm text-gray-600 font-medium mb-1">
                        <span className="text-[#D3AF37] font-semibold hover:underline">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-400 font-medium">
                        PNG, JPG, WEBP (Recommended 1000×620px)
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

                  <InputField
                    label="Image SEO Alt Tag"
                    name="imageAlt"
                    value={formData.imageAlt || ""}
                    onChange={handleChange}
                    placeholder="e.g. Engineer working on advanced equipment"
                    containerClassName="mt-1"
                  />
                </div>

                {/* Est. Badge Overlay — Full Width */}
                <div className="border border-gray-100 p-5 rounded-2xl bg-gray-50/20 flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    Est. Badge Overlay
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField
                      label="Badge Value Text"
                      name="badgeValue"
                      value={formData.badgeValue || ""}
                      onChange={handleChange}
                      placeholder="e.g. Est. 2011"
                    />
                    <InputField
                      label="Badge Label / Subtext"
                      name="badgeLabel"
                      value={formData.badgeLabel || ""}
                      onChange={handleChange}
                      placeholder="e.g. Pioneering Energy"
                    />
                    <div className="flex flex-col gap-1.5 px-0.5">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-4">
                        Badge Icon
                      </label>
                      <div className="relative w-full">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          {renderIcon(formData.badgeIcon)}
                        </div>
                        <select
                          name="badgeIcon"
                          value={formData.badgeIcon || "Zap"}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              badgeIcon: e.target.value,
                            }))
                          }
                          className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:outline-none focus:border-[#a0004f] focus:ring-1 focus:ring-[#a0004f] outline-none transition-all text-gray-800 appearance-none cursor-pointer"
                        >
                          <option value="Calendar">Calendar Icon</option>
                          <option value="Globe">Globe Icon</option>
                          <option value="Users">Users Icon</option>
                          <option value="Zap">Zap (Lightning) Icon</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Stats Grid (4 Items) */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
                    Stats Grid (4 Items)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    {formData.stats.map((stat, i) => (
                      <div
                        key={i}
                        className="border border-gray-100 p-4 rounded-2xl bg-gray-50/20 flex flex-col gap-3 relative group"
                      >
                        <span className="text-[10px] font-bold text-[#a0004f]/60 uppercase tracking-widest">
                          Stat Card {i + 1}
                        </span>
                        <InputField
                          label="Stat Value"
                          value={stat.value}
                          onChange={(e) =>
                            handleStatChange(i, "value", e.target.value)
                          }
                          placeholder="e.g. 1800+"
                        />
                        <InputField
                          label="Stat Label"
                          value={stat.label}
                          onChange={(e) =>
                            handleStatChange(i, "label", e.target.value)
                          }
                          placeholder="e.g. INDUSTRY SPECIALISTS"
                        />
                        <div className="flex flex-col gap-1 px-0.5">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-2">
                            Icon Selector
                          </label>
                          <div className="relative w-full">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                              {renderIcon(stat.icon)}
                            </div>
                            <select
                              value={stat.icon}
                              onChange={(e) =>
                                handleStatChange(i, "icon", e.target.value)
                              }
                              className="w-full pl-9 pr-6 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:ring-1 focus:outline-none focus:border-[#a0004f] focus:ring-[#a0004f] outline-none text-gray-800 appearance-none cursor-pointer"
                            >
                              <option value="Calendar">Calendar</option>
                              <option value="Globe">Globe</option>
                              <option value="Users">Users</option>
                              <option value="Zap">Zap</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. Global Footprint CTA Banner */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl">
                  <div className="col-span-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-2 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-sky-500" />
                      Global Footprint CTA Banner Form
                    </h4>
                  </div>
                  <InputField
                    label="Banner Headline"
                    name="bannerHeading"
                    value={formData.bannerHeading || ""}
                    onChange={handleChange}
                    placeholder="e.g. Experience Global Engineering Excellence."
                    containerClassName="col-span-2"
                  />
                  <TextAreaField
                    label="Banner Description"
                    name="bannerDescription"
                    value={formData.bannerDescription || ""}
                    onChange={handleChange}
                    placeholder="e.g. From India to Turkey, see how we are setting new standards..."
                    containerClassName="col-span-2"
                    rows={2}
                  />
                  <InputField
                    label="Banner Button Label"
                    name="bannerButtonLabel"
                    value={formData.bannerButtonLabel || ""}
                    onChange={handleChange}
                    placeholder="e.g. View Our Global Reach"
                  />
                  <InputField
                    label="Banner Button Redirect Route"
                    name="bannerButtonUrl"
                    value={formData.bannerButtonUrl || ""}
                    onChange={handleChange}
                    placeholder="e.g. /contact"
                  />
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
