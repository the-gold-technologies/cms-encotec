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
  ClipboardCheck,
  Network,
  Flame,
  Search,
  Wrench,
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
}

const defaultFormData = {
  tagline: "Our Services",
  heading: "Integrated Solutions Across the Asset Lifecycle",
  description: "We bridge the gap between technical complexity and commercial success. Whether you are conceptualizing a new plant or optimizing an existing one, we provide the end-to-end expertise required to keep your world running.",
  services: [
    {
      title: "Project Conceptualisation & Development",
      description: "From pre-feasibility and financial assessments to finalizing EPC contractors and developing technical specifications.",
      icon: "ClipboardCheck",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Construction, Commissioning & Relocation",
      description: "Expert installation of complex power and process industries, including specialized asset shifting and relocation services across borders.",
      icon: "Network",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Asset Stewardship (O&M)",
      description: "Specialized management of thermal power plants, international airports, and critical utilities like STPs.",
      icon: "Flame",
      image: "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Expert Advisory & Performance Audits",
      description: "High-level problem solving, energy efficiency audits, and specialized testing (NDT) for operational plants.",
      icon: "Search",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Global Trading & Spare Parts",
      description: "Strategic sourcing of critical equipment and spares from major OEMs in China, Vietnam, Korea, and India.",
      icon: "Wrench",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800"
    }
  ] as ServiceItem[]
};

const mergeDefaults = (data: any) => {
  const merged = { ...defaultFormData, ...data };
  if (!merged.services || !Array.isArray(merged.services)) {
    merged.services = defaultFormData.services.map((s) => ({ ...s }));
  } else {
    const arr = [...merged.services];
    while (arr.length < 5) {
      const def = defaultFormData.services[arr.length] || { title: "", description: "", icon: "Wrench", image: "" };
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
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (index: number, key: keyof ServiceItem, value: string) => {
    setFormData((prev) => {
      const updated = prev.services.map((s, idx) =>
        idx === index ? { ...s, [key]: value } : s
      );
      return { ...prev, services: updated };
    });
  };

  const handleFileChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const toastId = toast.loading(`Uploading image for Service ${index + 1}...`);
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

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.tagline?.trim()) errs.push("Tagline is required");
    if (!formData.heading?.trim()) errs.push("Heading is required");
    if (formData.services.some((s) => !s.title?.trim() || !s.description?.trim())) {
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
      case "ClipboardCheck": return <ClipboardCheck className="w-4 h-4 text-[#a0004f]" />;
      case "Network": return <Network className="w-4 h-4 text-[#a0004f]" />;
      case "Flame": return <Flame className="w-4 h-4 text-[#a0004f]" />;
      case "Search": return <Search className="w-4 h-4 text-[#a0004f]" />;
      case "Wrench": return <Wrench className="w-4 h-4 text-[#a0004f]" />;
      default: return <Wrench className="w-4 h-4 text-[#a0004f]" />;
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
                      className="border border-gray-100 p-6 rounded-2xl bg-gray-50/20 grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
                    >
                      <div className="flex flex-col gap-4">
                        <span className="text-[10px] font-bold text-[#a0004f] uppercase tracking-widest">
                          Service Card {i + 1}
                        </span>
                        <InputField
                          label="Service Title"
                          value={service.title}
                          onChange={(e) => handleCardChange(i, "title", e.target.value)}
                          placeholder="e.g. Asset Stewardship"
                        />
                        <div className="flex flex-col gap-1.5 px-0.5">
                          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-4">
                            Lucide Icon
                          </label>
                          <div className="relative w-full">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                              {renderIcon(service.icon)}
                            </div>
                            <select
                              value={service.icon}
                              onChange={(e) => handleCardChange(i, "icon", e.target.value)}
                              className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:outline-none focus:border-[#a0004f] focus:ring-1 focus:ring-[#a0004f] outline-none text-gray-800 appearance-none cursor-pointer"
                            >
                              <option value="ClipboardCheck">ClipboardCheck Icon</option>
                              <option value="Network">Network Icon</option>
                              <option value="Flame">Flame Icon</option>
                              <option value="Search">Search Icon</option>
                              <option value="Wrench">Wrench Icon</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-2 flex flex-col gap-4">
                        <TextAreaField
                          label="Description Subtext"
                          value={service.description}
                          onChange={(e) => handleCardChange(i, "description", e.target.value)}
                          placeholder="Describe this service lifecycle stage..."
                          rows={3}
                        />

                        {/* Image Uploader & Field */}
                        <div className="flex flex-col gap-2">
                          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-4">
                            Showcase Image URL
                          </label>
                          <div className="flex gap-3 items-center">
                            <input
                              type="text"
                              value={service.image}
                              onChange={(e) => handleCardChange(i, "image", e.target.value)}
                              placeholder="Image path or unsplash url..."
                              className="flex-1 px-6 py-4 bg-white border border-gray-200 text-sm rounded-2xl focus:ring-2 focus:outline-none focus:border-[#a0004f] focus:ring-1 focus:ring-[#a0004f] outline-none text-gray-800 transition-all"
                            />
                            <button
                              type="button"
                              onClick={() => fileInputRefs.current[i]?.click()}
                              className="bg-gray-950 hover:bg-gray-800 text-white font-bold text-xs px-6 py-4 rounded-2xl transition-all cursor-pointer whitespace-nowrap"
                            >
                              Upload File
                            </button>
                            <input
                              type="file"
                              ref={(el) => { fileInputRefs.current[i] = el; }}
                              onChange={(e) => handleFileChange(i, e)}
                              accept="image/*"
                              className="hidden"
                            />
                          </div>
                          {service.image && (
                            <div className="mt-2 w-32 h-20 rounded-lg overflow-hidden border border-gray-200">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
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
