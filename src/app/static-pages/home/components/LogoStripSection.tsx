"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { Tag, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";

const defaultFormData = {
  tagline: "Trusted by Industry Leaders",
  logos: ["Siemens Energy", "General Electric", "Vestas", "NextEra", "Orsted", "Enel", "Iberdrola"] as string[]
};

const mergeDefaults = (data: any) => {
  const merged = { ...defaultFormData, ...data };
  if (!merged.logos || !Array.isArray(merged.logos)) {
    merged.logos = [...defaultFormData.logos];
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
  const [newLogoText, setNewLogoText] = useState("");

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

  const addLogo = () => {
    if (newLogoText.trim()) {
      if (formData.logos.includes(newLogoText.trim())) {
        toast.error("Brand logo already exists");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        logos: [...prev.logos, newLogoText.trim()],
      }));
      setNewLogoText("");
    }
  };

  const removeLogo = (logoToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      logos: prev.logos.filter((l) => l !== logoToRemove),
    }));
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.tagline?.trim()) errs.push("Tagline is required");
    if (formData.logos.length === 0) errs.push("At least one brand name is required");

    if (errs.length > 0) {
      errs.forEach((m) => toast.error(m));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Brand Logo Strip...");
    try {
      const body = sectionId
        ? { id: sectionId, content: formData }
        : { section: responseKey ?? "LogoStripSection", content: formData };

      const res = await fetch(sectionId ? `/api/sections` : saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Logo Strip saved successfully!", { id: toastId });
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

  return (
    <section>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="Clients & Brands Logo Strip"
          description="Manage Encotec's client/brand names scrolling ticker strip."
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

              {/* Ticker Logos List */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#a0004f]" />
                  Active Ticker Brands List
                </h3>

                <div className="flex flex-wrap gap-2.5 bg-gray-50/50 p-4 border border-gray-100 rounded-2xl min-h-[50px] items-center">
                  {formData.logos.map((logo) => (
                    <span
                      key={logo}
                      className="bg-white border border-gray-200 text-gray-700 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                    >
                      {logo}
                      <button
                        type="button"
                        onClick={() => removeLogo(logo)}
                        className="text-gray-400 hover:text-red-500 p-0.5 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  {formData.logos.length === 0 && (
                    <p className="text-xs text-gray-400 font-medium italic">
                      No brand logos added yet.
                    </p>
                  )}
                </div>

                <div className="flex gap-3 w-full mt-1">
                  <input
                    type="text"
                    value={newLogoText}
                    onChange={(e) => setNewLogoText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLogo())}
                    placeholder="Add brand name (e.g. Siemens Energy)"
                    className="flex-1 px-6 py-4 bg-white border border-gray-200 text-sm rounded-2xl focus:ring-2 focus:outline-none focus:border-[#a0004f] focus:ring-1 focus:ring-[#a0004f] outline-none text-gray-800 transition-all"
                  />
                  <button
                    type="button"
                    onClick={addLogo}
                    className="bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs px-6 rounded-2xl transition-colors flex items-center gap-2"
                  >
                    Add Brand
                  </button>
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
