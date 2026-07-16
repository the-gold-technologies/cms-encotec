"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { Trash2, Plus, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { TextAreaField } from "@/components/TextAreaField";
import { SectionHeader } from "@/components/SectionHeader";

interface TestimonialItem {
  quote: string;
  name: string;
  title: string;
  company: string;
  initials: string;
}

const defaultFormData = {
  tagline: "Testimonials",
  heading: "Trusted by Industry Leaders",
  testimonials: [
    {
      quote: "Encotec's O&M team transformed our plant's performance. Their owner's mindset approach meant they treated our 700 MW facility as if it were their own — uptime improved by 12% in the first year alone.",
      name: "Rajesh Mehta",
      title: "Senior Vice President, Operations",
      company: "National Thermal Power Corp.",
      initials: "RM"
    },
    {
      quote: "From feasibility to commissioning, Encotec delivered our 200 MW solar project on schedule and under budget. Their engineering precision and attention to detail set a new benchmark for our portfolio.",
      name: "Sarah Al-Rashid",
      title: "Project Director, Renewable Energy",
      company: "Gulf Energy Solutions",
      initials: "SA"
    },
    {
      quote: "Working with Encotec on our 765 kV substation was exceptional. Their deep expertise in transmission infrastructure and commitment to safety standards gave us complete confidence throughout the project.",
      name: "Dr. Klaus Werner",
      title: "Chief Engineer, Grid Infrastructure",
      company: "European Power Networks",
      initials: "KW"
    },
    {
      quote: "Encotec's project management capabilities are world-class. They coordinated complex multi-disciplinary teams across three countries, delivering our airport MEP systems with zero safety incidents.",
      name: "Priya Sharma",
      title: "Managing Director",
      company: "Apex Infrastructure Group",
      initials: "PS"
    }
  ]
};

const mergeDefaults = (data: any) => {
  const merged = { ...defaultFormData, ...data };
  if (!merged.testimonials || !Array.isArray(merged.testimonials)) {
    merged.testimonials = defaultFormData.testimonials.map((t) => ({ ...t }));
  }
  return merged;
};

interface TestimonialsSectionProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function TestimonialsSection({
  sectionId,
  initialData,
  saveUrl = "/api/home",
  responseKey = "Testimonials",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: TestimonialsSectionProps) {
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

  const handleFieldChange = (index: number, field: keyof TestimonialItem, value: string) => {
    setFormData((prev) => {
      const updated = prev.testimonials.map((t, idx) =>
        idx === index ? { ...t, [field]: value } : t
      );
      return { ...prev, testimonials: updated };
    });
  };

  const addTestimonial = () => {
    setFormData((prev) => ({
      ...prev,
      testimonials: [
        ...prev.testimonials,
        {
          quote: "",
          name: "",
          title: "",
          company: "",
          initials: "",
        },
      ],
    }));
  };

  const removeTestimonial = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.tagline?.trim()) errs.push("Tagline is required");
    if (!formData.heading?.trim()) errs.push("Heading is required");

    formData.testimonials.forEach((t, idx) => {
      if (!t.quote?.trim()) errs.push(`Quote is required for Testimonial ${idx + 1}`);
      if (!t.name?.trim()) errs.push(`Name is required for Testimonial ${idx + 1}`);
      if (!t.initials?.trim()) errs.push(`Initials are required for Testimonial ${idx + 1}`);
    });

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Testimonials...");
    try {
      const body = sectionId
        ? { id: sectionId, content: formData }
        : { section: responseKey ?? "Testimonials", content: formData };

      const res = await fetch(sectionId ? `/api/sections` : saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Testimonials saved successfully!", { id: toastId });
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
          title="Testimonials Section"
          description="Manage Encotec's guest quotes, author details, and initials."
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
                  placeholder="e.g. Testimonials"
                  required
                />
                <InputField
                  label="Section Heading Title"
                  name="heading"
                  value={formData.heading}
                  onChange={handleChange}
                  placeholder="e.g. Trusted by Industry Leaders"
                  required
                />
              </div>

              {/* Testimonials List */}
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#a0004f]" />
                    Guest Testimonials ({formData.testimonials.length} reviews)
                  </h4>
                  <button
                    type="button"
                    onClick={addTestimonial}
                    className="text-xs text-[#a0004f] hover:text-[#80003f] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Testimonial
                  </button>
                </div>

                <div className="flex flex-col gap-6 mt-2">
                  {formData.testimonials.map((testimonial, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col gap-4 bg-gray-50/40 p-6 border border-gray-100 rounded-3xl shadow-sm relative"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                          Testimonial Card {idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeTestimonial(idx)}
                          className="text-red-500 hover:text-red-600 p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-all cursor-pointer"
                          title="Remove Testimonial"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <InputField
                          label="Author Name"
                          value={testimonial.name}
                          onChange={(e) => handleFieldChange(idx, "name", e.target.value)}
                          placeholder="e.g. Rajesh Mehta"
                          containerClassName="md:col-span-2"
                          required
                        />
                        <InputField
                          label="Initials"
                          value={testimonial.initials}
                          onChange={(e) => handleFieldChange(idx, "initials", e.target.value)}
                          placeholder="e.g. RM"
                          required
                        />
                        <InputField
                          label="Company / Affiliation"
                          value={testimonial.company}
                          onChange={(e) => handleFieldChange(idx, "company", e.target.value)}
                          placeholder="e.g. National Thermal Power"
                        />
                        <InputField
                          label="Job Title"
                          value={testimonial.title}
                          onChange={(e) => handleFieldChange(idx, "title", e.target.value)}
                          placeholder="e.g. Senior Vice President"
                          containerClassName="md:col-span-4"
                        />
                      </div>

                      <TextAreaField
                        label="Testimonial Quote"
                        value={testimonial.quote}
                        onChange={(e) => handleFieldChange(idx, "quote", e.target.value)}
                        placeholder="Quote text details..."
                        rows={3}
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
