"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

// 1. ProjectHeroCMS
export function ProjectHeroCMS({ saveUrl }: { saveUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    label: "",
    headline: "",
    description: "",
    floatingBadges: [
      { icon: "Map", text: "" },
      { icon: "FileText", text: "" },
      { icon: "Briefcase", text: "" }
    ]
  });

  useEffect(() => {
    fetchWithCache(saveUrl)
      .then((json) => {
        const sectionData = json.data?.["ProjectHero"];
        if (json.success && sectionData) {
          setFormData({
            label: sectionData.label || "",
            headline: sectionData.headline || "",
            description: sectionData.description || "",
            floatingBadges: sectionData.floatingBadges || [
              { icon: "Map", text: "" },
              { icon: "FileText", text: "" },
              { icon: "Briefcase", text: "" }
            ]
          });
        }
      })
      .catch(console.error);
  }, [saveUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBadgeTextChange = (index: number, text: string) => {
    setFormData((prev) => {
      const badges = [...prev.floatingBadges];
      badges[index] = { ...badges[index], text };
      return { ...prev, floatingBadges: badges };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Project Hero...");
    try {
      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "ProjectHero", content: formData })
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Project Hero saved!", { id: toastId });
      } else {
        toast.error(json.error || "Save failed.", { id: toastId });
      }
    } catch (e) {
      console.error(e);
      toast.error("Error saving.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4">
      <SectionHeader
        title="Project Hero Section"
        description="Manage the PM Hero tagline, titles, descriptions, and feature badges."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-6">
          <InputField label="Hero Label" name="label" value={formData.label} onChange={handleChange} required />
          <InputField label="Headline" name="headline" value={formData.headline} onChange={handleChange} required />
          <TextAreaField label="Description" name="description" value={formData.description} onChange={handleChange} required rows={3} />
          
          <div className="border border-gray-100 p-4 rounded-xl flex flex-col gap-4">
            <h4 className="text-sm font-bold text-gray-700">Floating Badges</h4>
            {formData.floatingBadges.map((badge, i) => (
              <InputField
                key={i}
                label={`Badge ${i + 1} (${badge.icon} icon)`}
                value={badge.text}
                onChange={(e) => handleBadgeTextChange(i, e.target.value)}
                placeholder="e.g. Pre-Feasibility"
              />
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <SaveButton onClick={handleSave} disabled={isSaving} className="w-44 h-12" />
          </div>
        </div>
      )}
    </div>
  );
}

// 2. PhilosophySectionCMS
export function PhilosophySectionCMS({ saveUrl }: { saveUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    heading: "",
    paragraphs: ["", ""],
    features: [] as any[]
  });

  useEffect(() => {
    fetchWithCache(saveUrl)
      .then((json) => {
        const sectionData = json.data?.["PhilosophySection"];
        if (json.success && sectionData) {
          setFormData({
            heading: sectionData.heading || "",
            paragraphs: sectionData.paragraphs || ["", ""],
            features: sectionData.features || []
          });
        }
      })
      .catch(console.error);
  }, [saveUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleParagraphChange = (index: number, val: string) => {
    setFormData((prev) => {
      const paras = [...prev.paragraphs];
      paras[index] = val;
      return { ...prev, paragraphs: paras };
    });
  };

  const handleFeatureChange = (index: number, field: string, val: string) => {
    setFormData((prev) => {
      const items = [...prev.features];
      items[index] = { ...items[index], [field]: val };
      return { ...prev, features: items };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Philosophy Section...");
    try {
      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "PhilosophySection", content: formData })
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Philosophy section saved!", { id: toastId });
      } else {
        toast.error(json.error || "Save failed.", { id: toastId });
      }
    } catch (e) {
      console.error(e);
      toast.error("Error saving.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4">
      <SectionHeader
        title="Philosophy & Strategy"
        description="Manage the strategic copy, paragraphs, and key capability alignment features."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-6">
          <InputField label="Heading" name="heading" value={formData.heading} onChange={handleChange} required />
          
          <div className="border border-gray-100 p-4 rounded-xl flex flex-col gap-4">
            <h4 className="text-sm font-bold text-gray-700">Paragraphs</h4>
            {formData.paragraphs.map((p, i) => (
              <TextAreaField
                key={i}
                label={`Paragraph ${i + 1}`}
                value={p}
                onChange={(e) => handleParagraphChange(i, e.target.value)}
                rows={3}
                required
              />
            ))}
          </div>

          <div className="flex flex-col gap-6 border border-gray-100 p-6 rounded-2xl bg-gray-50/20">
            <h4 className="text-sm font-bold text-gray-700">Strategic Alignment Features</h4>
            {formData.features.map((feat, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b last:border-0 border-gray-100">
                <InputField label="Title" value={feat.title} onChange={(e) => handleFeatureChange(i, "title", e.target.value)} required />
                <InputField label="Description" value={feat.desc} onChange={(e) => handleFeatureChange(i, "desc", e.target.value)} required />
                <InputField label="Lucide Icon (e.g. Target, Users)" value={feat.icon} onChange={(e) => handleFeatureChange(i, "icon", e.target.value)} required />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <SaveButton onClick={handleSave} disabled={isSaving} className="w-44 h-12" />
          </div>
        </div>
      )}
    </div>
  );
}

// 3. CoreOfferingsCMS
export function CoreOfferingsCMS({ saveUrl }: { saveUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    offerings: [] as any[]
  });

  useEffect(() => {
    fetchWithCache(saveUrl)
      .then((json) => {
        const sectionData = json.data?.["CoreOfferings"];
        if (json.success && sectionData) {
          setFormData({
            heading: sectionData.heading || "",
            description: sectionData.description || "",
            offerings: sectionData.offerings || []
          });
        }
      })
      .catch(console.error);
  }, [saveUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOfferingChange = (index: number, field: string, val: string) => {
    setFormData((prev) => {
      const items = [...prev.offerings];
      items[index] = { ...items[index], [field]: val };
      return { ...prev, offerings: items };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Core Offerings...");
    try {
      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "CoreOfferings", content: formData })
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Core offerings saved!", { id: toastId });
      } else {
        toast.error(json.error || "Save failed.", { id: toastId });
      }
    } catch (e) {
      console.error(e);
      toast.error("Error saving.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4">
      <SectionHeader
        title="Development Services Offerings"
        description="Manage the main service offering items, descriptions, and icon cards."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-6">
          <InputField label="Heading" name="heading" value={formData.heading} onChange={handleChange} required />
          <TextAreaField label="Description" name="description" value={formData.description} onChange={handleChange} required rows={2} />

          <div className="flex flex-col gap-6 border border-gray-100 p-6 rounded-2xl bg-gray-50/20">
            <h4 className="text-sm font-bold text-gray-700">Services List</h4>
            {formData.offerings.map((offering, i) => (
              <div key={i} className="border-b last:border-0 border-gray-100 pb-4 last:pb-0 flex flex-col gap-3">
                <div className="text-xs font-bold text-gray-400 font-medium">Service offering #{i + 1}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Title" value={offering.title} onChange={(e) => handleOfferingChange(i, "title", e.target.value)} required />
                  <InputField label="Lucide Icon (e.g. Map, FileText)" value={offering.icon} onChange={(e) => handleOfferingChange(i, "icon", e.target.value)} required />
                </div>
                <TextAreaField label="Description Text" value={offering.description} onChange={(e) => handleOfferingChange(i, "description", e.target.value)} required rows={2} />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <SaveButton onClick={handleSave} disabled={isSaving} className="w-44 h-12" />
          </div>
        </div>
      )}
    </div>
  );
}

// 4. ProjectStatsSectionCMS
export function ProjectStatsSectionCMS({ saveUrl }: { saveUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    stats: [] as any[]
  });

  useEffect(() => {
    fetchWithCache(saveUrl)
      .then((json) => {
        const sectionData = json.data?.["StatsSection"];
        if (json.success && sectionData) {
          setFormData({
            stats: sectionData.stats || []
          });
        }
      })
      .catch(console.error);
  }, [saveUrl]);

  const handleStatChange = (index: number, field: string, val: any) => {
    setFormData((prev) => {
      const items = [...prev.stats];
      items[index] = { ...items[index], [field]: val };
      return { stats: items };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Stats...");
    try {
      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "StatsSection", content: formData })
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Stats saved!", { id: toastId });
      } else {
        toast.error(json.error || "Save failed.", { id: toastId });
      }
    } catch (e) {
      console.error(e);
      toast.error("Error saving.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4">
      <SectionHeader
        title="Impact & Scale Counters"
        description="Manage the key numeric achievements counters."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border border-gray-100 p-6 rounded-2xl bg-gray-50/20">
            {formData.stats.map((stat, i) => (
              <div key={i} className="flex flex-col gap-3 p-4 bg-white border border-gray-100 rounded-xl">
                <div className="text-xs font-bold text-gray-400">Stat Card #{i + 1}</div>
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="Value"
                    type="number"
                    value={stat.value}
                    onChange={(e) => handleStatChange(i, "value", parseFloat(e.target.value))}
                    required
                  />
                  <InputField
                    label="Suffix (e.g. +, %)"
                    value={stat.suffix}
                    onChange={(e) => handleStatChange(i, "suffix", e.target.value)}
                    required
                  />
                </div>
                <InputField
                  label="Label Description"
                  value={stat.label}
                  onChange={(e) => handleStatChange(i, "label", e.target.value)}
                  required
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <SaveButton onClick={handleSave} disabled={isSaving} className="w-44 h-12" />
          </div>
        </div>
      )}
    </div>
  );
}
