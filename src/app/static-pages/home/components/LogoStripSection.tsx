"use client";

import { useState, useEffect, useRef } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { uploadFiles } from "@/app/lib/uploadHelpers";
import { X, Upload, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";

export interface LogoItem {
  name: string;
  image: File | string;
}

const defaultFormData = {
  tagline: "Trusted by Industry Leaders",
  logos: [] as Array<LogoItem>,
};

const isImageUrl = (val: any): boolean => {
  if (typeof val !== "string") return false;
  return (
    val.startsWith("http://") ||
    val.startsWith("https://") ||
    val.startsWith("/") ||
    val.startsWith("data:image/") ||
    /\.(png|jpe?g|svg|webp|gif)$/i.test(val)
  );
};

const mergeDefaults = (data: any) => {
  const merged = { ...defaultFormData, ...data };
  if (Array.isArray(merged.logos)) {
    // Strictly filter out text-only strings so ONLY logo image objects or URLs remain
    merged.logos = merged.logos
      .map((item: any) => {
        if (typeof item === "object" && item !== null && item.image) return item;
        if (typeof item === "string" && isImageUrl(item)) return { name: "Client Logo", image: item };
        return null;
      })
      .filter(Boolean);
  } else {
    merged.logos = [];
  }
  return merged;
};

interface LogoStripSectionProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function LogoStripSection({
  sectionId,
  initialData,
  saveUrl = "/api/home",
  responseKey = "LogoStripSection",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: LogoStripSectionProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (val: any) => {
    if (controlledOnToggle) {
      controlledOnToggle();
    } else {
      setInternalIsOpen(typeof val === "function" ? val(internalIsOpen) : val);
    }
  };

  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(mergeDefaults(initialData));
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey ? json.data?.[responseKey] : json.data;
          if (json.success && sectionData) {
            setFormData(mergeDefaults(sectionData));
          }
        })
        .catch(console.error);
    }
  }, [initialData, saveUrl, responseKey]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection (uploading logo images)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newItems: LogoItem[] = files.map((file) => ({
      name: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      image: file,
    }));

    setFormData((prev) => ({
      ...prev,
      logos: [...prev.logos, ...newItems],
    }));

    toast.success(`Added ${files.length} logo image(s)! Click Save to publish.`);
    e.target.value = "";
  };

  const removeLogo = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      logos: prev.logos.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.tagline?.trim()) errs.push("Tagline is required");

    if (errs.length > 0) {
      errs.forEach((m) => toast.error(m));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Client Logo Images...");

    try {
      // 1. Upload any File objects in logos
      const filesToUpload: (File | string | null)[] = [];
      formData.logos.forEach((item) => {
        if (typeof item === "object" && item !== null) {
          filesToUpload.push(
            (item as any).image instanceof File
              ? (item as any).image
              : typeof (item as any).image === "string"
              ? (item as any).image
              : null
          );
        } else {
          filesToUpload.push(null);
        }
      });

      const uploadedUrls = await uploadFiles(filesToUpload);

      // 2. Build final logos payload with uploaded URLs
      const finalLogos = formData.logos
        .map((item, idx) => {
          const uploadedUrl = uploadedUrls[idx];
          const img = uploadedUrl || (typeof (item as any).image === "string" ? (item as any).image : "");
          if (img) {
            return {
              name: (item as any).name || "Client Logo",
              image: img,
            };
          }
          return null;
        })
        .filter(Boolean);

      const updatedFormData = {
        ...formData,
        logos: finalLogos,
      };

      const body = sectionId
        ? { id: sectionId, content: updatedFormData }
        : { section: responseKey ?? "LogoStripSection", content: updatedFormData };

      const res = await fetch(sectionId ? `/api/sections` : saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Client Logos saved successfully!", { id: toastId });
        setFormData(updatedFormData as any);
        if (onSave) onSave(updatedFormData as unknown as Record<string, unknown>);
      } else {
        toast.error(json.error || "Save failed.", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network upload error.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const getLogoPreview = (item: LogoItem): string => {
    if (item && item.image) {
      if (item.image instanceof File) return URL.createObjectURL(item.image);
      if (typeof item.image === "string") return item.image;
    }
    return "";
  };

  return (
    <section>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="Clients & Brands Logo Strip"
          description="Upload client brand logo images for the scrolling ticker."
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
              
              <InputField
                label="Strip Header Tagline"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="e.g. Trusted by Industry Leaders"
                required
              />

              {/* Upload Logo Images Zone */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[#a0004f]" />
                    Upload Client Logo Images
                  </h3>
                  {formData.logos.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, logos: [] }))}
                      className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Clear All Logos
                    </button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 hover:border-[#a0004f] bg-gray-50/50 hover:bg-pink-50/10 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all text-center group"
                >
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center mb-3 text-gray-400 group-hover:text-[#a0004f] group-hover:scale-110 transition-all">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-gray-700 group-hover:text-[#a0004f]">
                    Click or drag & drop to upload logo images
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Upload multiple PNG, SVG, JPG or WEBP logo files
                  </p>
                </div>
              </div>

              {/* Uploaded Logos Preview Grid */}
              {formData.logos.length > 0 && (
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Uploaded Logos ({formData.logos.length})
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 bg-gray-50/50 p-4 border border-gray-100 rounded-2xl">
                    {formData.logos.map((item, index) => {
                      const preview = getLogoPreview(item);
                      const name = item.name || "Client Logo";

                      return (
                        <div
                          key={index}
                          className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-between gap-2 shadow-sm relative group hover:border-[#a0004f]/40 transition-all"
                        >
                          <button
                            type="button"
                            onClick={() => removeLogo(index)}
                            className="absolute top-1.5 right-1.5 text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors cursor-pointer opacity-70 group-hover:opacity-100"
                            title="Remove logo"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>

                          <div className="w-full h-16 flex items-center justify-center p-1 bg-gray-50/50 rounded-lg">
                            {preview ? (
                              <img
                                src={preview}
                                alt={name}
                                className="max-h-14 max-w-full object-contain"
                              />
                            ) : (
                              <span className="text-xs font-bold text-gray-400 text-center px-1">
                                {name}
                              </span>
                            )}
                          </div>

                          <span className="text-[11px] font-semibold text-gray-700 truncate w-full text-center" title={name}>
                            {name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

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
