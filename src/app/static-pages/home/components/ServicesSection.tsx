"use client";

import { useState, useRef, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import {
  ClipboardCheck,
  Network,
  Flame,
  Search,
  Wrench,
  CloudUpload,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { TextAreaField } from "@/components/TextAreaField";
import { uploadFiles } from "@/lib/uploadHelpers";
import { SectionHeader } from "@/components/SectionHeader";

interface ServiceItem {
  title: string;
  description: string;
  icon: string;
  image: string;
  ctaLabel: string;
  ctaUrl: string;
}

const defaultFormData = {
  tagline: "Our Services",
  heading: "Integrated Solutions Across the Asset Lifecycle",
  description:
    "We bridge the gap between technical complexity and commercial success. Whether you are conceptualizing a new plant or optimizing an existing one, we provide the end-to-end expertise required to keep your world running.",
  services: [
    {
      title: "Project Conceptualisation & Development",
      description:
        "From pre-feasibility and financial assessments to finalizing EPC contractors and developing technical specifications.",
      icon: "ClipboardCheck",
      image:
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800",
      ctaLabel: "Learn More",
      ctaUrl: "/services",
    },
    {
      title: "Construction, Commissioning & Relocation",
      description:
        "Expert installation of complex power and process industries, including specialized asset shifting and relocation services across borders.",
      icon: "Network",
      image:
        "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800",
      ctaLabel: "Learn More",
      ctaUrl: "/services",
    },
    {
      title: "Asset Stewardship (O&M)",
      description:
        "Specialized management of thermal power plants, international airports, and critical utilities like STPs.",
      icon: "Flame",
      image:
        "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=800",
      ctaLabel: "Learn More",
      ctaUrl: "/services",
    },
    {
      title: "Expert Advisory & Performance Audits",
      description:
        "High-level problem solving, energy efficiency audits, and specialized testing (NDT) for operational plants.",
      icon: "Search",
      image:
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800",
      ctaLabel: "Learn More",
      ctaUrl: "/services",
    },
    {
      title: "Global Trading & Spare Parts",
      description:
        "Strategic sourcing of critical equipment and spares from major OEMs in China, Vietnam, Korea, and India.",
      icon: "Wrench",
      image:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
      ctaLabel: "Learn More",
      ctaUrl: "/services",
    },
  ] as ServiceItem[],
};

const mergeDefaults = (data: any) => {
  const merged = { ...defaultFormData, ...data };
  if (!merged.services || !Array.isArray(merged.services)) {
    merged.services = defaultFormData.services.map((s) => ({ ...s }));
  } else {
    const arr = [...merged.services];
    while (arr.length < 5) {
      const def = defaultFormData.services[arr.length] || {
        title: "",
        description: "",
        icon: "Wrench",
        image: "",
        ctaLabel: "",
        ctaUrl: "",
      };
      arr.push({ ...def });
    }
    merged.services = arr.slice(0, 5);
  }
  return merged;
};

interface ServicesSectionProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function ServicesSection({
  sectionId,
  initialData,
  saveUrl = "/api/home",
  responseKey = "ServicesSection",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: ServicesSectionProps) {
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
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData(mergeDefaults(initialData));
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey
            ? json.data?.[responseKey]
            : json.data;
          if (json.success && sectionData) {
            setFormData(mergeDefaults(sectionData));
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

  const handleCardChange = (
    index: number,
    key: keyof ServiceItem,
    value: string,
  ) => {
    setFormData((prev) => {
      const updated = prev.services.map((s, idx) =>
        idx === index ? { ...s, [key]: value } : s,
      );
      return { ...prev, services: updated };
    });
  };

  const handleFileChange = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const toastId = toast.loading(
        `Uploading image for Service ${index + 1}...`,
      );
      try {
        const urls = await uploadFiles([file]);
        if (urls[0]) {
          handleCardChange(index, "image", urls[0]);
          toast.success("Image uploaded successfully!", { id: toastId });
        }
      } catch (err) {
        console.error(err);
        toast.error("Upload failed.", { id: toastId });
      }
    }
  };

  const handleDrop = async (index: number, e: React.DragEvent) => {
    e.preventDefault();
    setDraggingIdx(null);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const toastId = toast.loading(
        `Uploading image for Service ${index + 1}...`,
      );
      try {
        const urls = await uploadFiles([file]);
        if (urls[0]) {
          handleCardChange(index, "image", urls[0]);
          toast.success("Image uploaded!", { id: toastId });
        }
      } catch (err) {
        console.error(err);
        toast.error("Upload failed.", { id: toastId });
      }
    }
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.tagline?.trim()) errs.push("Tagline is required");
    if (!formData.heading?.trim()) errs.push("Heading is required");
    if (
      formData.services.some((s) => !s.title?.trim() || !s.description?.trim())
    ) {
      errs.push("All service titles and descriptions must be filled");
    }

    if (errs.length > 0) {
      errs.forEach((m) => toast.error(m));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Services section...");
    try {
      const body = sectionId
        ? { id: sectionId, content: formData }
        : { section: responseKey ?? "ServicesSection", content: formData };

      const res = await fetch(sectionId ? `/api/sections` : saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Services section saved successfully!", { id: toastId });
        if (onSave) onSave(formData as unknown as Record<string, unknown>);
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

  const renderIcon = (name: string) => {
    switch (name) {
      case "ClipboardCheck":
        return <ClipboardCheck className="w-4 h-4 text-[#a0004f]" />;
      case "Network":
        return <Network className="w-4 h-4 text-[#a0004f]" />;
      case "Flame":
        return <Flame className="w-4 h-4 text-[#a0004f]" />;
      case "Search":
        return <Search className="w-4 h-4 text-[#a0004f]" />;
      case "Wrench":
        return <Wrench className="w-4 h-4 text-[#a0004f]" />;
      default:
        return <Wrench className="w-4 h-4 text-[#a0004f]" />;
    }
  };

  return (
    <section>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="Services Section"
          description="Manage Encotec's home lifecycle services including headers, description, and individual service cards."
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
              {/* Header Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl">
                <InputField
                  label="Tagline Label"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="e.g. Our Services"
                  required
                />
                <InputField
                  label="Section Title"
                  name="heading"
                  value={formData.heading}
                  onChange={handleChange}
                  placeholder="e.g. Integrated Solutions Across the Asset Lifecycle"
                  required
                />
                <TextAreaField
                  label="Section Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your services portfolio..."
                  containerClassName="col-span-2"
                  rows={3}
                />
              </div>

              {/* Service Cards */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
                  Service Portfolio Cards (5 Items)
                </h4>
                <div className="grid grid-cols-1 gap-6">
                  {formData.services.map((service, i) => (
                    <div
                      key={i}
                      className="border border-gray-100 p-6 rounded-2xl bg-gray-50/20 flex flex-col gap-5"
                    >
                      {/* Top row: Card label + Title + Icon */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-3">
                          <span className="text-[10px] font-bold text-[#a0004f] uppercase tracking-widest">
                            Service Card {i + 1}
                          </span>
                          <InputField
                            label="Service Title"
                            value={service.title}
                            onChange={(e) =>
                              handleCardChange(i, "title", e.target.value)
                            }
                            placeholder="e.g. Asset Stewardship"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5 px-0.5 justify-end">
                          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-4">
                            Lucide Icon
                          </label>
                          <div className="relative w-full">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                              {renderIcon(service.icon)}
                            </div>
                            <select
                              value={service.icon}
                              onChange={(e) =>
                                handleCardChange(i, "icon", e.target.value)
                              }
                              className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:outline-none focus:border-[#a0004f] focus:ring-1 focus:ring-[#a0004f] outline-none text-gray-800 appearance-none cursor-pointer"
                            >
                              <option value="ClipboardCheck">
                                ClipboardCheck Icon
                              </option>
                              <option value="Network">Network Icon</option>
                              <option value="Flame">Flame Icon</option>
                              <option value="Search">Search Icon</option>
                              <option value="Wrench">Wrench Icon</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Description — full width */}
                      <TextAreaField
                        label="Description Subtext"
                        value={service.description}
                        onChange={(e) =>
                          handleCardChange(i, "description", e.target.value)
                        }
                        placeholder="Describe this service lifecycle stage..."
                        rows={3}
                      />

                      {/* Image Uploader — full width, Hero Style */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-4">
                          Showcase Image
                        </label>

                        {service.image ? (
                          <div className="flex items-center justify-between p-4 px-5 bg-white border border-gray-200 rounded-2xl transition-all hover:bg-gray-50/50 shadow-sm w-full">
                            <div className="flex items-center gap-3.5 text-gray-700 min-w-0">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 border border-gray-300/40 flex-shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={service.image}
                                  alt={service.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-sm font-bold text-gray-900 truncate max-w-xs sm:max-w-md">
                                  {service.image.split("/").pop() ||
                                    "Service Image"}
                                </span>
                                <span className="text-[10px] text-gray-400 font-semibold mt-0.5">
                                  Selected Image Asset
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  fileInputRefs.current[i]?.click()
                                }
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
                              >
                                Change
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCardChange(i, "image", "")}
                                className="text-red-500 hover:text-red-600 p-2 bg-red-50 hover:bg-red-100 rounded-xl transition-all cursor-pointer"
                                title="Remove Image"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => fileInputRefs.current[i]?.click()}
                            onDragOver={(e) => {
                              e.preventDefault();
                              setDraggingIdx(i);
                            }}
                            onDragLeave={() => setDraggingIdx(null)}
                            onDrop={(e) => handleDrop(i, e)}
                            className={`w-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-10 text-center cursor-pointer transition-all group ${
                              draggingIdx === i
                                ? "border-blue-400 bg-blue-50"
                                : "border-gray-200 hover:border-blue-400 bg-white hover:bg-blue-50/10"
                            }`}
                          >
                            <CloudUpload
                              className={`w-9 h-9 mb-3 transition-colors ${
                                draggingIdx === i
                                  ? "text-blue-500"
                                  : "text-gray-400 group-hover:text-blue-500"
                              }`}
                            />
                            <p className="text-sm text-gray-500 font-semibold group-hover:text-blue-600 mb-1">
                              {draggingIdx === i ? (
                                <span className="text-blue-600">
                                  Drop image here
                                </span>
                              ) : (
                                <>
                                  Drag and drop image here, or{" "}
                                  <span className="text-blue-500 hover:underline">
                                    browse
                                  </span>
                                </>
                              )}
                            </p>
                            <p className="text-xs text-gray-400">
                              Supports JPG, PNG, WEBP (Recommended 800×600px)
                            </p>
                          </div>
                        )}

                        <input
                          type="file"
                          ref={(el) => {
                            fileInputRefs.current[i] = el;
                          }}
                          onChange={(e) => handleFileChange(i, e)}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>

                      {/* CTA Section */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                          label="CTA Button Text"
                          value={service.ctaLabel || ""}
                          onChange={(e) =>
                            handleCardChange(i, "ctaLabel", e.target.value)
                          }
                          placeholder="e.g. Learn More"
                        />
                        <InputField
                          label="CTA Button Link (URL)"
                          value={service.ctaUrl || ""}
                          onChange={(e) =>
                            handleCardChange(i, "ctaUrl", e.target.value)
                          }
                          placeholder="e.g. /services"
                        />
                      </div>
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
