"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { Sparkles, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { TextAreaField } from "@/components/TextAreaField";
import { SectionHeader } from "@/components/SectionHeader";

interface CTABlock {
  headline: string;
  text: string;
}

const defaultFormData = {
  revealWord1: "Engineering Precision.",
  revealWord2: "Global Execution.",
  revealWord3: "Reliable Energy Solutions.",
  ctaBlocks: [
    {
      headline: "Ready to Move from Consultancy to Partnership?",
      text: "Discover how our \"Owner's Mindset\" can transform your project's performance."
    },
    {
      headline: "Let's Build Your Project's Future Together.",
      text: "Contact us for end-to-end solutions, from conceptualization to commissioning."
    },
    {
      headline: "Is Your Asset Reaching Its Full Potential?",
      text: "Speak with our 300+ engineers about our expert advisory and performance audits."
    },
    {
      headline: "Sourcing Critical Spares? We've Got the Global Reach.",
      text: "Access our network of major OEMs in China, Vietnam, and beyond for your spare part needs."
    },
    {
      headline: "Join the 13+ Cities That Trust Encotec.",
      text: "Experience the peace of mind that comes with a top-tier O&M partner."
    },
    {
      headline: "Planning an Asset Relocation?",
      text: "Let our experts manage the complex transition of your plant from one site — or country — to another."
    }
  ] as CTABlock[]
};

const mergeDefaults = (data: any) => {
  const merged = { ...defaultFormData, ...data };
  if (!merged.ctaBlocks || !Array.isArray(merged.ctaBlocks)) {
    merged.ctaBlocks = defaultFormData.ctaBlocks.map((b) => ({ ...b }));
  } else {
    const arr = [...merged.ctaBlocks];
    while (arr.length < 6) {
      const def = defaultFormData.ctaBlocks[arr.length] || { headline: "", text: "" };
      arr.push({ ...def });
    }
    merged.ctaBlocks = arr.slice(0, 6);
  }
  return merged;
};

interface WhyEncotecSectionProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function WhyEncotecSection({
  sectionId,
  initialData,
  saveUrl = "/api/home",
  responseKey = "WhyEncotecSection",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: WhyEncotecSectionProps) {
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

  const handleBlockChange = (index: number, key: keyof CTABlock, value: string) => {
    setFormData((prev) => {
      const updated = prev.ctaBlocks.map((b, idx) =>
        idx === index ? { ...b, [key]: value } : b
      );
      return { ...prev, ctaBlocks: updated };
    });
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.revealWord1?.trim() || !formData.revealWord2?.trim() || !formData.revealWord3?.trim()) {
      errs.push("All typography reveal titles must be filled");
    }
    if (formData.ctaBlocks.some((b) => !b.headline?.trim() || !b.text?.trim())) {
      errs.push("All Call to Action block headlines and descriptions must be filled");
    }

    if (errs.length > 0) {
      errs.forEach((m) => toast.error(m));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Why Encotec section...");
    try {
      const body = sectionId
        ? { id: sectionId, content: formData }
        : { section: responseKey ?? "WhyEncotecSection", content: formData };

      const res = await fetch(sectionId ? `/api/sections` : saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Why Encotec section saved successfully!", { id: toastId });
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
          title="Why Encotec (CTA Cards) Section"
          description="Manage Encotec's big typography titles and the 6 call-to-action cards."
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
              
              {/* Typography reveal */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl">
                <div className="col-span-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100/60 pb-2 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#a0004f]" />
                    Big Typography Reveal Headlines
                  </h4>
                </div>
                <InputField
                  label="Headline Line 1"
                  name="revealWord1"
                  value={formData.revealWord1}
                  onChange={handleChange}
                  placeholder="e.g. Engineering Precision."
                  required
                />
                <InputField
                  label="Headline Line 2"
                  name="revealWord2"
                  value={formData.revealWord2}
                  onChange={handleChange}
                  placeholder="e.g. Global Execution."
                  required
                />
                <InputField
                  label="Headline Line 3"
                  name="revealWord3"
                  value={formData.revealWord3}
                  onChange={handleChange}
                  placeholder="e.g. Reliable Energy Solutions."
                  required
                />
              </div>

              {/* Grid cards */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
                  Call to Action Blocks (Exactly 6 Cards)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {formData.ctaBlocks.map((block, i) => (
                    <div
                      key={i}
                      className="border border-gray-100 p-5 rounded-2xl bg-gray-50/20 flex flex-col gap-4 relative group"
                    >
                      <span className="text-[10px] font-bold text-[#a0004f] uppercase tracking-widest">
                        Card {i + 1}
                      </span>
                      <InputField
                        label="Card Headline"
                        value={block.headline}
                        onChange={(e) => handleBlockChange(i, "headline", e.target.value)}
                        placeholder="e.g. Ready to Move from Consultancy?"
                      />
                      <TextAreaField
                        label="Description Subtext"
                        value={block.text}
                        onChange={(e) => handleBlockChange(i, "text", e.target.value)}
                        placeholder="e.g. Discover how our Owner's Mindset..."
                        rows={3}
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
